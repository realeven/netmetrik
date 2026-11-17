import React from 'react';

interface YksCountdownCardProps {
  countdown: {
    days: number;
    hours: number;
    mins: number;
    secs: number;
  };
  progressPercent?: number;
  quote?: string;
}

export const YksCountdownCard: React.FC<YksCountdownCardProps> = ({
  countdown,
  progressPercent = 64,
  quote = 'Her gün çözdüğün fazladan 1 soru, sınav günü binlerce rakibinin önüne geçmeni sağlar.'
}) => {
  const timeUnits = [
    { val: countdown.days, label: 'GÜN' },
    { val: String(countdown.hours).padStart(2, '0'), label: 'SAAT' },
    { val: String(countdown.mins).padStart(2, '0'), label: 'DAKİKA' },
    { val: String(countdown.secs).padStart(2, '0'), label: 'SANİYE' }
  ];

  return (
    <div
      className="yks-lux-countdown-card"
      style={{
        position: 'relative',
        borderRadius: 26,
        overflow: 'hidden',
        padding: '24px 24px 22px 24px',
        background: '#090A0D',
        border: '2px solid rgba(255, 255, 255, 0.22)',
        borderTopColor: 'rgba(255, 255, 255, 0.45)',
        boxShadow: '0 30px 80px rgba(0, 0, 0, 0.95), inset 0 1.5px 2px rgba(255, 255, 255, 0.3)',
        userSelect: 'none'
      }}
    >
      {/* 🌟 1. Ambient White Spotlight Aura (Glowing behind top-right pill badge) */}
      <div
        style={{
          position: 'absolute',
          top: -30,
          right: 5,
          width: 250,
          height: 170,
          background: 'radial-gradient(ellipse 65% 55% at 55% 45%, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0.16) 30%, rgba(255, 255, 255, 0.02) 65%, transparent 80%)',
          pointerEvents: 'none',
          filter: 'blur(10px)',
          zIndex: 0
        }}
      />

      {/* 🌟 2. Low-Poly Wireframe Geometric Mesh (Exact triangle network from reference photo) */}
      <svg
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          overflow: 'hidden',
          opacity: 0.35,
          zIndex: 0
        }}
        viewBox="0 0 850 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <polygon
          points="540,0 640,65 740,20 850,80 850,0"
          stroke="rgba(255, 255, 255, 0.24)"
          strokeWidth="1"
          fill="rgba(255, 255, 255, 0.025)"
        />
        <polygon
          points="640,65 710,165 820,130 850,220 850,80 740,20"
          stroke="rgba(255, 255, 255, 0.22)"
          strokeWidth="1"
          fill="rgba(255, 255, 255, 0.015)"
        />
        <polygon
          points="710,165 590,205 680,310 800,260 820,130"
          stroke="rgba(255, 255, 255, 0.20)"
          strokeWidth="1"
          fill="rgba(255, 255, 255, 0.01)"
        />
        <polygon
          points="800,260 740,400 850,400 850,220"
          stroke="rgba(255, 255, 255, 0.24)"
          strokeWidth="1"
          fill="none"
        />
        <polygon
          points="470,40 570,0 540,0"
          stroke="rgba(255, 255, 255, 0.18)"
          strokeWidth="1"
          fill="none"
        />
        <line x1="470" y1="40" x2="570" y2="105" stroke="rgba(255, 255, 255, 0.18)" strokeWidth="1" />
        <line x1="570" y1="105" x2="640" y2="65" stroke="rgba(255, 255, 255, 0.20)" strokeWidth="1" />
        <line x1="570" y1="105" x2="710" y2="165" stroke="rgba(255, 255, 255, 0.18)" strokeWidth="1" />
        <line x1="680" y1="310" x2="740" y2="400" stroke="rgba(255, 255, 255, 0.20)" strokeWidth="1" />

        <circle cx="640" cy="65" r="2.8" fill="rgba(255, 255, 255, 0.85)" />
        <circle cx="740" cy="20" r="2.5" fill="rgba(255, 255, 255, 0.75)" />
        <circle cx="710" cy="165" r="2.8" fill="rgba(255, 255, 255, 0.85)" />
        <circle cx="820" cy="130" r="2.5" fill="rgba(255, 255, 255, 0.7)" />
        <circle cx="680" cy="310" r="2.5" fill="rgba(255, 255, 255, 0.65)" />
        <circle cx="800" cy="260" r="2.8" fill="rgba(255, 255, 255, 0.75)" />
      </svg>

      {/* 🌟 3. Top Header Row */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'relative',
          zIndex: 1
        }}
      >
        {/* Left: 3D Glossy ÖSYM Badge + Titles */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {/* 3D Liquid Chrome Squircle ÖSYM Badge */}
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 16,
              background: 'linear-gradient(145deg, #505462 0%, #242732 38%, #0C0D12 100%)',
              border: '2px solid rgba(255, 255, 255, 0.65)',
              borderTopColor: '#FFFFFF',
              boxShadow: '0 10px 24px rgba(0, 0, 0, 0.8), inset 0 2.5px 2px rgba(255, 255, 255, 0.95), inset 0 -2.5px 4px rgba(0, 0, 0, 0.95)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Top curved specular sheen */}
            <div
              style={{
                position: 'absolute',
                top: 1,
                left: 1,
                right: 1,
                height: '48%',
                background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.55) 0%, rgba(255, 255, 255, 0.12) 65%, transparent 100%)',
                borderRadius: '14px 14px 0 0',
                pointerEvents: 'none'
              }}
            />
            {/* ÖSYM text on top */}
            <span
              style={{
                fontSize: 9,
                fontWeight: 900,
                color: '#FFFFFF',
                letterSpacing: '0.6px',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                position: 'relative',
                zIndex: 2,
                marginTop: -1,
                textShadow: '0 1px 2px rgba(0,0,0,0.9)'
              }}
            >
              ÖSYM
            </span>
            {/* Circular Crescent Logo below */}
            <svg width="28" height="28" viewBox="0 0 100 100" fill="none" style={{ position: 'relative', zIndex: 1, marginTop: 1 }}>
              <defs>
                <linearGradient id="osym-pure-chrome" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="45%" stopColor="#E2E5F0" />
                  <stop offset="100%" stopColor="#8A8E9E" />
                </linearGradient>
              </defs>
              <path
                d="M48 14C29.2 14 14 29.2 14 48s15.2 34 34 34c12.5 0 23.4-6.7 29.2-16.6-2.8 1.3-6 2-9.4 2-13 0-23.6-10.6-23.6-23.6 0-8.1 4-15.2 10.2-19.4C59.7 17.1 54.1 14 48 14z"
                fill="url(#osym-pure-chrome)"
              />
              <circle cx="63" cy="39" r="12" fill="url(#osym-pure-chrome)" opacity="0.95" />
            </svg>
          </div>

          <div>
            <div
              style={{
                fontSize: 'clamp(18px, 2.3vw, 22px)',
                fontWeight: 800,
                color: '#FFFFFF',
                letterSpacing: '-0.3px',
                lineHeight: 1.2
              }}
            >
              YKS 2027 Geri Sayım
            </div>
            <div
              style={{
                fontSize: 'clamp(12px, 1.6vw, 13.5px)',
                color: '#8E92A0',
                marginTop: 4,
                fontWeight: 500,
                letterSpacing: '-0.1px'
              }}
            >
              TYT (20 Haziran 2027) & AYT (21 Haziran 2027)
            </div>
          </div>
        </div>

        {/* Right: Glossy Liquid Glass Capsule Pill ("216 Gün Kaldı") */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '8px 24px',
            borderRadius: 999,
            background: 'linear-gradient(180deg, #444755 0%, #222530 32%, #0E0F14 100%)',
            border: '2px solid rgba(255, 255, 255, 0.65)',
            borderTopColor: '#FFFFFF',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.8), inset 0 2.5px 2px rgba(255, 255, 255, 0.95), inset 0 -2px 3px rgba(0, 0, 0, 0.9)',
            overflow: 'hidden',
            flexShrink: 0
          }}
        >
          {/* Top specular highlight curve */}
          <div
            style={{
              position: 'absolute',
              top: 1,
              left: '8%',
              right: '8%',
              height: '46%',
              background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.60) 0%, rgba(255, 255, 255, 0.15) 60%, transparent 100%)',
              borderRadius: 999,
              pointerEvents: 'none'
            }}
          />
          <span
            style={{
              fontSize: 15,
              fontWeight: 900,
              color: '#FFFFFF',
              lineHeight: 1.15,
              position: 'relative',
              zIndex: 1,
              letterSpacing: '-0.2px'
            }}
          >
            {countdown.days} Gün
          </span>
          <span
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: '#A5A9B8',
              lineHeight: 1.15,
              position: 'relative',
              zIndex: 1
            }}
          >
            Kaldı
          </span>
        </div>
      </div>

      {/* 🌟 4. Middle: 4 Glossy Skeuomorphic Countdown Blocks (Exact Liquid Glass Parlaklığı) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 'clamp(8px, 1.8vw, 14px)',
          margin: '22px 0 20px 0',
          position: 'relative',
          zIndex: 1
        }}
      >
        {timeUnits.map((item, idx) => (
          <div
            key={idx}
            style={{
              position: 'relative',
              background: 'linear-gradient(180deg, #414552 0%, #262833 26%, #121319 62%, #08090C 100%)',
              borderRadius: 22,
              padding: 'clamp(18px, 3vw, 26px) 6px clamp(16px, 2.4vw, 22px) 6px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid rgba(255, 255, 255, 0.55)',
              borderTop: '2.5px solid rgba(255, 255, 255, 0.85)',
              borderBottom: '2px solid rgba(255, 255, 255, 0.25)',
              boxShadow: '0 14px 28px rgba(0, 0, 0, 0.95), 0 6px 12px rgba(0, 0, 0, 0.8), inset 0 2px 2px rgba(255, 255, 255, 0.95), inset 0 1px 0 rgba(255, 255, 255, 1), inset 0 -3px 4px rgba(0, 0, 0, 0.95), inset 0 0 20px rgba(0, 0, 0, 0.7)',
              overflow: 'hidden'
            }}
          >
            {/* Top Razor-Sharp 1px Specular Light Line */}
            <div
              style={{
                position: 'absolute',
                top: 2,
                left: '10%',
                right: '10%',
                height: 2,
                background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 1) 50%, transparent 100%)',
                borderRadius: 999,
                pointerEvents: 'none',
                zIndex: 4,
                filter: 'drop-shadow(0 0 2px rgba(255, 255, 255, 0.8))'
              }}
            />

            {/* Glossy Top Specular Sheen (Curved convex liquid glass reflection) */}
            <div
              style={{
                position: 'absolute',
                top: 2,
                left: 2,
                right: 2,
                height: '46%',
                background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.50) 0%, rgba(255, 255, 255, 0.18) 45%, rgba(255, 255, 255, 0.02) 85%, transparent 100%)',
                borderRadius: '18px 18px 50% 50% / 18px 18px 25% 25%',
                pointerEvents: 'none',
                zIndex: 2
              }}
            />

            {/* Number Display - Extra Bold, Rounded, Crisp White */}
            <div
              className="tabular-nums"
              style={{
                position: 'relative',
                zIndex: 3,
                fontSize: 'clamp(30px, 4.8vw, 46px)',
                fontWeight: 900,
                color: '#FFFFFF',
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "SF Pro Rounded", "Nunito", sans-serif',
                lineHeight: 1,
                letterSpacing: '-0.5px',
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.9), 0 0 4px rgba(255, 255, 255, 0.4)'
              }}
            >
              {item.val}
            </div>

            {/* Unit Label (GÜN, SAAT, DAKİKA, SANİYE) */}
            <div
              style={{
                position: 'relative',
                zIndex: 3,
                fontSize: 'clamp(11px, 1.4vw, 13px)',
                color: '#A3A7B6',
                fontWeight: 800,
                marginTop: 10,
                letterSpacing: '1.2px',
                textTransform: 'uppercase'
              }}
            >
              {item.label}
            </div>
          </div>
        ))}
      </div>

      {/* 🌟 5. Progress Bar Section */}
      <div style={{ marginTop: 10, position: 'relative', zIndex: 1 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 14,
            color: '#9EA2B0',
            marginBottom: 10,
            fontWeight: 500
          }}
        >
          <span>Yıllık Hazırlık İlerlemesi</span>
          <span style={{ color: '#FFFFFF', fontWeight: 800, fontSize: 15 }}>%{progressPercent}</span>
        </div>
        <div
          style={{
            height: 9,
            background: 'rgba(0, 0, 0, 0.85)',
            border: '1.5px solid rgba(255, 255, 255, 0.45)',
            borderRadius: 999,
            boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.95), 0 0 10px rgba(0, 0, 0, 0.6)',
            overflow: 'hidden',
            padding: '1px'
          }}
        >
          <div
            style={{
              width: `${Math.min(100, Math.max(0, progressPercent))}%`,
              height: '100%',
              background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.35) 0%, #D4D8E8 60%, #FFFFFF 100%)',
              borderRadius: 999,
              boxShadow: '0 0 16px 2px rgba(255, 255, 255, 0.95), 0 0 6px #FFFFFF, inset 0 1px 0 #FFFFFF'
            }}
          />
        </div>
      </div>

      {/* 🌟 6. Bottom Motivational Quote Strip */}
      <div
        style={{
          marginTop: 20,
          padding: '14px 20px',
          borderRadius: 16,
          background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.07) 0%, rgba(18, 20, 26, 0.65) 100%)',
          border: '1.5px solid rgba(255, 255, 255, 0.18)',
          boxShadow: 'inset 0 1.5px 1.5px rgba(255, 255, 255, 0.16), 0 8px 20px rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          position: 'relative',
          zIndex: 1
        }}
      >
        <span
          style={{
            fontSize: 20,
            lineHeight: 1,
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.6))',
            flexShrink: 0,
            display: 'inline-block'
          }}
        >
          ✏️
        </span>
        <span
          style={{
            fontSize: 'clamp(12.5px, 1.5vw, 14px)',
            fontStyle: 'italic',
            color: '#B8BCD0',
            lineHeight: 1.45,
            fontWeight: 400
          }}
        >
          "{quote}"
        </span>
      </div>
    </div>
  );
};
