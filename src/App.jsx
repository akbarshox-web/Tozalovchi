/**
 * Water Ejector / Speaker Cleaner
 * -----------------------------------------------------------------------------
 *  • Sticker-driven UI (custom SVG components, NOT emoji)
 *  • Trilingual: O'zbek / Русский / English
 *  • Real Web Audio engine: sine carrier + LFO frequency modulation
 *  • Mobile-first, dark theme, polished animations
 */

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { LANGUAGES, DICT } from "./i18n";
import {
  StWaterDrop,
  StTornado,
  StSpeaker,
  StPhoneDown,
  StVolumeMax,
  StPlugUnplug,
  StNoStop,
  StParty,
  StCheck,
  StLightning,
  StWave,
  StSlider,
  StMiniDrop,
  StSparkle,
  StStar,
} from "./stickers";

/* ============================================================================
 *  PRESETS — frequency targets & LFO behaviour (UI-agnostic)
 * ========================================================================== */
const PRESETS = {
  deep: { key: "deep", baseFreq: 165, lfoRate: 5, lfoDepth: 30, sticker: "wave", turbo: false, sweep: false },
  fast: { key: "fast", baseFreq: 250, lfoRate: 8, lfoDepth: 50, sticker: "lightning", turbo: false, sweep: false },
  manual: { key: "manual", baseFreq: 200, lfoRate: 6, lfoDepth: 25, sticker: "slider", turbo: false, sweep: false },
  // turbo: { key: "turbo", baseFreq: 300, lfoRate: 12, lfoDepth: 80, sticker: "lightning", turbo: true, sweep: true },
  // sweep: { key: "sweep", baseFreq: 200, lfoRate: 10, lfoDepth: 60, sticker: "wave", turbo: false, sweep: true },
};

const CLEAN_DURATION_MS = 60_000;
const MIN_FREQ = 80;
const MAX_FREQ = 500;

export default function App() {
  /* ----- UI state -------------------------------------------------------- */
  const [lang, setLang] = useState("uz");
  const [mode, setMode] = useState("deep");
  const [manualFreq, setManualFreq] = useState(200);
  const [volume, setVolume] = useState(0.85);
  const [phase, setPhase] = useState("idle"); // 'idle' | 'cleaning' | 'done'
  const [progress, setProgress] = useState(0);
  const [currentFreq, setCurrentFreq] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [shake, setShake] = useState(false);

  /* ----- i18n helper ---------------------------------------------------- */
  const t = useCallback((path) => {
    const parts = path.split(".");
    let cur = DICT[lang];
    for (const p of parts) cur = cur?.[p];
    return cur ?? path;
  }, [lang]);

  /* ----- Audio refs (persist across renders) ---------------------------- */
  const audioCtxRef = useRef(null);
  const mainOscRef = useRef(null);
  const lfoRef = useRef(null);
  const lfoGainRef = useRef(null);
  const mainGainRef = useRef(null);
  const masterGainRef = useRef(null);
  const progressRafRef = useRef(null);
  const startTimeRef = useRef(0);
  const sweepIntervalRef = useRef(null);

  /* ----- Derived -------------------------------------------------------- */
  const preset = PRESETS[mode];
  const activeFreq = mode === "manual" ? manualFreq : preset.baseFreq;
  const effectiveDuration = preset.turbo ? CLEAN_DURATION_MS / 2 : CLEAN_DURATION_MS;

  /* ============================================================================
   *  AUDIO ENGINE Controls
   * ========================================================================== */
  const stopAudioNodes = useCallback(() => {
    if (sweepIntervalRef.current) {
      clearInterval(sweepIntervalRef.current);
      sweepIntervalRef.current = null;
    }
    [mainOscRef, lfoRef].forEach((ref) => {
      try { ref.current?.stop(); } catch { /* already stopped */ }
      ref.current?.disconnect();
      ref.current = null;
    });
    [lfoGainRef, mainGainRef, masterGainRef].forEach((ref) => {
      ref.current?.disconnect();
      ref.current = null;
    });
  }, []);

  const startAudio = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    const ctx = audioCtxRef.current;
    if (ctx.state === "suspended") ctx.resume();

    stopAudioNodes();

    // master volume
    const master = ctx.createGain();
    master.gain.value = volume;
    master.connect(ctx.destination);
    masterGainRef.current = master;

    // main gain
    const mainGain = ctx.createGain();
    mainGain.gain.value = 0.5;
    mainGain.connect(master);
    mainGainRef.current = mainGain;

    // carrier oscillator
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = activeFreq;
    osc.connect(mainGain);
    mainOscRef.current = osc;

    // LFO (FM Modulation)
    const lfo = ctx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.value = preset.lfoRate;

    const lfoGain = ctx.createGain();
    lfoGain.gain.value = preset.lfoDepth;

    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);
    lfoRef.current = lfo;
    lfoGainRef.current = lfoGain;

    osc.start();
    lfo.start();

    // Frequency Sweep
    if (preset.sweep) {
      const freqs = [120, 165, 200, 250, 300, 350, 400, 450];
      let idx = 0;
      sweepIntervalRef.current = setInterval(() => {
        if (!mainOscRef.current || !audioCtxRef.current) return;
        idx = (idx + 1) % freqs.length;
        mainOscRef.current.frequency.setTargetAtTime(
          freqs[idx],
          audioCtxRef.current.currentTime,
          0.1
        );
      }, 2000);
    }
  }, [activeFreq, preset.lfoDepth, preset.lfoRate, preset.sweep, volume, stopAudioNodes]);

  /* ============================================================================
   *  CLEANING LIFECYCLE (Xatolar to'g'rilangan tartibda)
   * ========================================================================== */
  const stopCleaning = useCallback(() => {
    if (progressRafRef.current) {
      cancelAnimationFrame(progressRafRef.current);
    }
    stopAudioNodes();
    setShake(false);
    setCurrentFreq(0);
  }, [stopAudioNodes]);

  const finishCleaning = useCallback(() => {
    stopCleaning();
    setPhase("done");
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 6000);
  }, [stopCleaning]);

  const startCleaning = useCallback(() => {
    setPhase("cleaning");
    setProgress(0);
    setShowConfetti(false);
    setShake(true);
    startAudio();
    startTimeRef.current = performance.now();

    const tick = () => {
      const elapsed = performance.now() - startTimeRef.current;
      const pct = Math.min(100, (elapsed / effectiveDuration) * 100);
      setProgress(pct);

      if (mainOscRef.current) {
        setCurrentFreq(mainOscRef.current.frequency.value);
      }

      if (pct < 100) {
        progressRafRef.current = requestAnimationFrame(tick);
      } else {
        finishCleaning(); // Endi xavfsiz chaqiriladi, chunki tepada e'lon qilingan
      }
    };
    progressRafRef.current = requestAnimationFrame(tick);
  }, [startAudio, effectiveDuration, finishCleaning]);

  const reset = useCallback(() => {
    stopCleaning();
    setPhase("idle");
    setProgress(0);
  }, [stopCleaning]);

  /* ----- Live updates ---------------------------------------------------- */
  useEffect(() => {
    if (phase !== "cleaning" || !mainOscRef.current || !audioCtxRef.current) return;
    mainOscRef.current.frequency.setTargetAtTime(
      activeFreq,
      audioCtxRef.current.currentTime,
      0.05
    );
  }, [activeFreq, phase]);

  useEffect(() => {
    if (phase !== "cleaning" || !masterGainRef.current || !audioCtxRef.current) return;
    masterGainRef.current.gain.setTargetAtTime(
      volume,
      audioCtxRef.current.currentTime,
      0.05
    );
  }, [volume, phase]);

  /* ----- Unmount safety cleanup ----------------------------------------- */
  useEffect(() => {
    return () => {
      if (progressRafRef.current) cancelAnimationFrame(progressRafRef.current);
      stopAudioNodes();
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => { });
      }
    };
  }, [stopAudioNodes]);

  /* ============================================================================
   *  RENDER
   * ========================================================================== */
  return (
    <div
      className={`min-h-screen w-full overflow-x-hidden text-slate-100
                  bg-gradient-to-br from-[#0a0f2c] via-[#0d1547] to-[#1a0a3a]
                  ${shake ? "animate-screen-shake" : ""}`}
    >
      <BackdropOrbs />

      {phase === "cleaning" && <Droplets />}
      {showConfetti && <Confetti />}

      <main className="relative z-10 mx-auto flex min-h-screen max-w-3xl flex-col items-center px-4 pb-16 pt-6 sm:px-6 sm:pt-8">
        <Header
          title={t("nav.title")}
          tagline={t("nav.tagline")}
          lang={lang}
          onLang={setLang}
        />

        <section className="mt-6 w-full rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl sm:p-8">
          <HeroDisplay
            phase={phase}
            progress={progress}
            currentFreq={currentFreq}
            preset={preset}
            mode={mode}
            t={t}
            effectiveDuration={effectiveDuration}
          />

          <div className="mt-6 grid grid-cols-3 gap-2 sm:grid-cols-5 sm:gap-3">
            {Object.entries(PRESETS).map(([key, p]) => (
              <ModeButton
                key={key}
                active={mode === key}
                onClick={() => !isCleaning(phase) && setMode(key)}
                preset={p}
                t={t}
                disabled={isCleaning(phase)}
              />
            ))}
          </div>

          {mode === "manual" && (
            <Slider
              label={t("controls.manualFreq")}
              value={manualFreq}
              min={MIN_FREQ}
              max={MAX_FREQ}
              unit="Hz"
              onChange={setManualFreq}
              disabled={isCleaning(phase)}
            />
          )}

          <Slider
            label={t("controls.volume")}
            value={Math.round(volume * 100)}
            min={0}
            max={100}
            unit="%"
            onChange={(v) => setVolume(v / 100)}
            disabled={isCleaning(phase)}
          />

          <div className="mt-8 flex justify-center">
            {phase === "done" ? (
              <button
                onClick={reset}
                className="group relative flex items-center gap-3 rounded-full
                           bg-gradient-to-r from-emerald-400 to-cyan-400 px-8 py-4
                           text-lg font-bold text-slate-900 shadow-2xl shadow-emerald-500/40
                           transition hover:scale-105 active:scale-95"
              >
                <StSparkle size={22} />
                {t("cta.again")}
                <StSparkle size={22} />
              </button>
            ) : (
              <CleaningButton
                phase={phase}
                onStart={startCleaning}
                onStop={stopCleaning}
                t={t}
              />
            )}
          </div>
        </section>

        <Rules t={t} />

        <footer className="mt-10 text-center text-xs text-slate-400/70">
          <p>💡 {t("footer.tip")}</p>
          <p className="mt-1 opacity-60">{t("footer.made")}</p>
        </footer>
      </main>
    </div>
  );
}

/* ============================================================================
 *  YORDAMCHI SUB-KOMPONENTLAR
 * ========================================================================== */

const isCleaning = (phase) => phase === "cleaning";

function Header({ title, tagline, lang, onLang }) {
  return (
    <header className="w-full">
      <div className="flex flex-col items-center text-center">
        <div className="flex items-center gap-3">
          <div className="drop-shadow-[0_0_18px_rgba(34,211,238,0.55)] animate-bounce-slow">
            <StWaterDrop size={56} />
          </div>
          <h1 className="text-3xl font-black tracking-tight sm:text-5xl">
            <span className="bg-gradient-to-r from-cyan-300 via-sky-300 to-fuchsia-300
                            bg-clip-text text-transparent">
              {title}
            </span>
          </h1>
          <div className="drop-shadow-[0_0_18px_rgba(244,114,182,0.55)] animate-bounce-slow">
            <StPhoneDown size={56} />
          </div>
        </div>
        <p className="mt-2 text-sm text-slate-300/80 sm:text-base">{tagline}</p>
      </div>

      <nav
        className="mx-auto mt-4 flex w-fit items-center gap-1 rounded-full border
                   border-white/10 bg-white/5 p-1 backdrop-blur"
        role="tablist"
        aria-label="Language"
      >
        {LANGUAGES.map((l) => (
          <button
            key={l.code}
            role="tab"
            aria-selected={lang === l.code}
            onClick={() => onLang(l.code)}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs
                        font-bold transition sm:text-sm
                        ${lang === l.code
                ? "bg-gradient-to-r from-cyan-400 to-fuchsia-400 text-slate-900 shadow"
                : "text-slate-300 hover:bg-white/10"}`}
          >
            <span>{l.flag}</span>
            <span>{l.label}</span>
          </button>
        ))}
      </nav>
    </header>
  );
}

function HeroDisplay({ phase, progress, currentFreq, preset, mode, t, effectiveDuration }) {
  const status = useMemo(() => {
    if (phase === "cleaning") return { ...t("hero.cleaning"), sticker: "tornado" };
    if (phase === "done") return { ...t("hero.done"), sticker: "check" };
    return { ...t("hero.idle"), sticker: preset.sticker };
  }, [phase, preset, t]);

  const stickerEl = (() => {
    switch (status.sticker) {
      case "tornado": return <StTornado size={120} className="sm:w-36 sm:h-36" />;
      case "check": return <StCheck size={120} className="sm:w-36 sm:h-36" />;
      case "wave": return <StWave size={120} className="sm:w-36 sm:h-36" />;
      case "lightning": return <StLightning size={120} className="sm:w-36 sm:h-36" />;
      case "slider": return <StSlider size={120} className="sm:w-36 sm:h-36" />;
      default: return <StWaterDrop size={120} className="sm:w-36 sm:h-36" />;
    }
  })();

  const durationMs = effectiveDuration ?? CLEAN_DURATION_MS;

  return (
    <div className="flex flex-col items-center">
      <div
        key={`${phase}-${mode}`}
        className={`mb-4 drop-shadow-[0_0_25px_rgba(255,255,255,0.25)]
                    ${phase === "cleaning" ? "animate-spin-slow" : "animate-pulse-slow"}`}
        aria-hidden
      >
        {stickerEl}
      </div>

      <h2 className="text-2xl font-bold sm:text-3xl">{status.title}</h2>
      <p className="mt-1 text-sm text-slate-300/80 sm:text-base">{status.sub}</p>

      <ProgressRing
        progress={progress}
        active={phase === "cleaning"}
        done={phase === "done"}
        t={t}
      />

      {phase === "cleaning" && (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-sm font-mono text-cyan-200">
          <Stat icon={<StSpeaker size={20} />} label={t("stats.freq")} value={`${currentFreq.toFixed(0)} Hz`} />
          <Stat
            icon={<span className="text-base">⏱</span>}
            label={t("stats.left")}
            value={`${Math.max(0, Math.ceil((durationMs * (1 - progress / 100)) / 1000))}s`}
          />
        </div>
      )}
    </div>
  );
}

function ProgressRing({ progress, active, done, t }) {
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const dash = (progress / 100) * circumference;

  return (
    <div className="relative mt-6 h-56 w-56 sm:h-64 sm:w-64">
      {active && (
        <div className="absolute inset-0 rounded-full bg-cyan-400/20 blur-2xl animate-pulse" />
      )}

      <svg viewBox="0 0 220 220" className="relative h-full w-full -rotate-90">
        <defs>
          <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#e879f9" />
          </linearGradient>
        </defs>
        <circle cx="110" cy="110" r={radius} stroke="rgba(255,255,255,0.1)" strokeWidth="12" fill="none" />
        <circle
          cx="110" cy="110" r={radius}
          stroke="url(#ringGradient)" strokeWidth="12" strokeLinecap="round" fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - dash}
          className={active ? "transition-all duration-100" : "transition-all duration-500"}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {done ? (
          <div className="animate-bounce">
            <StCheck size={84} />
          </div>
        ) : (
          <>
            <span className="text-4xl font-black tabular-nums sm:text-5xl">
              {Math.floor(progress)}%
            </span>
            <span className="mt-1 text-xs uppercase tracking-widest text-slate-400">
              {active ? t("hero.cleaning_lbl") : t("hero.ready")}
            </span>
          </>
        )}
      </div>
    </div>
  );
}

function Stat({ icon, label, value }) {
  return (
    <div className="flex items-center gap-2 rounded-full bg-white/5 px-3 py-1.5">
      <span className="flex items-center">{icon}</span>
      <span className="text-slate-400">{label}:</span>
      <span className="font-bold text-cyan-200">{value}</span>
    </div>
  );
}

function ModeButton({ active, onClick, preset, t, disabled }) {
  const Sticker =
    preset.sticker === "wave" ? StWave :
      preset.sticker === "lightning" ? StLightning :
        StSlider;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`group relative overflow-hidden rounded-2xl border p-3 text-left
                  transition-all duration-200 sm:p-4
                  ${active
          ? `border-white/30 bg-gradient-to-br
                       ${accentForMode(preset.key)} text-white shadow-lg
                       ${glowForMode(preset.key)} scale-105`
          : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:scale-105"
        }
                  ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <div className="mx-auto w-10 sm:w-12">
        <Sticker size={48} className="w-full h-auto" />
      </div>
      <div className="mt-1 text-center text-xs font-bold sm:text-sm">
        {t(`modes.${preset.key}.label`)}
      </div>
    </button>
  );
}

function accentForMode(key) {
  if (key === "deep") return "from-cyan-400 to-blue-500";
  if (key === "fast") return "from-fuchsia-400 to-pink-500";
  if (key === "turbo") return "from-amber-400 to-red-500";
  if (key === "sweep") return "from-emerald-400 to-teal-500";
  return "from-violet-400 to-indigo-500";
}
function glowForMode(key) {
  if (key === "deep") return "shadow-cyan-500/50";
  if (key === "fast") return "shadow-pink-500/50";
  if (key === "turbo") return "shadow-amber-500/50";
  if (key === "sweep") return "shadow-emerald-500/50";
  return "shadow-violet-500/50";
}

function Slider({ label, value, min, max, unit, onChange, disabled }) {
  return (
    <div className="mt-4">
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-semibold text-slate-200">{label}</span>
        <span className="rounded-full bg-white/10 px-3 py-0.5 font-mono text-cyan-200">
          {value} {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-cyan-400 disabled:opacity-40"
      />
    </div>
  );
}

function CleaningButton({ phase, onStart, onStop, t }) {
  const cleaning = phase === "cleaning";

  return (
    <button
      onClick={cleaning ? onStop : onStart}
      aria-label={cleaning ? t("a11y.stop") : t("a11y.start")}
      className={`group relative flex h-44 w-44 items-center justify-center
                  rounded-full transition-transform active:scale-95
                  sm:h-52 sm:w-52
                  ${cleaning
          ? "bg-gradient-to-br from-fuchsia-500 to-pink-600 shadow-2xl shadow-pink-500/50"
          : "bg-gradient-to-br from-cyan-500 to-blue-600 shadow-2xl shadow-cyan-500/40 hover:scale-105"}`}
    >
      {cleaning && (
        <>
          <span className="absolute inset-0 rounded-full border-4 border-white/40 animate-ripple" />
          <span className="absolute inset-0 rounded-full border-4 border-white/30 animate-ripple" style={{ animationDelay: "0.5s" }} />
          <span className="absolute inset-0 rounded-full border-4 border-white/20 animate-ripple" style={{ animationDelay: "1s" }} />
        </>
      )}

      <div className={`relative z-10 ${cleaning ? "animate-vibrate" : "animate-pulse-slow"}`}>
        {cleaning ? <StSpeaker size={120} /> : <StTornado size={130} />}
      </div>

      {!cleaning && (
        <span className="absolute inset-0 rounded-full bg-cyan-400/40 blur-xl animate-pulse-glow" />
      )}

      <span className="absolute -bottom-9 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs
                       font-bold uppercase tracking-wider text-cyan-200 sm:text-sm">
        {cleaning ? t("cta.stop") : t("cta.start")}
      </span>
    </button>
  );
}

function Rules({ t }) {
  const ruleKeys = ["deep", "volume", "plug", "stop"];
  const stickers = [StPhoneDown, StVolumeMax, StPlugUnplug, StNoStop];
  const colors = [
    "from-cyan-500/20 to-cyan-500/5 border-cyan-400/30",
    "from-pink-500/20 to-pink-500/5 border-pink-400/30",
    "from-violet-500/20 to-violet-500/5 border-violet-400/30",
    "from-amber-500/20 to-amber-500/5 border-amber-400/30",
  ];

  return (
    <section className="mt-10 w-full">
      <h3 className="mb-4 flex items-center justify-center gap-2 text-xl font-bold sm:text-2xl">
        <StStar size={22} />
        <span className="bg-gradient-to-r from-cyan-300 to-fuchsia-300 bg-clip-text text-transparent">
          {t("rules.heading")}
        </span>
        <StStar size={22} />
      </h3>

      <ol className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {ruleKeys.map((key, i) => {
          const Sticker = stickers[i];
          return (
            <li
              key={key}
              className={`group relative overflow-hidden rounded-2xl border
                          bg-gradient-to-br ${colors[i]} p-4 backdrop-blur
                          transition hover:scale-[1.02] hover:shadow-xl`}
            >
              <div className="flex items-start gap-3">
                <div className="shrink-0 drop-shadow-lg transition group-hover:scale-110
                                w-14 sm:w-16">
                  <Sticker size={64} className="w-full h-auto" />
                </div>
                <div className="flex-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    {t("rules.step")} {i + 1}
                  </span>
                  <h4 className="mt-0.5 text-base font-bold sm:text-lg">
                    {t(`rules.items.${i}.title`)}
                  </h4>
                  <p className="mt-1 text-sm text-slate-300/85">
                    {t(`rules.items.${i}.body`)}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function Droplets() {
  const drops = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        left: `${(i * 53) % 100}%`,
        delay: `${(i * 0.27) % 4}s`,
        duration: `${2 + ((i * 37) % 30) / 10}s`,
        size: 18 + (i % 4) * 6,
        type: i % 3,
      })),
    []
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      {drops.map((d, i) => (
        <div
          key={i}
          className="absolute -top-10 animate-fall opacity-50"
          style={{
            left: d.left,
            animationDelay: d.delay,
            animationDuration: d.duration,
            width: d.size,
            height: d.size,
          }}
        >
          {d.type === 0 ? (
            <StMiniDrop size={d.size} className="w-full h-full" />
          ) : d.type === 1 ? (
            <StSparkle size={d.size} className="w-full h-full" />
          ) : (
            <StStar size={d.size} className="w-full h-full" />
          )}
        </div>
      ))}
    </div>
  );
}

function Confetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 60 }, (_, i) => ({
        left: `${(i * 17) % 100}%`,
        delay: `${(i * 0.05) % 2}s`,
        duration: `${2 + ((i * 13) % 30) / 10}s`,
        size: 18 + (i % 4) * 6,
        kind: i % 4,
      })),
    []
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden>
      {pieces.map((p, i) => (
        <div
          key={i}
          className="absolute -top-10 animate-confetti"
          style={{
            left: p.left,
            animationDelay: p.delay,
            animationDuration: p.duration,
            width: p.size,
            height: p.size,
          }}
        >
          {p.kind === 0 ? (
            <StSparkle size={p.size} className="w-full h-full" />
          ) : p.kind === 1 ? (
            <StStar size={p.size} className="w-full h-full" />
          ) : p.kind === 2 ? (
            <StMiniDrop size={p.size} className="w-full h-full" />
          ) : (
            <StCheck size={p.size} className="w-full h-full" />
          )}
        </div>
      ))}
    </div>
  );
}

function BackdropOrbs() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-cyan-500/20
                      blur-3xl animate-float-slow" />
      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-fuchsia-500/20
                      blur-3xl animate-float-slow" style={{ animationDelay: "1.5s" }} />
      <div className="absolute top-1/2 left-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2
                      rounded-full bg-violet-500/15 blur-3xl animate-float-slow"
        style={{ animationDelay: "0.7s" }} />
    </div>
  );
}