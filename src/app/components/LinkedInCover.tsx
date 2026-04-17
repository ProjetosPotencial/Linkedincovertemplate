import svgPaths from "../../imports/svg-l2yh47psh";
import imgLogoParceleAqui1 from "figma:asset/f105090c0d8399c4c5ddf6f3b68c32fc5dfd387f.png";

interface LinkedInCoverProps {
  numero?: string;
  titulo?: string;
  legendaLinha1?: string;
  legendaLinha2?: string;
  fotoUrl?: string;
  IconeCustomizado?: React.ComponentType<any>;
  usarLegenda1?: boolean;
  usarSubtitulo?: boolean;
}

function IconePadrao() {
  return (
    <div className="absolute left-[72px] top-[282px] flex items-center justify-center" style={{ width: '80px', height: '80px' }}>
      <svg style={{ width: '48px', height: '48px' }} fill="none" viewBox="0 0 80 80">
        <g>
          <path d={svgPaths.p325f5470} fill="#371B01" />
        </g>
      </svg>
    </div>
  );
}

export default function LinkedInCover({
  numero = "49",
  titulo = "Mercado B2C: o uso estratégico e consciente do parcelamento",
  legendaLinha1 = "Tecnologia que destrava",
  legendaLinha2 = "o seu dia a dia financeiro.",
  fotoUrl = "figma:asset/94f0de88dd7da2aa7b58f6680bcc081b5b16c90f.png",
  IconeCustomizado,
  usarLegenda1 = true,
  usarSubtitulo = true
}: LinkedInCoverProps) {
  return (
    <div
      className="bg-white relative"
      style={{ width: '1200px', height: '675px' }}
    >
      {/* Shape amarelo */}
      <div
        className="absolute"
        style={{
          backgroundColor: '#ffcb31',
          height: '539px',
          left: '32px',
          right: '32px',
          top: '104px',
          borderBottomLeftRadius: '32px',
          borderBottomRightRadius: '32px',
          borderTopLeftRadius: '32px',
          borderTopRightRadius: '320px'
        }}
      />

      {/* Container da foto */}
      <div className="absolute" style={{ right: '32px', bottom: '32px' }}>
        <div
          className="relative overflow-hidden bg-gradient-to-br from-gray-300 to-gray-400"
          style={{
            height: '470px',
            width: '500px',
            borderBottomLeftRadius: '32px',
            borderBottomRightRadius: '32px',
            borderTopLeftRadius: '200px',
            borderTopRightRadius: '32px'
          }}
        >
          {/* Placeholder/Imagem */}
          {fotoUrl ? (
            <img
              alt=""
              className="absolute object-cover"
              src={fotoUrl}
              style={{
                width: '100%',
                height: '100%'
              }}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-24 h-24 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}

          {/* Gradiente sobre a foto */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to bottom, rgba(0,0,0,0) 32.867%, rgba(0,0,0,0.8) 95.333%)'
            }}
          />
        </div>
      </div>

      {/* Logo parcele aqui */}
      <div
        className="absolute overflow-hidden"
        style={{
          height: '33px',
          left: '32px',
          top: '39px',
          width: '192px'
        }}
      >
        <img
          alt=""
          className="absolute max-w-none"
          src={imgLogoParceleAqui1}
          style={{
            height: '280.41%',
            left: '-7.98%',
            top: '-94.89%',
            width: '115.96%'
          }}
        />
      </div>

      {/* Parcele News */}
      <p
        className="absolute font-['Kufam',sans-serif] text-right"
        style={{
          color: '#371b01',
          fontSize: '17px',
          fontWeight: 700,
          right: '32px',
          letterSpacing: '-0.02em',
          lineHeight: '1.2',
          top: '40px',
          marginBottom: '16px'
        }}
      >
        Parcele News
      </p>

      {/* Número */}
      <p
        className="absolute font-['Kufam',sans-serif] text-right"
        style={{
          color: '#371b01',
          fontSize: '50px',
          fontWeight: 700,
          right: '32px',
          letterSpacing: '-0.02em',
          lineHeight: '1',
          top: 'calc(40px + 17px * 1.2 + 16px)'
        }}
      >
        #{numero}
      </p>

      {/* Card do ícone */}
      <div
        className="absolute rounded-[12px]"
        style={{
          backgroundColor: '#ffe8a4',
          height: '80px',
          left: '72px',
          top: '282px',
          width: '80px'
        }}
      />

      {/* Ícone */}
      {IconeCustomizado ? <IconeCustomizado /> : <IconePadrao />}

      {/* Título */}
      <h1
        className="absolute font-['Kufam',sans-serif]"
        style={{
          color: '#1a1a1a',
          fontSize: '42px',
          fontWeight: 700,
          left: '72px',
          letterSpacing: '-0.02em',
          lineHeight: '1.15',
          top: '398px',
          width: '565px'
        }}
      >
        {titulo}
      </h1>

      {/* Legenda sobre a foto */}
      {(usarLegenda1 || usarSubtitulo) && (
        <div
          className="absolute font-['Kufam',sans-serif] text-white"
          style={{
            left: 'calc(1200px - 32px - 500px + 44px)',
            bottom: '44px',
            right: 'calc(32px + 44px)',
            textShadow: '0 2px 12px rgba(0,0,0,0.6)'
          }}
        >
          {usarLegenda1 && (
            <p
              style={{
                fontSize: '20px',
                fontWeight: 400,
                lineHeight: '1.3',
                margin: 0
              }}
            >
              {legendaLinha1}
            </p>
          )}
          {usarSubtitulo && (
            <p
              style={{
                fontSize: '20px',
                fontWeight: 700,
                lineHeight: '1.3',
                margin: 0
              }}
            >
              {legendaLinha2}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
