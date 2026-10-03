import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { CartaoConsulta } from '@/components/agenda/CartaoConsulta';
import { Botao, Cartao, Secao, Tela, Texto, Vazio } from '@/components/ui';
import { alertasDoPaciente, consultasDoDia, useDados } from '@/store';
import { cores, espaco } from '@/theme';
import { formatarDataExtenso, paraDataHoraISO, paraDataISO, saudacao } from '@/utils/datas';

export default function HojeScreen() {
  const { dados } = useDados();
  const { consultorio } = dados;
  const hoje = new Date();
  const consultas = consultasDoDia(dados, hoje);
  const comAlerta = consultas.filter((c) => alertasDoPaciente(dados, c.pacienteId).length > 0).length;
  const agora = paraDataHoraISO(hoje);
  const restantes = consultas.filter((c) => c.inicio >= agora && c.status !== 'faltou' && c.status !== 'atendido').length;
  const dataExtenso = formatarDataExtenso(hoje);

  return (
    <Tela
      titulo={`${saudacao(hoje)}, ${consultorio.dentista}`}
      subtitulo={dataExtenso.charAt(0).toUpperCase() + dataExtenso.slice(1)}
    >
      <View style={styles.resumo}>
        <Indicador valor={consultas.length} rotulo="consultas hoje" cor={cores.primaria} />
        <Indicador valor={restantes} rotulo="ainda por vir" cor={cores.info} />
        <Indicador valor={comAlerta} rotulo="com alerta" cor={cores.perigo} />
      </View>

      <View style={styles.atalhos}>
        <View style={styles.flex}>
          <Botao
            titulo="Nova consulta"
            icone="calendar"
            bloco
            onPress={() => router.push(`/consulta/nova?data=${paraDataISO(hoje)}`)}
          />
        </View>
        <View style={styles.flex}>
          <Botao titulo="Novo paciente" icone="person-add" variante="secundario" bloco onPress={() => router.push('/paciente/novo')} />
        </View>
      </View>

      <Secao titulo="Consultas de hoje">
        {consultas.length === 0 ? (
          <Vazio icone="cafe-outline" titulo="Nenhuma consulta hoje" descricao="Aproveite para organizar a semana." />
        ) : (
          consultas.map((c) => <CartaoConsulta key={c.id} consulta={c} />)
        )}
      </Secao>
    </Tela>
  );
}

function Indicador({ valor, rotulo, cor }: { valor: number; rotulo: string; cor: string }) {
  return (
    <Cartao style={styles.indicador}>
      <Texto variante="titulo" cor={cor}>
        {valor}
      </Texto>
      <Texto variante="legenda" suave>
        {rotulo}
      </Texto>
    </Cartao>
  );
}

const styles = StyleSheet.create({
  resumo: { flexDirection: 'row', gap: espaco.sm },
  indicador: { flex: 1, gap: espaco.xxs, padding: espaco.md },
  atalhos: { flexDirection: 'row', gap: espaco.sm },
  flex: { flex: 1 },
});
