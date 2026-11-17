"use client";

type Props={
  ready:boolean;
  returning:boolean;
  progress:number;
  onSkip:()=>void;
};

/**
 * Only the small loading curtain uses DOM/CSS. The actual portal and
 * all 155 works share the Three.js gallery camera and its single canvas.
 */
export default function PortalIntro({ready,returning,progress,onSkip}:Props){
  return <>
    <div className={"portal-boot"+(ready?" portal-boot--release":"")}
      data-testid="archive-portal" aria-hidden={ready}>
      <div className="portal-boot__core" aria-hidden="true"><i/><i/><i/></div>
      {!ready&&<div className="portal-boot__status" role="status" aria-live="polite">
        A PREPARAR O ARQUIVO
        <span className="portal-boot__progress" aria-label={`${Math.round(progress*100)}% carregado`}/>
      </div>}
    </div>
    <div className="portal-hud" aria-label="Entrada cinematográfica">
      <span className="portal-hud__brand">EK <span> / </span> IMMERSIVE ARCHIVE</span>
      <button type="button" onClick={onSkip} className="portal-hud__skip"
        data-testid="skip-intro" title="Saltar abertura">
        {returning?"ENTRAR DIRECTAMENTE":"SALTAR INTRO"} <span aria-hidden="true">↗</span>
      </button>
    </div>
  </>;
}
