import { useEffect, useRef } from 'react';
import type * as Three from 'three';

type PetalRig = {
  group: Three.Group;
  material: Three.MeshStandardMaterial;
  layer: 'outer' | 'middle' | 'inner';
  angle: number;
  delay: number;
  closedTilt: number;
  openTilt: number;
  closedScale: number;
  openScale: number;
};

type GardenRig = {
  group: Three.Group;
  materials: Three.Material[];
  offset: number;
};

type BudRig = {
  group: Three.Group;
  materials: Three.MeshStandardMaterial[];
};

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const lerp = (from: number, to: number, progress: number) => from + (to - from) * progress;
const smoothstep = (edge0: number, edge1: number, value: number) => {
  const x = clamp01((value - edge0) / (edge1 - edge0));
  return x * x * (3 - 2 * x);
};

function createPetalGeometry(three: typeof Three, width: number, height: number) {
  const shape = new three.Shape();
  shape.moveTo(0, 0);
  shape.bezierCurveTo(width * 0.58, height * 0.16, width * 0.52, height * 0.72, 0, height);
  shape.bezierCurveTo(-width * 0.52, height * 0.72, -width * 0.58, height * 0.16, 0, 0);

  const geometry = new three.ShapeGeometry(shape, 32);
  geometry.computeVertexNormals();
  return geometry;
}

function createLeafGeometry(three: typeof Three, width: number, height: number) {
  const shape = new three.Shape();
  shape.moveTo(0, 0);
  shape.bezierCurveTo(width, height * 0.22, width * 0.75, height * 0.9, 0, height);
  shape.bezierCurveTo(-width * 0.2, height * 0.55, -width * 0.18, height * 0.15, 0, 0);

  return new three.ShapeGeometry(shape, 20);
}

function makePetalLayer(
  three: typeof Three,
  flower: Three.Group,
  rigs: PetalRig[],
  count: number,
  layer: PetalRig['layer'],
  radius: number,
  width: number,
  height: number,
  color: string,
  emissive: string,
  z: number,
) {
  const geometry = createPetalGeometry(three, width, height);

  Array.from({ length: count }, (_, index) => {
    const angle = (Math.PI * 2 * index) / count;
    const group = new three.Group();
    const material = new three.MeshStandardMaterial({
      color,
      emissive,
      emissiveIntensity: 0.06,
      roughness: 0.58,
      metalness: 0.02,
      side: three.DoubleSide,
      transparent: true,
      opacity: 0.98,
    });

    const petal = new three.Mesh(geometry, material);
    petal.position.y = radius;
    petal.position.z = z;
    petal.rotation.z = Math.sin(index * 2.1) * 0.035;
    group.add(petal);
    group.rotation.z = angle;
    flower.add(group);

    rigs.push({
      group,
      material,
      layer,
      angle,
      delay: index / count,
      closedTilt: layer === 'outer' ? 1.32 : layer === 'middle' ? 1.18 : 1.02,
      openTilt: layer === 'outer' ? 0.08 : layer === 'middle' ? -0.02 : -0.1,
      closedScale: layer === 'outer' ? 0.46 : layer === 'middle' ? 0.52 : 0.58,
      openScale: layer === 'outer' ? 1 : layer === 'middle' ? 0.92 : 0.82,
    });
  });
}

function createGardenFlower(three: typeof Three, color: string, x: number, y: number, z: number, scale: number): GardenRig {
  const group = new three.Group();
  const materials: Three.Material[] = [];
  const petalGeometry = createPetalGeometry(three, 0.18, 0.36);
  const centerGeometry = new three.SphereGeometry(0.08, 18, 12);

  for (let index = 0; index < 8; index += 1) {
    const material = new three.MeshStandardMaterial({
      color,
      emissive: color,
      emissiveIntensity: 0.08,
      roughness: 0.62,
      side: three.DoubleSide,
      transparent: true,
      opacity: 0,
    });
    const petal = new three.Mesh(petalGeometry, material);
    petal.position.y = 0.1;
    petal.rotation.z = (Math.PI * 2 * index) / 8;
    petal.rotation.x = -0.18;
    materials.push(material);
    group.add(petal);
  }

  const centerMaterial = new three.MeshStandardMaterial({
    color: '#ffd02f',
    emissive: '#ffb21f',
    emissiveIntensity: 0.4,
    roughness: 0.5,
    transparent: true,
    opacity: 0,
  });
  const center = new three.Mesh(centerGeometry, centerMaterial);
  center.position.z = 0.05;
  materials.push(centerMaterial);
  group.add(center);

  group.position.set(x, y, z);
  group.scale.setScalar(0.01);

  return { group, materials, offset: Math.abs(x) * 0.05 + Math.abs(z) * 0.04 + scale * 0.08 };
}

export default function ThreeBloomScene() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let disposed = false;
    let cleanupScroll: (() => void) | undefined;
    let frame = 0;
    let progress = 0;
    let targetProgress = 0;

    Promise.all([
      import('three'),
      import('gsap'),
      import('gsap/ScrollTrigger'),
    ]).then(([three, gsapModule, scrollTriggerModule]) => {
      if (disposed) return;

      const gsap = gsapModule.default;
      const ScrollTrigger = scrollTriggerModule.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);

      const scene = new three.Scene();
      const camera = new three.PerspectiveCamera(38, 1, 0.1, 100);
      camera.position.set(0, 0.58, 7.25);

      const renderer = new three.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
      renderer.setClearColor(0x000000, 0);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.65));
      renderer.outputColorSpace = three.SRGBColorSpace;
      mount.appendChild(renderer.domElement);

      const ambient = new three.HemisphereLight('#fff3f8', '#7db66e', 1.8);
      const keyLight = new three.DirectionalLight('#fff0c8', 2.2);
      keyLight.position.set(4, 5, 5);
      const pinkLight = new three.PointLight('#ff4fa3', 1.4, 8);
      pinkLight.position.set(-2.6, 1.4, 2.8);
      scene.add(ambient, keyLight, pinkLight);

      const flower = new three.Group();
      flower.position.set(0.2, -0.92, 0);
      scene.add(flower);

      const petalRigs: PetalRig[] = [];
      makePetalLayer(three, flower, petalRigs, 12, 'outer', 0.18, 0.62, 1.72, '#ff4fa3', '#f21d8d', -0.04);
      makePetalLayer(three, flower, petalRigs, 10, 'middle', 0.12, 0.48, 1.36, '#ff86bc', '#ff4fa3', 0.1);
      makePetalLayer(three, flower, petalRigs, 8, 'inner', 0.08, 0.34, 1.02, '#ffc2dc', '#ff7ab8', 0.24);

      const budGeometry = createPetalGeometry(three, 0.34, 1.3);
      const bud: BudRig = { group: new three.Group(), materials: [] };
      bud.group.position.set(0, 0, 0.08);
      Array.from({ length: 10 }, (_, index) => {
        const angle = (Math.PI * 2 * index) / 10;
        const material = new three.MeshStandardMaterial({
          color: index % 2 === 0 ? '#f43691' : '#ff5ba6',
          emissive: '#b60f65',
          emissiveIntensity: 0.08,
          roughness: 0.54,
          side: three.DoubleSide,
          transparent: true,
          opacity: 1,
        });
        const petal = new three.Mesh(budGeometry, material);
        petal.position.y = -0.12;
        petal.position.z = 0.15;
        const petalPivot = new three.Group();
        petalPivot.rotation.y = angle;
        petalPivot.rotation.x = 0.5 + Math.sin(index) * 0.06;
        petalPivot.rotation.z = Math.sin(index * 1.7) * 0.06;
        petalPivot.add(petal);
        bud.group.add(petalPivot);
        bud.materials.push(material);
      });
      flower.add(bud.group);

      const centerMaterial = new three.MeshStandardMaterial({
        color: '#ffd02f',
        emissive: '#ffb21f',
        emissiveIntensity: 0.2,
        roughness: 0.42,
      });
      const center = new three.Mesh(new three.SphereGeometry(0.34, 42, 24), centerMaterial);
      center.position.z = 0.42;
      center.scale.setScalar(0.1);
      flower.add(center);

      const stemMaterial = new three.MeshStandardMaterial({ color: '#2f8f5b', roughness: 0.6 });
      const stem = new three.Mesh(new three.CylinderGeometry(0.045, 0.065, 2.65, 20), stemMaterial);
      stem.position.y = -1.32;
      stem.position.z = -0.38;
      flower.add(stem);

      const leafGeometry = createLeafGeometry(three, 0.55, 1);
      const leafMaterial = new three.MeshStandardMaterial({
        color: '#56a75e',
        emissive: '#236c47',
        emissiveIntensity: 0.08,
        roughness: 0.66,
        side: three.DoubleSide,
      });

      const leaves = [
        { x: -0.06, y: -1.35, z: -0.32, r: 2.25, s: 0.9 },
        { x: 0.08, y: -1.58, z: -0.34, r: -0.92, s: 0.78 },
      ].map((leaf) => {
        const mesh = new three.Mesh(leafGeometry, leafMaterial);
        mesh.position.set(leaf.x, leaf.y, leaf.z);
        mesh.rotation.set(0.2, 0.15, leaf.r);
        mesh.scale.setScalar(leaf.s);
        flower.add(mesh);
        return mesh;
      });

      const sunMaterial = new three.MeshBasicMaterial({
        color: '#fff2a6',
        transparent: true,
        opacity: 0,
        depthWrite: false,
      });
      const sun = new three.Mesh(new three.CircleGeometry(1.25, 64), sunMaterial);
      sun.position.set(2.62, 2.08, -2.4);
      scene.add(sun);

      const sunFace = new three.Group();
      sunFace.position.copy(sun.position);
      sunFace.position.z += 0.04;
      scene.add(sunFace);

      const faceMaterial = new three.MeshBasicMaterial({
        color: '#9b5d16',
        transparent: true,
        opacity: 0,
        depthWrite: false,
      });
      const eyeGeometry = new three.CircleGeometry(0.055, 18);
      const leftEye = new three.Mesh(eyeGeometry, faceMaterial);
      leftEye.position.set(-0.34, 0.24, 0);
      const rightEye = new three.Mesh(eyeGeometry, faceMaterial);
      rightEye.position.set(0.34, 0.24, 0);
      sunFace.add(leftEye, rightEye);

      const smileCurve = new three.QuadraticBezierCurve3(
        new three.Vector3(-0.38, -0.18, 0),
        new three.Vector3(0, -0.46, 0),
        new three.Vector3(0.38, -0.18, 0),
      );
      const smileGeometry = new three.TubeGeometry(smileCurve, 24, 0.018, 8, false);
      const smile = new three.Mesh(smileGeometry, faceMaterial);
      sunFace.add(smile);

      const sunGlowMaterial = new three.MeshBasicMaterial({
        color: '#ffd36e',
        transparent: true,
        opacity: 0,
        depthWrite: false,
      });
      const sunGlow = new three.Mesh(new three.CircleGeometry(3.05, 64), sunGlowMaterial);
      sunGlow.position.copy(sun.position);
      sunGlow.position.z -= 0.08;
      scene.add(sunGlow);

      const garden = new three.Group();
      garden.position.set(0, -2.25, -0.8);
      scene.add(garden);
      const gardenColors = ['#ff4fa3', '#ff8f70', '#f43fb7', '#ffbc6f', '#b65cff'];
      const gardenRigs = Array.from({ length: 18 }, (_, index) => {
        const x = -3.4 + (index % 6) * 1.28 + ((index * 17) % 10) * 0.018;
        const y = ((index % 3) - 1) * 0.08;
        const z = -0.3 - Math.floor(index / 6) * 0.62;
        const scale = 0.72 + (index % 5) * 0.1;
        const rig = createGardenFlower(three, gardenColors[index % gardenColors.length], x, y, z, scale);
        rig.group.scale.setScalar(0.01);
        garden.add(rig.group);
        return rig;
      });

      const particleGeometry = new three.BufferGeometry();
      const particleCount = 90;
      const particlePositions = new Float32Array(particleCount * 3);
      for (let index = 0; index < particleCount; index += 1) {
        particlePositions[index * 3] = -4 + ((index * 37) % 80) / 10;
        particlePositions[index * 3 + 1] = -1.2 + ((index * 19) % 50) / 10;
        particlePositions[index * 3 + 2] = -1.8 + ((index * 23) % 42) / 10;
      }
      particleGeometry.setAttribute('position', new three.BufferAttribute(particlePositions, 3));
      const particleMaterial = new three.PointsMaterial({
        color: '#ff7ab8',
        size: 0.045,
        transparent: true,
        opacity: 0,
        depthWrite: false,
      });
      const particles = new three.Points(particleGeometry, particleMaterial);
      scene.add(particles);

      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const trigger = ScrollTrigger.create({
        trigger: '.vera-story',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.7,
        onUpdate: (self) => {
          targetProgress = self.progress;
        },
      });
      cleanupScroll = () => trigger.kill();
      if (reduceMotion) targetProgress = 1;

      const resize = () => {
        const { width, height } = mount.getBoundingClientRect();
        const safeWidth = Math.max(1, width);
        const safeHeight = Math.max(1, height);
        renderer.setSize(safeWidth, safeHeight, false);
        camera.aspect = safeWidth / safeHeight;
        camera.updateProjectionMatrix();
      };
      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(mount);
      resize();

      const render = () => {
        if (disposed) return;

        progress += (targetProgress - progress) * (reduceMotion ? 1 : 0.085);
        const sprout = smoothstep(0.02, 0.16, progress);
        const bloom = smoothstep(0.18, 0.74, progress);
        const glow = smoothstep(0.58, 0.86, progress);
        const gardenBloom = smoothstep(0.72, 1, progress);

        flower.scale.setScalar(lerp(0.64, 1.26, smoothstep(0, 0.7, progress)));
        flower.rotation.x = lerp(0.55, -0.18, bloom);
        flower.rotation.y = Math.sin(progress * Math.PI * 1.4) * 0.18;
        flower.position.y = lerp(-1.35, -0.72, sprout);

        petalRigs.forEach((rig) => {
          const layerStart = rig.layer === 'outer' ? 0.16 : rig.layer === 'middle' ? 0.34 : 0.5;
          const open = smoothstep(layerStart + rig.delay * 0.06, layerStart + 0.32 + rig.delay * 0.06, progress);
          const breathe = Math.sin(frame * 0.018 + rig.angle * 2) * 0.018;
          rig.group.rotation.x = lerp(rig.closedTilt, rig.openTilt + breathe, open);
          rig.group.rotation.y = Math.sin(rig.angle * 3 + progress * 2) * 0.05 * open;
          rig.group.scale.setScalar(lerp(0.04, rig.openScale, open));
          rig.material.emissiveIntensity = lerp(0.02, 0.16, glow);
          rig.material.opacity = lerp(0, 0.98, open);
        });

        const budFade = 1 - smoothstep(0.12, 0.38, progress);
        const budGrow = smoothstep(0, 0.2, progress);
        bud.group.scale.setScalar(lerp(0.85, 1.05, budGrow));
        bud.group.rotation.y = Math.sin(frame * 0.01) * 0.12 + progress * 0.4;
        bud.group.rotation.x = lerp(0.02, -0.35, bloom);
        bud.materials.forEach((material) => {
          material.opacity = budFade;
          material.emissiveIntensity = lerp(0.08, 0.22, smoothstep(0, 0.22, progress));
        });
        bud.group.visible = budFade > 0.02;

        center.scale.setScalar(lerp(0.08, 1, smoothstep(0.54, 0.84, progress)));
        centerMaterial.emissiveIntensity = lerp(0.2, 1.4, glow);
        leaves.forEach((leaf, index) => {
          leaf.rotation.y = lerp(index === 0 ? 0.75 : -0.6, index === 0 ? 0.1 : -0.16, bloom);
        });

        sunMaterial.opacity = lerp(0, 0.9, smoothstep(0.78, 0.98, progress));
        sunGlowMaterial.opacity = lerp(0, 0.22, smoothstep(0.76, 1, progress));
        const sunReveal = smoothstep(0.78, 1, progress);
        const smileReveal = smoothstep(0.9, 1, progress);
        sun.scale.setScalar(lerp(0.72, 1.24, sunReveal));
        sunFace.scale.setScalar(sun.scale.x);
        faceMaterial.opacity = lerp(0, 0.68, smileReveal);
        sunFace.rotation.z = Math.sin(frame * 0.012) * 0.025;
        sunGlow.scale.setScalar(lerp(0.58, 1.6, smoothstep(0.78, 1, progress)));

        gardenRigs.forEach((rig) => {
          const open = smoothstep(0.7 + rig.offset * 0.12, 0.98, progress);
          rig.group.scale.setScalar(lerp(0.01, 0.92 + rig.offset, open));
          rig.group.rotation.z = Math.sin(frame * 0.012 + rig.offset * 8) * 0.08;
          rig.materials.forEach((material) => {
            material.opacity = lerp(0, 0.92, open);
          });
        });

        particles.rotation.z += 0.0008;
        particles.position.y = Math.sin(frame * 0.008) * 0.12;
        particleMaterial.opacity = lerp(0, 0.42, smoothstep(0.36, 0.92, progress));

        renderer.render(scene, camera);
        frame = requestAnimationFrame(render);
      };

      render();

      cleanupScroll = () => {
        trigger.kill();
        resizeObserver.disconnect();
        cancelAnimationFrame(frame);
        renderer.dispose();
        petalRigs.forEach((rig) => {
          rig.material.dispose();
        });
        center.geometry.dispose();
        centerMaterial.dispose();
        stem.geometry.dispose();
        stemMaterial.dispose();
        leafGeometry.dispose();
        leafMaterial.dispose();
        sun.geometry.dispose();
        sunMaterial.dispose();
        eyeGeometry.dispose();
        smileGeometry.dispose();
        faceMaterial.dispose();
        sunGlow.geometry.dispose();
        sunGlowMaterial.dispose();
        particleGeometry.dispose();
        particleMaterial.dispose();
        renderer.domElement.remove();
      };
    });

    return () => {
      disposed = true;
      cleanupScroll?.();
    };
  }, []);

  return <div className="three-bloom-scene" ref={mountRef} aria-hidden="true" />;
}
