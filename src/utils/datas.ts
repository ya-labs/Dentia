const DIAS_SEMANA = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
const MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

const doisDigitos = (n: number) => String(n).padStart(2, '0');

/** Data local em `YYYY-MM-DD`. */
export function paraDataISO(data: Date): string {
  return `${data.getFullYear()}-${doisDigitos(data.getMonth() + 1)}-${doisDigitos(data.getDate())}`;
}

/** Data e hora locais em `YYYY-MM-DDTHH:mm`. */
export function paraDataHoraISO(data: Date): string {
  return `${paraDataISO(data)}T${doisDigitos(data.getHours())}:${doisDigitos(data.getMinutes())}`;
}

/** Interpreta `YYYY-MM-DD` ou `YYYY-MM-DDTHH:mm` como horário local. */
export function lerData(iso: string): Date {
  const [data, hora = '00:00'] = iso.split('T');
  const [ano, mes, dia] = data.split('-').map(Number);
  const [h, m] = hora.split(':').map(Number);
  return new Date(ano, mes - 1, dia, h, m);
}

/** Desloca `hoje` em dias e define a hora, devolvendo ISO local. */
export function relativoAHoje(dias: number, hora?: string, base: Date = new Date()): string {
  const data = new Date(base.getFullYear(), base.getMonth(), base.getDate() + dias);
  if (!hora) return paraDataISO(data);
  const [h, m] = hora.split(':').map(Number);
  data.setHours(h, m);
  return paraDataHoraISO(data);
}

export function mesmoDia(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function idade(dataNascimento: string, referencia: Date = new Date()): number {
  const nasc = lerData(dataNascimento);
  let anos = referencia.getFullYear() - nasc.getFullYear();
  const aindaNaoFez =
    referencia.getMonth() < nasc.getMonth() ||
    (referencia.getMonth() === nasc.getMonth() && referencia.getDate() < nasc.getDate());
  if (aindaNaoFez) anos -= 1;
  return anos;
}

/** Ex.: "02/10/2026". */
export function formatarData(iso: string): string {
  const d = lerData(iso);
  return `${doisDigitos(d.getDate())}/${doisDigitos(d.getMonth() + 1)}/${d.getFullYear()}`;
}

/** Converte `DD/MM/AAAA` em `YYYY-MM-DD`; devolve `undefined` se a data não existir. */
export function dataBrParaISO(texto: string): string | undefined {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(texto.trim());
  if (!m) return undefined;
  const [, dia, mes, ano] = m.map(Number);
  const d = new Date(ano, mes - 1, dia);
  if (d.getFullYear() !== ano || d.getMonth() !== mes - 1 || d.getDate() !== dia) return undefined;
  return paraDataISO(d);
}

/** Ex.: "14:30". */
export function formatarHora(iso: string): string {
  const d = lerData(iso);
  return `${doisDigitos(d.getHours())}:${doisDigitos(d.getMinutes())}`;
}

/** Ex.: "sexta-feira, 2 de outubro". */
export function formatarDataExtenso(data: Date): string {
  return `${DIAS_SEMANA[data.getDay()]}, ${data.getDate()} de ${MESES[data.getMonth()]}`;
}

const DIAS_CURTOS = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];

export function adicionarDias(data: Date, dias: number): Date {
  return new Date(data.getFullYear(), data.getMonth(), data.getDate() + dias);
}

/** Segunda-feira da semana da data. */
export function inicioDaSemana(data: Date): Date {
  const deslocamento = (data.getDay() + 6) % 7;
  return adicionarDias(data, -deslocamento);
}

/** Ex.: "seg, 05/10". */
export function formatarDiaCurto(data: Date): string {
  return `${DIAS_CURTOS[data.getDay()]}, ${doisDigitos(data.getDate())}/${doisDigitos(data.getMonth() + 1)}`;
}

export function nomeDiaCurto(dia: number): string {
  return DIAS_CURTOS[dia];
}

/** Converte `HH:mm` em minutos desde 00:00; `undefined` se inválido. */
export function horaParaMinutos(hora: string): number | undefined {
  const m = /^(\d{2}):(\d{2})$/.exec(hora.trim());
  if (!m) return undefined;
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (h > 23 || min > 59) return undefined;
  return h * 60 + min;
}

export function minutosParaHora(minutos: number): string {
  return `${doisDigitos(Math.floor(minutos / 60))}:${doisDigitos(minutos % 60)}`;
}

/** Saudação conforme o horário. */
export function saudacao(data: Date = new Date()): string {
  const h = data.getHours();
  if (h < 12) return 'Bom dia';
  if (h < 18) return 'Boa tarde';
  return 'Boa noite';
}
