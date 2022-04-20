import * as sphereShader from "./shader/sphereShader.js";
import * as THREE from './three.js';
import { OrbitControls } from './OrbitControls.js';
import { countries } from './countries.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

const raycaster = new THREE.Raycaster();

const clock = new THREE.Clock();

const geometry = new THREE.SphereGeometry(5, 64, 64);
const texture = new THREE.TextureLoader().load('texture/2k_earth_daymap.jpg');

const material = new THREE.MeshBasicMaterial({
  map: texture
});
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

const atmosphere = new THREE.Mesh(
  new THREE.SphereGeometry(5.1, 64, 64),
  new THREE.ShaderMaterial({
    transparent: true,
    vertexShader: sphereShader.vertex,
    fragmentShader: sphereShader.fragment,
  })
);
atmosphere.opacity = 0.2;

scene.add(atmosphere);

camera.position.z = 10;

document.addEventListener('mousedown', onDocumentMouseDown, false);
let mouse = new THREE.Vector2();

function onDocumentMouseDown(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  let globe = raycaster.intersectObject(sphere);

  for (let i = 0; i < globe.length; i++) {
    let point = globe[i].point;
    let norm  = point.normalize();
    let p = new THREE.Mesh(
      new THREE.SphereGeometry(0.1, 64, 64),
      new THREE.MeshBasicMaterial({ color: 0xFF0000 })
    );

    let latitude  = norm.y * 90.0;
    let longitude = Math.atan2(point.z, point.x) * (180.0 / Math.PI);
    console.log({latitude, longitude});


    let nc = countries["ref_country_codes"]
        .map(c => ({ "name": c.country, "lng": longitude - c.longitude, "lat": latitude - c.latitude }))
        .reduce(
          (a, b) => (a.lng < b.lng) && (a.lat < b.lat) ? a : b,
          { "name": "null", "lng": Infinity, "lat": Infinity }
        );

    console.log(nc);

    // p.translateX(point.x);
    // p.translateY(point.y);
    // p.translateZ(point.z);

    // scene.add(p);
  }
}

function animate() {
  // sphere.rotateY(0.005);

  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();
