import * as THREE from './three.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.SphereGeometry(5);
const material = new THREE.MeshBasicMaterial({color: 0xff0000});
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

camera.position.z = 10;

function animate() {
  // sphere.rotateY(0.01);

  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();
