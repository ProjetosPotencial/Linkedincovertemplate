import { toPng } from "html-to-image";

/**
 * Pré-carrega uma imagem forçando CORS anônimo.
 * Se falhar, resolve mesmo assim (não trava a geração).
 */
function preloadImageWithCORS(src: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = src;
  });
}

/**
 * Pré-carrega todas as imagens de um container com CORS anônimo.
 */
async function preloadAllImages(container: HTMLElement): Promise<void> {
  const images = container.querySelectorAll("img");
  const urls = Array.from(images)
    .map((img) => img.src)
    .filter((src) => !!src);
  await Promise.all(urls.map(preloadImageWithCORS));
}

export interface GerarCapaOpcoes {
  nomeArquivo: string;
  onSuccess?: () => void;
  onError?: (err: Error) => void;
}

/**
 * Gera um PNG do elemento e dispara o download automático.
 * Retorna true em caso de sucesso, false em caso de erro.
 */
export async function gerarCapaPNG(
  elemento: HTMLElement,
  opcoes: GerarCapaOpcoes
): Promise<boolean> {
  try {
    // 1. Aguarda fontes carregarem
    await document.fonts.ready;

    // 2. Pré-carrega imagens com CORS
    await preloadAllImages(elemento);

    // 3. Aguarda frame de render
    await new Promise((resolve) => requestAnimationFrame(resolve));

    // 4. Gera o PNG
    const dataUrl = await toPng(elemento, {
      cacheBust: true,
      pixelRatio: 2,
      width: 1200,
      height: 675,
      backgroundColor: "#ffffff",
      skipFonts: false,
      fetchRequestInit: {
        cache: "no-cache",
        mode: "cors",
        credentials: "omit",
      },
      filter: (node: HTMLElement) => {
        // Pula iframes e imagens quebradas
        if (node.tagName === "IFRAME") return false;
        if (node.tagName === "IMG") {
          const img = node as HTMLImageElement;
          if (img.src && (!img.complete || img.naturalWidth === 0)) {
            console.warn("[gerarCapaPNG] Pulando imagem quebrada:", img.src);
            return false;
          }
        }
        return true;
      },
    });

    // 5. Dispara download
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = opcoes.nomeArquivo.endsWith(".png")
      ? opcoes.nomeArquivo
      : `${opcoes.nomeArquivo}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    opcoes.onSuccess?.();
    return true;
  } catch (err: any) {
    const error = err instanceof Error ? err : new Error(String(err?.message || err));
    console.error("[gerarCapaPNG] Erro:", error);
    opcoes.onError?.(error);
    return false;
  }
}
