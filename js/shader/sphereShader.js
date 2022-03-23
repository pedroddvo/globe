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

void main(void) {
  float intensity = 1.05 - dot(vNormal, vec3(0.0, 0.0, 1.0));
  vec3 atmosphere = vec3(1.0, 1.0, 1.0) * pow(intensity * 1.5, 3.0);
  gl_FragColor = vec4(vec3(0.0, 1.2, 2.0) * atmosphere, 0.5);
}
`;
