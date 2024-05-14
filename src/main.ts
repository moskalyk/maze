import {
  Mesh,
  MeshBasicMaterial,
  PCFSoftShadowMap,
  SphereGeometry,
  WebGLRenderer,
} from "three";
import { PerspectiveCamera } from "three";
import { Scene } from "three";
import { Object3D } from "three";
import type {} from "vite";
import { DungeonGame } from "./DungeonGame";
import { initResizeHandler } from "./initResizeHandler";

// Create a scene
const scene = new Scene();

// Create a camera
const camera = new PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);

scene.add(camera);
camera.position.set(0, 0, 5);
camera.frustumCulled;

const renderer = new WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = PCFSoftShadowMap;

renderer.autoClear = true;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

function rafRender() {
  requestAnimationFrame(rafRender);
  renderer.render(scene, camera);
}
rafRender();

let simulate: ((dt: number) => void) | undefined;
let lastNow = performance.now();
function rafSimulate() {
  requestAnimationFrame(rafSimulate);
  const now = performance.now();
  if (simulate) {
    simulate((now - lastNow) * 0.001);
  }
  lastNow = now;
}
rafSimulate();
initResizeHandler(camera, renderer);

const gamePivot = new Object3D();

const t = new Mesh(
  new SphereGeometry(1),
  new MeshBasicMaterial({ color: 0xff0000 }),
);
scene.add(t);
scene.add(gamePivot);

if (import.meta.hot) {
  import.meta.hot.accept("./DungeonGame", (mod) => {
    while (gamePivot.children.length > 0) {
      gamePivot.remove(gamePivot.children[0]);
    }
    game.cleanup();
    game = new mod.DungeonGame(gamePivot, camera);
    simulate = game.simulate;
  });
}
let game = new DungeonGame(gamePivot, camera);
simulate = game.simulate;
