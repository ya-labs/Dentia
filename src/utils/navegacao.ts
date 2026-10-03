import { Href, router } from 'expo-router';

/** Volta para a tela anterior; sem histórico (ex.: link direto), abre a rota de apoio. */
export function voltarOu(rota: Href): void {
  if (router.canGoBack()) router.back();
  else router.replace(rota);
}
