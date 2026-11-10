import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeCakeCanvasProps {
  isCandlesLit: boolean;
  onBlowCandles?: () => void;
  isAutoRotate?: boolean;
}

export const ThreeCakeCanvas: React.FC<ThreeCakeCanvasProps> = ({
  isCandlesLit,
  onBlowCandles,
  isAutoRotate = true,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const flamesRef = useRef<THREE.Mesh[]>([]);
  const flameLightsRef = useRef<THREE.PointLight[]>([]);
  const smokeParticlesRef = useRef<{ mesh: THREE.Mesh; opacity: number; vy: number; vx: number }[]>([]);
  const cakeGroupRef = useRef<THREE.Group | null>(null);
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const rotationVelocityRef = useRef(0.004);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Dimensions
    const width = mount.clientWidth || 400;
    const height = mount.clientHeight || 450;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 1000);
    camera.position.set(0, 3.8, 8.5);
    camera.lookAt(0, 1.2, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    mount.replaceChildren(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xfff5ea, 1.2);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 1.4);
    mainLight.position.set(4, 8, 5);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 1024;
    mainLight.shadow.mapSize.height = 1024;
    mainLight.shadow.bias = -0.001;
    scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0xffdbe6, 0.8);
    fillLight.position.set(-5, 4, -3);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xe5d4ff, 0.6);
    rimLight.position.set(0, 6, -6);
    scene.add(rimLight);

    // Root Group for rotation
    const cakeGroup = new THREE.Group();
    scene.add(cakeGroup);
    cakeGroupRef.current = cakeGroup;

    // Materials
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.15,
      metalness: 0.05,
    });

    const lavenderMat = new THREE.MeshStandardMaterial({
      color: 0xcbb7e8, // Pastel lilac/purple
      roughness: 0.45,
      metalness: 0.05,
    });

    const pinkTierMat = new THREE.MeshStandardMaterial({
      color: 0xffadc2, // Pastel strawberry pink
      roughness: 0.4,
      metalness: 0.05,
    });

    const creamDripMat = new THREE.MeshStandardMaterial({
      color: 0xfff0f5, // Pale creamy drip
      roughness: 0.25,
      metalness: 0.02,
    });

    const macaronColors = [
      0xb2f2bb, // mint
      0xfff3bf, // pastel lemon
      0xffc9c9, // pastel strawberry
    ];

    // 1. Ceramic Pedestal Stand
    const standBaseGeo = new THREE.CylinderGeometry(1.6, 2.0, 0.4, 48);
    const standBase = new THREE.Mesh(standBaseGeo, pedestalMat);
    standBase.position.y = -0.7;
    standBase.receiveShadow = true;
    cakeGroup.add(standBase);

    const standStemGeo = new THREE.CylinderGeometry(0.5, 0.9, 1.2, 32);
    const standStem = new THREE.Mesh(standStemGeo, pedestalMat);
    standStem.position.y = 0.0;
    standStem.castShadow = true;
    standStem.receiveShadow = true;
    cakeGroup.add(standStem);

    const plateGeo = new THREE.CylinderGeometry(2.8, 2.7, 0.18, 64);
    const plate = new THREE.Mesh(plateGeo, pedestalMat);
    plate.position.y = 0.65;
    plate.castShadow = true;
    plate.receiveShadow = true;
    cakeGroup.add(plate);

    // 2. Bottom Tier (Pastel Lavender with Sprinkles)
    const bottomRadius = 2.4;
    const bottomHeight = 1.35;
    const bottomTierGeo = new THREE.CylinderGeometry(bottomRadius, bottomRadius, bottomHeight, 64);
    const bottomTier = new THREE.Mesh(bottomTierGeo, lavenderMat);
    bottomTier.position.y = 0.74 + bottomHeight / 2;
    bottomTier.castShadow = true;
    bottomTier.receiveShadow = true;
    cakeGroup.add(bottomTier);

    // Pearl border at bottom
    const pearlCount = 36;
    const pearlRadius = 0.085;
    const pearlGeo = new THREE.SphereGeometry(pearlRadius, 16, 16);
    const pearlMat = new THREE.MeshStandardMaterial({
      color: 0xd9c5f2,
      roughness: 0.2,
      metalness: 0.1,
    });

    for (let i = 0; i < pearlCount; i++) {
      const angle = (i / pearlCount) * Math.PI * 2;
      const pearl = new THREE.Mesh(pearlGeo, pearlMat);
      pearl.position.set(
        Math.cos(angle) * (bottomRadius + 0.02),
        0.8,
        Math.sin(angle) * (bottomRadius + 0.02)
      );
      cakeGroup.add(pearl);
    }

    // Sprinkles on Bottom Tier
    const sprinkleColors = [0xfff3b0, 0xa7f3d0, 0xfecdd3, 0xbfdbfe, 0xffffff];
    const sprinkleGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.14, 8);
    for (let i = 0; i < 75; i++) {
      const col = sprinkleColors[Math.floor(Math.random() * sprinkleColors.length)];
      const spMat = new THREE.MeshStandardMaterial({ color: col, roughness: 0.3 });
      const sp = new THREE.Mesh(sprinkleGeo, spMat);

      const angle = Math.random() * Math.PI * 2;
      const h = 0.85 + Math.random() * (bottomHeight - 0.2);
      sp.position.set(
        Math.cos(angle) * (bottomRadius + 0.012),
        h,
        Math.sin(angle) * (bottomRadius + 0.012)
      );
      sp.rotation.set(
        (Math.random() - 0.5) * 1.5,
        Math.random() * Math.PI,
        (Math.random() - 0.5) * 1.5
      );
      cakeGroup.add(sp);
    }

    // 3. Top Tier (Pastel Pink)
    const topRadius = 1.75;
    const topHeight = 1.15;
    const topTierGeo = new THREE.CylinderGeometry(topRadius, topRadius, topHeight, 64);
    const topTier = new THREE.Mesh(topTierGeo, pinkTierMat);
    topTier.position.y = bottomTier.position.y + bottomHeight / 2 + topHeight / 2;
    topTier.castShadow = true;
    topTier.receiveShadow = true;
    cakeGroup.add(topTier);

    // Cream Frosting Top Cap
    const topCapGeo = new THREE.CylinderGeometry(topRadius + 0.04, topRadius + 0.04, 0.12, 64);
    const topCap = new THREE.Mesh(topCapGeo, creamDripMat);
    topCap.position.y = topTier.position.y + topHeight / 2 + 0.04;
    topCap.castShadow = true;
    cakeGroup.add(topCap);

    // Cream Drips cascading down top tier
    const dripCount = 20;
    for (let i = 0; i < dripCount; i++) {
      const angle = (i / dripCount) * Math.PI * 2;
      const dripLength = 0.25 + Math.sin(i * 2.3) * 0.18 + Math.random() * 0.1;
      const dripGeo = new THREE.SphereGeometry(0.1, 16, 16);
      dripGeo.scale(1, dripLength * 2.5, 0.6);
      const drip = new THREE.Mesh(dripGeo, creamDripMat);
      drip.position.set(
        Math.cos(angle) * (topRadius + 0.02),
        topTier.position.y + topHeight / 2 - dripLength / 2,
        Math.sin(angle) * (topRadius + 0.02)
      );
      drip.rotation.y = angle;
      cakeGroup.add(drip);
    }

    // 4. Macarons and Meringue Kisses on base of top tier & top tier rim
    const createMacaron = (colorHex: number, scale = 1) => {
      const macGroup = new THREE.Group();
      const shellGeo = new THREE.SphereGeometry(0.16 * scale, 16, 16);
      shellGeo.scale(1, 0.45, 1);
      const shellMat = new THREE.MeshStandardMaterial({
        color: colorHex,
        roughness: 0.35,
      });

      const topShell = new THREE.Mesh(shellGeo, shellMat);
      topShell.position.y = 0.07 * scale;
      const botShell = new THREE.Mesh(shellGeo, shellMat);
      botShell.position.y = -0.07 * scale;

      const fillGeo = new THREE.CylinderGeometry(0.14 * scale, 0.14 * scale, 0.06 * scale, 16);
      const fillMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 });
      const fill = new THREE.Mesh(fillGeo, fillMat);

      macGroup.add(topShell, botShell, fill);
      return macGroup;
    };

    // Macarons on lower tier rim
    const lowerMacaronCount = 10;
    for (let i = 0; i < lowerMacaronCount; i++) {
      const angle = (i / lowerMacaronCount) * Math.PI * 2;
      const mac = createMacaron(macaronColors[i % macaronColors.length], 1.15);
      mac.position.set(
        Math.cos(angle) * (topRadius + 0.35),
        bottomTier.position.y + bottomHeight / 2 + 0.12,
        Math.sin(angle) * (topRadius + 0.35)
      );
      mac.rotation.set(0.4, angle + Math.PI / 2, 0.2);
      cakeGroup.add(mac);
    }

    // Macarons on top tier rim
    const topMacaronAngles = [0.2, 1.4, 2.7, 3.9, 5.1];
    topMacaronAngles.forEach((angle, idx) => {
      const mac = createMacaron(macaronColors[idx % macaronColors.length], 0.95);
      mac.position.set(
        Math.cos(angle) * (topRadius - 0.3),
        topTier.position.y + topHeight / 2 + 0.14,
        Math.sin(angle) * (topRadius - 0.3)
      );
      mac.rotation.set(0.3, angle, 0.1);
      cakeGroup.add(mac);
    });

    // Meringue Kisses (swirled white cones)
    const meringueGeo = new THREE.ConeGeometry(0.12, 0.2, 16);
    const meringueMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2 + 0.5;
      const kiss = new THREE.Mesh(meringueGeo, meringueMat);
      kiss.position.set(
        Math.cos(angle) * (topRadius - 0.25),
        topTier.position.y + topHeight / 2 + 0.18,
        Math.sin(angle) * (topRadius - 0.25)
      );
      cakeGroup.add(kiss);
    }

    // 5. Glossy Red Candy Heart in center
    const heartShape = new THREE.Shape();
    const x = 0, y = 0;
    heartShape.moveTo(x + 0.25, y + 0.25);
    heartShape.bezierCurveTo(x + 0.25, y + 0.25, x + 0.2, y, x, y);
    heartShape.bezierCurveTo(x - 0.35, y, x - 0.35, y + 0.35, x - 0.35, y + 0.35);
    heartShape.bezierCurveTo(x - 0.35, y + 0.55, x - 0.15, y + 0.77, x + 0.25, y + 0.95);
    heartShape.bezierCurveTo(x + 0.65, y + 0.77, x + 0.85, y + 0.55, x + 0.85, y + 0.35);
    heartShape.bezierCurveTo(x + 0.85, y + 0.35, x + 0.85, y, x + 0.5, y);
    heartShape.bezierCurveTo(x + 0.35, y, x + 0.25, y + 0.25, x + 0.25, y + 0.25);

    const extrudeSettings = {
      depth: 0.2,
      bevelEnabled: true,
      bevelSegments: 8,
      steps: 2,
      bevelSize: 0.08,
      bevelThickness: 0.08,
    };
    const heartGeo = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
    heartGeo.center();
    const heartMat = new THREE.MeshStandardMaterial({
      color: 0xef233c,
      roughness: 0.1,
      metalness: 0.2,
    });
    const candyHeart = new THREE.Mesh(heartGeo, heartMat);
    candyHeart.scale.set(0.65, 0.65, 0.65);
    candyHeart.rotation.z = Math.PI;
    candyHeart.position.set(0, topTier.position.y + topHeight / 2 + 0.42, 0);
    candyHeart.castShadow = true;
    cakeGroup.add(candyHeart);

    // 6. Five Birthday Candles with Flames
    const candleColors = [0x6ee7b7, 0xfde047, 0xf472b6, 0xc084fc, 0xfb7185];
    const candlePositions = [
      { x: -0.85, z: 0.1 },
      { x: -0.45, z: -0.4 },
      { x: 0.0, z: -0.65 },
      { x: 0.45, z: -0.4 },
      { x: 0.85, z: 0.1 },
    ];

    const candleGeo = new THREE.CylinderGeometry(0.065, 0.065, 0.9, 16);
    const wickGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.14, 8);
    const wickMat = new THREE.MeshBasicMaterial({ color: 0x222222 });

    const flames: THREE.Mesh[] = [];
    const flameLights: THREE.PointLight[] = [];

    const flameGeo = new THREE.ConeGeometry(0.07, 0.22, 16);
    flameGeo.translate(0, 0.11, 0);
    const flameMat = new THREE.MeshBasicMaterial({
      color: 0xffbe0b,
      transparent: true,
      opacity: 0.92,
    });

    candlePositions.forEach((pos, idx) => {
      const cMat = new THREE.MeshStandardMaterial({
        color: candleColors[idx % candleColors.length],
        roughness: 0.3,
      });
      const candle = new THREE.Mesh(candleGeo, cMat);
      const topY = topTier.position.y + topHeight / 2 + 0.12;
      candle.position.set(pos.x, topY + 0.45, pos.z);
      candle.castShadow = true;
      cakeGroup.add(candle);

      const wick = new THREE.Mesh(wickGeo, wickMat);
      wick.position.set(pos.x, topY + 0.95, pos.z);
      cakeGroup.add(wick);

      // Flame
      const flame = new THREE.Mesh(flameGeo, flameMat.clone());
      flame.position.set(pos.x, topY + 1.02, pos.z);
      cakeGroup.add(flame);
      flames.push(flame);

      // Flame point light
      const pLight = new THREE.PointLight(0xffa200, 0.6, 2.5);
      pLight.position.set(pos.x, topY + 1.1, pos.z);
      cakeGroup.add(pLight);
      flameLights.push(pLight);
    });

    flamesRef.current = flames;
    flameLightsRef.current = flameLights;

    // Mouse / Touch Interaction for spinning
    const onMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current || !cakeGroupRef.current) return;
      const deltaX = e.clientX - previousMousePositionRef.current.x;
      cakeGroupRef.current.rotation.y += deltaX * 0.008;
      rotationVelocityRef.current = deltaX * 0.004;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDraggingRef.current = true;
        previousMousePositionRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current || !cakeGroupRef.current || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - previousMousePositionRef.current.x;
      cakeGroupRef.current.rotation.y += deltaX * 0.008;
      rotationVelocityRef.current = deltaX * 0.004;
      previousMousePositionRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const onTouchEnd = () => {
      isDraggingRef.current = false;
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    domElement.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    // Animation Loop
    let clock = new THREE.Clock();
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Cake rotation
      if (cakeGroupRef.current) {
        if (!isDraggingRef.current) {
          if (isAutoRotate) {
            cakeGroupRef.current.rotation.y += 0.005;
          } else {
            // Apply slight inertia
            cakeGroupRef.current.rotation.y += rotationVelocityRef.current;
            rotationVelocityRef.current *= 0.95;
          }
        }
      }

      // Flame flickering animation
      flamesRef.current.forEach((flame, i) => {
        if (flame.visible) {
          const s = 1 + Math.sin(elapsedTime * 12 + i * 1.5) * 0.12;
          flame.scale.set(s, s * 1.1, s);
          flame.rotation.z = Math.sin(elapsedTime * 8 + i) * 0.1;
        }
      });

      // Point lights flicker
      flameLightsRef.current.forEach((light, i) => {
        if (light.visible) {
          light.intensity = 0.5 + Math.sin(elapsedTime * 15 + i) * 0.15;
        }
      });

      // Update smoke particles
      smokeParticlesRef.current.forEach((p, idx) => {
        p.mesh.position.y += p.vy;
        p.mesh.position.x += p.vx;
        p.opacity -= 0.015;
        (p.mesh.material as THREE.MeshBasicMaterial).opacity = Math.max(0, p.opacity);
        p.mesh.scale.multiplyScalar(1.02);

        if (p.opacity <= 0) {
          scene.remove(p.mesh);
          smokeParticlesRef.current.splice(idx, 1);
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!mount) return;
      const newWidth = mount.clientWidth;
      const newHeight = mount.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      domElement.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      domElement.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      renderer.dispose();
      mount.replaceChildren();
    };
  }, [isAutoRotate]);

  // Handle candle lit state changes
  useEffect(() => {
    flamesRef.current.forEach((flame) => {
      flame.visible = isCandlesLit;
    });
    flameLightsRef.current.forEach((light) => {
      light.visible = isCandlesLit;
    });

    // If candles just got blown out, spawn gentle puffs of smoke
    if (!isCandlesLit && cakeGroupRef.current) {
      flamesRef.current.forEach((flame) => {
        for (let j = 0; j < 6; j++) {
          const smokeGeo = new THREE.SphereGeometry(0.04 + Math.random() * 0.03, 8, 8);
          const smokeMat = new THREE.MeshBasicMaterial({
            color: 0xdddddd,
            transparent: true,
            opacity: 0.6,
          });
          const smoke = new THREE.Mesh(smokeGeo, smokeMat);
          smoke.position.copy(flame.position);
          smoke.position.y += 0.1;
          cakeGroupRef.current?.add(smoke);

          smokeParticlesRef.current.push({
            mesh: smoke,
            opacity: 0.6,
            vy: 0.018 + Math.random() * 0.015,
            vx: (Math.random() - 0.5) * 0.008,
          });
        }
      });
    }
  }, [isCandlesLit]);

  return (
    <div
      ref={mountRef}
      className="w-full h-full cursor-grab active:cursor-grabbing select-none"
      title="Drag to rotate the cake in 3D!"
    />
  );
};
