import { StyleSheet, View } from 'react-native';

import { Cartao, EmConstrucao, Tela, Texto } from '@/components/ui';
import { alertasDoPaciente, consultasDoDia, consultorio } from '@/data';
import { cores, espaco } from '@/theme';
import { formatarDataExtenso, saudacao } from '@/utils/datas';

export default function HojeScreen() {
  const hoje = new Date();
  const consultas = consultasDoDia(hoje);
  const comAlerta = consultas.filter((c) => alertasDoPaciente(c.pacienteId).length > 0).length;
  const dataExtenso = formatarDataExtenso(hoje);

  return (
    <Tela
      titulo={`${saudacao(hoje)}, ${consultorio.dentista}`}
      subtitulo={dataExtenso.charAt(0).toUpperCase() + dataExtenso.slice(1)}
    >
      <View style={styles.resumo}>
        <Cartao style={styles.indicador}>
          <Texto variante="titulo" cor={cores.primaria}>
            {consultas.length}
          </Texto>
          <Texto variante="legenda" suave>
            consultas hoje
          </Texto>
        </Cartao>
        <Cartao style={styles.indicador}>
          <Texto variante="titulo" cor={cores.perigo}>
            {comAlerta}
          </Texto>
          <Texto variante="legenda" suave>
            com alerta de saúde
          </Texto>
        </Cartao>
      </View>

      <EmConstrucao
        icone="today-outline"
        titulo="Hoje"
        itens={[
          'Consultas do dia em ordem de horário',
          'Alertas de saúde de cada paciente',
          'Atalhos para nova consulta e novo paciente',
        ]}
      />
    </Tela>
  );
}

const styles = StyleSheet.create({
  resumo: { flexDirection: 'row', gap: espaco.md },
  indicador: { flex: 1, gap: espaco.xxs },
});
