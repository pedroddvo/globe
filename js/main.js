import * as sphereShader from "./shader/sphereShader.js";
import * as starShader from "./shader/starShader.js";
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
const texture = new THREE.TextureLoader().load('texture/8k_earth_daymap.jpg');

const material = new THREE.MeshBasicMaterial({
  map: texture
});
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

const atmosphere = new THREE.Mesh(
  new THREE.SphereGeometry(5.02, 64, 64),
  new THREE.ShaderMaterial({
    transparent: true,
    vertexShader: sphereShader.vertex,
    fragmentShader: sphereShader.fragment,
  })
);
atmosphere.opacity = 0.2;

scene.add(atmosphere);

const star_vertices = [];
for (let i = 0; i < 10000; i++) {
    const x = THREE.MathUtils.randFloatSpread(2000);
    const y = THREE.MathUtils.randFloatSpread(2000);
    const z = THREE.MathUtils.randFloatSpread(2000);

    star_vertices.push(x,y,z);
}

const star_geometry = new THREE.BufferGeometry();
star_geometry.setAttribute('position', new THREE.Float32BufferAttribute(star_vertices, 3));

let star_uniforms = {
    delta: { value: 1.0 },
};

const star_material = new THREE.ShaderMaterial({ 
    uniforms: star_uniforms,
    vertexShader: starShader.vertex,
    fragmentShader: starShader.fragment,
});
const stars = new THREE.Points(star_geometry, star_material);
scene.add(stars);

camera.position.z = 10;

document.addEventListener('mousedown', onDocumentMouseDown, false);
let mouse = new THREE.Vector2();

function distance(a, b) {
  let dx = a.longitude - b.longitude;
  let dy = a.latitude  - b.latitude;
  return Math.sqrt(dx*dx + dy*dy)
}

function ltoxyz(r, lng, lat) {
  return {
    x: r * Math.cos(lat) * Math.cos(lng),
    y: r * Math.cos(lat) * Math.sin(lng),
    z: r * Math.sin(lat)
  };
}

function postJSON(url, data) {
    return fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
}

function queryCountry(country) {
    document.getElementById("title").textContent = country.country;

    postJSON("https://countriesnow.space/api/v0.1/countries/population", {
        "iso3": country.alpha3
    }).then(jdata => jdata.json().then(data => {
        let latest = data.data.populationCounts
                              .reduce((a, b) => (a.year < b.year) ? b : a, { year: 0 })
        document.getElementById("population-header").textContent = "Population";
        document.getElementById("population").textContent = latest.value;
    }))

    postJSON("https://countriesnow.space/api/v0.1/countries/flag/images", {
        "iso2": country.alpha2
    }).then(jdata => jdata.json().then(data => {
        let flag = document.getElementById("flag");
        flag.style.visibility = "visible";
        flag.src = data.data.flag;
    }))
}

function onDocumentMouseDown(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  let globe = raycaster.intersectObject(sphere);

  for (let i = 0; i < globe.length; i++) {
    let point = globe[i].point;
    let norm  = new THREE.Vector3(point.x, point.y, point.z);
    norm.normalize()

    // let p = new THREE.Mesh(
    //   new THREE.SphereGeometry(0.1, 64, 64),
    //   new THREE.MeshBasicMaterial({ color: 0xFF0000 })
    // );

    let latitude  = Math.asin(norm.y) * (180.0 / Math.PI);
    let longitude = Math.atan2(norm.z, norm.x) * (-180.0 / Math.PI);
    console.log({latitude, longitude});


    let lng_lat = { longitude, latitude }
    let closest =
        countries["ref_country_codes"]
        .reduce((a, b) => distance(a, lng_lat) < distance(b, lng_lat) ? a : b)

    let closest_xyz = ltoxyz(5.0, closest.longitude, closest.latitude);

    queryCountry(closest);
    // console.log(closest_xyz);
    // console.log(point);

    // p.translateX(closest_xyz.x);
    // p.translateY(closest_xyz.y);
    // p.translateZ(closest_xyz.z);

    // scene.add(p);
  }
}

function animate() {
  star_uniforms.delta.value += 0.5;

  // sphere.rotateY(0.005);

  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();
