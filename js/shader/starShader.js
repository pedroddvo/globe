export const vertex = `
varying vec3 vUv;
varying vec3 vNormal;
void main(void) {
  vUv = position;

  vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * modelViewPosition;
  vNormal = normalize(normalMatrix * normal);
}
`;

export const fragment = `
varying vec3 vUv;
varying vec3 vNormal;

uniform float delta;

void main(void) {
    vec3 vN = normalize(vUv);
    vec3 blink = vec3(1.0, 1.0, 1.0) * sin(delta * 0.05 + vUv.x);
    gl_FragColor = vec4(blink, 1.0);
}
`;
