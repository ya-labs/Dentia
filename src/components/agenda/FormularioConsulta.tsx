import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, Platform, Pressable, StyleSheet, View } from 'react-native';

import {
  AlertasSaude,
  Avatar,
  Botao,
  CampoBusca,
  CampoTexto,
  Cartao,
  Escolhas,
  Pagina,
  Secao,
  Texto,
} from '@/components/ui';
import {
  alertasDoPaciente,
  buscarPaciente,
  conflitosDeHorario,
  filtrarPacientes,
  ordenarPorNome,
  useDados,
} from '@/store';
import { cores, coresStatusConsulta, espaco, raio } from '@/theme';
import type { Consulta, Id, StatusConsulta } from '@/types';
import {
  adicionarDias,
  formatarDataExtenso,
  formatarHora,
  horaParaMinutos,
  lerData,
  minutosParaHora,
  paraDataISO,
} from '@/utils/datas';
import { voltarOu } from '@/utils/navegacao';
import { abrirWhatsApp, mensagemDeLembrete, telefoneDeContato } from '@/utils/whatsapp';

const PROCEDIMENTOS_COMUNS = ['Avaliação', 'Profilaxia', 'Restauração', 'Canal', 'Extração', 'Retorno'];
const DURACOES = [30, 45, 60, 90];
const INTERVALO_MIN = 30;

type Props = {
  inicial?: Consulta;
  /** `YYYY-MM-DD` sugerido ao abrir pela agenda. */
  dataInicial?: string;
  pacienteInicial?: Id;
};

export function FormularioConsulta({ inicial, dataInicial, pacienteInicial }: Props) {
  const { dados, criarConsulta, atualizarConsulta, removerConsulta } = useDados();
  const { consultorio } = dados;

  const [pacienteId, setPacienteId] = useState<Id | undefined>(inicial?.pacienteId ?? pacienteInicial);
  const [busca, setBusca] = useState('');
  const [dia, setDia] = useState(() => lerData(inicial?.inicio ?? dataInicial ?? paraDataISO(new Date())));
  const [hora, setHora] = useState(inicial ? formatarHora(inicial.inicio) : '');
  const [duracao, setDuracao] = useState(inicial?.duracaoMin ?? consultorio.duracaoPadraoMin);
  const [procedimento, setProcedimento] = useState(inicial?.procedimento ?? '');
  const [status, setStatus] = useState<StatusConsulta>(inicial?.status ?? 'agendado');
  const [observacao, setObservacao] = useState(inicial?.observacao ?? '');
  const [tentouSalvar, setTentouSalvar] = useState(false);

  const paciente = pacienteId ? buscarPaciente(dados, pacienteId) : undefined;
  const inicio = hora ? `${paraDataISO(dia)}T${hora}` : undefined;
  const conflitos = inicio ? conflitosDeHorario(dados, inicio, duracao, inicial?.id) : [];

  const horarios = useMemo(() => {
    const comeco = horaParaMinutos(consultorio.horario.inicio) ?? 8 * 60;
    const fim = horaParaMinutos(consultorio.horario.fim) ?? 18 * 60;
    const lista: string[] = [];
    for (let m = comeco; m < fim; m += INTERVALO_MIN) lista.push(minutosParaHora(m));
    if (hora && !lista.includes(hora)) lista.push(hora);
    return lista.sort();
  }, [consultorio.horario.inicio, consultorio.horario.fim, hora]);

  const ocupados = new Set(
    horarios.filter((h) => conflitosDeHorario(dados, `${paraDataISO(dia)}T${h}`, INTERVALO_MIN, inicial?.id).length > 0),
  );

  const sugestoes = useMemo(
    () => (busca.trim() ? filtrarPacientes(ordenarPorNome(dados.pacientes), busca).slice(0, 6) : []),
    [busca, dados.pacientes],
  );

  const atende = consultorio.horario.dias.includes(dia.getDay());
  const valido = !!paciente && !!inicio && procedimento.trim().length > 0;

  function salvar() {
    setTentouSalvar(true);
    if (!valido || !paciente || !inicio) return;
    const dadosConsulta = {
      pacienteId: paciente.id,
      inicio,
      duracaoMin: duracao,
      procedimento: procedimento.trim(),
      status,
      observacao: observacao.trim() || undefined,
    };
    if (inicial) atualizarConsulta(inicial.id, dadosConsulta);
    else criarConsulta(dadosConsulta);
    voltarOu('/agenda');
  }

  function desmarcar() {
    if (!inicial) return;
    const confirmar = () => {
      removerConsulta(inicial.id);
      voltarOu('/agenda');
    };
    if (Platform.OS === 'web') {
      confirmar();
      return;
    }
    Alert.alert('Desmarcar consulta?', 'A consulta sai da agenda.', [
      { text: 'Manter', style: 'cancel' },
      { text: 'Desmarcar', style: 'destructive', onPress: confirmar },
    ]);
  }

  async function lembrar() {
    if (!paciente || !inicio) return;
    try {
      await abrirWhatsApp(telefoneDeContato(paciente), mensagemDeLembrete(consultorio, paciente, inicio));
    } catch {
      Alert.alert('WhatsApp indisponível', 'Não foi possível abrir o WhatsApp neste aparelho.');
    }
  }

  return (
    <Pagina
      rodape={
        <>
          {tentouSalvar && !valido && (
            <Texto variante="legenda" cor={cores.perigo}>
              Escolha paciente, horário e procedimento.
            </Texto>
          )}
          <Botao titulo={inicial ? 'Salvar alterações' : 'Marcar consulta'} icone="checkmark" bloco onPress={salvar} />
        </>
      }
    >
      <Secao titulo="Paciente">
        {paciente ? (
          <Cartao>
            <View style={styles.linha}>
              <Avatar nome={paciente.nome} />
              <View style={styles.flex}>
                <Texto variante="corpoForte">{paciente.nome}</Texto>
                <Texto variante="legenda" suave>
                  {telefoneDeContato(paciente)}
                  {paciente.responsavel ? ` (${paciente.responsavel.nome})` : ''}
                </Texto>
              </View>
              {!inicial && (
                <Pressable accessibilityRole="button" onPress={() => setPacienteId(undefined)} hitSlop={8}>
                  <Texto variante="rotulo" cor={cores.primaria}>
                    Trocar
                  </Texto>
                </Pressable>
              )}
            </View>
            <AlertasSaude alertas={alertasDoPaciente(dados, paciente.id)} />
          </Cartao>
        ) : (
          <View style={styles.busca}>
            <CampoBusca valor={busca} onChange={setBusca} placeholder="Buscar paciente por nome ou telefone" />
            {sugestoes.map((p) => (
              <Cartao key={p.id} onPress={() => setPacienteId(p.id)} style={styles.sugestao}>
                <View style={styles.linha}>
                  <Avatar nome={p.nome} tamanho={32} />
                  <Texto style={styles.flex}>{p.nome}</Texto>
                  <Ionicons name="add-circle-outline" size={20} color={cores.primaria} />
                </View>
              </Cartao>
            ))}
            {busca.trim().length > 0 && sugestoes.length === 0 && (
              <Botao titulo="Cadastrar novo paciente" variante="fantasma" icone="person-add" onPress={() => router.push('/paciente/novo')} />
            )}
          </View>
        )}
      </Secao>

      <Secao titulo="Data e horário">
        <Cartao>
          <View style={styles.linha}>
            <Seta icone="chevron-back" onPress={() => setDia((d) => adicionarDias(d, -1))} rotulo="Dia anterior" />
            <Texto variante="corpoForte" style={[styles.flex, styles.centro]}>
              {capitalizar(formatarDataExtenso(dia))}
            </Texto>
            <Seta icone="chevron-forward" onPress={() => setDia((d) => adicionarDias(d, 1))} rotulo="Próximo dia" />
          </View>
          {!atende && (
            <Texto variante="legenda" cor={cores.atencao}>
              O consultório não atende neste dia.
            </Texto>
          )}
          <View style={styles.horarios}>
            {horarios.map((h) => {
              const ativo = h === hora;
              const ocupado = ocupados.has(h) && !ativo;
              return (
                <Pressable
                  key={h}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: ativo }}
                  accessibilityLabel={`${h}${ocupado ? ', ocupado' : ''}`}
                  onPress={() => setHora(h)}
                  style={[styles.horario, ativo && styles.horarioAtivo, ocupado && styles.horarioOcupado]}
                >
                  <Texto variante="rotulo" cor={ativo ? cores.textoInverso : ocupado ? cores.textoSecundario : cores.texto}>
                    {h}
                  </Texto>
                </Pressable>
              );
            })}
          </View>
          <Texto variante="legenda" suave>
            Horários em cinza já têm consulta.
          </Texto>
          {conflitos.length > 0 && (
            <Texto variante="legenda" cor={cores.atencao}>
              Conflita com {conflitos.map((c) => `${formatarHora(c.inicio)} (${buscarPaciente(dados, c.pacienteId)?.nome ?? 'paciente'})`).join(', ')}.
            </Texto>
          )}
          <Texto variante="rotulo" suave>
            Duração
          </Texto>
          <Escolhas
            opcoes={DURACOES.map((d) => ({ valor: d, rotulo: `${d} min` }))}
            selecionados={[duracao]}
            onAlternar={setDuracao}
          />
        </Cartao>
      </Secao>

      <Secao titulo="Procedimento">
        <Cartao>
          <Escolhas
            opcoes={PROCEDIMENTOS_COMUNS.map((p) => ({ valor: p, rotulo: p }))}
            selecionados={[procedimento]}
            onAlternar={setProcedimento}
          />
          <CampoTexto rotulo="Procedimento" obrigatorio value={procedimento} onChangeText={setProcedimento} />
          <CampoTexto rotulo="Observação" value={observacao} onChangeText={setObservacao} multiline />
        </Cartao>
      </Secao>

      {inicial && (
        <Secao titulo="Status">
          <Escolhas
            opcoes={(Object.keys(coresStatusConsulta) as StatusConsulta[]).map((s) => ({
              valor: s,
              rotulo: coresStatusConsulta[s].rotulo,
              cor: coresStatusConsulta[s].texto,
            }))}
            selecionados={[status]}
            onAlternar={setStatus}
          />
        </Secao>
      )}

      {paciente && inicio && (
        <Secao titulo="Lembrete">
          <Cartao>
            <Texto variante="legenda" suave>
              Mensagem para {telefoneDeContato(paciente)}:
            </Texto>
            <Texto>{mensagemDeLembrete(consultorio, paciente, inicio)}</Texto>
            <Botao titulo="Lembrar pelo WhatsApp" icone="logo-whatsapp" variante="secundario" bloco onPress={lembrar} />
            <Texto variante="legenda" suave>
              Abre a conversa com a mensagem pronta; o envio é feito por você no WhatsApp.
            </Texto>
          </Cartao>
        </Secao>
      )}

      {inicial && paciente && (
        <View style={styles.extras}>
          <Botao titulo="Abrir ficha do paciente" variante="fantasma" icone="person-outline" bloco onPress={() => router.push(`/paciente/${paciente.id}`)} />
          <Botao titulo="Desmarcar consulta" variante="perigo" icone="trash-outline" bloco onPress={desmarcar} />
        </View>
      )}
    </Pagina>
  );
}

function Seta({ icone, rotulo, onPress }: { icone: 'chevron-back' | 'chevron-forward'; rotulo: string; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={rotulo} onPress={onPress} hitSlop={8} style={styles.seta}>
      <Ionicons name={icone} size={22} color={cores.primaria} />
    </Pressable>
  );
}

const capitalizar = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);

const styles = StyleSheet.create({
  linha: { flexDirection: 'row', alignItems: 'center', gap: espaco.md },
  flex: { flex: 1 },
  centro: { textAlign: 'center' },
  busca: { gap: espaco.sm },
  sugestao: { paddingVertical: espaco.sm },
  seta: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  horarios: { flexDirection: 'row', flexWrap: 'wrap', gap: espaco.xs },
  horario: {
    minWidth: 64,
    minHeight: 36,
    borderRadius: raio.sm,
    borderWidth: 1,
    borderColor: cores.borda,
    backgroundColor: cores.superficie,
    alignItems: 'center',
    justifyContent: 'center',
  },
  horarioAtivo: { backgroundColor: cores.primaria, borderColor: cores.primaria },
  horarioOcupado: { backgroundColor: cores.superficieAlternativa },
  extras: { gap: espaco.sm },
});
