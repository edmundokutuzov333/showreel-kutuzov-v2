import { forwardRef, useRef } from "react";
import { Play } from "lucide-react";
import ExploreOverlay from "@/components/reel/ExploreOverlay";

const Stage = forwardRef(function Stage({ r }, forwardedRef) {
  const pinch = useRef(null);
  const relative = (e) => {
    const b=e.currentTarget.getBoundingClientRect();
    const naturalRatio=16/9;
    const containerRatio=b.width/b.height;
    const fittedWidth=containerRatio>naturalRatio ? b.height*naturalRatio : b.width;
    const fittedHeight=containerRatio>naturalRatio ? b.height : b.width/naturalRatio;
    const left=(b.width-fittedWidth)/2;
    const top=(b.height-fittedHeight)/2;
    return [(e.clientX-b.left-left)/fittedWidth,(e.clientY-b.top-top)/fittedHeight];
  };

  return (
    <div ref={forwardedRef} data-testid="reel-stage" className={"cinema-stage "+(r.mode==="explore"?"cinema-stage--explore":"")}
      onPointerMove={(e)=>r.pointer("move",...relative(e))}
      onPointerDown={(e)=>{
        if(r.mode!=="explore"||!e.isPrimary||(e.button!==undefined&&e.button!==0))return;
        if(e.target!==e.currentTarget&&e.target.tagName!=="CANVAS")return;
        e.currentTarget.setPointerCapture?.(e.pointerId);
        r.pointer("down",...relative(e));
      }}
      onPointerUp={(e)=>{
        if(r.mode!=="explore"||!e.isPrimary)return;
        r.pointer("up",...relative(e));
        if(e.currentTarget.hasPointerCapture?.(e.pointerId))e.currentTarget.releasePointerCapture(e.pointerId);
      }}
      onPointerCancel={()=>r.pointer("leave",0,0)}
      onPointerLeave={()=>r.pointer("leave",0,0)}
      onWheel={(e)=>{if(r.mode==="explore"){ e.preventDefault();r.pointer("wheel",0,0,e.deltaY);}}}
      onTouchStart={(e)=>{if(e.touches.length===2)pinch.current=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);}}
      onTouchMove={(e)=>{if(e.touches.length===2&&pinch.current){
        const d=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);
        if(r.mode==="explore")r.pointer("wheel",0,0,(pinch.current-d)*2);
        pinch.current=d;
      }}}
      onTouchEnd={()=>{pinch.current=null;}}>
      <canvas ref={r.canvasRef} data-testid="reel-canvas" className="cinema-canvas"/>
      {!r.ready && !r.error && (
        <div data-testid="reel-loading" className="cinema-loading" aria-label="A carregar arquivo 3D" role="status">
          <div className="cinema-loader-ring" aria-hidden="true"/>
          <div className="cinema-loader-line"><div style={{width:Math.round(r.progress*100)+"%"}}/></div>
        </div>
      )}
      {r.ready && r.mode==="reel" && !r.playing && r.time<0.05 && (
        <button data-testid="stage-play-overlay" className="cinema-play" onClick={r.toggle}
          aria-label="Iniciar o filme Versão 3"><Play fill="currentColor" size={26}/></button>
      )}
      {r.mode==="explore" && <ExploreOverlay r={r}/>}
    </div>
  );
});
export default Stage;
