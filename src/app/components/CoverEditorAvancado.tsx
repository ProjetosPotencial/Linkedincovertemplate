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

export default function CoverEditorAvancado() {
  const [numero, setNumero] = useState("49");
  const [titulo, setTitulo] = useState("Mercado B2C: o uso estratégico e consciente do parcelamento");
  const [legendaLinha1, setLegendaLinha1] = useState("Tecnologia que destrava");
  const [legendaLinha2, setLegendaLinha2] = useState("o seu dia a dia financeiro.");
  const [fotoUrl, setFotoUrl] = useState("figma:asset/94f0de88dd7da2aa7b58f6680bcc081b5b16c90f.png");
  const [iconeEscolhido, setIconeEscolhido] = useState<string>("CreditCard");
  const [usarLegenda1, setUsarLegenda1] = useState(true);
  const [usarSubtitulo, setUsarSubtitulo] = useState(true);
  const capaRef = useRef<HTMLDivElement>(null);

  const IconeComponente = iconesDisponiveis[iconeEscolhido as keyof typeof iconesDisponiveis];

  const gerarImagem = async () => {
    if (!capaRef.current) {
      alert('Erro: Não foi possível encontrar a capa para gerar a imagem.');
      return;
    }

    try {
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
      link.download = `capa-linkedin-${numero}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err: any) {
      console.error('Erro detalhado ao gerar imagem:', err);
      console.error('Stack:', err?.stack);
      console.error('Message:', err?.message);
      console.error('Name:', err?.name);
      alert(`Erro ao gerar imagem: ${err?.message || JSON.stringify(err)}`);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#0f0f0f] p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Preview da Capa */}
        <div className="flex justify-center">
          <div ref={capaRef}>
            <LinkedInCover
              numero={numero}
              titulo={titulo}
              legendaLinha1={legendaLinha1}
              legendaLinha2={legendaLinha2}
              fotoUrl={fotoUrl}
              usarLegenda1={usarLegenda1}
              usarSubtitulo={usarSubtitulo}
              IconeCustomizado={() => <IconeCustomizado IconeComponente={IconeComponente} />}
            />
          </div>
        </div>

        <div className="bg-[#1a1a1a] rounded-lg shadow-xl p-6 space-y-4 border border-gray-800">
          <h2 className="text-xl font-semibold mb-4 text-white font-['Archivo',sans-serif]">Editor de Capa LinkedIn - Avançado</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Número da Edição
              </label>
              <input
                type="text"
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
                className="w-full px-3 py-2 bg-[#2a2a2a] border border-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="49"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Ícone
              </label>
              <select
                value={iconeEscolhido}
                onChange={(e) => setIconeEscolhido(e.target.value)}
                className="w-full px-3 py-2 bg-[#2a2a2a] border border-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.keys(iconesDisponiveis).map((nomeIcone) => (
                  <option key={nomeIcone} value={nomeIcone}>
                    {nomeIcone}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">
              Título Principal
            </label>
            <textarea
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 bg-[#2a2a2a] border border-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Mercado B2C: o uso estratégico e consciente do parcelamento"
            />
          </div>

          <div>
            <div className="flex items-center gap-3 mb-2">
              <input
                type="checkbox"
                id="usarLegenda1"
                checked={usarLegenda1}
                onChange={(e) => setUsarLegenda1(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="usarLegenda1" className="text-sm font-medium text-gray-300">
                Usar Legenda - Linha 1 (sobre a imagem)
              </label>
            </div>
            <input
              type="text"
              value={legendaLinha1}
              onChange={(e) => setLegendaLinha1(e.target.value)}
              disabled={!usarLegenda1}
              className="w-full px-3 py-2 bg-[#2a2a2a] border border-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-[#1a1a1a] disabled:cursor-not-allowed disabled:text-gray-600"
              placeholder="Tecnologia que destrava"
            />
          </div>

          <div>
            <div className="flex items-center gap-3 mb-2">
              <input
                type="checkbox"
                id="usarSubtitulo"
                checked={usarSubtitulo}
                onChange={(e) => setUsarSubtitulo(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="usarSubtitulo" className="text-sm font-medium text-gray-300">
                Usar Legenda - Linha 2 (negrito sobre a imagem)
              </label>
            </div>
            <input
              type="text"
              value={legendaLinha2}
              onChange={(e) => setLegendaLinha2(e.target.value)}
              disabled={!usarSubtitulo}
              className="w-full px-3 py-2 bg-[#2a2a2a] border border-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-[#1a1a1a] disabled:cursor-not-allowed disabled:text-gray-600"
              placeholder="o seu dia a dia financeiro."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">
              URL da Foto
            </label>
            <input
              type="text"
              value={fotoUrl}
              onChange={(e) => setFotoUrl(e.target.value)}
              className="w-full px-3 py-2 bg-[#2a2a2a] border border-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
              placeholder="URL da imagem"
            />
            <UnsplashSearch
              onSelectImage={(url) => setFotoUrl(url)}
              grupoIndex={0}
            />
            <p className="text-xs text-gray-500 mt-2">
              Use "figma:asset/..." para assets importados ou URLs externas
            </p>
          </div>

          <div className="pt-4 border-t border-gray-700">
            <h3 className="text-sm font-medium mb-2 text-gray-300">Preview do Ícone Selecionado</h3>
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#ffe8a4] rounded-lg">
              <IconeComponente size={40} strokeWidth={1.5} color="#371B01" />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-700">
            <button
              onClick={gerarImagem}
              className="px-4 py-2 bg-[#FFC528] text-black rounded-md hover:bg-[#FFD04F] transition-colors font-bold shadow-lg flex items-center gap-2 text-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Gerar Imagem
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
