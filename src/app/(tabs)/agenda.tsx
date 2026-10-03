import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { CartaoConsulta } from '@/components/agenda/CartaoConsulta';
import { Botao, Segmentos, Selo, Tela, Texto, Vazio } from '@/components/ui';
import { consultasDoDia, useDados } from '@/store';
import { cores, coresStatusConsulta, espaco, raio } from '@/theme';
import type { StatusConsulta } from '@/types';
import { adicionarDias, formatarDataExtenso, formatarDiaCurto, inicioDaSemana, mesmoDia, paraDataISO } from '@/utils/datas';

type Visao = 'dia' | 'semana';

export default function AgendaScreen() {
  const { dados } = useDados();
  const hoje = new Date();
  const [visao, setVisao] = useState<Visao>('dia');
  const [dia, setDia] = useState(() => new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate()));

  const passo = visao === 'dia' ? 1 : 7;
  const semana = Array.from({ length: 7 }, (_, i) => adicionarDias(inicioDaSemana(dia), i));
  const titulo =
    visao === 'dia'
      ? capitalizar(formatarDataExtenso(dia))
      : `${formatarDiaCurto(semana[0])} a ${formatarDiaCurto(semana[6])}`;
  const ehHoje = visao === 'dia' ? mesmoDia(dia, hoje) : semana.some((d) => mesmoDia(d, hoje));

  return (
    <Tela
      titulo="Agenda"
      acao={
        <Botao titulo="Nova" icone="add" onPress={() => router.push(`/consulta/nova?data=${paraDataISO(dia)}`)} />
      }
    >
      <Segmentos
        opcoes={[
          { valor: 'dia', rotulo: 'Dia' },
          { valor: 'semana', rotulo: 'Semana' },
        ]}
        valor={visao}
        onChange={setVisao}
      />

      <View style={styles.navegacao}>
        <BotaoSeta icone="chevron-back" rotulo="Anterior" onPress={() => setDia((d) => adicionarDias(d, -passo))} />
        <View style={styles.centro}>
          <Texto variante="corpoForte" style={styles.textoCentro}>
            {titulo}
          </Texto>
          {!ehHoje && (
            <Pressable accessibilityRole="button" onPress={() => setDia(new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate()))}>
              <Texto variante="rotulo" cor={cores.primaria}>
                Voltar para hoje
              </Texto>
            </Pressable>
          )}
        </View>
        <BotaoSeta icone="chevron-forward" rotulo="Próximo" onPress={() => setDia((d) => adicionarDias(d, passo))} />
      </View>

      <LegendaStatus />

      {visao === 'dia' ? (
        <ListaDoDia dia={dia} />
      ) : (
        semana.map((d) => {
          const doDia = consultasDoDia(dados, d);
          return (
            <View key={paraDataISO(d)} style={styles.diaSemana}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Ver ${formatarDataExtenso(d)}`}
                onPress={() => {
                  setDia(d);
                  setVisao('dia');
                }}
                style={styles.cabecalhoDia}
              >
                <Texto variante="rotulo" cor={mesmoDia(d, hoje) ? cores.primaria : cores.textoSecundario}>
                  {formatarDiaCurto(d).toUpperCase()}
                  {mesmoDia(d, hoje) ? ' · HOJE' : ''}
                </Texto>
                <Texto variante="legenda" suave>
                  {doDia.length === 0 ? 'livre' : `${doDia.length} ${doDia.length === 1 ? 'consulta' : 'consultas'}`}
                </Texto>
              </Pressable>
              {doDia.map((c) => (
                <CartaoConsulta key={c.id} consulta={c} compacto />
              ))}
            </View>
          );
        })
      )}
    </Tela>
  );
}

function ListaDoDia({ dia }: { dia: Date }) {
  const { dados } = useDados();
  const consultas = consultasDoDia(dados, dia);
  const atende = dados.consultorio.horario.dias.includes(dia.getDay());

  if (consultas.length === 0) {
    return (
      <Vazio
        icone="calendar-clear-outline"
        titulo="Nenhuma consulta"
        descricao={atende ? 'Dia livre na agenda.' : 'O consultório não atende neste dia.'}
      >
        <Botao titulo="Marcar consulta" variante="secundario" onPress={() => router.push(`/consulta/nova?data=${paraDataISO(dia)}`)} />
      </Vazio>
    );
  }
  return (
    <View style={styles.lista}>
      {consultas.map((c) => (
        <CartaoConsulta key={c.id} consulta={c} />
      ))}
    </View>
  );
}

function LegendaStatus() {
  const status = Object.keys(coresStatusConsulta) as StatusConsulta[];
  return (
    <View style={styles.legenda}>
      {status.map((s) => (
        <Selo key={s} texto={coresStatusConsulta[s].rotulo} cor={coresStatusConsulta[s].texto} fundo={coresStatusConsulta[s].fundo} />
      ))}
    </View>
  );
}

function BotaoSeta({ icone, rotulo, onPress }: { icone: 'chevron-back' | 'chevron-forward'; rotulo: string; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={rotulo}
      onPress={onPress}
      style={({ pressed }) => [styles.seta, pressed && styles.pressionado]}
    >
      <Ionicons name={icone} size={22} color={cores.primaria} />
    </Pressable>
  );
}

const capitalizar = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);

const styles = StyleSheet.create({
  navegacao: { flexDirection: 'row', alignItems: 'center', gap: espaco.sm },
  centro: { flex: 1, alignItems: 'center', gap: espaco.xxs },
  textoCentro: { textAlign: 'center' },
  seta: {
    width: 44,
    height: 44,
    borderRadius: raio.md,
    backgroundColor: cores.superficie,
    borderWidth: 1,
    borderColor: cores.borda,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressionado: { opacity: 0.6 },
  legenda: { flexDirection: 'row', flexWrap: 'wrap', gap: espaco.xs },
  lista: { gap: espaco.md },
  diaSemana: { gap: espaco.sm },
  cabecalhoDia: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: espaco.xs },
});
