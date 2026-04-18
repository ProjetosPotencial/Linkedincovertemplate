import { toPng } from "html-to-image";

/**
 * Dimensões do design base (tamanho real renderizado do componente).
 */
const BASE_WIDTH = 1200;
const BASE_HEIGHT = 675;

/**
 * Dimensão final padrão para LinkedIn (16:9 otimizado).
 */
export const TAMANHO_LINKEDIN = { width: 1280, height: 720 } as const;

/**
 * Pré-carrega uma imagem forçando CORS anônimo.
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

async function preloadAllImages(container: HTMLElement): Promise<void> {
  const images = container.querySelectorAll("img");
  const urls = Array.from(images)
    .map((img) => img.src)
    .filter((src) => !!src);
  await Promise.all(urls.map(preloadImageWithCORS));
}

export interface TamanhoSaida {
  width: number;
  height: number;
}

export interface GerarOpcoes {
  /** Tamanho final da imagem (padrão 1280x720 — ideal LinkedIn) */
  tamanho?: TamanhoSaida;
}

export interface GerarDownloadOpcoes extends GerarOpcoes {
  nomeArquivo: string;
  onSuccess?: () => void;
  onError?: (err: Error) => void;
}

/**
 * Gera o dataURL PNG do elemento nas dimensões finais desejadas.
 *
 * Estratégia: renderizamos o elemento no tamanho base (1200×675) e escalamos
 * proporcionalmente via pixelRatio para atingir o tamanho de saída (1280×720).
 *
 * Para LinkedIn (1280×720), o ratio é 1280/1200 = 1.0667, que escala
 * proporcionalmente ambas as dimensões (1200→1280 e 675→720).
 *
 * NÃO usamos canvasWidth/canvasHeight separados — isso criaria um canvas
 * maior que o elemento, gerando espaço em branco nas bordas.
 */
async function gerarDataURL(
  elemento: HTMLElement,
  tamanho: TamanhoSaida = TAMANHO_LINKEDIN
): Promise<string> {
  // 1. Fontes
  await document.fonts.ready;

  // 2. Pré-carrega imagens
  await preloadAllImages(elemento);

  // 3. Espera frame
  await new Promise((resolve) => requestAnimationFrame(resolve));

  // 4. pixelRatio escala ambas as dimensões proporcionalmente
  //    1200 × 1.0667 = 1280  |  675 × 1.0667 = 720 ✓
  const pixelRatio = tamanho.width / BASE_WIDTH;

  // 5. Gera o PNG no tamanho final
  const dataUrl = await toPng(elemento, {
    cacheBust: true,
    pixelRatio,
    width: BASE_WIDTH,
    height: BASE_HEIGHT,
    backgroundColor: "#ffffff",
    skipFonts: false,
    fetchRequestInit: {
      cache: "no-cache",
      mode: "cors",
      credentials: "omit",
    },
    filter: (node: HTMLElement) => {
      if (node.tagName === "IFRAME") return false;
      if (node.tagName === "IMG") {
        const img = node as HTMLImageElement;
        if (img.src && (!img.complete || img.naturalWidth === 0)) {
          console.warn("[gerarCapa] Pulando imagem quebrada:", img.src);
          return false;
        }
      }
      return true;
    },
  });

  return dataUrl;
}

/**
 * Converte um data URL (base64) em Blob.
 */
function dataUrlToBlob(dataUrl: string): Blob {
  const [header, base64] = dataUrl.split(",");
  const mimeMatch = header.match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : "image/png";
  const binary = atob(base64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new Blob([bytes], { type: mime });
}

/**
 * Gera uma PNG e retorna o Blob (sem disparar download).
 * Útil para agrupar múltiplas imagens num ZIP.
 */
export async function gerarCapaBlob(
  elemento: HTMLElement,
  opcoes: GerarOpcoes = {}
): Promise<Blob> {
  const dataUrl = await gerarDataURL(elemento, opcoes.tamanho);
  return dataUrlToBlob(dataUrl);
}

/**
 * Gera um PNG do elemento e dispara o download automático.
 * Mantido para compat. com o editor individual.
 */
export async function gerarCapaPNG(
  elemento: HTMLElement,
  opcoes: GerarDownloadOpcoes
): Promise<boolean> {
  try {
    const dataUrl = await gerarDataURL(elemento, opcoes.tamanho);

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
