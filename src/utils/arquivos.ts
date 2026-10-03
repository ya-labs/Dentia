import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

import type { Anexo } from '@/types';

/** Arquivo escolhido no aparelho, ainda sem paciente ou categoria. */
export type ArquivoEscolhido = Pick<Anexo, 'uri' | 'tipo' | 'titulo'>;

const OPCOES_IMAGEM: ImagePicker.ImagePickerOptions = { mediaTypes: ['images'], quality: 0.7 };

function horaAtual(): string {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

/** Abre a câmera; devolve `null` se a pessoa cancelar ou negar a permissão. */
export async function tirarFoto(): Promise<ArquivoEscolhido | null> {
  const permissao = await ImagePicker.requestCameraPermissionsAsync();
  if (!permissao.granted) {
    Alert.alert('Câmera bloqueada', 'Libere o acesso à câmera nos ajustes do iPhone para tirar fotos.');
    return null;
  }
  const resultado = await ImagePicker.launchCameraAsync(OPCOES_IMAGEM);
  if (resultado.canceled || !resultado.assets[0]) return null;
  return { uri: resultado.assets[0].uri, tipo: 'imagem', titulo: `Foto das ${horaAtual()}` };
}

export async function escolherDaGaleria(): Promise<ArquivoEscolhido | null> {
  const resultado = await ImagePicker.launchImageLibraryAsync(OPCOES_IMAGEM);
  if (resultado.canceled || !resultado.assets[0]) return null;
  const asset = resultado.assets[0];
  return { uri: asset.uri, tipo: 'imagem', titulo: asset.fileName ?? `Imagem das ${horaAtual()}` };
}

/** Importa PDF ou imagem dos arquivos do aparelho. */
export async function importarArquivo(): Promise<ArquivoEscolhido | null> {
  const resultado = await DocumentPicker.getDocumentAsync({
    type: ['application/pdf', 'image/*'],
    copyToCacheDirectory: true,
  });
  if (resultado.canceled || !resultado.assets[0]) return null;
  const asset = resultado.assets[0];
  const pdf = asset.mimeType === 'application/pdf' || asset.name.toLowerCase().endsWith('.pdf');
  return { uri: asset.uri, tipo: pdf ? 'pdf' : 'imagem', titulo: asset.name.replace(/\.[^.]+$/, '') };
}
