import { AlertasSaude, Cartao, EmConstrucao, Tela, Texto } from '@/components/ui';
import { alertasDoPaciente, pacientes } from '@/data';
import { idade } from '@/utils/datas';

export default function PacientesScreen() {
  const exemplo = pacientes.find((p) => alertasDoPaciente(p.id).length > 0) ?? pacientes[0];

  return (
    <Tela titulo="Pacientes" subtitulo={`${pacientes.length} pacientes cadastrados (fictícios)`}>
      <Cartao>
        <Texto variante="corpoForte">{exemplo.nome}</Texto>
        <Texto suave>
          {idade(exemplo.dataNascimento)} anos · {exemplo.telefone}
        </Texto>
        <AlertasSaude alertas={alertasDoPaciente(exemplo.id)} />
      </Cartao>

      <EmConstrucao
        icone="people-outline"
        titulo="Pacientes"
        itens={[
          'Busca por nome ou telefone',
          'Ficha com Saúde, Odontograma, Histórico e Anexos',
          'Cadastro rápido com anamnese',
        ]}
      />
    </Tela>
  );
}
