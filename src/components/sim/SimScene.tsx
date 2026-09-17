import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import type { Actor, CameraMode, DriverInput, World } from "@/lib/sim/engine";
import { actorLabel, stepWorld } from "@/lib/sim/engine";
import { makeAsphaltTexture, makeBuildingTexture, makeGroundTexture } from "@/lib/sim/textures";
import { ActorModel } from "./models";

const RISK_COLOR = { low: "#00d9ff", medium: "#ff9f1c", high: "#ff3b30" } as const;
const ROAD_LEN = 400;

function hash(i: number) {
  const x = Math.sin(i * 127.1) * 43758.5453;
  return x - Math.floor(x);
}

/* ------------------------------------------------------------------ road */
function Road({ world }: { world: World }) {
  const asphalt = useMemo(() => makeAsphaltTexture(ROAD_LEN / 8), []);
  const ground = useMemo(() => makeGroundTexture(), []);
  const road = useRef<THREE.Mesh>(null);
  const dirt = useRef<THREE.Mesh>(null);

  useFrame(() => {
    const z = world.ego.z;
    if (road.current) road.current.position.z = z;
    if (dirt.current) dirt.current.position.z = z;
    asphalt.offset.y = -z / 8;
    ground.offset.y = -z / 20;
  });

  return (
    <group>
      <mesh ref={dirt} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <planeGeometry args={[220, 900]} />
        <meshStandardMaterial map={ground} roughness={1} />
      </mesh>
      <mesh ref={road} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[world.scenario.roadWidth, ROAD_LEN]} />
        <meshStandardMaterial map={asphalt} roughness={0.96} />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------- roadside */
function Roadside({ world }: { world: World }) {
  const texA = useMemo(() => makeBuildingTexture(), []);
  const texB = useMemo(() => makeBuildingTexture(), []);
  const group = useRef<THREE.Group>(null);
  const spacing = 16;
  const count = 26;
  const half = world.scenario.roadWidth / 2;

  useFrame(() => {
    if (!group.current) return;
    const base = Math.floor((world.ego.z - 80) / spacing);
    group.current.children.forEach((child, i) => {
      const slot = base + i;
      child.position.z = slot * spacing;
      const h = 4 + hash(slot) * 9;
      child.scale.y = h / 6;
      child.position.y = 0;
      const side = i % 2 === 0 ? -1 : 1;
      child.position.x = side * (half + 5 + hash(slot + 91) * 3);
    });
  });

  return (
    <group ref={group}>
      {Array.from({ length: count }).map((_, i) => (
        <mesh key={i} position={[0, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[7, 6, 9]} />
          <meshStandardMaterial map={i % 2 ? texA : texB} roughness={0.95} />
        </mesh>
      ))}
    </group>
  );
}

/* ---------------------------------------------------------------- actors */
function ActorNode({ actor, showBoxes }: { actor: Actor; showBoxes: boolean }) {
  const group = useRef<THREE.Group>(null);
  const box = useRef<THREE.LineSegments>(null);

  useFrame(() => {
    if (!group.current) return;
    group.current.position.set(actor.x, 0, actor.z);
    group.current.rotation.y = actor.heading;
    if (box.current) {
      const on = showBoxes && actor.detected && actor.distance < 60;
      box.current.visible = on;
      if (on) {
        const mat = box.current.material as THREE.LineBasicMaterial;
        mat.color.set(RISK_COLOR[actor.risk]);
      }
    }
  });

  const boxGeom = useMemo(
    () => new THREE.EdgesGeometry(new THREE.BoxGeometry(actor.width + 0.3, Math.max(actor.height, 0.5) + 0.2, actor.length + 0.3)),
    [actor.width, actor.height, actor.length],
  );

  return (
    <group ref={group}>
      <ActorModel kind={actor.kind} color={actor.color} width={actor.width} length={actor.length} height={actor.height} />
      <lineSegments ref={box} geometry={boxGeom} position={[0, Math.max(actor.height, 0.5) / 2 + 0.1, 0]}>
        <lineBasicMaterial color="#00d9ff" transparent opacity={0.9} />
      </lineSegments>
    </group>
  );
}

/* -------------------------------------------------------------- ego car */
function EgoVehicle({ world, cameraMode }: { world: World; cameraMode: CameraMode }) {
  const group = useRef<THREE.Group>(null);
  const radar = useRef<THREE.Mesh>(null);
  const lidar = useRef<THREE.Mesh>(null);

  useFrame((_, dt) => {
    if (!group.current) return;
    group.current.position.set(world.ego.x, 0, world.ego.z);
    group.current.rotation.y = world.ego.heading;
    if (lidar.current) lidar.current.rotation.y += dt * 4;
    if (radar.current) {
      const m = radar.current.material as THREE.MeshBasicMaterial;
      m.opacity = world.ego.braking ? 0.24 : 0.12;
    }
  });

  return (
    <group ref={group}>
      <group visible={cameraMode !== "inside"}>
        <mesh position={[0, 0.62, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.78, 0.72, 4.3]} />
          <meshStandardMaterial color="#e9edf0" roughness={0.32} metalness={0.55} />
        </mesh>
        <mesh position={[0, 1.18, -0.25]} castShadow>
          <boxGeometry args={[1.62, 0.6, 2.3]} />
          <meshStandardMaterial color="#12181d" roughness={0.12} metalness={0.4} />
        </mesh>
        {[
          [-0.89, 2.05],
          [0.89, 2.05],
          [-0.89, -1.75],
          [0.89, -1.75],
        ].map(([x, z], i) => (
          <mesh key={i} position={[x!, 0.33, z!]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.33, 0.33, 0.24, 16]} />
            <meshStandardMaterial color="#111" roughness={0.95} />
          </mesh>
        ))}
        {/* roof LiDAR */}
        <mesh ref={lidar} position={[0, 1.58, -0.2]} castShadow>
          <cylinderGeometry args={[0.16, 0.16, 0.22, 16]} />
          <meshStandardMaterial color="#1d2b33" metalness={0.8} roughness={0.25} emissive="#00d9ff" emissiveIntensity={0.25} />
        </mesh>
      </group>

      {/* sensor coverage */}
      <mesh ref={radar} position={[0, 0.35, 16]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[18, 28, Math.PI / 2 - 0.45, 0.9]} />
        <meshBasicMaterial color="#00d9ff" transparent opacity={0.12} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <mesh position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[7.8, 8, 48]} />
        <meshBasicMaterial color="#00ff88" transparent opacity={0.28} depthWrite={false} />
      </mesh>

      {/* cockpit for inside view */}
      <group visible={cameraMode === "inside"}>
        <mesh position={[0, 0.78, 1.35]} rotation={[-0.2, 0, 0]}>
          <boxGeometry args={[1.75, 0.34, 0.9]} />
          <meshStandardMaterial color="#191d21" roughness={0.9} />
        </mesh>
        <mesh position={[-0.35, 0.95, 0.95]} rotation={[1.15, 0, 0]}>
          <torusGeometry args={[0.17, 0.025, 10, 28]} />
          <meshStandardMaterial color="#0e1114" roughness={0.6} />
        </mesh>
      </group>
    </group>
  );
}

/* ------------------------------------------------------------ planned path */
function PlannedPath({ world }: { world: World }) {
  const line = useRef<THREE.Line>(null);
  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(world.path.length / 2 * 3), 3));
    return g;
  }, [world.path.length]);

  useFrame(() => {
    const pos = geom.getAttribute("position") as THREE.BufferAttribute;
    for (let i = 0; i < world.path.length / 2; i++) {
      pos.setXYZ(i, world.path[i * 2]!, 0.08, world.path[i * 2 + 1]!);
    }
    pos.needsUpdate = true;
    geom.computeBoundingSphere();
    if (line.current) {
      const mat = line.current.material as THREE.LineBasicMaterial;
      mat.color.set(world.metrics.risk === "high" ? "#ff3b30" : world.metrics.risk === "medium" ? "#ff9f1c" : "#00ff88");
    }
  });

  return (
    // @ts-expect-error three Line is a valid r3f element
    <line ref={line} geometry={geom}>
      <lineBasicMaterial color="#00ff88" linewidth={2} transparent opacity={0.95} />
    </line>
  );
}

/* --------------------------------------------------------------- labels */
function Labels({ world }: { world: World }) {
  const [items, setItems] = useState<Actor[]>([]);
  const acc = useRef(0);

  useFrame((_, dt) => {
    acc.current += dt;
    if (acc.current < 0.25) return;
    acc.current = 0;
    const near = world.actors
      .filter((a) => a.detected && a.distance < 42 && a.z > world.ego.z - 4)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 8);
    setItems(near);
  });

  return (
    <>
      {items.map((a) => (
        <Html key={a.id} position={[a.x, Math.max(a.height, 0.6) + 0.5, a.z]} center zIndexRange={[20, 0]}>
          <div
            className="whitespace-nowrap rounded-sm border px-1.5 py-0.5 font-mono text-[10px] leading-tight backdrop-blur-sm"
            style={{
              borderColor: RISK_COLOR[a.risk],
              color: RISK_COLOR[a.risk],
              background: "rgba(8,12,16,0.72)",
            }}
          >
            {actorLabel(a.kind)} · {a.distance.toFixed(0)}m · {(a.confidence * 100).toFixed(0)}%
          </div>
        </Html>
      ))}
    </>
  );
}

/* --------------------------------------------------------------- camera */
function CameraRig({ world, cameraMode }: { world: World; cameraMode: CameraMode }) {
  const { camera, gl } = useThree();
  const orbit = useRef({ yaw: 0, pitch: 0.28, dist: 13, dragging: false, lx: 0, ly: 0 });
  const target = useRef(new THREE.Vector3());

  useEffect(() => {
    const el = gl.domElement;
    const down = (e: PointerEvent) => {
      orbit.current.dragging = true;
      orbit.current.lx = e.clientX;
      orbit.current.ly = e.clientY;
    };
    const move = (e: PointerEvent) => {
      if (!orbit.current.dragging) return;
      orbit.current.yaw -= (e.clientX - orbit.current.lx) * 0.005;
      orbit.current.pitch = THREE.MathUtils.clamp(orbit.current.pitch + (e.clientY - orbit.current.ly) * 0.004, 0.05, 1.35);
      orbit.current.lx = e.clientX;
      orbit.current.ly = e.clientY;
    };
    const up = () => (orbit.current.dragging = false);
    const wheel = (e: WheelEvent) => {
      orbit.current.dist = THREE.MathUtils.clamp(orbit.current.dist + e.deltaY * 0.02, 6, 90);
    };
    el.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    el.addEventListener("wheel", wheel, { passive: true });
    return () => {
      el.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      el.removeEventListener("wheel", wheel);
    };
  }, [gl]);

  useEffect(() => {
    orbit.current.dist = cameraMode === "overview" ? 34 : 13;
    orbit.current.pitch = cameraMode === "overview" ? 0.95 : 0.26;
    orbit.current.yaw = 0;
  }, [cameraMode]);

  useFrame((_, dt) => {
    const { ego } = world;
    const k = 1 - Math.pow(0.001, dt);
    if (cameraMode === "inside") {
      const p = new THREE.Vector3(ego.x - 0.35, 1.4, ego.z - 0.5);
      camera.position.lerp(p, Math.min(1, k * 1.6));
      target.current.lerp(new THREE.Vector3(ego.x + ego.heading * 8, 1.0, ego.z + 25), Math.min(1, k * 1.6));
      camera.lookAt(target.current);
      return;
    }
    const o = orbit.current;
    const d = o.dist;
    const px = ego.x + Math.sin(o.yaw) * Math.cos(o.pitch) * d;
    const pz = ego.z - Math.cos(o.yaw) * Math.cos(o.pitch) * d;
    const py = 1.2 + Math.sin(o.pitch) * d;
    camera.position.lerp(new THREE.Vector3(px, py, pz), Math.min(1, k * 1.2));
    target.current.lerp(new THREE.Vector3(ego.x, 1, ego.z + (cameraMode === "overview" ? 6 : 10)), Math.min(1, k * 1.2));
    camera.lookAt(target.current);
  });

  return null;
}

/* ---------------------------------------------------------------- scene */
function SunFollower({ world }: { world: World }) {
  useFrame(() => {
    const sun = sunRef.current;
    if (!sun) return;
    sun.position.set(world.ego.x + 28, 42, world.ego.z + 18);
    sun.target.position.set(world.ego.x, 0, world.ego.z);
    sun.target.updateMatrixWorld();
  });
  return null;
}

const sunRef = { current: null as THREE.DirectionalLight | null };

function Scene({
  world,
  cameraMode,
  inputRef,
  onTick,
  quality,
}: {
  world: World;
  cameraMode: CameraMode;
  inputRef: React.RefObject<DriverInput>;
  onTick: () => void;
  quality: "high" | "low";
}) {
  const acc = useRef(0);
  useFrame((_, dt) => {
    stepWorld(world, dt, inputRef.current);
    acc.current += dt;
    if (acc.current > 0.15) {
      acc.current = 0;
      onTick();
    }
  });

  return (
    <>
      <color attach="background" args={["#c9c3b4"]} />
      <fogExp2 attach="fog" args={["#cbc5b6", world.scenario.fog]} />
      <hemisphereLight args={["#eaddc2", "#5b4c39", 1.05]} />
      <directionalLight
        ref={sunRef}
        position={[28, 42, 18]}
        intensity={2.1}
        color="#fff3dd"
        castShadow={quality === "high"}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-40}
        shadow-camera-right={40}
        shadow-camera-top={40}
        shadow-camera-bottom={-40}
      />
      <SunFollower world={world} />
      <Road world={world} />
      <Roadside world={world} />
      <EgoVehicle world={world} cameraMode={cameraMode} />
      <PlannedPath world={world} />
      {world.actors.map((a) => (
        <ActorNode key={a.id} actor={a} showBoxes />
      ))}
      <Labels world={world} />
      <CameraRig world={world} cameraMode={cameraMode} />
    </>
  );
}

export default function SimCanvas(props: {
  world: World;
  cameraMode: CameraMode;
  inputRef: React.RefObject<DriverInput>;
  onTick: () => void;
  quality: "high" | "low";
}) {
  return (
    <Canvas
      shadows={props.quality === "high"}
      dpr={props.quality === "high" ? [1, 1.8] : 1}
      camera={{ fov: 62, near: 0.1, far: 600, position: [0, 6, -12] }}
      gl={{ antialias: props.quality === "high", powerPreference: "high-performance" }}
    >
      <Scene {...props} />
    </Canvas>
  );
}
