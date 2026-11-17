import { useEffect, useRef, useState } from "react";
import {
  Play, Pause, RotateCcw, Compass, Maximize2, Minimize2,
  MousePointer2, Move, ZoomIn, ZoomOut, Hand, Volume2, VolumeX
} from "lucide-react";
import { useReel } from "@/hooks/useReel";
import Stage from "@/components/reel/Stage";

function Tool({ label, onClick, children, active = false, disabled = false }) {
  return (
    <button type="button" title={label} aria-label={label} onClick={onClick} disabled={disabled}
      className={"cinema-tool " + (active ? "cinema-tool--active" : "")}>
      {children}
    </button>
  );
}

export default function ReelStudio() {
  const r = useReel();
  const stageRef = useRef(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [showHelp, setShowHelp] = useState(true);

  useEffect(() => {
    const sync = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", sync);
    return () => document.removeEventListener("fullscreenchange", sync);
  }, []);

  useEffect(() => {
    const onKey = (event) => {
      const el = event.target;
      if (el && /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName)) return;
      if (event.code === "Space") {
        event.preventDefault();
        if (r.mode === "reel") r.toggle();
        else r.setMode("reel");
      } else if (event.key.toLowerCase() === "e") {
        r.setMode(r.mode === "explore" ? "reel" : "explore");
      } else if (event.key.toLowerCase() === "f") {
        toggleFullscreen();
      } else if (event.key === "Escape" && r.mode === "explore" && !r.selected) {
        r.setMode("reel");
      } else if (r.mode === "explore" && event.key.startsWith("Arrow")) {
        event.preventDefault();
        r.pointer("key", event.key === "ArrowLeft" ? -0.24 : event.key === "ArrowRight" ? 0.24 : 0,
          event.key === "ArrowUp" ? -0.18 : event.key === "ArrowDown" ? 0.18 : 0);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const toggleFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen?.();
    else stageRef.current?.requestFullscreen?.().catch(() => {});
  };

  return (
    <main ref={stageRef} data-testid="immersive-v3" className="cinema-shell">
      <Stage r={r}/>
      {r.ready && (
        <>
          <div className="cinema-toolbar" aria-label="Controlos do filme">
            {r.mode === "reel" ? (
              <>
                <Tool label={r.playing ? "Pausar filme" : "Reproduzir Versão 3"} onClick={r.toggle}>
                  {r.playing ? <Pause size={19}/> : <Play size={19} fill="currentColor"/>}
                </Tool>
                <Tool label="Recomeçar filme" onClick={r.restart}><RotateCcw size={18}/></Tool>
                <Tool label={r.muted ? "Ligar som" : "Desligar som"} onClick={r.toggleMute}>
                  {r.muted ? <VolumeX size={19}/> : <Volume2 size={19}/>}
                </Tool>
              </>
            ) : (
              <>
                <Tool label="Afastar da galáxia" onClick={() => r.pointer("wheel",0,0,170)}>
                  <ZoomOut size={18}/>
                </Tool>
                <Tool label="Aproximar da galáxia" onClick={() => r.pointer("wheel",0,0,-170)}>
                  <ZoomIn size={18}/>
                </Tool>
              </>
            )}
            <Tool label={fullscreen ? "Sair do ecrã inteiro" : "Ecrã inteiro"}
              onClick={toggleFullscreen}>
              {fullscreen ? <Minimize2 size={19}/> : <Maximize2 size={19}/>}
            </Tool>
          </div>

          <div className="cinema-bottom">
            {r.mode === "reel" && (
              <button type="button" data-testid="explore-mode-button"
                className="cinema-explore" onClick={() => r.setMode("explore")}>
                <Compass size={18} strokeWidth={1.8}/>
                <span>Explorar arquivos</span>
                <span className="cinema-explore-arrow" aria-hidden="true">↗</span>
              </button>
            )}
            {r.mode === "explore" && (
              <button type="button" data-testid="return-to-film"
                className="cinema-explore" onClick={() => r.setMode("reel")}>
                <Play size={17}/><span>Voltar ao filme</span>
              </button>
            )}
            <button type="button" data-testid="toggle-help" className="cinema-hint-toggle"
              aria-label={showHelp ? "Ocultar instruções" : "Mostrar instruções"}
              onClick={() => setShowHelp(v => !v)}>
              <MousePointer2 size={16}/><span aria-hidden="true">?</span>
            </button>
          </div>

          {r.mode === "explore" && showHelp && !r.selected && (
            <div className="cinema-gesture-guide" aria-label="Instruções de navegação">
              <span title="Arrastar para orbitar"><Hand size={17}/> <span>Arrastar</span></span>
              <span title="Roda do rato ou gestos para aproximar"><ZoomIn size={17}/> <span>Zoom</span></span>
              <span title="Clicar numa obra para a abrir"><MousePointer2 size={17}/> <span>Seleccionar</span></span>
              <span title="Usar as setas do teclado"><Move size={17}/> <span>Setas</span></span>
            </div>
          )}
          {r.mode === "reel" && (
            <div className="cinema-timeline-wrap">
              <button type="button" aria-label="Ir para a posição seleccionada do filme"
                className="cinema-timeline"
                onClick={(e) => {
                  const rect=e.currentTarget.getBoundingClientRect();
                  r.seek(((e.clientX-rect.left)/rect.width)*r.duration);
                }}>
                <span style={{width: Math.min(100,(r.time/r.duration)*100)+"%"}} />
              </button>
            </div>
          )}
        </>
      )}
      {r.error && <div role="alert" className="cinema-error">{r.error}</div>}
    </main>
  );
}
