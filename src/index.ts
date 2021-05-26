import "./index.scss";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";
import * as noise from "./noise";

// Debug
const gui = new dat.GUI();

// Canvas
const canvas: HTMLCanvasElement = document.querySelector("canvas.webgl")!;

// Scene
const scene = new THREE.Scene();

// Objects
const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const planeGeometry = new THREE.PlaneGeometry(32, 32, 256, 256);
planeGeometry.rotateX(-Math.PI / 2);

let oldVertices = planeGeometry.getAttribute("position").array;

const options: noise.Options = {
  octaves: 3,
  amplitude: 1,
  frequency: 0.2,
  persistence: 0.1,
};
let newVertices = new Float32Array(oldVertices.length);
for (let i = 0; i < newVertices.length; i += 1) {
  if (i % 3 == 1)
    newVertices[i] = noise.fractalNoise3(
      oldVertices[i - 1],
      oldVertices[i],
      oldVertices[i + 1],
      noise.ridge3,
      options
    );
  else newVertices[i] = oldVertices[i];
}

planeGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(newVertices, 3)
);
planeGeometry.computeVertexNormals();

// Materials
const material = new THREE.MeshStandardMaterial();
material.metalness = 0.1;
material.roughness = 0.5;
material.color = new THREE.Color(0xffffff);

// Mesh
const sphere = new THREE.Mesh(sphereGeometry, material);
scene.add(sphere);
const plane = new THREE.Mesh(planeGeometry, material);
scene.add(plane);

// Lights
const pointLightColor = {
  color: 0x0000ff,
};

const pointLight = new THREE.PointLight(pointLightColor.color, 1);
pointLight.position.set(80, 8, 80);
scene.add(pointLight);

const pointLight2 = new THREE.PointLight("0xff0000", 1);
pointLight2.position.set(-80, 8, -80);
scene.add(pointLight2);

const pointLightGui = gui.addFolder("pointLight");
pointLightGui.add(pointLight.position, "x").min(-3).max(3).step(0.01);
pointLightGui.add(pointLight.position, "y").min(-3).max(3).step(0.01);
pointLightGui.add(pointLight.position, "z").min(-3).max(3).step(0.01);

pointLightGui.addColor(pointLightColor, "color").onChange(() => {
  pointLight.color.set(pointLightColor.color);
});

const pointLightHelper = new THREE.PointLightHelper(pointLight, 1);
scene.add(pointLightHelper);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 2;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */

const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update objects
  sphere.rotation.y = 0.5 * elapsedTime;

  // Update Orbital Controls
  // controls.update()

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
