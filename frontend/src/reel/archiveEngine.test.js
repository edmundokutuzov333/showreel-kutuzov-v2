import {makePoses,galaxyPose,pose} from "./formations";
import * as THREE from "three";
import {FILTERS} from "./storyboard";

describe("Archive-only 3D presentation",()=>{
  it("builds a deterministic collection of 155 distinct gallery poses",()=>{
    const poses=makePoses(155,11);
    expect(poses).toHaveLength(155);
    expect(new Set(poses.map(p=>p.cell)).size).toBe(155);
    const out=pose();
    galaxyPose(poses[0],0,new THREE.Quaternion(),out,new THREE.Vector3());
    expect(out.p.length()).toBeGreaterThan(0);
    expect(Number.isFinite(out.s)).toBe(true);
  });
  it("retains the original six archive filters without a film timeline",()=>{
    expect(FILTERS).toEqual(["ALL","SOCIAL MEDIA","IMAGE MANIPULATION","DESIGN","CAMPAIGN","VIDEO"]);
  });
});
