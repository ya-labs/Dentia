import Ionicons from '@expo/vector-icons/Ionicons';
import { ComponentProps } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import { Texto } from '@/components/ui';
import { cores, espaco, raio } from '@/theme';
import type { Anexo, CategoriaAnexo } from '@/types';

export const categoriasAnexo: Record<CategoriaAnexo, { rotulo: string; icone: ComponentProps<typeof Ionicons>['name'] }> = {
  'raio-x': { rotulo: 'Raio-x', icone: 'scan-outline' },
  foto: { rotulo: 'Fotos', icone: 'camera-outline' },
  exame: { rotulo: 'Exames', icone: 'flask-outline' },
  documento: { rotulo: 'Documentos', icone: 'document-text-outline' },
};

type Props = {
  anexo: Anexo;
  tamanho: number;
  onPress?: () => void;
  /** Mostra o título abaixo da imagem. */
  comTitulo?: boolean;
};

/** Miniatura quadrada: imagem real quando houver arquivo; ícone da categoria nos anexos fictícios e PDFs. */
export function MiniaturaAnexo({ anexo, tamanho, onPress, comTitulo }: Props) {
  const temImagem = anexo.tipo === 'imagem' && !!anexo.uri;
  const icone = anexo.tipo === 'pdf' ? 'document-attach-outline' : categoriasAnexo[anexo.categoria].icone;

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole="button"
      accessibilityLabel={`Abrir ${anexo.titulo}`}
      style={({ pressed }) => [{ width: tamanho }, styles.base, pressed && styles.pressionado]}
    >
      <View style={[styles.caixa, { width: tamanho, height: tamanho }]}>
        {temImagem ? (
          <Image source={{ uri: anexo.uri }} style={styles.imagem} resizeMode="cover" />
        ) : (
          <>
            <Ionicons name={icone} size={tamanho * 0.32} color={cores.primaria} />
            <Texto variante="legenda" suave>
              {anexo.tipo === 'pdf' ? 'PDF' : categoriasAnexo[anexo.categoria].rotulo}
            </Texto>
          </>
        )}
      </View>
      {comTitulo && (
        <Texto variante="legenda" numberOfLines={2}>
          {anexo.titulo}
        </Texto>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { gap: espaco.xs },
  pressionado: { opacity: 0.7 },
  caixa: {
    borderRadius: raio.md,
    overflow: 'hidden',
    backgroundColor: cores.primariaSuave,
    alignItems: 'center',
    justifyContent: 'center',
    gap: espaco.xxs,
  },
  imagem: { width: '100%', height: '100%' },
});
