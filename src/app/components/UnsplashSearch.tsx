import { useState } from "react";
import { Check, ImageIcon } from "lucide-react";

interface UnsplashSearchProps {
  onSelectImage: (url: string, index: number) => void;
  grupoIndex: number;
}

const imagensSugeridas = {
  business: [
    "https://images.unsplash.com/photo-1556745757-8d76bdb6984b?w=1200&q=80",
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80",
    "https://images.unsplash.com/photo-1664575602276-acd073f104c1?w=1200&q=80",
    "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1200&q=80",
  ],
  technology: [
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80",
    "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1200&q=80",
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&q=80",
    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&q=80",
  ],
  people: [
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1200&q=80",
    "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=1200&q=80",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=80",
    "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=1200&q=80",
  ],
  office: [
    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80",
    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200&q=80",
    "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1200&q=80",
    "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1200&q=80",
  ],
  finance: [
    "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=1200&q=80",
    "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200&q=80",
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80",
    "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&q=80",
  ],
};

const labels: Record<keyof typeof imagensSugeridas, string> = {
  business: "Negócios",
  technology: "Tecnologia",
  people: "Pessoas",
  office: "Escritório",
  finance: "Finanças",
};

export default function UnsplashSearch({ onSelectImage, grupoIndex }: UnsplashSearchProps) {
  const [categoria, setCategoria] = useState<keyof typeof imagensSugeridas>("business");
  const [selecionada, setSelecionada] = useState<string | null>(null);

  const selecionar = (url: string) => {
    setSelecionada(url);
    onSelectImage(url, grupoIndex);
  };

  return (
    <div className="bg-[#0f0f0f] rounded-lg border border-gray-800 p-4 space-y-3">
      <div className="flex items-center gap-2">
        <ImageIcon size={14} className="text-gray-400" />
        <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
          Banco de imagens
        </h4>
      </div>

      {/* Chips de categoria */}
      <div className="flex flex-wrap gap-1.5">
        {(Object.keys(imagensSugeridas) as Array<keyof typeof imagensSugeridas>).map((key) => (
          <button
            key={key}
            onClick={() => setCategoria(key)}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
              categoria === key
                ? "bg-[#FFC528] text-black"
                : "bg-[#1f1f1f] text-gray-400 hover:bg-[#2a2a2a] hover:text-white"
            }`}
          >
            {labels[key]}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-4 gap-2">
        {imagensSugeridas[categoria].map((url, idx) => (
          <button
            key={idx}
            className="relative group aspect-[4/3] rounded-md overflow-hidden border-2 border-transparent hover:border-[#FFC528] transition-all focus:outline-none focus:border-[#FFC528]"
            onClick={() => selecionar(url)}
            aria-label={`Selecionar imagem ${idx + 1} de ${labels[categoria]}`}
          >
            <img
              src={url}
              alt=""
              className="w-full h-full object-cover"
              crossOrigin="anonymous"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all" />
            {selecionada === url && (
              <div className="absolute inset-0 bg-[#FFC528]/30 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-[#FFC528] flex items-center justify-center">
                  <Check size={18} className="text-black" strokeWidth={3} />
                </div>
              </div>
            )}
          </button>
        ))}
      </div>

      <p className="text-[10px] text-gray-600">
        Imagens do Unsplash · uso gratuito comercial
      </p>
    </div>
  );
}
