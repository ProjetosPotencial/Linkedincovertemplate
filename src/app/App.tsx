import { useState, useEffect } from "react";
import CoverEditorAvancado from "./components/CoverEditorAvancado";
import GeradorLote from "./components/GeradorLote";
import imgLogoGrupo from "../imports/logo_potencial_dark.png";
import imgLogoPotencialFooter from "../imports/Logo_-_Potencial_Tecnologia_Horizontal_Negativa__2-2.png";
import { LayoutDashboard, Layers } from "lucide-react";

type Modo = "editor" | "lote";

export default function App() {
  const [modo, setModo] = useState<Modo>("editor");

  useEffect(() => {
    document.title = "Gerador de Capas LinkedIn — Parcele Aqui | Potencial Tecnologia";
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#0b0b0b] flex flex-col font-['Poppins',sans-serif]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#111111]/95 backdrop-blur-md border-b border-gray-800/80">
        <div className="max-w-[1400px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <img src={imgLogoGrupo} alt="Grupo Potencial" className="h-9" />
              <div className="hidden sm:block h-8 w-px bg-gray-700" />
              <div className="hidden sm:block">
                <h1 className="text-base font-bold text-white font-['Archivo',sans-serif] leading-tight">
                  Gerador de Capas LinkedIn
                </h1>
                <p className="text-xs text-gray-500">Parcele Aqui · Parcele News</p>
              </div>
            </div>

            {/* Tabs de navegação */}
            <nav className="flex bg-[#1a1a1a] rounded-lg p-1 border border-gray-800">
              <TabButton
                active={modo === "editor"}
                onClick={() => setModo("editor")}
                icon={<LayoutDashboard size={16} />}
                label="Editor"
              />
              <TabButton
                active={modo === "lote"}
                onClick={() => setModo("lote")}
                icon={<Layers size={16} />}
                label="Lote"
              />
            </nav>
          </div>
        </div>
      </header>

      {/* Conteúdo */}
      <main className="flex-1">
        {modo === "editor" && <CoverEditorAvancado />}
        {modo === "lote" && <GeradorLote />}
      </main>

      {/* Footer */}
      <footer className="bg-[#111111] border-t border-gray-800/80">
        <div className="max-w-[1400px] mx-auto px-6 py-6 flex items-center justify-center gap-4 flex-wrap">
          <span className="text-gray-500 text-sm">Desenvolvido por</span>
          <img
            src={imgLogoPotencialFooter}
            alt="Potencial Tecnologia"
            className="h-20 opacity-95"
          />
          <span className="text-gray-500 text-xs font-mono">
            v{__APP_VERSION__} • {new Date().getFullYear()}
          </span>
        </div>
      </footer>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all ${
        active
          ? "bg-[#FFC528] text-black shadow-md"
          : "text-gray-400 hover:text-white hover:bg-[#242424]"
      }`}
      aria-pressed={active}
    >
      {icon}
      {label}
    </button>
  );
}
