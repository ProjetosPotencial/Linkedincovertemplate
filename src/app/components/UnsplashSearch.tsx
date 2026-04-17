import { useState } from 'react';

interface UnsplashSearchProps {
  onSelectImage: (url: string, index: number) => void;
  grupoIndex: number;
}

// Imagens pré-selecionadas do Unsplash para evitar problemas de CORS
const imagensSugeridas = {
  business: [
    'https://images.unsplash.com/photo-1556745757-8d76bdb6984b?w=1200&q=80',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80',
    'https://images.unsplash.com/photo-1664575602276-acd073f104c1?w=1200&q=80',
    'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1200&q=80'
  ],
  technology: [
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80',
    'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1200&q=80',
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&q=80',
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&q=80'
  ],
  people: [
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1200&q=80',
    'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=1200&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=80',
    'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=1200&q=80'
  ],
  office: [
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80',
    'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200&q=80',
    'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1200&q=80',
    'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1200&q=80'
  ],
  finance: [
    'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=1200&q=80',
    'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200&q=80',
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80',
    'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&q=80'
  ]
};

export default function UnsplashSearch({ onSelectImage, grupoIndex }: UnsplashSearchProps) {
  const [categoria, setCategoria] = useState<keyof typeof imagensSugeridas>('business');

  return (
    <div className="p-3 bg-[#2a2a2a] rounded-lg border border-gray-700">
      <h4 className="text-xs font-medium text-gray-400 mb-2">
        📸 Imagens Profissionais
      </h4>
      <select
        value={categoria}
        onChange={(e) => setCategoria(e.target.value as keyof typeof imagensSugeridas)}
        className="w-full px-2 py-1 bg-[#1a1a1a] border border-gray-600 text-white rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 mb-2"
      >
        <option value="business">Negócios</option>
        <option value="technology">Tecnologia</option>
        <option value="people">Pessoas</option>
        <option value="office">Escritório</option>
        <option value="finance">Finanças</option>
      </select>

      <div className="grid grid-cols-2 gap-2">
        {imagensSugeridas[categoria].map((url, idx) => (
          <div
            key={idx}
            className="relative group cursor-pointer"
            onClick={() => onSelectImage(url, grupoIndex)}
          >
            <img
              src={url}
              alt={`${categoria} ${idx + 1}`}
              className="w-full h-16 object-cover rounded border border-gray-600 hover:border-yellow-500 transition-all"
              crossOrigin="anonymous"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 transition-all rounded flex items-center justify-center">
              <span className="text-white text-xs opacity-0 group-hover:opacity-100 font-bold">
                ✓
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
