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

/** Ex.: "14:30". */
export function formatarHora(iso: string): string {
  const d = lerData(iso);
  return `${doisDigitos(d.getHours())}:${doisDigitos(d.getMinutes())}`;
}

/** Ex.: "sexta-feira, 2 de outubro". */
export function formatarDataExtenso(data: Date): string {
  return `${DIAS_SEMANA[data.getDay()]}, ${data.getDate()} de ${MESES[data.getMonth()]}`;
}

/** Saudação conforme o horário. */
export function saudacao(data: Date = new Date()): string {
  const h = data.getHours();
  if (h < 12) return 'Bom dia';
  if (h < 18) return 'Boa tarde';
  return 'Boa noite';
}
