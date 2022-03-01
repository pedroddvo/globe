export const vertex = `
varying vec3 vUv;
void main(void) {
  vUv = position;

  vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * modelViewPosition;
}
`;

export const fragment = `
uniform float time;
varying vec3 vUv;
void main(void) {
  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}
`;
