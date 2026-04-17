import { useState, useRef } from 'react';
import LinkedInCover from './LinkedInCover';
import * as LucideIcons from 'lucide-react';
import { toPng } from 'html-to-image';
import UnsplashSearch from './UnsplashSearch';

const iconesDisponiveis = {
  CreditCard: LucideIcons.CreditCard,
  Wallet: LucideIcons.Wallet,
  TrendingUp: LucideIcons.TrendingUp,
  DollarSign: LucideIcons.DollarSign,
  Sparkles: LucideIcons.Sparkles,
  Target: LucideIcons.Target,
  BarChart3: LucideIcons.BarChart3,
  PieChart: LucideIcons.PieChart,
  ShoppingCart: LucideIcons.ShoppingCart,
  Store: LucideIcons.Store,
  Zap: LucideIcons.Zap,
  TrendingDown: LucideIcons.TrendingDown,
  LayoutDashboard: LucideIcons.LayoutDashboard,
  Megaphone: LucideIcons.Megaphone,
  Lightbulb: LucideIcons.Lightbulb,
  Rocket: LucideIcons.Rocket,
  Users: LucideIcons.Users,
  ShieldCheck: LucideIcons.ShieldCheck,
  Lock: LucideIcons.Lock,
  Unlock: LucideIcons.Unlock,
};

function IconeCustomizado({ IconeComponente }: { IconeComponente: any }) {
  return (
    <div className="absolute left-[72px] top-[282px] flex items-center justify-center" style={{ width: '80px', height: '80px' }}>
      <IconeComponente size={48} strokeWidth={1.5} color="#371B01" />
    </div>
  );
}

interface CapaConfig {
  numero: string;
  titulo: string;
  legendaLinha1: string;
  legendaLinha2: string;
  fotoUrl: string;
  icone: string;
  usarLegenda1: boolean;
  usarSubtitulo: boolean;
}

export default function GeradorLote() {
  const [numeroInicial, setNumeroInicial] = useState("1");
  const [titulos, setTitulos] = useState("");
  const [promptTexto, setPromptTexto] = useState("");
  const [legendaLinha1Padrao, setLegendaLinha1Padrao] = useState("Tecnologia que destrava");
  const [legendaLinha2Padrao, setLegendaLinha2Padrao] = useState("o seu dia a dia financeiro.");
  const [usarLegenda1, setUsarLegenda1] = useState(true);
  const [usarSubtitulo, setUsarSubtitulo] = useState(true);
  const [quantidadePorVez, setQuantidadePorVez] = useState(10);
  const capaRef = useRef<HTMLDivElement>(null);

  // Imagens (a cada 10 capas)
  const [imagens, setImagens] = useState([
    "figma:asset/94f0de88dd7da2aa7b58f6680bcc081b5b16c90f.png",
    "",
    "",
    "",
    "",
    ""
  ]);

  // Ícones (a cada 10 capas)
  const [icones, setIcones] = useState([
    "CreditCard",
    "Wallet",
    "TrendingUp",
    "DollarSign",
    "Sparkles",
    "Target"
  ]);

  const [capasGeradas, setCapasGeradas] = useState<CapaConfig[]>([]);
  const [visualizandoIndice, setVisualizandoIndice] = useState<number | null>(null);

  const gerarCapas = () => {
    const linhasTitulos = titulos.split('\n').filter(t => t.trim() !== '');
    const numeroInicialInt = parseInt(numeroInicial) || 1;

    const capas: CapaConfig[] = linhasTitulos.map((titulo, index) => {
      const grupoImagem = Math.floor(index / quantidadePorVez);
      const grupoIcone = Math.floor(index / quantidadePorVez);

      return {
        numero: (numeroInicialInt + index).toString(),
        titulo: titulo.trim(),
        legendaLinha1: legendaLinha1Padrao,
        legendaLinha2: legendaLinha2Padrao,
        fotoUrl: imagens[grupoImagem] || imagens[0],
        icone: icones[grupoIcone] || icones[0],
        usarLegenda1: usarLegenda1,
        usarSubtitulo: usarSubtitulo
      };
    });

    setCapasGeradas(capas);
    if (capas.length > 0) {
      setVisualizandoIndice(0);
    }
  };

  const limparCapas = () => {
    setCapasGeradas([]);
    setVisualizandoIndice(null);
  };

  const processarPrompt = () => {
    // Formato esperado: "Título do post | NomeDoIcone | URLImagem"
    const linhas = promptTexto.split('\n').filter(l => l.trim() !== '');

    const titulosExtraidos: string[] = [];
    const iconesExtraidos: string[] = [];
    const imagensExtraidas: string[] = [];

    linhas.forEach(linha => {
      const partes = linha.split('|').map(p => p.trim());
      if (partes.length >= 1) {
        titulosExtraidos.push(partes[0]);
        if (partes.length >= 2 && partes[1] in iconesDisponiveis) {
          iconesExtraidos.push(partes[1]);
        }
        if (partes.length >= 3 && partes[2]) {
          imagensExtraidas.push(partes[2]);
        }
      }
    });

    setTitulos(titulosExtraidos.join('\n'));

    // Preencher ícones a cada grupo
    const novosIcones = [...icones];
    iconesExtraidos.forEach((icone, idx) => {
      const grupo = Math.floor(idx / quantidadePorVez);
      if (grupo < 6) {
        novosIcones[grupo] = icone;
      }
    });
    setIcones(novosIcones);

    // Preencher imagens a cada grupo
    const novasImagens = [...imagens];
    imagensExtraidas.forEach((img, idx) => {
      const grupo = Math.floor(idx / quantidadePorVez);
      if (grupo < 6) {
        novasImagens[grupo] = img;
      }
    });
    setImagens(novasImagens);
  };

  const selecionarImagemUnsplash = (url: string, grupoIndex: number) => {
    const novasImagens = [...imagens];
    novasImagens[grupoIndex] = url;
    setImagens(novasImagens);
  };

  const gerarImagens = async () => {
    if (capasGeradas.length === 0) {
      alert('Gere as capas primeiro antes de baixar as imagens.');
      return;
    }

    if (!capaRef.current) {
      alert('Erro: Não foi possível encontrar a capa para gerar as imagens.');
      return;
    }

    let sucessos = 0;
    let erros = 0;

    for (let i = 0; i < capasGeradas.length; i++) {
      setVisualizandoIndice(i);

      // Aguardar renderização completa
      await new Promise(resolve => setTimeout(resolve, 800));

      try {
        if (capaRef.current) {
          // Aguardar todas as fontes carregarem
          await document.fonts.ready;

          // Validar que todas as imagens carregaram
          const container = capaRef.current;
          const images = container.querySelectorAll('img');
          await Promise.all(
            Array.from(images).map((img) => {
              if (img.complete) return Promise.resolve();
              return new Promise((resolve) => {
                img.onload = resolve;
                img.onerror = resolve; // resolve mesmo em erro pra não travar
              });
            })
          );

          const dataUrl = await toPng(capaRef.current, {
            cacheBust: true,
            pixelRatio: 2,
            width: 1200,
            height: 675,
            backgroundColor: '#ffffff',
            skipFonts: true,
            imagePlaceholder: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
            filter: (node) => {
              return node.tagName !== 'IFRAME';
            }
          });

          const link = document.createElement('a');
          link.href = dataUrl;
          link.download = `capa-linkedin-${capasGeradas[i].numero}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          sucessos++;

          // Delay entre downloads
          await new Promise(resolve => setTimeout(resolve, 400));
        }
      } catch (err: any) {
        console.error(`Erro detalhado ao gerar capa ${i + 1}:`, err);
        console.error('Stack:', err?.stack);
        console.error('Message:', err?.message);
        console.error('Name:', err?.name);
        erros++;
      }
    }

    if (erros > 0) {
      alert(`Geração concluída: ${sucessos} imagens geradas com sucesso, ${erros} com erro.`);
    } else {
      alert(`${sucessos} imagens geradas com sucesso!`);
    }
  };

  const capaAtual = visualizandoIndice !== null ? capasGeradas[visualizandoIndice] : null;
  const IconeComponente = capaAtual ? iconesDisponiveis[capaAtual.icone as keyof typeof iconesDisponiveis] : null;

  return (
    <div className="w-full min-h-screen bg-[#0f0f0f] p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Preview da Capa - Mostrar apenas se houver capas geradas */}
        {capasGeradas.length > 0 && capaAtual && IconeComponente && (
          <div className="flex justify-center">
            <div ref={capaRef}>
              <LinkedInCover
                numero={capaAtual.numero}
                titulo={capaAtual.titulo}
                legendaLinha1={capaAtual.legendaLinha1}
                legendaLinha2={capaAtual.legendaLinha2}
                fotoUrl={capaAtual.fotoUrl}
                usarLegenda1={capaAtual.usarLegenda1}
                usarSubtitulo={capaAtual.usarSubtitulo}
                IconeCustomizado={() => <IconeCustomizado IconeComponente={IconeComponente} />}
              />
            </div>
          </div>
        )}

        {/* Configuração */}
        <div className="bg-[#1a1a1a] rounded-lg shadow-xl p-6 space-y-6 border border-gray-800">
          <h2 className="text-2xl font-semibold text-white font-['Archivo',sans-serif]">Gerador de Capas em Lote</h2>

          <div className="grid grid-cols-2 gap-6">
            {/* Coluna Esquerda */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Número Inicial
                </label>
                <input
                  type="number"
                  value={numeroInicial}
                  onChange={(e) => setNumeroInicial(e.target.value)}
                  className="w-full px-3 py-2 bg-[#2a2a2a] border border-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Importar Prompt (Título | Ícone | URLImagem)
                </label>
                <textarea
                  value={promptTexto}
                  onChange={(e) => setPromptTexto(e.target.value)}
                  rows={5}
                  className="w-full px-3 py-2 bg-[#2a2a2a] border border-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                  placeholder="Mercado B2C | CreditCard | https://...&#10;Como otimizar fluxo | Wallet | figma:asset/...&#10;Tendências em pagamentos | TrendingUp"
                />
                <button
                  onClick={processarPrompt}
                  className="mt-2 px-4 py-2 bg-[#FFC528] text-black rounded-md hover:bg-[#FFD04F] transition-colors text-sm font-bold"
                >
                  Processar e Preencher Campos
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Títulos (um por linha)
                </label>
                <textarea
                  value={titulos}
                  onChange={(e) => setTitulos(e.target.value)}
                  rows={8}
                  className="w-full px-3 py-2 bg-[#2a2a2a] border border-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                  placeholder="Mercado B2C: estratégias de parcelamento&#10;Como otimizar seu fluxo de caixa&#10;Novas tendências em pagamentos..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  {titulos.split('\n').filter(t => t.trim() !== '').length} títulos detectados
                </p>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-2">
                  <input
                    type="checkbox"
                    id="usarLegenda1Lote"
                    checked={usarLegenda1}
                    onChange={(e) => setUsarLegenda1(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="usarLegenda1Lote" className="text-sm font-medium text-gray-300">
                    Usar Legenda Linha 1 (padrão para todas)
                  </label>
                </div>
                <input
                  type="text"
                  value={legendaLinha1Padrao}
                  onChange={(e) => setLegendaLinha1Padrao(e.target.value)}
                  disabled={!usarLegenda1}
                  className="w-full px-3 py-2 bg-[#2a2a2a] border border-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-[#1a1a1a] disabled:cursor-not-allowed disabled:text-gray-600"
                />
              </div>

              <div>
                <div className="flex items-center gap-3 mb-2">
                  <input
                    type="checkbox"
                    id="usarSubtituloLote"
                    checked={usarSubtitulo}
                    onChange={(e) => setUsarSubtitulo(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="usarSubtituloLote" className="text-sm font-medium text-gray-300">
                    Usar Legenda Linha 2 (padrão para todas)
                  </label>
                </div>
                <input
                  type="text"
                  value={legendaLinha2Padrao}
                  onChange={(e) => setLegendaLinha2Padrao(e.target.value)}
                  disabled={!usarSubtitulo}
                  className="w-full px-3 py-2 bg-[#2a2a2a] border border-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-[#1a1a1a] disabled:cursor-not-allowed disabled:text-gray-600"
                />
              </div>
            </div>

            {/* Coluna Direita */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Capas por Grupo de Imagem/Ícone
                </label>
                <select
                  value={quantidadePorVez}
                  onChange={(e) => setQuantidadePorVez(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#2a2a2a] border border-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={10}>10 capas por grupo</option>
                  <option value={20}>20 capas por grupo</option>
                  <option value={30}>30 capas por grupo</option>
                  <option value={40}>40 capas por grupo</option>
                  <option value={50}>50 capas por grupo</option>
                  <option value={60}>60 capas por grupo</option>
                </select>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-3 text-gray-300">Imagens (a cada {quantidadePorVez} capas)</h3>
                <div className="space-y-3">
                  {imagens.map((img, idx) => (
                    <div key={idx} className="space-y-2">
                      <label className="block text-xs text-gray-500">
                        Capas {idx * quantidadePorVez + 1} - {(idx + 1) * quantidadePorVez}
                      </label>
                      <input
                        type="text"
                        value={img}
                        onChange={(e) => {
                          const novasImagens = [...imagens];
                          novasImagens[idx] = e.target.value;
                          setImagens(novasImagens);
                        }}
                        className="w-full px-3 py-2 bg-[#2a2a2a] border border-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        placeholder="URL da imagem"
                      />
                      <UnsplashSearch
                        onSelectImage={selecionarImagemUnsplash}
                        grupoIndex={idx}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-3 text-gray-300">Ícones (a cada {quantidadePorVez} capas)</h3>
                <div className="space-y-2">
                  {icones.map((icone, idx) => (
                    <div key={idx}>
                      <label className="block text-xs text-gray-500 mb-1">
                        Capas {idx * quantidadePorVez + 1} - {(idx + 1) * quantidadePorVez}
                      </label>
                      <select
                        value={icone}
                        onChange={(e) => {
                          const novosIcones = [...icones];
                          novosIcones[idx] = e.target.value;
                          setIcones(novosIcones);
                        }}
                        className="w-full px-3 py-2 bg-[#2a2a2a] border border-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      >
                        {Object.keys(iconesDisponiveis).map((nomeIcone) => (
                          <option key={nomeIcone} value={nomeIcone}>
                            {nomeIcone}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t border-gray-700">
            <button
              onClick={gerarCapas}
              className="px-6 py-3 bg-[#FFC528] text-black rounded-md hover:bg-[#FFD04F] transition-colors font-bold shadow-lg"
            >
              Gerar {titulos.split('\n').filter(t => t.trim() !== '').length} Capas
            </button>
            {capasGeradas.length > 0 && (
              <>
                <button
                  onClick={gerarImagens}
                  className="px-4 py-2 bg-[#FFC528] text-black rounded-md hover:bg-[#FFD04F] transition-colors font-bold shadow-lg flex items-center gap-2 text-sm"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Gerar Imagens ({capasGeradas.length})
                </button>
                <button
                  onClick={limparCapas}
                  className="px-6 py-3 bg-[#2a2a2a] text-white rounded-md hover:bg-[#353535] transition-colors font-bold"
                >
                  Limpar
                </button>
              </>
            )}
          </div>
        </div>

        {/* Navegação e Grid de Capas */}
        {capasGeradas.length > 0 && capaAtual && IconeComponente && (
          <div className="bg-[#1a1a1a] rounded-lg shadow-xl p-6 space-y-4 border border-gray-800">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-white font-['Archivo',sans-serif]">
                Navegação: Capa {visualizandoIndice! + 1} de {capasGeradas.length}
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setVisualizandoIndice(Math.max(0, visualizandoIndice! - 1))}
                  disabled={visualizandoIndice === 0}
                  className="px-4 py-2 bg-[#2a2a2a] text-white rounded-md hover:bg-[#353535] disabled:opacity-50 disabled:cursor-not-allowed font-bold"
                >
                  ← Anterior
                </button>
                <button
                  onClick={() => setVisualizandoIndice(Math.min(capasGeradas.length - 1, visualizandoIndice! + 1))}
                  disabled={visualizandoIndice === capasGeradas.length - 1}
                  className="px-4 py-2 bg-[#2a2a2a] text-white rounded-md hover:bg-[#353535] disabled:opacity-50 disabled:cursor-not-allowed font-bold"
                >
                  Próxima →
                </button>
              </div>
            </div>

            {/* Grid de miniaturas */}
            <div className="pt-4 border-t border-gray-700">
              <h4 className="text-sm font-medium mb-3 text-gray-300">Todas as Capas ({capasGeradas.length})</h4>
              <div className="grid grid-cols-6 gap-2 max-h-[400px] overflow-y-auto">
                {capasGeradas.map((capa, idx) => (
                  <button
                    key={idx}
                    onClick={() => setVisualizandoIndice(idx)}
                    className={`p-2 border-2 rounded-md transition-all ${
                      visualizandoIndice === idx
                        ? 'border-blue-500 bg-blue-950'
                        : 'border-gray-700 hover:border-gray-500 bg-[#2a2a2a]'
                    }`}
                  >
                    <div className="text-xs font-medium mb-1 text-white">#{capa.numero}</div>
                    <div className="text-xs text-gray-400 truncate">{capa.titulo}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
