import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AlertasSaude, Botao, CampoTexto, Cartao, Pagina, Secao, SimNao, Texto, Vazio } from '@/components/ui';
import { perguntasAnamnese, secoesAnamnese } from '@/data';
import { alertasDaAnamnese, anamneseAtual, buscarPaciente, useDados } from '@/store';
import { voltarOu } from '@/utils/navegacao';
import { espaco } from '@/theme';
import type { Id, RespostaAnamnese, SecaoAnamnese } from '@/types';
import { formatarData } from '@/utils/datas';

export default function AnamneseScreen() {
  const { id, novo } = useLocalSearchParams<{ id: string; novo?: string }>();
  const { dados, salvarAnamnese } = useDados();
  const paciente = buscarPaciente(dados, id);
  const anterior = anamneseAtual(dados, id);

  const [queixa, setQueixa] = useState(anterior?.queixaPrincipal ?? '');
  const [medicamentos, setMedicamentos] = useState(anterior?.medicamentos.join('\n') ?? '');
  const [respostas, setRespostas] = useState<Record<Id, RespostaAnamnese>>(anterior?.respostas ?? {});

  if (!paciente) {
    return <Vazio icone="person-outline" titulo="Paciente não encontrado" />;
  }

  const responder = (perguntaId: Id, resposta: Partial<RespostaAnamnese>) =>
    setRespostas((r) => {
      const atual = r[perguntaId] ?? { sim: false };
      return { ...r, [perguntaId]: { ...atual, ...resposta } };
    });

  // Pré-visualização dos alertas que a ficha vai mostrar.
  const alertas = alertasDaAnamnese({
    id: 'previa',
    pacienteId: paciente.id,
    data: '',
    queixaPrincipal: queixa,
    medicamentos: [],
    respostas,
  });

  function salvar() {
    // Guarda só respostas "sim"; ausência equivale a "não".
    const somenteSim = Object.fromEntries(
      Object.entries(respostas)
        .filter(([, r]) => r.sim)
        .map(([pid, r]) => [pid, { sim: true, detalhe: r.detalhe?.trim() || undefined }]),
    );
    salvarAnamnese(paciente!.id, {
      queixaPrincipal: queixa.trim(),
      medicamentos: medicamentos
        .split(/[\n,;]/)
        .map((m) => m.trim())
        .filter(Boolean),
      respostas: somenteSim,
    });
    if (novo) router.replace(`/paciente/${paciente!.id}`);
    else voltarOu(`/paciente/${paciente!.id}`);
  }

  const secoes = Object.keys(secoesAnamnese) as SecaoAnamnese[];

  return (
    <>
      <Stack.Screen options={{ title: 'Anamnese' }} />
      <Pagina
        rodape={
          <>
            <AlertasSaude alertas={alertas} />
            <Botao titulo="Salvar anamnese" icone="checkmark" bloco onPress={salvar} />
          </>
        }
      >
        <View style={styles.topo}>
          <Texto variante="corpoForte">{paciente.nome}</Texto>
          <Texto variante="legenda" suave>
            {anterior
              ? `Partindo da anamnese de ${formatarData(anterior.data)}. Ao salvar, uma nova versão é registrada e a anterior fica guardada.`
              : 'Primeira anamnese do paciente.'}
          </Texto>
        </View>

        <Secao titulo="Queixa principal">
          <Cartao>
            <CampoTexto
              rotulo="O que trouxe o paciente?"
              value={queixa}
              onChangeText={setQueixa}
              multiline
              placeholder="Ex.: dor ao mastigar do lado direito"
            />
          </Cartao>
        </Secao>

        {secoes.map((secao) => (
          <Secao key={secao} titulo={secoesAnamnese[secao]}>
            <Cartao style={styles.perguntas}>
              {perguntasAnamnese
                .filter((p) => p.secao === secao)
                .map((p) => {
                  const r = respostas[p.id];
                  return (
                    <View key={p.id} style={styles.pergunta}>
                      <SimNao
                        pergunta={p.texto}
                        valor={!!r?.sim}
                        risco={p.risco}
                        onChange={(sim) => responder(p.id, { sim })}
                      />
                      {r?.sim && p.detalhe && (
                        <CampoTexto
                          rotulo={p.detalhe}
                          value={r.detalhe ?? ''}
                          onChangeText={(detalhe) => responder(p.id, { detalhe })}
                        />
                      )}
                    </View>
                  );
                })}
            </Cartao>
          </Secao>
        ))}

        <Secao titulo="Medicamentos em uso">
          <Cartao>
            <CampoTexto
              rotulo="Um por linha"
              value={medicamentos}
              onChangeText={setMedicamentos}
              multiline
              placeholder="Ex.: Losartana 50 mg"
              ajuda="Atenção a anticoagulantes, bisfosfonatos e anti-hipertensivos."
            />
          </Cartao>
        </Secao>
      </Pagina>
    </>
  );
}

const styles = StyleSheet.create({
  topo: { gap: espaco.xs },
  perguntas: { gap: espaco.md },
  pergunta: { gap: espaco.sm },
});
