import "./index.scss";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";

// Debug
const gui = new dat.GUI();

// Canvas
const canvas: HTMLCanvasElement = document.querySelector("canvas.webgl")!;

// Scene
const scene = new THREE.Scene();

// Objects
const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);

// Materials
const material = new THREE.MeshStandardMaterial();
material.metalness = 0.5;
material.roughness = 0.9;
material.color = new THREE.Color(0xffffff);

// Mesh
const sphere = new THREE.Mesh(sphereGeometry, material);
scene.add(sphere);

// Lights
const pointLightColor = {
  color: 0xffffff,
};

const pointLight = new THREE.PointLight(pointLightColor.color, 0.6);
pointLight.position.set(4, 4, 4);
scene.add(pointLight);

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
