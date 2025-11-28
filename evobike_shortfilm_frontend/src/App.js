import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import './App.css';

/**
 * Ocean Professional themed single-page short film experience for Evobike.
 * - Centered video player with timeline markers for 10 scenes (0-90s)
 * - Clickable markers to seek by scene
 * - Caption overlay with Spanish narration
 * - Final CTA section after last scene
 * - Placeholder video can be replaced in public/assets/evobike_placeholder.mp4
 */

/** Scene map based on provided storyboard. */
const SCENES = [
  { id: 1, start: 0, end: 7, title: 'Hogar feliz', narration: 'Éramos una familia sencilla… pero feliz.' },
  { id: 2, start: 7, end: 15, title: 'Mala decisión', narration: 'Hasta que una mala decisión lo cambió todo.' },
  { id: 3, start: 15, end: 22, title: 'Accidente mínimo', narration: 'Era un accidente mínimo… pero la consecuencia fue enorme.' },
  { id: 4, start: 22, end: 28, title: 'Correccional', narration: 'Mi hermano fue enviado a una correccional. Mis padres tuvieron que trabajar lejos.' },
  { id: 5, start: 28, end: 34, title: 'Graduación sola', narration: 'Mi propio día especial… lo viví sola.' },
  { id: 6, start: 34, end: 41, title: 'Sigo intentando', narration: 'Pero aun así, seguía intentando.' },
  { id: 7, start: 41, end: 52, title: 'Miedo a motos', narration: 'Le temía a las motos… y no podía cargar más gastos ni papeles.' },
  { id: 8, start: 52, end: 65, title: 'Descubre Evobike', narration: 'Hasta que encontré Evobike… una forma segura, limpia y accesible de moverme.' },
  { id: 9, start: 65, end: 79, title: 'Avanzo en mi vida', narration: 'Gracias a esa libertad… pude llegar a tiempo a mi vida.' },
  { id: 10, start: 79, end: 90, title: 'Graduación universitaria', narration: 'Evobike. El camino que te lleva a donde de verdad quieres estar.' },
];

/** Resolve video source with env override. */
function useVideoSrc() {
  const envUrl = process.env.REACT_APP_FRONTEND_URL || '';
  const base = envUrl && envUrl.trim() !== '' ? envUrl.replace(/\/$/, '') : '';
  // PUBLIC_INTERFACE
  const resolved = base ? `${base}/assets/evobike_placeholder.mp4` : '/assets/evobike_placeholder.mp4';
  return resolved;
}

/** Determine active scene by current time. */
function getActiveSceneIndex(timeSec) {
  const idx = SCENES.findIndex(s => timeSec >= s.start && timeSec < s.end);
  if (idx >= 0) return idx;
  // If beyond last end, consider last scene active
  if (timeSec >= (SCENES[SCENES.length - 1]?.start ?? 0)) return SCENES.length - 1;
  return 0;
}

/** Format seconds to mm:ss */
function formatTime(s) {
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return `${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}`;
}

/** Timeline component with markers and progress. */
// PUBLIC_INTERFACE
function SceneTimeline({ duration = 90, currentTime = 0, onSeek }) {
  /** This is a public function. */
  const progress = Math.min(100, Math.max(0, (currentTime / duration) * 100));

  return (
    <div className="timeline" aria-label="Línea de tiempo de escenas">
      <div className="timeline-track" role="progressbar" aria-valuemin={0} aria-valuemax={duration} aria-valuenow={Math.floor(currentTime)} aria-label={`Progreso ${formatTime(currentTime)} de ${formatTime(duration)}`}>
        <div className="timeline-progress" style={{ width: `${progress}%` }} />
      </div>
      <div className="markers" role="list">
        {SCENES.map((scene, i) => {
          const active = currentTime >= scene.start && currentTime < scene.end;
          return (
            <div className={`marker ${active ? 'active' : ''}`} role="listitem" key={scene.id}>
              <button
                type="button"
                aria-pressed={active}
                aria-label={`Ir a escena ${scene.id}: ${scene.title}, tiempo ${formatTime(scene.start)}`}
                onClick={() => onSeek(scene.start)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSeek(scene.start);
                  }
                }}
                title={`${scene.title} (${formatTime(scene.start)})`}
              >
                {scene.id}. {scene.title}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Caption overlay for current scene */
// PUBLIC_INTERFACE
function CaptionOverlay({ activeIndex }) {
  /** This is a public function. */
  const text = SCENES[activeIndex]?.narration ?? '';
  return (
    <div className="caption-overlay" aria-live="polite" aria-atomic="true">
      <div className="caption-chip">{text}</div>
    </div>
  );
}

/** Final CTA shown after last scene */
// PUBLIC_INTERFACE
function FinalCTA() {
  /** This is a public function. */
  const ctaUrl =
    process.env.REACT_APP_FRONTEND_URL ||
    process.env.REACT_APP_BACKEND_URL ||
    process.env.REACT_APP_API_BASE ||
    '#';

  return (
    <section className="cta" aria-label="Sección final Evobike">
      <h2 className="cta-title">Evobike: libertad, limpieza y confianza</h2>
      <p className="cta-subtitle">Da el siguiente paso hacia una movilidad segura y accesible.</p>
      <a href={ctaUrl} className="cta-button" rel="noopener noreferrer">
        Descubre Evobike
      </a>
    </section>
  );
}

/** Main App */
// PUBLIC_INTERFACE
function App() {
  /** This is a public function. */
  const videoRef = useRef(null);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(90);
  const [isReady, setIsReady] = useState(false);

  const videoSrc = useVideoSrc();

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const onTime = () => setTime(v.currentTime || 0);
    const onLoaded = () => {
      setDuration(v.duration && Number.isFinite(v.duration) ? v.duration : 90);
      setIsReady(true);
    };
    const onEnded = () => setTime(v.duration || 90);

    v.addEventListener('timeupdate', onTime);
    v.addEventListener('loadedmetadata', onLoaded);
    v.addEventListener('ended', onEnded);

    return () => {
      v.removeEventListener('timeupdate', onTime);
      v.removeEventListener('loadedmetadata', onLoaded);
      v.removeEventListener('ended', onEnded);
    };
  }, []);

  const activeIndex = useMemo(() => getActiveSceneIndex(time), [time]);

  const handleSeek = useCallback((target) => {
    const v = videoRef.current;
    if (!v) return;
    // Smooth-ish UX: pause, seek, then play
    const wasPaused = v.paused;
    v.pause();
    v.currentTime = target + 0.001; // nudge to trigger timeupdate
    if (!wasPaused) {
      v.play().catch(() => {});
    }
  }, []);

  return (
    <div className="app">
      <main className="container" role="main">
        <header className="header">
          <h1 className="header-title">Corto Evobike</h1>
          <p className="header-subtitle">Una historia de esperanza y movimiento</p>
        </header>

        <section className="player-card" aria-label="Reproductor de video">
          <div className="video-wrapper">
            <video
              ref={videoRef}
              className="video"
              src={videoSrc}
              controls
              preload="metadata"
              playsInline
              aria-label="Corto animado de 90 segundos"
            />
            <CaptionOverlay activeIndex={activeIndex} />
          </div>

          <SceneTimeline duration={duration} currentTime={time} onSeek={handleSeek} />
        </section>

        {/* Show CTA after last scene time is reached */}
        {time >= (SCENES[SCENES.length - 1]?.start ?? 79) && (
          <FinalCTA />
        )}

        <p className="sr-only" aria-live="polite">
          {isReady ? 'Video listo.' : 'Cargando video...'}
        </p>
      </main>
    </div>
  );
}

export default App;
