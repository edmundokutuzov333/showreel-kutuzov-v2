import { useCallback, useEffect, useRef, useState } from "react";
import { ReelEngine } from "@/reel/engine";

export function useReel() {
  const canvasRef=useRef(null);
  const engineRef=useRef(null);
  const [ready,setReady]=useState(false);
  const [progress,setProgress]=useState(0);
  const [error,setError]=useState("");
  const [playing,setPlaying]=useState(false);
  const [time,setTime]=useState(0);
  const [mode,setModeState]=useState("reel");
  const [hover,setHover]=useState(null);
  const [selected,setSelected]=useState(null);
  const [filter,setFilterState]=useState("ALL");
  const [muted,setMuted]=useState(false);

  useEffect(()=>{
    const engine=new ReelEngine(canvasRef.current);
    engineRef.current=engine;
    let alive=true;
    let lastUi=0;
    engine.onTime=(next)=>{
      if(next-lastUi>.10 || next<lastUi || next>=60){
        lastUi=next; if(alive)setTime(next);
      }
    };
    engine.onEnd=()=>alive&&setPlaying(false);
    engine.load((p)=>alive&&setProgress(p))
      .then(()=>{
        if(!alive || !engine.explore)return;
        engine.explore.onHover=(it)=>alive&&setHover(it);
        setReady(true);
      })
      .catch((e)=>{if(alive)setError(e?.message||"Não foi possível abrir o arquivo 3D.");});
    return ()=>{alive=false;engine.dispose();engineRef.current=null;};
  },[]);

  const setMode=useCallback((next)=>{
    const engine=engineRef.current;
    if(!engine||!engine.explore||!["reel","explore"].includes(next))return;
    engine.setMode(next);
    setPlaying(false);setSelected(null);setHover(null);setModeState(next);
  },[]);

  const toggle=useCallback(async()=>{
    const engine=engineRef.current;
    if(!engine||!engine.explore)return;
    if(engine.playing){engine.pause();setPlaying(false);return;}
    try{
      await engine.play();
      setModeState("reel");setSelected(null);setPlaying(true);
    }catch(e){setError(e?.message||"Falha ao iniciar reprodução.");}
  },[]);

  const restart=useCallback(async()=>{
    const engine=engineRef.current;
    if(!engine||!engine.explore)return;
    engine.seek(0);
    try{await engine.play();setModeState("reel");setSelected(null);setPlaying(true);}
    catch(e){setError(e?.message||"Falha ao iniciar reprodução.");}
  },[]);

  const seek=useCallback((at)=>{
    const engine=engineRef.current;
    if(!engine||!engine.explore)return;
    if(engine.mode!=="reel"){engine.setMode("reel");setModeState("reel");}
    engine.seek(at);setTime(engine.t);
  },[]);

  const toggleMute=useCallback(()=>{
    const engine=engineRef.current;
    if(!engine)return;
    const next=!muted;
    engine.score.master.gain.value=next?0:.9;
    setMuted(next);
  },[muted]);

  const setFilter=useCallback((next)=>{
    const engine=engineRef.current;
    if(!engine?.explore)return;
    engine.explore.filter=next;
    setFilterState(next);
    setSelected(null);
  },[]);

  const pointer=useCallback((type,x,y,extra)=>{
    const engine=engineRef.current;
    if(!engine?.explore)return;
    if(engine.mode==="explore"){
      const ex=engine.explore;
      if(type==="move"){ex.pointer(x,y);ex.move(x,y);}
      else if(type==="down"){ex.pointer(x,y);ex.down(x,y);}
      else if(type==="up"){ex.pointer(x,y);const it=ex.up();if(it)setSelected(it);}
      else if(type==="leave"){ex.pointer(9,9);ex.up();}
      else if(type==="wheel")ex.wheel(extra);
      else if(type==="key"){ex.tYaw+=x;ex.tPitch=Math.max(-1.2,Math.min(1.35,ex.tPitch+y));ex.idle=0;}
    } else if(type==="move")engine.setParallax(x*2-1,-(y*2-1));
    else if(type==="leave")engine.setParallax(0,0);
  },[]);

  return {canvasRef,ready,progress,error,playing,time,duration:60,mode,setMode,
    hover,selected,setSelected,filter,setFilter,pointer,toggle,restart,seek,muted,toggleMute};
}
