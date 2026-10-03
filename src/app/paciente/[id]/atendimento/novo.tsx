import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import { Botao, CampoTexto, Cartao, Escolhas, Pagina, Secao, Texto, Vazio } from '@/components/ui';
import { buscarPaciente, useDados } from '@/store';
import { voltarOu } from '@/utils/navegacao';
import { cores, espaco, raio } from '@/theme';
import { ArquivoEscolhido, escolherDaGaleria, tirarFoto } from '@/utils/arquivos';
import { dataBrParaISO, formatarData, paraDataISO } from '@/utils/datas';
import { mascararData } from '@/utils/texto';

const PROCEDIMENTOS_COMUNS = ['Avaliação', 'Profilaxia (limpeza)', 'Restauração', 'Tratamento de canal', 'Extração', 'Ajuste de prótese'];

/** Números FDI válidos: permanentes 11–48 e decíduos 51–85. */
function denteValido(n: number): boolean {
  const q = Math.floor(n / 10);
  const d = n % 10;
  return (q >= 1 && q <= 4 && d >= 1 && d <= 8) || (q >= 5 && q <= 8 && d >= 1 && d <= 5);
}

export default function NovoAtendimentoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { dados, criarAnexos, criarAtendimento } = useDados();
  const paciente = buscarPaciente(dados, id);

  const [procedimento, setProcedimento] = useState('');
  const [data, setData] = useState(formatarData(paraDataISO(new Date())));
  const [dentes, setDentes] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [fotos, setFotos] = useState<ArquivoEscolhido[]>([]);
  const [tentouSalvar, setTentouSalvar] = useState(false);

  if (!paciente) return <Vazio icone="person-outline" titulo="Paciente não encontrado" />;

  const dataISO = dataBrParaISO(data);
  const numeros = dentes
    .split(/[^0-9]+/)
    .filter(Boolean)
    .map(Number);
  const invalidos = numeros.filter((n) => !denteValido(n));

  const erroProcedimento = tentouSalvar && !procedimento.trim() ? 'Informe o procedimento.' : undefined;
  const erroData = tentouSalvar && !dataISO ? 'Use o formato DD/MM/AAAA.' : undefined;
  const erroDentes = invalidos.length > 0 ? `Número inválido: ${invalidos.join(', ')}` : undefined;

  async function adicionarFoto(escolher: () => Promise<ArquivoEscolhido | null>) {
    const foto = await escolher();
    if (foto) setFotos((atual) => [...atual, foto]);
  }

  function salvar() {
    setTentouSalvar(true);
    if (!procedimento.trim() || !dataISO || invalidos.length > 0) return;
    const anexos = criarAnexos(
      fotos.map((f) => ({ ...f, pacienteId: paciente!.id, categoria: 'foto', data: dataISO, descricao: procedimento.trim() })),
    );
    criarAtendimento({
      pacienteId: paciente!.id,
      data: dataISO,
      procedimento: procedimento.trim(),
      dentes: [...new Set(numeros)],
      observacoes: observacoes.trim() || undefined,
      anexoIds: anexos.map((a) => a.id),
    });
    voltarOu(`/paciente/${paciente!.id}?aba=historico`);
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Novo atendimento' }} />
      <Pagina rodape={<Botao titulo="Salvar atendimento" icone="checkmark" bloco onPress={salvar} />}>
        <Texto variante="corpoForte">{paciente.nome}</Texto>

        <Secao titulo="Procedimento">
          <Cartao>
            <Escolhas
              opcoes={PROCEDIMENTOS_COMUNS.map((p) => ({ valor: p, rotulo: p }))}
              selecionados={[procedimento]}
              onAlternar={setProcedimento}
            />
            <CampoTexto rotulo="Procedimento" obrigatorio value={procedimento} onChangeText={setProcedimento} erro={erroProcedimento} />
            <CampoTexto
              rotulo="Data"
              obrigatorio
              value={data}
              onChangeText={(t) => setData(mascararData(t))}
              keyboardType="number-pad"
              erro={erroData}
            />
            <CampoTexto
              rotulo="Dentes envolvidos"
              value={dentes}
              onChangeText={setDentes}
              placeholder="Ex.: 36, 37"
              keyboardType="numbers-and-punctuation"
              ajuda="Numeração FDI, separada por vírgula."
              erro={erroDentes}
            />
            <CampoTexto rotulo="Observações" value={observacoes} onChangeText={setObservacoes} multiline />
          </Cartao>
        </Secao>

        <Secao titulo={`Fotos (${fotos.length})`}>
          <View style={styles.acoes}>
            <View style={styles.flex}>
              <Botao titulo="Tirar foto" icone="camera" variante="secundario" bloco onPress={() => adicionarFoto(tirarFoto)} />
            </View>
            <View style={styles.flex}>
              <Botao titulo="Galeria" icone="images-outline" variante="fantasma" bloco onPress={() => adicionarFoto(escolherDaGaleria)} />
            </View>
          </View>
          {fotos.length > 0 && (
            <View style={styles.fotos}>
              {fotos.map((f, i) => (
                <View key={`${f.uri}-${i}`}>
                  <Image source={{ uri: f.uri }} style={styles.foto} />
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Remover foto"
                    hitSlop={8}
                    onPress={() => setFotos((atual) => atual.filter((_, j) => j !== i))}
                    style={styles.remover}
                  >
                    <Ionicons name="close-circle" size={22} color={cores.perigo} />
                  </Pressable>
                </View>
              ))}
            </View>
          )}
          <Texto variante="legenda" suave>
            As fotos também aparecem na aba Anexos do paciente.
          </Texto>
        </Secao>
      </Pagina>
    </>
  );
}

const styles = StyleSheet.create({
  acoes: { flexDirection: 'row', gap: espaco.sm },
  flex: { flex: 1 },
  fotos: { flexDirection: 'row', flexWrap: 'wrap', gap: espaco.sm },
  foto: { width: 88, height: 88, borderRadius: raio.md, backgroundColor: cores.superficieAlternativa },
  remover: { position: 'absolute', top: -8, right: -8, backgroundColor: cores.superficie, borderRadius: 11 },
});
