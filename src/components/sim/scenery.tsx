import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import type { World } from "@/lib/sim/engine";
import { makeBuildingTexture } from "@/lib/sim/textures";
import { makeAwningTexture, makeFootpathTexture, makeShopSignTexture, makeShutterTexture } from "@/lib/sim/scenery-textures";

/** Roadside market street: shops, signage, awnings, footpath crowds, carts, poles, wires. */

function rnd(i: number) {
  const x = Math.sin(i * 127.1 + 31.7) * 43758.5453;
  return x - Math.floor(x);
}

const CLOTH = ["#c0392b", "#d4a017", "#1f7a4d", "#2e5e8e", "#8e44ad", "#e07b39", "#26a69a", "#f1f0e6", "#7b3f00"];
const SKIN = ["#8d5a3b", "#6f4327", "#a97350", "#5d3a22"];

function Person({ seed, scale = 1 }: { seed: number; scale?: number }) {
  const shirt = CLOTH[Math.floor(rnd(seed) * CLOTH.length)]!;
  const lower = CLOTH[Math.floor(rnd(seed + 7) * CLOTH.length)]!;
  const skin = SKIN[Math.floor(rnd(seed + 13) * SKIN.length)]!;
  const h = 1.5 + rnd(seed + 3) * 0.28;
  return (
    <group scale={scale}>
      <mesh position={[0, h * 0.22, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.17, h * 0.44, 8]} />
        <meshStandardMaterial color={lower} roughness={0.95} />
      </mesh>
      <mesh position={[0, h * 0.62, 0]} castShadow>
        <capsuleGeometry args={[0.17, h * 0.32, 4, 10]} />
        <meshStandardMaterial color={shirt} roughness={0.92} />
      </mesh>
      <mesh position={[0, h * 0.92, 0]} castShadow>
        <sphereGeometry args={[0.13, 12, 12]} />
        <meshStandardMaterial color={skin} roughness={0.9} />
      </mesh>
    </group>
  );
}

function Crowd({ seed, count }: { seed: number; count: number }) {
  const g = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!g.current) return;
    const t = clock.elapsedTime;
    g.current.children.forEach((c, i) => {
      c.rotation.y = Math.sin(t * 0.5 + i) * 0.4 + rnd(seed + i) * 6;
      c.position.y = Math.abs(Math.sin(t * 1.6 + i * 1.3)) * 0.03;
    });
  });
  return (
    <group ref={g}>
      {Array.from({ length: count }).map((_, i) => (
        <group key={i} position={[(rnd(seed + i * 3) - 0.5) * 2.6, 0, (rnd(seed + i * 5) - 0.5) * 11]}>
          <Person seed={seed + i * 11} />
        </group>
      ))}
    </group>
  );
}

function Cart({ seed }: { seed: number }) {
  const cloth = CLOTH[Math.floor(rnd(seed + 2) * CLOTH.length)]!;
  const fruit = ["#d64545", "#e8a33d", "#4e9a3e", "#c9752b"];
  return (
    <group>
      <mesh position={[0, 0.78, 0]} castShadow>
        <boxGeometry args={[1.5, 0.1, 2.6]} />
        <meshStandardMaterial color="#6b5335" roughness={0.95} />
      </mesh>
      {[-0.6, 0.6].map((z, i) => (
        <mesh key={i} position={[0.75, 0.32, z]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.32, 0.32, 0.1, 12]} />
          <meshStandardMaterial color="#2a2a2a" roughness={0.9} />
        </mesh>
      ))}
      {Array.from({ length: 14 }).map((_, i) => (
        <mesh key={i} position={[(rnd(seed + i) - 0.5) * 1.2, 0.88, (rnd(seed + i * 2) - 0.5) * 2.2]} castShadow>
          <sphereGeometry args={[0.1 + rnd(seed + i * 3) * 0.05, 8, 8]} />
          <meshStandardMaterial color={fruit[i % 4]!} roughness={0.85} />
        </mesh>
      ))}
      <mesh position={[0, 2.1, 0]} castShadow>
        <coneGeometry args={[1.7, 0.5, 10]} />
        <meshStandardMaterial color={cloth} roughness={0.95} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 1.45, 0]}>
        <cylinderGeometry args={[0.035, 0.035, 1.4, 6]} />
        <meshStandardMaterial color="#5a4a35" />
      </mesh>
    </group>
  );
}

function ParkedBike({ seed }: { seed: number }) {
  const c = CLOTH[Math.floor(rnd(seed) * CLOTH.length)]!;
  return (
    <group rotation={[0, Math.PI / 2, 0]}>
      <mesh position={[0, 0.6, 0]} castShadow>
        <boxGeometry args={[0.3, 0.3, 1.5]} />
        <meshStandardMaterial color={c} roughness={0.5} metalness={0.4} />
      </mesh>
      {[0.6, -0.6].map((z, i) => (
        <mesh key={i} position={[0, 0.3, z]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.3, 0.3, 0.1, 12]} />
          <meshStandardMaterial color="#141414" />
        </mesh>
      ))}
    </group>
  );
}

function Pole({ seed }: { seed: number }) {
  return (
    <group>
      <mesh position={[0, 4, 0]} castShadow>
        <cylinderGeometry args={[0.09, 0.13, 8, 8]} />
        <meshStandardMaterial color="#7d7b74" roughness={0.9} />
      </mesh>
      {/* tangled wires */}
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[0, 6.6 - i * 0.28, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.025, 0.025, 30, 5]} />
          <meshStandardMaterial color="#1b1b1b" roughness={1} />
        </mesh>
      ))}
      {/* hanging banner */}
      <mesh position={[0.5, 3.2, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
        <planeGeometry args={[2.2, 0.9]} />
        <meshStandardMaterial
          color={CLOTH[Math.floor(rnd(seed + 4) * CLOTH.length)]!}
          roughness={0.95}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

function Tree({ seed }: { seed: number }) {
  const s = 0.8 + rnd(seed) * 0.6;
  return (
    <group scale={s}>
      <mesh position={[0, 1.4, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.24, 2.8, 7]} />
        <meshStandardMaterial color="#5a4630" roughness={1} />
      </mesh>
      <mesh position={[0, 3.4, 0]} castShadow>
        <icosahedronGeometry args={[1.5, 0]} />
        <meshStandardMaterial color="#3f6b31" roughness={1} flatShading />
      </mesh>
      <mesh position={[0.7, 2.9, 0.4]} castShadow>
        <icosahedronGeometry args={[0.9, 0]} />
        <meshStandardMaterial color="#4a7a37" roughness={1} flatShading />
      </mesh>
    </group>
  );
}

function ShopBlock({ seed, side, dense }: { seed: number; side: 1 | -1; dense: boolean }) {
  const buildingTex = useMemo(() => makeBuildingTexture(), []);
  const signTex = useMemo(() => makeShopSignTexture(Math.floor(rnd(seed) * 997)), [seed]);
  const awningTex = useMemo(() => makeAwningTexture(Math.floor(rnd(seed + 5) * 997)), [seed]);
  const shutterTex = useMemo(() => makeShutterTexture(), []);
  const h = 5.5 + rnd(seed + 1) * 6;

  return (
    <group>
      {/* building mass, set back from the footpath */}
      <mesh position={[side * 9, h / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[8, h, 12.5]} />
        <meshStandardMaterial map={buildingTex} roughness={0.95} />
      </mesh>
      {/* ground-floor shutter face */}
      <mesh position={[side * 5.02, 1.6, 0]} rotation={[0, side * Math.PI * 0.5, 0]}>
        <planeGeometry args={[11, 3.2]} />
        <meshStandardMaterial map={shutterTex} roughness={0.85} metalness={0.2} />
      </mesh>
      {/* shop sign board */}
      <mesh position={[side * 4.9, 4.1, 0]} rotation={[0, side * Math.PI * 0.5, 0]} castShadow>
        <planeGeometry args={[10, 1.5]} />
        <meshStandardMaterial map={signTex} roughness={0.8} side={THREE.DoubleSide} />
      </mesh>
      {/* cloth awning over the footpath */}
      <mesh position={[side * 3.3, 3.2, 0]} rotation={[0, 0, side * 0.34]} castShadow>
        <boxGeometry args={[3.6, 0.07, 11]} />
        <meshStandardMaterial map={awningTex} roughness={0.98} />
      </mesh>
      {[-5.2, 5.2].map((z, i) => (
        <mesh key={i} position={[side * 2, 1.5, z]}>
          <cylinderGeometry args={[0.04, 0.04, 3, 6]} />
          <meshStandardMaterial color="#4b4b46" />
        </mesh>
      ))}
      {/* street life in front of the shop */}
      <group position={[side * 2.4, 0, 0]}>
        <Crowd seed={seed * 3} count={dense ? 7 : 3} />
      </group>
      {rnd(seed + 9) > 0.45 && (
        <group position={[side * 1.1, 0, (rnd(seed + 12) - 0.5) * 8]} rotation={[0, side > 0 ? 0 : Math.PI, 0]}>
          <Cart seed={seed + 21} />
        </group>
      )}
      {dense &&
        Array.from({ length: 3 }).map((_, i) => (
          <group key={i} position={[side * 3.4, 0, -4 + i * 1.1 + rnd(seed + i) * 0.4]}>
            <ParkedBike seed={seed + i * 4} />
          </group>
        ))}
      {rnd(seed + 31) > 0.6 ? (
        <group position={[side * 0.9, 0, 5.6]}>
          <Pole seed={seed} />
        </group>
      ) : (
        rnd(seed + 41) > 0.55 && (
          <group position={[side * 1.4, 0, -5.4]}>
            <Tree seed={seed} />
          </group>
        )
      )}
    </group>
  );
}

export function MarketStreet({ world, quality }: { world: World; quality: "high" | "low" }) {
  const group = useRef<THREE.Group>(null);
  const pathTex = useMemo(() => makeFootpathTexture(), []);
  const footL = useRef<THREE.Mesh>(null);
  const footR = useRef<THREE.Mesh>(null);
  const spacing = 13;
  const count = quality === "high" ? 16 : 8;
  const half = world.scenario.roadWidth / 2;
  const dense = world.scenario.id === "market" || world.scenario.id === "intersection";

  useFrame(() => {
    const z = world.ego.z;
    if (!group.current) return;
    const base = Math.floor((z - 60) / spacing);
    group.current.children.forEach((child, i) => {
      child.position.z = (base + i) * spacing;
    });
    for (const m of [footL.current, footR.current]) {
      if (m) m.position.z = z;
    }
    pathTex.offset.y = -z / 8;
  });

  return (
    <group>
      {/* raised footpaths both sides */}
      {[-1, 1].map((s) => (
        <mesh
          key={s}
          ref={s === -1 ? footL : footR}
          position={[s * (half + 2), 0.14, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          receiveShadow
        >
          <planeGeometry args={[4, 500]} />
          <meshStandardMaterial map={pathTex} roughness={1} />
        </mesh>
      ))}
      <group ref={group}>
        {Array.from({ length: count }).map((_, i) => {
          const side: 1 | -1 = i % 2 === 0 ? -1 : 1;
          return (
            <group key={i} position={[side * (half + 4), 0, 0]}>
              <ShopBlock seed={i * 17 + 3} side={side} dense={dense && quality === "high"} />
            </group>
          );
        })}
      </group>
    </group>
  );
}
