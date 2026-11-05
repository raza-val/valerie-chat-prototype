/**
 * Fragment shaders for the two mascot options kept for comparison (polished hexagon, soft cloud), run by Paper's
 * ShaderMount (it supplies u_time and u_resolution). Output is premultiplied, like Paper's own shaders.
 * Colours come in as uniforms from the brand tokens. u_level (voice loudness) and u_wobble (thinking)
 * come from the mascot rig every frame.
 */

const head = `#version 300 es
precision highp float;
uniform mediump vec2 u_resolution; // matches Paper's vertex shader
uniform float u_time;
uniform float u_level;
uniform float u_wobble;
out vec4 fragColor;
`

/** The soft option's cumulus: merged spheres over a flat base. */
const cloud = `
float smin(float a, float b, float k) { float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0); return mix(b, a, h) - k * h * (1.0 - h); }
float sph(vec3 p, vec3 c, float r) { return length(p - c) - r; }
float map(vec3 p) {
  float t = u_time;
  float b = 0.010 + 0.022 * u_wobble;
  float v = 0.025 * u_level;
  float d = sph(p, vec3(0.0, 0.07, 0.0), 0.40 + b * sin(t * 1.1) + v);
  d = smin(d, sph(p, vec3(-0.41, -0.08, 0.04), 0.28 + b * sin(t * 1.3 + 1.0) + v), 0.09);
  d = smin(d, sph(p, vec3(0.42, -0.07, 0.02), 0.30 + b * sin(t * 1.2 + 2.0) + v), 0.09);
  d = smin(d, sph(p, vec3(-0.20, 0.31, -0.03), 0.27 + b * sin(t * 1.4 + 3.0) + v), 0.07);
  d = smin(d, sph(p, vec3(0.21, 0.28, -0.07), 0.25 + b * sin(t * 1.0 + 4.0) + v), 0.07);
  vec3 q = p - vec3(0.0, -0.19, 0.0);
  d = smin(d, length(vec3(max(abs(q.x) - 0.42, 0.0), q.y, q.z)) - 0.21, 0.1);
  return d;
}
vec3 nrm(vec3 p) {
  vec2 e = vec2(0.0015, 0.0);
  return normalize(vec3(map(p + e.xyy) - map(p - e.xyy), map(p + e.yxy) - map(p - e.yxy), map(p + e.yyx) - map(p - e.yyx)));
}
// Orthographic march straight in; returns coverage (anti-aliased edge) and the hit point.
float march(vec2 uv, float zoom, float s, out vec3 p) {
  vec3 ro = vec3(uv * zoom, 2.0);
  float t = 0.0, dmin = 1e9;
  bool hit = false;
  for (int i = 0; i < 72; i++) {
    float d = map(ro + vec3(0.0, 0.0, -t));
    dmin = min(dmin, d);
    if (d < 0.0012) { hit = true; break; }
    t += d;
    if (t > 4.0) break;
  }
  p = ro + vec3(0.0, 0.0, -t);
  return hit ? 1.0 : 1.0 - smoothstep(0.0, zoom / s * 1.4, dmin);
}
`

/**
 * A photo studio for the polished hexagon, turning slowly: a pale sky with a cool zenith, a low horizon (so the face reflects
 * sky, not the dark band), a graded floor, two softboxes and a floor bounce.
 */
const studio = `
uniform vec4 u_sky;
uniform vec4 u_zenith;
uniform vec4 u_floor;
uniform vec4 u_light;
vec3 env(vec3 r) {
  float a = u_time * (0.22 + 0.5 * u_wobble);
  float c = cos(a), s = sin(a);
  r.xz = mat2(c, -s, s, c) * r.xz;
  float h = -0.22;
  vec3 sky = mix(u_sky.rgb, u_zenith.rgb, smoothstep(0.1, 0.95, r.y));
  vec3 flo = mix(u_floor.rgb * 0.55, u_floor.rgb, smoothstep(-1.0, h, r.y));
  vec3 col = mix(flo, sky, smoothstep(h - 0.06, h + 0.12, r.y));
  col = mix(col, u_floor.rgb * 0.4, exp(-(r.y - h) * (r.y - h) * 70.0) * 0.7);
  col += u_light.rgb * 1.2 * smoothstep(0.88, 0.97, dot(r, normalize(vec3(-0.55, 0.62, 0.55))));
  col += u_light.rgb * 0.7 * smoothstep(0.91, 0.98, dot(r, normalize(vec3(0.65, 0.25, 0.7))));
  col += u_light.rgb * 0.3 * smoothstep(0.80, 0.99, dot(r, normalize(vec3(0.0, -0.6, 0.8))));
  return col;
}
`

/**
 * The hexagon as a chrome pebble: a dome over a perfectly smooth hexagonal outline (r = R / (1 − 0.07·cos 6θ),
 * point up). Chrome shows every kink in a surface, so the outline has none. Reflects the studio.
 */
export const hexChromeShader = `${head}
${studio}
float edgeAt(float a) {
  float t = u_time;
  float w = (0.005 + 0.016 * u_wobble + 0.018 * u_level) * (sin(3.0 * a + t * 0.9) * 0.55 + sin(5.0 * a - t * 1.3) * 0.3 + sin(2.0 * a + t * 0.55) * 0.45);
  return (0.352 + w + 0.01 * u_level) / (1.0 - 0.07 * cos(6.0 * (a - 1.5707963)));
}
float height(vec2 p) {
  float k = clamp(length(p) / edgeAt(atan(p.y, p.x)), 0.0, 1.0);
  return 0.22 * sqrt(1.0 - k * k);
}
void main() {
  float s = min(u_resolution.x, u_resolution.y);
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution) / s;
  float d = length(uv) - edgeAt(atan(uv.y, uv.x));
  float cover = 1.0 - smoothstep(-1.2 / s, 1.2 / s, d);
  if (cover <= 0.0) { fragColor = vec4(0.0); return; }
  float e = 1.5 / s;
  vec2 g = vec2(height(uv + vec2(e, 0.0)) - height(uv - vec2(e, 0.0)), height(uv + vec2(0.0, e)) - height(uv - vec2(0.0, e))) / (2.0 * e);
  vec3 n = normalize(vec3(-g, 1.0));
  float rim = smoothstep(-0.03, 0.0, d);
  n = normalize(mix(n, vec3(normalize(uv) * 0.98, 0.2), rim));
  vec3 col = env(reflect(vec3(0.0, 0.0, -1.0), n));
  fragColor = vec4(col * cover, cover);
}
`

/** The soft 3D cumulus: lit from the top left, cool shadows in its creases. */
export const cloudShader = `${head}
uniform vec4 u_light;
uniform vec4 u_shade;
uniform vec4 u_deep;
${cloud}
void main() {
  float s = min(u_resolution.x, u_resolution.y);
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution) / s;
  vec3 p;
  float cover = march(uv, 1.5, s, p);
  if (cover <= 0.0) { fragColor = vec4(0.0); return; }
  vec3 n = nrm(p);
  vec3 L = normalize(vec3(-0.45, 0.75, 0.6));
  float dif = clamp(dot(n, L) * 0.55 + 0.45, 0.0, 1.0);
  float ao = 0.0, sc = 1.0;
  for (int i = 1; i <= 5; i++) { float h = 0.03 * float(i); ao += (h - map(p + n * h)) * sc; sc *= 0.6; }
  ao = clamp(1.0 - 2.6 * ao, 0.0, 1.0);
  vec3 col = mix(u_shade.rgb, u_light.rgb, dif);
  col = mix(u_deep.rgb, col, ao);
  float rim = pow(1.0 - clamp(n.z, 0.0, 1.0), 2.5);
  col += u_light.rgb * rim * 0.22 * (n.y * 0.5 + 0.5);
  vec3 H = normalize(L + vec3(0.0, 0.0, 1.0));
  col += 0.1 * pow(clamp(dot(n, H), 0.0, 1.0), 28.0);
  fragColor = vec4(col * cover, cover);
}
`
