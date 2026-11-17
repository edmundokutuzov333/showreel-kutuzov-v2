import {useCallback,useEffect,useRef,useState} from "react";
import {ArchiveEngine} from "@/reel/archiveEngine";
import {loadArchiveAssets} from "@/reel/archiveAssets";

/** UI state stays independent from the WebGL frame loop. */
export function useReel(entered=false) {
  const canvasRef=useRef(null);
  const engineRef=useRef(null);
  const [assets,setAssets]=useState(null);
  const [ready,setReady]=useState(false);
  const [progress,setProgress]=useState(0);
  const [error,setError]=useState("");
  const [hover,setHover]=useState(null);
  const [selected,setSelected]=useState(null);
  const [filter,setFilterState]=useState("ALL");

  useEffect(()=>{
    let alive=true;
    loadArchiveAssets(p=>alive&&setProgress(p))
      .then(data=>alive&&setAssets(data))
      .catch(e=>alive&&setError(e?.message||"Falha ao abrir o arquivo."));
    return ()=>{alive=false;};
  },[]);

  useEffect(()=>{
    if(!entered||!assets||!canvasRef.current)return;
    let engine;
    try{
      engine=new ArchiveEngine(canvasRef.current,assets);
      engineRef.current=engine;
      engine.explore.onHover=(it)=>setHover(it);
      engine.start();
      setReady(true);
    }catch(e){setError(e?.message||"Não foi possível iniciar a exploração 3D.");}
    return ()=>{
      if(engine){engine.dispose();engineRef.current=null;}
    };
  },[entered,assets]);

  const setFilter=useCallback((next)=>{
    const ex=engineRef.current?.explore;
    if(!ex)return;
    ex.filter=next;setFilterState(next);setSelected(null);
  },[]);

  const resetView=useCallback(()=>{
    const ex=engineRef.current?.explore;
    if(!ex)return;
    ex.tYaw=.6;ex.tPitch=.72;ex.tDist=19;ex.idle=0;
    setFilterState("ALL");ex.filter="ALL";setSelected(null);
  },[]);

  const pointer=useCallback((type,x,y,extra)=>{
    const ex=engineRef.current?.explore;
    if(!ex)return;
    if(type==="move"){ex.pointer(x,y);ex.move(x,y);}
    else if(type==="down"){ex.pointer(x,y);ex.down(x,y);}
    else if(type==="up"){ex.pointer(x,y);const it=ex.up();if(it)setSelected(it);}
    else if(type==="leave"){ex.pointer(9,9);ex.up();}
    else if(type==="wheel")ex.wheel(extra);
    else if(type==="key"){
      ex.tYaw+=x;
      ex.tPitch=Math.max(-1.2,Math.min(1.35,ex.tPitch+y));
      ex.idle=0;
    }
  },[]);
  return {canvasRef,ready,progress,error,hover,selected,setSelected,filter,
    setFilter,resetView,pointer,mode:"explore"};
}
