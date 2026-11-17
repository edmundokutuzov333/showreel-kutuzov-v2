import * as THREE from "three";
import { C } from "./core";
import { Cloud } from "./cloud";
import { Explore } from "./explore";

/**
 * Standalone, single-pass WebGL archive. No film timeline, score,
 * post-processing targets or high-resolution film assets.
 */
export class ArchiveEngine {
  constructor(canvas, assets) {
    this.canvas=canvas;
    this.A=assets;
    this.renderer=new THREE.WebGLRenderer({
      canvas, alpha:false, antialias:false, powerPreference:"high-performance",
      preserveDrawingBuffer:false
    });
    this.renderer.outputColorSpace=THREE.LinearSRGBColorSpace;
    this.renderer.setPixelRatio(1);
    this.scene=new THREE.Scene();
    this.scene.background=new THREE.Color(C.bg);
    this.scene.fog=new THREE.Fog(C.bg,8,70);
    this.camera=new THREE.PerspectiveCamera(42,1,.1,300);
    this.cloud=new Cloud(assets.catalog,assets.atlases);
    this.scene.add(this.cloud.group);
    this.explore=new Explore(this);
    // The gallery comes into focus as the tunnel opens.
    this.explore.dist=30;
    this.explore.tDist=19;
    this.explore.pitch=.72;
    this.explore.yaw=.6;
    this.onHover=null;
    this.disposed=false;
    this.frameHandle=0;
    this.lastFrame=0;
    this.running=false;
    this.mobile=window.matchMedia("(pointer:coarse)").matches;
    this.reduced=window.matchMedia("(prefers-reduced-motion:reduce)").matches;
    this.resize=()=>{
      if(this.disposed)return;
      const bounds=this.canvas.getBoundingClientRect();
      const width=Math.max(1,bounds.width),height=Math.max(1,bounds.height);
      // Cap pixel work on 4K and phones without distorting the aspect ratio.
      const dpr=Math.min(window.devicePixelRatio||1,this.mobile?1.2:1.5);
      const ratio=Math.min(dpr,1600/width,960/height);
      const rw=Math.max(2,Math.round(width*ratio));
      const rh=Math.max(2,Math.round(height*ratio));
      this.renderer.setSize(rw,rh,false);
      this.camera.aspect=width/height;
      this.camera.updateProjectionMatrix();
    };
    this.observer=new ResizeObserver(this.resize);
    this.observer.observe(canvas);
    this.resize();
    this.onVisibility=()=>{
      if(!document.hidden && !this.disposed){this.lastFrame=0;this.start();}
      else this.stop();
    };
    document.addEventListener("visibilitychange",this.onVisibility);
  }

  start() {
    if(this.running||this.disposed||document.hidden)return;
    this.running=true;
    const budget=this.reduced?1000/30:this.mobile?1000/45:1000/60;
    const loop=(now)=>{
      if(!this.running||this.disposed)return;
      this.frameHandle=requestAnimationFrame(loop);
      if(now-this.lastFrame<budget-.5)return;
      const dt=Math.min(.05,Math.max(.001,(now-(this.lastFrame||now-16))/1000));
      this.lastFrame=now;
      this.explore.frame(dt);
      this.renderer.render(this.scene,this.camera);
    };
    this.frameHandle=requestAnimationFrame(loop);
  }
  stop(){this.running=false;cancelAnimationFrame(this.frameHandle);this.frameHandle=0;}
  dispose(){
    if(this.disposed)return;
    this.stop();this.disposed=true;
    this.observer.disconnect();
    document.removeEventListener("visibilitychange",this.onVisibility);
    this.cloud.meshes.forEach(m=>{m.geometry.dispose();m.material.dispose();});
    this.A.atlases.forEach(t=>t.dispose());
    this.renderer.dispose();
    this.renderer.forceContextLoss();
  }
}
