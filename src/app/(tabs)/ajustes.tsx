import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Botao, CampoTexto, Cartao, Escolhas, Secao, Tela, Texto } from '@/components/ui';
import { useDados } from '@/store';
import { cores, espaco, raio } from '@/theme';
import type { Consultorio } from '@/types';
import { horaParaMinutos, nomeDiaCurto } from '@/utils/datas';
import { mascararHora, mascararTelefone } from '@/utils/texto';
import { montarMensagem } from '@/utils/whatsapp';

const DURACOES = [30, 45, 60, 90];
// Segunda a domingo.
const DIAS = [1, 2, 3, 4, 5, 6, 0];

export default function AjustesScreen() {
  const { dados, atualizarConsultorio } = useDados();
  const [form, setForm] = useState<Consultorio>(dados.consultorio);
  const [salvo, setSalvo] = useState(true);

  const alterar = <K extends keyof Consultorio>(campo: K, valor: Consultorio[K]) => {
    setForm((f) => ({ ...f, [campo]: valor }));
    setSalvo(false);
  };
  const alterarHorario = (parcial: Partial<Consultorio['horario']>) => alterar('horario', { ...form.horario, ...parcial });

  const inicioMin = horaParaMinutos(form.horario.inicio);
  const fimMin = horaParaMinutos(form.horario.fim);
  const erroHorario =
    inicioMin === undefined || fimMin === undefined
      ? 'Use o formato HH:MM.'
      : fimMin <= inicioMin
        ? 'O fim precisa ser depois do início.'
        : undefined;
  const erroNome = form.nome.trim() ? undefined : 'Informe o nome do consultório.';
  const valido = !erroHorario && !erroNome && form.horario.dias.length > 0;

  const exemplo = montarMensagem(form.mensagemWhatsApp, {
    paciente: 'Ana',
    data: '15/10',
    hora: '14:30',
    consultorio: form.nome || 'consultório',
  });

  return (
    <Tela titulo="Ajustes" subtitulo="Consultório e preferências">
      <Secao titulo="Consultório">
        <Cartao>
          <CampoTexto rotulo="Nome do consultório" value={form.nome} onChangeText={(v) => alterar('nome', v)} erro={erroNome} />
          <CampoTexto rotulo="Dentista" value={form.dentista} onChangeText={(v) => alterar('dentista', v)} />
          <CampoTexto rotulo="CRO" value={form.cro} onChangeText={(v) => alterar('cro', v)} autoCapitalize="characters" />
          <CampoTexto
            rotulo="Telefone"
            value={form.telefone}
            onChangeText={(v) => alterar('telefone', mascararTelefone(v))}
            keyboardType="phone-pad"
          />
          <CampoTexto rotulo="Endereço" value={form.endereco} onChangeText={(v) => alterar('endereco', v)} />
        </Cartao>
      </Secao>

      <Secao titulo="Atendimento">
        <Cartao>
          <View style={styles.linha}>
            <View style={styles.flex}>
              <CampoTexto
                rotulo="Início"
                value={form.horario.inicio}
                onChangeText={(v) => alterarHorario({ inicio: mascararHora(v) })}
                keyboardType="number-pad"
              />
            </View>
            <View style={styles.flex}>
              <CampoTexto
                rotulo="Fim"
                value={form.horario.fim}
                onChangeText={(v) => alterarHorario({ fim: mascararHora(v) })}
                keyboardType="number-pad"
              />
            </View>
          </View>
          {erroHorario && (
            <Texto variante="legenda" cor={cores.perigo}>
              {erroHorario}
            </Texto>
          )}
          <Texto variante="rotulo" suave>
            Dias de atendimento
          </Texto>
          <Escolhas
            opcoes={DIAS.map((d) => ({ valor: d, rotulo: nomeDiaCurto(d) }))}
            selecionados={form.horario.dias}
            onAlternar={(d) =>
              alterarHorario({
                dias: form.horario.dias.includes(d) ? form.horario.dias.filter((x) => x !== d) : [...form.horario.dias, d].sort(),
              })
            }
          />
          <Texto variante="rotulo" suave>
            Duração padrão da consulta
          </Texto>
          <Escolhas
            opcoes={DURACOES.map((d) => ({ valor: d, rotulo: `${d} min` }))}
            selecionados={[form.duracaoPadraoMin]}
            onAlternar={(d) => alterar('duracaoPadraoMin', d)}
          />
        </Cartao>
      </Secao>

      <Secao titulo="Mensagem de lembrete (WhatsApp)">
        <Cartao>
          <CampoTexto
            rotulo="Modelo da mensagem"
            value={form.mensagemWhatsApp}
            onChangeText={(v) => alterar('mensagemWhatsApp', v)}
            multiline
            ajuda="Use {paciente}, {data}, {hora} e {consultorio}; eles são trocados pelos dados da consulta."
          />
          <Texto variante="rotulo" suave>
            Exemplo
          </Texto>
          <View style={styles.balao}>
            <Texto>{exemplo}</Texto>
          </View>
        </Cartao>
      </Secao>

      <Botao
        titulo={salvo ? 'Ajustes salvos' : 'Salvar ajustes'}
        icone={salvo ? 'checkmark' : 'save-outline'}
        bloco
        disabled={salvo || !valido}
        onPress={() => {
          atualizarConsultorio({ ...form, nome: form.nome.trim() });
          setSalvo(true);
        }}
      />

      <Texto variante="legenda" suave>
        Protótipo Dentia · dados fictícios, nada fica salvo ao fechar o app.
      </Texto>
    </Tela>
  );
}

const styles = StyleSheet.create({
  linha: { flexDirection: 'row', gap: espaco.md },
  flex: { flex: 1 },
  balao: {
    backgroundColor: cores.sucessoSuave,
    borderRadius: raio.md,
    padding: espaco.md,
  },
});
