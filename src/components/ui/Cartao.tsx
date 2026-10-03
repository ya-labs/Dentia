import { Pressable, StyleSheet, View, ViewProps } from 'react-native';

import { cores, espaco, raio, sombra } from '@/theme';

type Props = ViewProps & {
  /** Torna o cartão tocável. */
  onPress?: () => void;
};

export function Cartao({ onPress, style, children, ...rest }: Props) {
  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        style={({ pressed }) => [styles.base, pressed && styles.pressionado, style]}
        {...rest}
      >
        {children}
      </Pressable>
    );
  }
  return (
    <View style={[styles.base, style]} {...rest}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: cores.superficie,
    borderRadius: raio.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: cores.borda,
    padding: espaco.lg,
    gap: espaco.sm,
    ...sombra,
  },
  pressionado: { backgroundColor: cores.superficieAlternativa },
});
