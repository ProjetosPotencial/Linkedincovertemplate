import { useState, useEffect } from 'react';
import CoverEditorAvancado from './components/CoverEditorAvancado';
import GeradorLote from './components/GeradorLote';
import imgLogoGrupo from "../imports/logo_potencial_dark.png";
import imgLogoPotencialFooter from "../imports/Logo_-_Potencial_Tecnologia_Horizontal_Negativa__2-2.png";

type Modo = 'editor' | 'lote';

export default function App() {
  const [modo, setModo] = useState<Modo>('editor');

  useEffect(() => {
    document.title = 'Gerador de Capas LinkedIn - Parcele Aqui | Potencial Tecnologia';
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#0f0f0f] flex flex-col font-['Poppins',sans-serif]">
      {/* Header */}
      <div className="p-4 bg-[#1a1a1a] shadow-lg border-b border-gray-800">
        <div className="max-w-7xl mx-auto">
          {/* Logo Grupo Potencial, Título e Botões */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src={imgLogoGrupo} alt="Grupo Potencial" className="h-10" />
              <div className="h-8 w-px bg-gray-700"></div>
              <h1 className="text-xl font-bold text-white font-['Archivo',sans-serif]">Template Capa LinkedIn - Parcele Aqui</h1>
            </div>

            {/* Botões de Navegação alinhados à direita */}
            <div className="flex gap-2">
              <button
                onClick={() => setModo('editor')}
                className={`px-4 py-2 rounded-md transition-colors font-bold ${
                  modo === 'editor'
                    ? 'bg-[#FFC528] text-black shadow-lg'
                    : 'bg-[#2a2a2a] text-gray-300 hover:bg-[#353535]'
                }`}
              >
                Editor Individual
              </button>
              <button
                onClick={() => setModo('lote')}
                className={`px-4 py-2 rounded-md transition-colors font-bold ${
                  modo === 'lote'
                    ? 'bg-[#FFC528] text-black shadow-lg'
                    : 'bg-[#2a2a2a] text-gray-300 hover:bg-[#353535]'
                }`}
              >
                Gerador em Lote
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1">
        {modo === 'editor' && <CoverEditorAvancado />}
        {modo === 'lote' && <GeradorLote />}
      </div>

      {/* Footer */}
      <div className="p-4 bg-[#1a1a1a] border-t border-gray-800">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
          <span className="text-gray-400 text-sm">Desenvolvido por</span>
          <img
            src={imgLogoPotencialFooter}
            alt="Potencial Tecnologia"
            style={{ height: '96px' }}
          />
          <span className="text-gray-400 text-sm">• V1.0 • 2026</span>
        </div>
      </div>
    </div>
  );
}