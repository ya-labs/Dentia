import { StyleSheet, View } from 'react-native';

import { Avatar, Cartao, Texto } from '@/components/ui';
import { espaco } from '@/theme';
import type { Paciente } from '@/types';
import { idade } from '@/utils/datas';

export function CabecalhoPaciente({ paciente }: { paciente: Paciente }) {
  const anos = idade(paciente.dataNascimento);
  return (
    <Cartao>
      <View style={styles.linha}>
        <Avatar nome={paciente.nome} tamanho={56} />
        <View style={styles.textos}>
          <Texto variante="subtitulo" accessibilityRole="header">
            {paciente.nome}
          </Texto>
          <Texto suave>
            {anos} {anos === 1 ? 'ano' : 'anos'} · {paciente.telefone}
          </Texto>
        </View>
      </View>
      {paciente.responsavel && (
        <Texto variante="legenda" suave>
          Responsável: {paciente.responsavel.nome} ({paciente.responsavel.parentesco}) · {paciente.responsavel.telefone}
        </Texto>
      )}
      {paciente.observacoes && (
        <Texto variante="legenda" suave>
          {paciente.observacoes}
        </Texto>
      )}
    </Cartao>
  );
}

const styles = StyleSheet.create({
  linha: { flexDirection: 'row', alignItems: 'center', gap: espaco.md },
  textos: { flex: 1, gap: espaco.xxs },
});
