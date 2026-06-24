import { useEffect, useRef, type CSSProperties } from 'react';
import type * as Three from 'three';

type Props = {
  active: boolean;
  water: boolean;
};

const STAR_COUNT = 1500;
const ORB_COUNT = 26;
const ASTRO_COUNT = 7;
const MEMORY_IMAGES = [
  { src: '/vera/memories/16.jpg', className: 'is-featured', position: '50% 59%' },
  { src: '/vera/memories/1.jpg', className: 'is-giant', position: '50% 44%' },
  { src: '/vera/memories/2.jpg', position: '50% 46%' },
  { src: '/vera/memories/3.jpg', position: '50% 48%' },
  { src: '/vera/memories/4.jpg', position: '50% 48%' },
  { src: '/vera/memories/5.jpg', position: '50% 58%' },
  { src: '/vera/memories/6.jpg', position: '50% 52%' },
  { src: '/vera/memories/7.jpg', position: '50% 58%' },
  { src: '/vera/memories/8.jpg', className: 'is-titanic', position: '50% 58%' },
  { src: '/vera/memories/9.jpg', className: 'is-giant', position: '50% 58%' },
  { src: '/vera/memories/10.jpg', position: '50% 58%' },
  { src: '/vera/memories/11.jpg', position: '50% 54%' },
  { src: '/vera/memories/12.jpg', position: '50% 58%' },
  { src: '/vera/memories/14.jpg', className: 'is-playful', position: '50% 49%' },
  { src: '/vera/memories/15.jpg', className: 'is-beautiful', position: '50% 52%' },
];

const randomRange = (min: number, max: number) => min + Math.random() * (max - min);

export default function LightVoyageTransition({ active, water }: Props) {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount || !active) return;

    let disposed = false;
    let frame = 0;
    let animationFrame = 0;
    let threeModule: typeof Three;
    let renderer: Three.WebGLRenderer | undefined;
    let cleanup = () => {};

    const mouse = { x: 0, y: 0 };
    const cameraTarget = { x: 0, y: 0 };

    const handlePointerMove = (event: PointerEvent) => {
      mouse.x = (event.clientX / window.innerWidth - 0.5) * 2;
      mouse.y = (event.clientY / window.innerHeight - 0.5) * -2;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    import('three').then((module) => {
      if (disposed || !mount) return;

      threeModule = module;
      const three = threeModule;
      const scene = new three.Scene();
      scene.fog = new three.FogExp2(0x010008, 0.012);

      const camera = new three.PerspectiveCamera(62, 1, 0.1, 3600);
      camera.position.set(0, 0, 22);

      renderer = new three.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
      renderer.setClearColor(0x000000, 0);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
      mount.appendChild(renderer.domElement);

      const positions = new Float32Array(STAR_COUNT * 3);
      const colors = new Float32Array(STAR_COUNT * 3);
      const speeds = new Float32Array(STAR_COUNT);
      const palette = [
        new three.Color('#79d7ff'),
        new three.Color('#fff8c8'),
        new three.Color('#ff6fd8'),
        new three.Color('#b997ff'),
        new three.Color('#ffffff'),
      ];

      for (let index = 0; index < STAR_COUNT; index += 1) {
        const color = palette[index % palette.length];
        positions[index * 3] = randomRange(-115, 115);
        positions[index * 3 + 1] = randomRange(-70, 70);
        positions[index * 3 + 2] = randomRange(-2900, 40);
        colors[index * 3] = color.r;
        colors[index * 3 + 1] = color.g;
        colors[index * 3 + 2] = color.b;
        speeds[index] = randomRange(1.9, 7.4);
      }

      const geometry = new three.BufferGeometry();
      geometry.setAttribute('position', new three.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new three.BufferAttribute(colors, 3));

      const material = new three.PointsMaterial({
        size: 1.28,
        vertexColors: true,
        transparent: true,
        opacity: 0.98,
        blending: three.AdditiveBlending,
        depthWrite: false,
      });

      const stars = new three.Points(geometry, material);
      scene.add(stars);

      const orbGeometry = new three.SphereGeometry(1, 20, 12);
      const orbMaterial = new three.MeshBasicMaterial({
        color: '#ff7bd5',
        transparent: true,
        opacity: 0.32,
        blending: three.AdditiveBlending,
        depthWrite: false,
      });
      const orbs = Array.from({ length: ORB_COUNT }, (_, index) => {
        const orb = new three.Mesh(orbGeometry, orbMaterial.clone());
        const scale = randomRange(0.22, 0.8);
        orb.position.set(randomRange(-46, 46), randomRange(-28, 28), randomRange(-520, -70));
        orb.scale.setScalar(scale);
        orb.userData.speed = randomRange(0.46, 1.55);
        orb.userData.phase = index * 1.7;
        scene.add(orb);
        return orb;
      });

      const astroPalette = ['#203dff', '#ff74d4', '#fff1a8', '#78dcff', '#ffffff'];
      const astros = Array.from({ length: ASTRO_COUNT }, (_, index) => {
        const group = new three.Group();
        const color = new three.Color(astroPalette[index % astroPalette.length]);
        const radius = randomRange(0.8, 2.2);
        const planet = new three.Mesh(
          new three.SphereGeometry(radius, 28, 18),
          new three.MeshBasicMaterial({
            color,
            transparent: true,
            opacity: randomRange(0.24, 0.52),
            blending: three.AdditiveBlending,
            depthWrite: false,
          }),
        );
        const ring = new three.Mesh(
          new three.TorusGeometry(radius * 1.36, 0.018, 8, 72),
          new three.MeshBasicMaterial({
            color: '#ffffff',
            transparent: true,
            opacity: 0.26,
            blending: three.AdditiveBlending,
            depthWrite: false,
          }),
        );
        ring.rotation.x = Math.PI * randomRange(0.28, 0.42);
        ring.rotation.y = Math.PI * randomRange(-0.12, 0.12);
        group.add(planet, ring);
        group.position.set(randomRange(-58, 58), randomRange(-34, 34), randomRange(-1300, -260));
        group.userData.speed = randomRange(0.12, 0.46);
        group.userData.phase = index * 2.2;
        scene.add(group);
        return group;
      });

      const resize = () => {
        const width = Math.max(1, mount.clientWidth);
        const height = Math.max(1, mount.clientHeight);
        renderer?.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      };

      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(mount);
      resize();

      const render = () => {
        if (disposed || !renderer) return;

        frame += 1;
        cameraTarget.x += (mouse.x * 12 - cameraTarget.x) * 0.026;
        cameraTarget.y += (mouse.y * 7 - cameraTarget.y) * 0.026;
        camera.position.x += (cameraTarget.x - camera.position.x) * 0.024;
        camera.position.y += (cameraTarget.y - camera.position.y) * 0.024;
        camera.rotation.z = -camera.position.x * 0.006;
        camera.lookAt(camera.position.x * 0.28, camera.position.y * 0.22, -260);

        for (let index = 0; index < STAR_COUNT; index += 1) {
          const offset = index * 3;
          positions[offset] += mouse.x * 0.018 * speeds[index];
          positions[offset + 1] += mouse.y * 0.012 * speeds[index];
          positions[offset + 2] += speeds[index] * 1.05;

          if (positions[offset + 2] > 44) {
            positions[offset] = randomRange(-120, 120) - mouse.x * 18;
            positions[offset + 1] = randomRange(-74, 74) - mouse.y * 12;
            positions[offset + 2] = randomRange(-2900, -2100);
          }
        }
        geometry.attributes.position.needsUpdate = true;
        stars.rotation.z += 0.0008;

        orbs.forEach((orb, index) => {
          const speed = Number(orb.userData.speed);
          const phase = Number(orb.userData.phase);
          orb.position.z += speed * 1.05;
          orb.position.x += Math.sin(frame * 0.012 + phase) * 0.012;
          orb.position.y += Math.cos(frame * 0.01 + phase) * 0.01;
          orb.scale.setScalar(orb.scale.x + Math.sin(frame * 0.02 + index) * 0.0008);

          if (orb.position.z > 24) {
            orb.position.set(randomRange(-52, 52), randomRange(-30, 30), randomRange(-620, -260));
          }
        });

        astros.forEach((astro, index) => {
          const speed = Number(astro.userData.speed);
          const phase = Number(astro.userData.phase);
          astro.position.z += speed * 0.92;
          astro.position.x += Math.sin(frame * 0.005 + phase) * 0.01;
          astro.position.y += Math.cos(frame * 0.004 + phase) * 0.008;
          astro.rotation.y += 0.003 + index * 0.0002;
          astro.rotation.z += 0.001;

          if (astro.position.z > 16) {
            astro.position.set(randomRange(-64, 64), randomRange(-38, 38), randomRange(-1500, -900));
          }
        });

        renderer.render(scene, camera);
        animationFrame = requestAnimationFrame(render);
      };

      render();

      cleanup = () => {
        resizeObserver.disconnect();
        cancelAnimationFrame(animationFrame);
        geometry.dispose();
        material.dispose();
        orbGeometry.dispose();
        orbs.forEach((orb) => {
          (orb.material as Three.Material).dispose();
        });
        astros.forEach((astro) => {
          astro.children.forEach((child) => {
            const mesh = child as Three.Mesh;
            mesh.geometry?.dispose();
            (mesh.material as Three.Material | undefined)?.dispose();
          });
        });
        renderer?.dispose();
        renderer?.domElement.remove();
      };
    });

    return () => {
      disposed = true;
      window.removeEventListener('pointermove', handlePointerMove);
      cleanup();
    };
  }, [active]);

  return (
    <div className={`light-voyage${active ? ' is-active' : ''}${water ? ' is-water' : ''}`} ref={mountRef}>
      <div className="light-voyage-memories" aria-hidden="true">
        {MEMORY_IMAGES.map((memory, index) => (
          <img
            alt=""
            className={`light-voyage-memory ${memory.className ?? ''}`}
            key={memory.src}
            src={memory.src}
            style={{
              '--memory-index': index,
              objectPosition: memory.position,
            } as CSSProperties}
          />
        ))}
      </div>
      <div className="light-voyage-message" aria-hidden="true">
        <span>Feliz día Vera</span>
        <span className="light-voyage-smile">:)</span>
      </div>
      <div className="light-voyage-vignette" aria-hidden="true" />
      <div className="light-voyage-water" aria-hidden="true" />
    </div>
  );
}
