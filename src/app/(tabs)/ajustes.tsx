import { Cartao, EmConstrucao, Tela, Texto } from '@/components/ui';
import { useDados } from '@/store';

export default function AjustesScreen() {
  const { consultorio } = useDados().dados;
  return (
    <Tela titulo="Ajustes" subtitulo="Consultório e preferências">
      <Cartao>
        <Texto variante="corpoForte">{consultorio.nome}</Texto>
        <Texto suave>
          {consultorio.dentista} · {consultorio.cro}
        </Texto>
        <Texto suave>
          Atendimento das {consultorio.horario.inicio} às {consultorio.horario.fim}
        </Texto>
      </Cartao>

      <EmConstrucao
        icone="settings-outline"
        titulo="Ajustes"
        itens={[
          'Dados do consultório',
          'Horário de atendimento e duração padrão',
          'Texto da mensagem de WhatsApp',
        ]}
      />

      <Texto variante="legenda" suave>
        Protótipo Dentia · dados fictícios, nada é salvo.
      </Texto>
    </Tela>
  );
}
