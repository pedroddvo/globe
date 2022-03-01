import * as sphereShader from "./shader/sphereShader.js";
import * as THREE from './three.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const clock = new THREE.Clock();

const geometry = new THREE.SphereGeometry(5);
const material = new THREE.ShaderMaterial({
  uniforms: {
    time: { value: clock.getElapsedTime() }
  },

  vertexShader: sphereShader.vertex,
  fragmentShader: sphereShader.fragment,
});
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

camera.position.z = 10;

function animate() {
  sphere.material.uniforms.time.value = clock.getElapsedTime();
  sphere.rotateY(0.01);

  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();
