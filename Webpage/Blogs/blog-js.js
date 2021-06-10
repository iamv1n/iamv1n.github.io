/**
 * Debug
 */
const gui = new dat.GUI({ closed: false, width: 340 });
const bigWavesFolder = gui.addFolder("Large Waves");
const smallWavesFolder = gui.addFolder("Small Waves");
const colorFolder = gui.addFolder("Colors");
const debugObject = {
  waveDepthColor: "#1e4d40",
  waveSurfaceColor: "#4d9aaa",
  fogNear: 1,
  fogFar: 3,
  fogColor: "#8e99a2"
};

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();
scene.fog = new THREE.Fog(
  debugObject.fogColor,
  debugObject.fogNear,
  debugObject.fogFar
);
scene.background = new THREE.Color(debugObject.fogColor);

/**
 * Object
 */
const waterGeometry = new THREE.PlaneGeometry(12, 12, 512, 512);

// Material
const waterMaterial = new THREE.ShaderMaterial({
  vertexShader: document.getElementById("vertexShader").textContent,
  fragmentShader: document.getElementById("fragmentShader").textContent,
  transparent: true,
  fog: true,
  uniforms: {
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2() },
    uBigWavesElevation: { value: 0.2 },
    uBigWavesFrequency: { value: new THREE.Vector2(4, 2) },
    uBigWaveSpeed: { value: 0.75 },
    // Small Waves
    uSmallWavesElevation: { value: 0.15 },
    uSmallWavesFrequency: { value: 3 },
    uSmallWavesSpeed: { value: 0.2 },
    uSmallWavesIterations: { value: 4 },
    // Color
    uDepthColor: { value: new THREE.Color(debugObject.waveDepthColor) },
    uSurfaceColor: { value: new THREE.Color(debugObject.waveSurfaceColor) },
    uColorOffset: { value: 0.08 },
    uColorMultiplier: { value: 5 },

    // Fog, contains fogColor, fogDensity, fogFar and fogNear
    ...THREE.UniformsLib["fog"]
  }
});

const water = new THREE.Mesh(waterGeometry, waterMaterial);
water.rotation.x = -Math.PI * 0.5;
scene.add(water);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
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
camera.position.set(1, 1, 1);
scene.add(camera);

// Controls
const controls = new THREE.OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Add GUI
 */
// Big Waves
bigWavesFolder
  .add(waterMaterial.uniforms.uBigWavesElevation, "value")
  .min(0)
  .max(1)
  .step(0.001)
  .name("Elevation");
bigWavesFolder
  .add(waterMaterial.uniforms.uBigWavesFrequency.value, "x")
  .min(0)
  .max(10)
  .step(0.001)
  .name("Frequency X");
bigWavesFolder
  .add(waterMaterial.uniforms.uBigWavesFrequency.value, "y")
  .min(0)
  .max(10)
  .step(0.001)
  .name("Frequency Y");
bigWavesFolder
  .add(waterMaterial.uniforms.uBigWaveSpeed, "value")
  .min(0.25)
  .max(5)
  .step(0.001)
  .name("Speed");

// Small Waves
smallWavesFolder
  .add(waterMaterial.uniforms.uSmallWavesElevation, "value")
  .min(0.0)
  .max(0.3)
  .step(0.001)
  .name("Elevation");
smallWavesFolder
  .add(waterMaterial.uniforms.uSmallWavesFrequency, "value")
  .min(0)
  .max(30)
  .step(0.001)
  .name("Frequency");
smallWavesFolder
  .add(waterMaterial.uniforms.uSmallWavesSpeed, "value")
  .min(0.0)
  .max(1)
  .step(0.001)
  .name("Speed");
smallWavesFolder
  .add(waterMaterial.uniforms.uSmallWavesIterations, "value")
  .min(0)
  .max(10)
  .step(1)
  .name("Iterations");

// Colors
colorFolder
  .add(waterMaterial.uniforms.uColorOffset, "value")
  .min(0)
  .max(0.15)
  .step(0.0001)
  .name("Color Offset");
colorFolder
  .add(waterMaterial.uniforms.uColorMultiplier, "value")
  .min(0.0)
  .max(10.0)
  .step(0.001)
  .name("Color multiplier");
colorFolder
  .addColor(debugObject, "waveDepthColor")
  .name("Wave depth color")
  .onChange(() => {
    waterMaterial.uniforms.uDepthColor.value.set(debugObject.waveDepthColor);
  });
colorFolder
  .addColor(debugObject, "waveSurfaceColor")
  .name("Wave surface color")
  .onChange(() => {
    waterMaterial.uniforms.uSurfaceColor.value.set(
      debugObject.waveSurfaceColor
    );
  });
colorFolder
  .addColor(debugObject, "fogColor")
  .name("Fog Color")
  .onChange(() => {
    waterMaterial.uniforms.fogColor.value.set(debugObject.fogColor);
    scene.background.set(debugObject.fogColor);
    scene.fog = new THREE.Fog(
      debugObject.fogColor,
      debugObject.fogNear,
      debugObject.fogFar
    );
  });

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Update time
  waterMaterial.uniforms.uTime.value = elapsedTime;

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
