"use client";

import {Component as ReactComponent,lazy,Suspense,useEffect,useRef,useState,type ReactNode} from "react";
import {DitherFlow,type DitherFlowPalette} from "@/components/ui/dither-flow";

export const PORTAL_DURATION_MS=2000;
const PALETTE:DitherFlowPalette=["#060a13","#2948b4","#8bbcf4","#edf7ff"];
const UnicornLayer=lazy(()=>import("@/components/ui/bloim-animation-background"));
class PortalLayerBoundary extends ReactComponent<{children:ReactNode},{failed:boolean}>{
  state={failed:false};
  static getDerivedStateFromError(){return {failed:true};}
  render(){return this.state.failed?null:this.props.children;}
}
type Props={onComplete:()=>void};
export default function PortalIntro({onComplete}:Props){
  const done=useRef(onComplete);
  const [enhanced]=useState(()=>{
    if(typeof window==="undefined")return false;
    const memory=(navigator as Navigator&{deviceMemory?:number}).deviceMemory;
    return window.innerWidth>=1180 &&
      (memory===undefined||memory>=6) &&
      !window.matchMedia("(prefers-reduced-motion:reduce)").matches;
  });
  useEffect(()=>{done.current=onComplete;},[onComplete]);
  useEffect(()=>{
    const timer=window.setTimeout(()=>done.current(),PORTAL_DURATION_MS);
    return ()=>window.clearTimeout(timer);
  },[]);
  return <div className="portal-intro" data-testid="archive-portal"
    role="img" aria-label="Uma passagem luminosa de dois segundos abre o arquivo 3D">
    <DitherFlow className="portal-dither" palette={PALETTE}
      durationMs={PORTAL_DURATION_MS} cell={2} speed={1.35}/>
    {enhanced&&<PortalLayerBoundary><Suspense fallback={null}>
      <UnicornLayer/>
    </Suspense></PortalLayerBoundary>}
    <div className="portal-core" aria-hidden="true"/>
    <div className="portal-iris portal-iris--one" aria-hidden="true"/>
    <div className="portal-iris portal-iris--two" aria-hidden="true"/>
    <div className="portal-iris portal-iris--three" aria-hidden="true"/>
    <div className="portal-lens" aria-hidden="true"/>
    <div className="portal-flash" aria-hidden="true"/>
  </div>;
}
