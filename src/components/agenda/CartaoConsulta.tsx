import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AlertasSaude, Cartao, SeloStatusConsulta, Texto } from '@/components/ui';
import { alertasDoPaciente, buscarPaciente, useDados } from '@/store';
import { coresStatusConsulta, espaco, raio } from '@/theme';
import type { Consulta } from '@/types';
import { formatarHora, lerData } from '@/utils/datas';

type Props = {
  consulta: Consulta;
  /** Versão enxuta para a visão de semana (sem alertas). */
  compacto?: boolean;
};

export function CartaoConsulta({ consulta, compacto }: Props) {
  const { dados } = useDados();
  const paciente = buscarPaciente(dados, consulta.pacienteId);
  const alertas = compacto ? [] : alertasDoPaciente(dados, consulta.pacienteId);
  const fim = new Date(lerData(consulta.inicio).getTime() + consulta.duracaoMin * 60_000);
  const cor = coresStatusConsulta[consulta.status].texto;

  return (
    <Cartao
      onPress={() => router.push(`/consulta/${consulta.id}`)}
      accessibilityLabel={`Consulta às ${formatarHora(consulta.inicio)} com ${paciente?.nome ?? 'paciente'}`}
      style={[styles.base, compacto && styles.compacto]}
    >
      <View style={[styles.faixa, { backgroundColor: cor }]} />
      <View style={styles.horario}>
        <Texto variante="corpoForte">{formatarHora(consulta.inicio)}</Texto>
        <Texto variante="legenda" suave>
          {String(fim.getHours()).padStart(2, '0')}:{String(fim.getMinutes()).padStart(2, '0')}
        </Texto>
      </View>
      <View style={styles.flex}>
        <Texto variante="corpoForte" numberOfLines={1}>
          {paciente?.nome ?? 'Paciente removido'}
        </Texto>
        <Texto variante="legenda" suave numberOfLines={1}>
          {consulta.procedimento} · {consulta.duracaoMin} min
        </Texto>
        {!compacto && <SeloStatusConsulta status={consulta.status} />}
        <AlertasSaude alertas={alertas} />
      </View>
    </Cartao>
  );
}

const styles = StyleSheet.create({
  base: { flexDirection: 'row', gap: espaco.md, paddingLeft: espaco.lg + espaco.xs, overflow: 'hidden' },
  compacto: { paddingVertical: espaco.sm },
  faixa: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 5, borderTopLeftRadius: raio.lg, borderBottomLeftRadius: raio.lg },
  horario: { width: 48, gap: espaco.xxs },
  flex: { flex: 1, gap: espaco.xs },
});
