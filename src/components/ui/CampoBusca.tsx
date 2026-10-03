import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { cores, espaco, raio, tipografia } from '@/theme';

type Props = {
  valor: string;
  onChange: (texto: string) => void;
  placeholder: string;
};

export function CampoBusca({ valor, onChange, placeholder }: Props) {
  return (
    <View style={styles.base}>
      <Ionicons name="search" size={18} color={cores.textoSecundario} />
      <TextInput
        value={valor}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={cores.textoSecundario}
        accessibilityLabel={placeholder}
        autoCorrect={false}
        returnKeyType="search"
        clearButtonMode="never"
        style={styles.input}
      />
      {valor.length > 0 && (
        <Pressable accessibilityRole="button" accessibilityLabel="Limpar busca" onPress={() => onChange('')} hitSlop={8}>
          <Ionicons name="close-circle" size={18} color={cores.textoSecundario} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco.sm,
    backgroundColor: cores.superficie,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: raio.md,
    paddingHorizontal: espaco.md,
    minHeight: 44,
  },
  input: { ...tipografia.corpo, flex: 1, color: cores.texto, paddingVertical: espaco.sm },
});
