// Aurora shader adapted from the React Bits component supplied by the user.
// Native WebGL2 integration: no React, OGL, modules or build step required.
(() => {
  const VERT =
    "#version 300 es\nin vec2 position;\nvoid main() {\n  gl_Position = vec4(position, 0.0, 1.0);\n}\n";
  const FRAG =
    "#version 300 es\nprecision highp float;\n\nuniform float uTime;\nuniform float uAmplitude;\nuniform vec3 uColorStops[3];\nuniform vec2 uResolution;\nuniform float uBlend;\nuniform float uLightMode;\n\nout vec4 fragColor;\n\nvec3 permute(vec3 x) {\n  return mod(((x * 34.0) + 1.0) * x, 289.0);\n}\n\nfloat snoise(vec2 v){\n  const vec4 C = vec4(\n      0.211324865405187, 0.366025403784439,\n      -0.577350269189626, 0.024390243902439\n  );\n  vec2 i  = floor(v + dot(v, C.yy));\n  vec2 x0 = v - i + dot(i, C.xx);\n  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);\n  vec4 x12 = x0.xyxy + C.xxzz;\n  x12.xy -= i1;\n  i = mod(i, 289.0);\n\n  vec3 p = permute(\n      permute(i.y + vec3(0.0, i1.y, 1.0))\n    + i.x + vec3(0.0, i1.x, 1.0)\n  );\n\n  vec3 m = max(\n      0.5 - vec3(\n          dot(x0, x0),\n          dot(x12.xy, x12.xy),\n          dot(x12.zw, x12.zw)\n      ), \n      0.0\n  );\n  m = m * m;\n  m = m * m;\n\n  vec3 x = 2.0 * fract(p * C.www) - 1.0;\n  vec3 h = abs(x) - 0.5;\n  vec3 ox = floor(x + 0.5);\n  vec3 a0 = x - ox;\n  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);\n\n  vec3 g;\n  g.x  = a0.x  * x0.x  + h.x  * x0.y;\n  g.yz = a0.yz * x12.xz + h.yz * x12.yw;\n  return 130.0 * dot(m, g);\n}\n\nstruct ColorStop {\n  vec3 color;\n  float position;\n};\n\n#define COLOR_RAMP(colors, factor, finalColor) {              \\\n  int index = 0;                                            \\\n  for (int i = 0; i < 2; i++) {                               \\\n     ColorStop currentColor = colors[i];                    \\\n     bool isInBetween = currentColor.position <= factor;    \\\n     index = int(mix(float(index), float(i), float(isInBetween))); \\\n  }                                                         \\\n  ColorStop currentColor = colors[index];                   \\\n  ColorStop nextColor = colors[index + 1];                  \\\n  float range = nextColor.position - currentColor.position; \\\n  float lerpFactor = (factor - currentColor.position) / range; \\\n  finalColor = mix(currentColor.color, nextColor.color, lerpFactor); \\\n}\n\nvoid main() {\n  vec2 uv = gl_FragCoord.xy / uResolution;\n  \n  ColorStop colors[3];\n  colors[0] = ColorStop(uColorStops[0], 0.0);\n  colors[1] = ColorStop(uColorStops[1], 0.5);\n  colors[2] = ColorStop(uColorStops[2], 1.0);\n  \n  vec3 rampColor;\n  COLOR_RAMP(colors, uv.x, rampColor);\n  \n  float height = snoise(vec2(uv.x * 2.0 + uTime * 0.1, uTime * 0.25)) * 0.5 * uAmplitude;\n  height = exp(height);\n  height = (uv.y * 2.0 - height + 0.2);\n  float intensity = 0.6 * height;\n  \n  float midPoint = 0.20;\n  float auroraAlpha = smoothstep(midPoint - uBlend * 0.5, midPoint + uBlend * 0.5, intensity);\n  \n  vec3 auroraColor = intensity * rampColor;\n  \n  if (uLightMode > 0.5) {\n    float energy = clamp(max(intensity, 0.0), 0.0, 1.0);\n    float coverage = clamp(auroraAlpha * (0.55 + 0.45 * energy), 0.0, 0.86);\n    vec3 chroma = pow(clamp(rampColor, 0.0, 1.0), vec3(1.2));\n    float chromaPeak = max(chroma.r, max(chroma.g, chroma.b));\n    chroma /= max(chromaPeak, 0.0001);\n    fragColor = vec4(mix(vec3(1.0), chroma, min(coverage * 1.08, 0.94)), 1.0);\n  } else {\n    fragColor = vec4(auroraColor * auroraAlpha, auroraAlpha);\n  }\n}\n";
  const container = document.querySelector(".aurora-container");
  if (!container) return;
  const canvas = container.querySelector("canvas");
  const button = document.querySelector(".aurora-toggle");
  // The aurora is a viewport-fixed theme layer on every page.
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  let gl,
    program,
    buffer,
    locations,
    frame = 0,
    elapsed = 4,
    last = 0;
  let paused = reduced.matches,
    visible = true,
    lost = false,
    ready = false;
  const palette = new Float32Array([
    0.21, 0.91, 0.69, 0.22, 0.65, 0.72, 0.45, 0.27, 0.72,
  ]);
  try {
    paused =
      reduced.matches || localStorage.getItem("menthol-motion") === "paused";
  } catch {}
  function label() {
    button.setAttribute("aria-pressed", String(paused));
    button.setAttribute("aria-label", paused ? "播放极光动画" : "暂停极光动画");
    button.innerHTML = `${paused ? "▷" : "Ⅱ"} <span>AURORA ${paused ? "OFF" : "ON"}</span>`;
  }
  function fallback() {
    ready = false;
    cancelAnimationFrame(frame);
    canvas.hidden = true;
    button.disabled = true;
    button.setAttribute("aria-label", "极光静态背景");
    button.innerHTML = "◌ <span>AURORA STATIC</span>";
  }
  function shader(type, source) {
    const s = gl.createShader(type);
    gl.shaderSource(s, source);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      const message = gl.getShaderInfoLog(s);
      gl.deleteShader(s);
      throw new Error(message);
    }
    return s;
  }
  function setup() {
    gl = canvas.getContext("webgl2", {
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      powerPreference: "low-power",
    });
    if (!gl) {
      fallback();
      return;
    }
    try {
      const vertex = shader(gl.VERTEX_SHADER, VERT),
        fragment = shader(gl.FRAGMENT_SHADER, FRAG);
      program = gl.createProgram();
      gl.attachShader(program, vertex);
      gl.attachShader(program, fragment);
      gl.linkProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS))
        throw new Error(gl.getProgramInfoLog(program));
      gl.useProgram(program);
      buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 3, -1, -1, 3]),
        gl.STATIC_DRAW,
      );
      const position = gl.getAttribLocation(program, "position");
      gl.enableVertexAttribArray(position);
      gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
      locations = {};
      for (const key of [
        "uTime",
        "uAmplitude",
        "uResolution",
        "uBlend",
        "uLightMode",
      ])
        locations[key] = gl.getUniformLocation(program, key);
      gl.uniform3fv(gl.getUniformLocation(program, "uColorStops[0]"), palette);
      gl.uniform1f(locations.uAmplitude, 1.05);
      gl.uniform1f(locations.uBlend, 0.65);
      gl.uniform1f(locations.uLightMode, 0);
      gl.clearColor(0, 0, 0, 0);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      ready = true;
      lost = false;
      canvas.hidden = false;
      button.disabled = false;
      resize();
      label();
      schedule();
    } catch (error) {
      console.warn("Aurora uses its static fallback:", error.message);
      fallback();
    }
  }
  function draw() {
    if (!ready || lost) return;
    gl.useProgram(program);
    gl.uniform1f(locations.uTime, elapsed);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
  function resize() {
    if (!ready || lost) return;
    const ratio = Math.min(devicePixelRatio || 1, 1.5);
    const width = Math.max(1, Math.round(container.clientWidth * ratio));
    const height = Math.max(1, Math.round(container.clientHeight * ratio));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
    gl.viewport(0, 0, width, height);
    gl.uniform2f(locations.uResolution, width, height);
    draw();
  }
  function tick(now) {
    if (paused || !visible || document.hidden || !ready || lost) {
      frame = 0;
      last = 0;
      return;
    }
    if (!last) last = now;
    const delta = now - last;
    if (delta >= 1000 / 30) {
      elapsed += Math.min(delta, 100) * 0.00045;
      last = now;
      draw();
    }
    frame = requestAnimationFrame(tick);
  }
  function schedule() {
    cancelAnimationFrame(frame);
    frame = 0;
    last = 0;
    if (!paused && visible && !document.hidden && ready && !lost)
      frame = requestAnimationFrame(tick);
  }
  button.addEventListener("click", () => {
    paused = !paused;
    try {
      localStorage.setItem("menthol-motion", paused ? "paused" : "playing");
    } catch {}
    label();
    schedule();
  });
  reduced.addEventListener("change", (event) => {
    paused = event.matches;
    label();
    schedule();
  });
  document.addEventListener("visibilitychange", schedule);
  new ResizeObserver(resize).observe(container);

  canvas.addEventListener("webglcontextlost", (event) => {
    event.preventDefault();
    lost = true;
    cancelAnimationFrame(frame);
  });
  canvas.addEventListener("webglcontextrestored", setup);
  label();
  setup();
})();
