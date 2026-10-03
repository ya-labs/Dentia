import * as Linking from 'expo-linking';

import type { Consulta, Consultorio, Paciente } from '@/types';

import { formatarData, formatarHora } from './datas';
import { soDigitos } from './texto';

/** Preenche o modelo de Ajustes. Variáveis: {paciente}, {data}, {hora}, {consultorio}. */
export function montarMensagem(
  modelo: string,
  valores: { paciente: string; data: string; hora: string; consultorio: string },
): string {
  return modelo
    .replace(/\{paciente\}/g, valores.paciente)
    .replace(/\{data\}/g, valores.data)
    .replace(/\{hora\}/g, valores.hora)
    .replace(/\{consultorio\}/g, valores.consultorio);
}

export function mensagemDeLembrete(consultorio: Consultorio, paciente: Paciente, inicio: Consulta['inicio']): string {
  return montarMensagem(consultorio.mensagemWhatsApp, {
    paciente: paciente.nome.split(' ')[0],
    data: formatarData(inicio).slice(0, 5),
    hora: formatarHora(inicio),
    consultorio: consultorio.nome,
  });
}

/** Menores recebem o lembrete no telefone do responsável. */
export function telefoneDeContato(paciente: Paciente): string {
  return paciente.responsavel?.telefone ?? paciente.telefone;
}

/** Link `wa.me` com DDI 55 e a mensagem pronta. Nada é enviado automaticamente. */
export function linkWhatsApp(telefone: string, mensagem: string): string {
  const numero = soDigitos(telefone);
  const comPais = numero.startsWith('55') && numero.length > 11 ? numero : `55${numero}`;
  return `https://wa.me/${comPais}?text=${encodeURIComponent(mensagem)}`;
}

export function abrirWhatsApp(telefone: string, mensagem: string): Promise<true> {
  return Linking.openURL(linkWhatsApp(telefone, mensagem));
}
