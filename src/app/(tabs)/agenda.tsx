import { StyleSheet, View } from 'react-native';

import { Cartao, EmConstrucao, SeloStatusConsulta, Tela, Texto } from '@/components/ui';
import { buscarPaciente, consultasDoDia } from '@/data';
import { espaco } from '@/theme';
import { formatarHora, paraDataHoraISO } from '@/utils/datas';

export default function AgendaScreen() {
  const agora = new Date();
  const doDia = consultasDoDia(agora);
  const futura = doDia.find((c) => c.inicio >= paraDataHoraISO(agora));
  const proxima = futura ?? doDia[0];
  const paciente = proxima && buscarPaciente(proxima.pacienteId);

  return (
    <Tela titulo="Agenda" subtitulo="Consultas por dia e por semana">
      {proxima && paciente && (
        <Cartao>
          <Texto variante="rotulo" suave>
            {futura ? 'PRÓXIMA CONSULTA DE HOJE' : 'PRIMEIRA CONSULTA DE HOJE'}
          </Texto>
          <View style={styles.linha}>
            <Texto variante="subtitulo">{formatarHora(proxima.inicio)}</Texto>
            <SeloStatusConsulta status={proxima.status} />
          </View>
          <Texto variante="corpoForte">{paciente.nome}</Texto>
          <Texto suave>
            {proxima.procedimento} · {proxima.duracaoMin} min
          </Texto>
        </Cartao>
      )}

      <EmConstrucao
        icone="calendar-outline"
        titulo="Agenda"
        itens={[
          'Visão de dia e de semana',
          'Status: agendado, confirmado, faltou, atendido',
          'Nova consulta e lembrete pelo WhatsApp',
        ]}
      />
    </Tela>
  );
}

const styles = StyleSheet.create({
  linha: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
});
