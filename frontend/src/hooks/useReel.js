import {useCallback,useEffect,useRef,useState} from "react";
import {ArchiveEngine} from "@/reel/archiveEngine";
import {loadArchiveAssets} from "@/reel/archiveAssets";

const SEEN_KEY="kutuzov-immersive-archive-entered-v2";
function readSeen(){
  try{return window.localStorage.getItem(SEEN_KEY)==="1";}
  catch{return false;}
}
function markSeen(){
  try{window.localStorage.setItem(SEEN_KEY,"1");}catch{/* storage is optional */}
}

/** Boot assets during the loading curtain; render the intro inside the gallery canvas. */
export function useReel(){
  const canvasRef=useRef(null);
  const engineRef=useRef(null);
  const skipRequested=useRef(false);
  const [returning]=useState(readSeen);
  const [assets,setAssets]=useState(null);
  const [ready,setReady]=useState(false);
  const [introComplete,setIntroComplete]=useState(false);
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
    if(!assets||!canvasRef.current)return;
    let alive=true,engine;
    try{
      engine=new ArchiveEngine(canvasRef.current,assets,{returning});
      engineRef.current=engine;
      engine.explore.onHover=it=>{if(alive)setHover(it);};
      engine.onIntroComplete=()=>{
        if(!alive)return;
        markSeen();
        setIntroComplete(true);
      };
      engine.start();
      setReady(true);
      if(skipRequested.current)engine.skipIntro();
    }catch(e){
      if(engine){engine.dispose();engineRef.current=null;}
      if(alive)setError(e?.message||"Não foi possível iniciar a exploração 3D.");
    }
    return ()=>{
      alive=false;
      if(engine){engine.dispose();engineRef.current=null;}
    };
  },[assets,returning]);

  const skipIntro=useCallback(()=>{
    skipRequested.current=true;
    engineRef.current?.skipIntro();
  },[]);

  const setFilter=useCallback(next=>{
    const engine=engineRef.current,ex=engine?.explore;
    if(!ex||!engine.introComplete)return;
    ex.filter=next;setFilterState(next);setSelected(null);
  },[]);

  const resetView=useCallback(()=>{
    const engine=engineRef.current,ex=engine?.explore;
    if(!ex||!engine.introComplete)return;
    ex.tYaw=.6;ex.tPitch=.72;ex.tDist=19;ex.idle=0;
    setFilterState("ALL");ex.filter="ALL";setSelected(null);
  },[]);

  const pointer=useCallback((type,x,y,extra)=>{
    const engine=engineRef.current;
    if(!engine)return;
    if(type==="move")engine.aperture.pointer(x,y);
    if(!engine.introComplete)return;
    const ex=engine.explore;
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

  return {canvasRef,ready,introComplete,skipIntro,returning,progress,error,
    hover,selected,setSelected,filter,setFilter,resetView,pointer,mode:"explore"};
}
