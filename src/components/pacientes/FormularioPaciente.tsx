import { useState } from 'react';

import { Botao, CampoTexto, Cartao, Pagina, Secao, Texto } from '@/components/ui';
import type { NovoPaciente } from '@/store';
import type { Paciente } from '@/types';
import { dataBrParaISO, formatarData, idade, paraDataISO } from '@/utils/datas';
import { mascararCpf, mascararData, mascararTelefone, soDigitos } from '@/utils/texto';

export type DestinoAposSalvar = 'ficha' | 'anamnese';

type Props = {
  inicial?: Paciente;
  onSalvar: (dados: NovoPaciente, destino: DestinoAposSalvar) => void;
};

type Erros = Partial<Record<'nome' | 'nascimento' | 'telefone' | 'responsavelNome' | 'responsavelTelefone', string>>;

/** Cadastro e edição: campos essenciais primeiro; responsável aparece para menores de idade. */
export function FormularioPaciente({ inicial, onSalvar }: Props) {
  const [nome, setNome] = useState(inicial?.nome ?? '');
  const [nascimento, setNascimento] = useState(inicial ? formatarData(inicial.dataNascimento) : '');
  const [telefone, setTelefone] = useState(inicial?.telefone ?? '');
  const [email, setEmail] = useState(inicial?.email ?? '');
  const [cpf, setCpf] = useState(inicial?.cpf ?? '');
  const [endereco, setEndereco] = useState(inicial?.endereco ?? '');
  const [observacoes, setObservacoes] = useState(inicial?.observacoes ?? '');
  const [respNome, setRespNome] = useState(inicial?.responsavel?.nome ?? '');
  const [respTelefone, setRespTelefone] = useState(inicial?.responsavel?.telefone ?? '');
  const [respParentesco, setRespParentesco] = useState(inicial?.responsavel?.parentesco ?? '');
  const [erros, setErros] = useState<Erros>({});

  const nascimentoISO = dataBrParaISO(nascimento);
  const menor = nascimentoISO !== undefined && idade(nascimentoISO) < 18;
  const mostrarResponsavel = menor || !!inicial?.responsavel;

  function validar(): Erros {
    const e: Erros = {};
    if (nome.trim().length < 3) e.nome = 'Informe o nome completo.';
    if (!nascimentoISO) e.nascimento = 'Use o formato DD/MM/AAAA.';
    else if (nascimentoISO > paraDataISO(new Date())) e.nascimento = 'A data não pode estar no futuro.';
    if (soDigitos(telefone).length < 10) e.telefone = 'Informe o telefone com DDD.';
    if (menor) {
      if (respNome.trim().length < 3) e.responsavelNome = 'Informe o nome do responsável.';
      if (soDigitos(respTelefone).length < 10) e.responsavelTelefone = 'Informe o telefone com DDD.';
    }
    return e;
  }

  function salvar(destino: DestinoAposSalvar) {
    const e = validar();
    setErros(e);
    if (Object.keys(e).length > 0 || !nascimentoISO) return;

    const opcional = (v: string) => v.trim() || undefined;
    const temResponsavel = mostrarResponsavel && respNome.trim().length > 0;
    onSalvar(
      {
        nome: nome.trim(),
        dataNascimento: nascimentoISO,
        telefone: telefone.trim(),
        email: opcional(email),
        cpf: opcional(cpf),
        endereco: opcional(endereco),
        observacoes: opcional(observacoes),
        responsavel: temResponsavel
          ? { nome: respNome.trim(), telefone: respTelefone.trim(), parentesco: respParentesco.trim() || 'Responsável' }
          : undefined,
      },
      destino,
    );
  }

  const temErros = Object.keys(erros).length > 0;

  return (
    <Pagina
      rodape={
        <>
          {temErros && (
            <Texto variante="legenda" suave>
              Confira os campos destacados.
            </Texto>
          )}
          {inicial ? (
            <Botao titulo="Salvar alterações" icone="checkmark" bloco onPress={() => salvar('ficha')} />
          ) : (
            <>
              <Botao titulo="Salvar e preencher anamnese" icone="arrow-forward" bloco onPress={() => salvar('anamnese')} />
              <Botao titulo="Só salvar" variante="fantasma" bloco onPress={() => salvar('ficha')} />
            </>
          )}
        </>
      }
    >
      <Secao titulo="Essencial">
        <Cartao>
          <CampoTexto
            rotulo="Nome completo"
            obrigatorio
            value={nome}
            onChangeText={setNome}
            autoCapitalize="words"
            textContentType="name"
            erro={erros.nome}
          />
          <CampoTexto
            rotulo="Data de nascimento"
            obrigatorio
            value={nascimento}
            onChangeText={(t) => setNascimento(mascararData(t))}
            placeholder="DD/MM/AAAA"
            keyboardType="number-pad"
            erro={erros.nascimento}
            ajuda={nascimentoISO ? `${idade(nascimentoISO)} anos` : undefined}
          />
          <CampoTexto
            rotulo="Telefone (WhatsApp)"
            obrigatorio
            value={telefone}
            onChangeText={(t) => setTelefone(mascararTelefone(t))}
            placeholder="(51) 99999-9999"
            keyboardType="phone-pad"
            textContentType="telephoneNumber"
            erro={erros.telefone}
          />
        </Cartao>
      </Secao>

      {mostrarResponsavel && (
        <Secao titulo="Responsável">
          <Cartao>
            {menor && (
              <Texto variante="legenda" suave>
                Paciente menor de idade: informe quem responde por ele.
              </Texto>
            )}
            <CampoTexto
              rotulo="Nome do responsável"
              obrigatorio={menor}
              value={respNome}
              onChangeText={setRespNome}
              autoCapitalize="words"
              erro={erros.responsavelNome}
            />
            <CampoTexto
              rotulo="Telefone do responsável"
              obrigatorio={menor}
              value={respTelefone}
              onChangeText={(t) => setRespTelefone(mascararTelefone(t))}
              placeholder="(51) 99999-9999"
              keyboardType="phone-pad"
              erro={erros.responsavelTelefone}
            />
            <CampoTexto
              rotulo="Parentesco"
              value={respParentesco}
              onChangeText={setRespParentesco}
              placeholder="Mãe, pai, filha…"
              autoCapitalize="sentences"
            />
          </Cartao>
        </Secao>
      )}

      <Secao titulo="Mais dados (opcional)">
        <Cartao>
          <CampoTexto
            rotulo="E-mail"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            textContentType="emailAddress"
          />
          <CampoTexto
            rotulo="CPF"
            value={cpf}
            onChangeText={(t) => setCpf(mascararCpf(t))}
            placeholder="000.000.000-00"
            keyboardType="number-pad"
          />
          <CampoTexto rotulo="Endereço" value={endereco} onChangeText={setEndereco} />
          <CampoTexto rotulo="Observações" value={observacoes} onChangeText={setObservacoes} multiline />
        </Cartao>
      </Secao>
    </Pagina>
  );
}
