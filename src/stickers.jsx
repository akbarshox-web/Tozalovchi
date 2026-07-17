/**
 * Sticker components — custom SVG illustrations that replace emojis.
 * Each sticker is fully stylised, animated through Tailwind/CSS, and scales
 * cleanly at any size. Defined inline as React components so they accept
 * className / size props.
 *
 * Naming convention: St<Subject>   (St = "sticker")
 */
import React from "react";

const baseProps = (size, className) => ({
  width: size,
  height: size,
  viewBox: "0 0 100 100",
  xmlns: "http://www.w3.org/2000/svg",
  className,
  "aria-hidden": true,
});

/* ------------------------------------------------------------------ */
/*  CORE STICKERS                                                     */
/* ------------------------------------------------------------------ */

/** 💧 → <StWaterDrop/>  The hero "main" sticker. Animated inside the button. */
export function StWaterDrop({ size = 120, className = "" }) {
  return (
    <svg {...baseProps(size, className)}>
      <defs>
        <linearGradient id="dropFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor="#67e8f9" />
          <stop offset="55%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#1e40af" />
        </linearGradient>
        <radialGradient id="dropShine" cx="35%" cy="30%" r="35%">
          <stop offset="0%"  stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* outer halo */}
      <circle cx="50" cy="55" r="42" fill="#22d3ee" opacity="0.15" />
      {/* drop body */}
      <path
        d="M50 12 C 32 36, 22 50, 22 64 a28 28 0 0 0 56 0 C 78 50, 68 36, 50 12 Z"
        fill="url(#dropFill)"
        stroke="#a5f3fc"
        strokeWidth="2"
      />
      {/* highlight */}
      <ellipse cx="40" cy="55" rx="8" ry="13" fill="url(#dropShine)" />
      <ellipse cx="38" cy="50" rx="3" ry="5" fill="#ffffff" opacity="0.7" />
    </svg>
  );
}

/** 🌪️ → <StTornado/>  The "start" button sticker (spinning while idle). */
export function StTornado({ size = 120, className = "" }) {
  return (
    <svg {...baseProps(size, className)}>
      <defs>
        <linearGradient id="torFill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"  stopColor="#f0abfc" />
          <stop offset="100%" stopColor="#22d3ee" />
        </linearGradient>
      </defs>
      <g>
        <path
          d="M50 14 C 30 14, 24 24, 30 32 C 50 36, 64 30, 70 38 C 76 46, 56 52, 36 52 C 26 52, 22 58, 30 64 C 50 68, 66 62, 70 70 C 74 78, 50 84, 38 84"
          fill="none"
          stroke="url(#torFill)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M50 22 C 38 22, 34 28, 38 32"
          fill="none"
          stroke="#ffffff"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.7"
        />
        <path
          d="M44 58 C 36 58, 32 62, 36 66"
          fill="none"
          stroke="#ffffff"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.7"
        />
      </g>
    </svg>
  );
}

/** 🔊 → <StSpeaker/>  Used while cleaning and as a rules sticker. */
export function StSpeaker({ size = 100, className = "" }) {
  return (
    <svg {...baseProps(size, className)}>
      <defs>
        <linearGradient id="spkFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
        <linearGradient id="spkCone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor="#1e293b" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
      </defs>
      {/* box */}
      <rect x="14" y="20" width="40" height="60" rx="8" fill="url(#spkFill)" stroke="#7c2d12" strokeWidth="2" />
      <rect x="62" y="32" width="20" height="36" rx="4" fill="url(#spkFill)" stroke="#7c2d12" strokeWidth="2" />
      {/* cone big */}
      <circle cx="34" cy="50" r="14" fill="url(#spkCone)" />
      <circle cx="34" cy="50" r="8"  fill="#334155" />
      <circle cx="34" cy="50" r="3"  fill="#0f172a" />
      {/* cone small */}
      <circle cx="72" cy="50" r="9" fill="url(#spkCone)" />
      <circle cx="72" cy="50" r="4" fill="#334155" />
      {/* sound waves */}
      <path d="M88 38 Q 96 50 88 62" fill="none" stroke="#22d3ee" strokeWidth="3" strokeLinecap="round" />
      <path d="M94 30 Q 104 50 94 70" fill="none" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

/** 📱 → <StPhoneDown/>  Rules sticker. */
export function StPhoneDown({ size = 100, className = "" }) {
  return (
    <svg {...baseProps(size, className)}>
      <defs>
        <linearGradient id="phnFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
        <linearGradient id="phnScreen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor="#0ea5e9" />
          <stop offset="100%" stopColor="#1e1b4b" />
        </linearGradient>
      </defs>
      {/* arrows pointing down */}
      <path d="M30 18 L 30 38 M 22 30 L 30 38 L 38 30" fill="none" stroke="#22d3ee" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M50 18 L 50 38 M 42 30 L 50 38 L 58 30" fill="none" stroke="#f0abfc" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M70 18 L 70 38 M 62 30 L 70 38 L 78 30" fill="none" stroke="#22d3ee" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      {/* phone body */}
      <rect x="32" y="42" width="36" height="50" rx="6" fill="url(#phnFill)" stroke="#0c4a6e" strokeWidth="2" />
      <rect x="36" y="48" width="28" height="36" rx="2" fill="url(#phnScreen)" />
      <circle cx="50" cy="88" r="2" fill="#0c4a6e" />
      {/* screen content (downward water lines) */}
      <path d="M40 54 Q 44 60 40 66 Q 36 72 40 78" fill="none" stroke="#67e8f9" strokeWidth="1.5" opacity="0.8" />
      <path d="M50 54 Q 54 60 50 66 Q 46 72 50 78" fill="none" stroke="#67e8f9" strokeWidth="1.5" opacity="0.8" />
      <path d="M60 54 Q 64 60 60 66 Q 56 72 60 78" fill="none" stroke="#67e8f9" strokeWidth="1.5" opacity="0.8" />
    </svg>
  );
}

/** 🔊 → <StVolumeMax/>  Rules sticker (max volume). */
export function StVolumeMax({ size = 100, className = "" }) {
  return (
    <svg {...baseProps(size, className)}>
      <defs>
        <linearGradient id="volFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f472b6" />
          <stop offset="100%" stopColor="#db2777" />
        </linearGradient>
      </defs>
      {/* speaker base */}
      <path d="M14 40 L 30 40 L 50 26 L 50 74 L 30 60 L 14 60 Z" fill="url(#volFill)" stroke="#831843" strokeWidth="2" strokeLinejoin="round" />
      {/* sound waves */}
      <path d="M58 38 Q 70 50 58 62" fill="none" stroke="#f0abfc" strokeWidth="4" strokeLinecap="round" />
      <path d="M68 28 Q 86 50 68 72" fill="none" stroke="#f0abfc" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
      <path d="M78 18 Q 102 50 78 82" fill="none" stroke="#f0abfc" strokeWidth="4" strokeLinecap="round" opacity="0.4" />
      {/* MAX badge */}
      <g transform="translate(60,70)">
        <rect x="0" y="0" width="32" height="18" rx="9" fill="#fbbf24" stroke="#92400e" strokeWidth="2" />
        <text x="16" y="13" textAnchor="middle" fontFamily="Arial Black, sans-serif" fontSize="11" fontWeight="900" fill="#7c2d12">MAX</text>
      </g>
    </svg>
  );
}

/** 🔌 → <StPlugUnplug/>  Rules sticker. */
export function StPlugUnplug({ size = 100, className = "" }) {
  return (
    <svg {...baseProps(size, className)}>
      <defs>
        <linearGradient id="plugBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
      </defs>
      {/* plug head (right) */}
      <rect x="44" y="36" width="34" height="28" rx="6" fill="url(#plugBody)" stroke="#4c1d95" strokeWidth="2" />
      <rect x="78" y="42" width="6"  height="6"  rx="1" fill="#cbd5f5" />
      <rect x="78" y="52" width="6"  height="6"  rx="1" fill="#cbd5f5" />
      {/* cable end (left) */}
      <rect x="20" y="44" width="20" height="12" rx="3" fill="#334155" stroke="#0f172a" strokeWidth="1.5" />
      <line x1="20" y1="50" x2="6"  y2="50" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
      {/* gap with spark */}
      <path d="M42 50 L 46 50" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />
      <g transform="translate(43,50)">
        <path d="M0 -6 L 2 0 L -2 0 L 0 6" fill="#fbbf24" stroke="#92400e" strokeWidth="1" />
      </g>
      {/* X mark */}
      <g transform="translate(82,22)">
        <circle cx="0" cy="0" r="9" fill="#ef4444" stroke="#7f1d1d" strokeWidth="2" />
        <path d="M-4 -4 L 4 4 M 4 -4 L -4 4" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
      </g>
    </svg>
  );
}

/** 🛑 → <StNoStop/>  Rules sticker. */
export function StNoStop({ size = 100, className = "" }) {
  return (
    <svg {...baseProps(size, className)}>
      <defs>
        <linearGradient id="octFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor="#fb7185" />
          <stop offset="100%" stopColor="#b91c1c" />
        </linearGradient>
      </defs>
      <polygon
        points="50,10 90,30 90,70 50,90 10,70 10,30"
        fill="url(#octFill)"
        stroke="#7f1d1d"
        strokeWidth="3"
      />
      <polygon
        points="50,20 80,35 80,65 50,80 20,65 20,35"
        fill="none"
        stroke="#fff"
        strokeWidth="2"
        opacity="0.6"
      />
      <text x="50" y="62" textAnchor="middle" fontFamily="Arial Black, sans-serif" fontSize="28" fontWeight="900" fill="#fff">STOP</text>
    </svg>
  );
}

/** 🎉 → <StParty/>  Success sticker. */
export function StParty({ size = 120, className = "" }) {
  return (
    <svg {...baseProps(size, className)}>
      <defs>
        <linearGradient id="coneFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor="#fde68a" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>
      {/* confetti bits */}
      <rect x="14" y="14" width="6" height="10" rx="1" fill="#ec4899" transform="rotate(20 17 19)" />
      <rect x="80" y="18" width="6" height="10" rx="1" fill="#22d3ee" transform="rotate(-15 83 23)" />
      <rect x="86" y="60" width="6" height="10" rx="1" fill="#a78bfa" transform="rotate(40 89 65)" />
      <rect x="8"  y="58" width="6" height="10" rx="1" fill="#34d399" transform="rotate(-30 11 63)" />
      <circle cx="22" cy="36" r="3" fill="#f472b6" />
      <circle cx="78" cy="40" r="3" fill="#22d3ee" />
      <circle cx="20" cy="78" r="3" fill="#a78bfa" />
      <circle cx="82" cy="80" r="3" fill="#34d399" />
      {/* party popper cone */}
      <path d="M30 88 L 50 30 L 78 70 L 60 78 Z" fill="url(#coneFill)" stroke="#92400e" strokeWidth="2" strokeLinejoin="round" />
      <ellipse cx="78" cy="70" rx="6" ry="4" fill="#92400e" />
      <path d="M40 50 L 44 60 L 38 60 Z" fill="#ec4899" />
      <path d="M52 40 L 56 50 L 50 50 Z" fill="#22d3ee" />
      <path d="M48 65 L 52 75 L 46 75 Z" fill="#a78bfa" />
    </svg>
  );
}

/** ✅ → <StCheck/>  Success badge. */
export function StCheck({ size = 80, className = "" }) {
  return (
    <svg {...baseProps(size, className)}>
      <defs>
        <linearGradient id="chkFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor="#34d399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="40" fill="url(#chkFill)" stroke="#064e3b" strokeWidth="3" />
      <path d="M28 52 L 44 68 L 74 32" fill="none" stroke="#fff" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** ⚡ → <StLightning/>  "Fast" mode sticker. */
export function StLightning({ size = 60, className = "" }) {
  return (
    <svg {...baseProps(size, className)}>
      <defs>
        <linearGradient id="ltFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor="#fde047" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>
      <path d="M58 6 L 26 52 L 46 52 L 36 94 L 78 40 L 56 40 Z" fill="url(#ltFill)" stroke="#92400e" strokeWidth="2.5" strokeLinejoin="round" />
    </svg>
  );
}

/** 🌊 → <StWave/>  "Deep" mode sticker. */
export function StWave({ size = 60, className = "" }) {
  return (
    <svg {...baseProps(size, className)}>
      <defs>
        <linearGradient id="wvFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor="#67e8f9" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
      </defs>
      <path d="M6 50 Q 20 30, 34 50 T 62 50 T 94 50 L 94 80 L 6 80 Z" fill="url(#wvFill)" stroke="#0c4a6e" strokeWidth="2" strokeLinejoin="round" />
      <path d="M6 64 Q 20 50, 34 64 T 62 64 T 94 64" fill="none" stroke="#fff" strokeWidth="2" opacity="0.5" />
    </svg>
  );
}

/** 🎛️ → <StSlider/>  "Manual" mode sticker. */
export function StSlider({ size = 60, className = "" }) {
  return (
    <svg {...baseProps(size, className)}>
      <defs>
        <linearGradient id="slFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor="#c4b5fd" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
      </defs>
      <rect x="8" y="44" width="84" height="12" rx="6" fill="#1e293b" stroke="#0f172a" strokeWidth="2" />
      <rect x="8" y="44" width="50" height="12" rx="6" fill="url(#slFill)" />
      <circle cx="58" cy="50" r="12" fill="#fff" stroke="#4c1d95" strokeWidth="3" />
      <circle cx="58" cy="50" r="5"  fill="#7c3aed" />
    </svg>
  );
}

/** 💦 → small falling drop (used in droplet field) */
export function StMiniDrop({ size = 28, className = "" }) {
  return (
    <svg {...baseProps(size, className)}>
      <defs>
        <linearGradient id="miniFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor="#67e8f9" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>
      </defs>
      <path d="M50 8 C 30 32, 22 46, 22 58 a28 28 0 0 0 56 0 C 78 46, 70 32, 50 8 Z" fill="url(#miniFill)" />
      <ellipse cx="40" cy="50" rx="5" ry="8" fill="#fff" opacity="0.45" />
    </svg>
  );
}

/** ✨ → confetti sparkle */
export function StSparkle({ size = 28, className = "" }) {
  return (
    <svg {...baseProps(size, className)}>
      <path
        d="M50 4 L 56 40 L 96 50 L 56 60 L 50 96 L 44 60 L 4 50 L 44 40 Z"
        fill="#fde047"
        stroke="#a16207"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="50" cy="50" r="6" fill="#fff" />
    </svg>
  );
}

/** 🔋 / 🎊 / etc utility decorations */
export function StStar({ size = 24, className = "" }) {
  return (
    <svg {...baseProps(size, className)}>
      <path
        d="M50 6 L 60 38 L 94 40 L 68 60 L 78 92 L 50 74 L 22 92 L 32 60 L 6 40 L 40 38 Z"
        fill="#fbbf24"
        stroke="#92400e"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}
