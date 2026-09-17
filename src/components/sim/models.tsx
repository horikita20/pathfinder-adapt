import { memo } from "react";
import type { ActorKind } from "@/lib/sim/engine";

/** Procedural low-cost vehicle / obstacle meshes, dimensioned per actor kind. */

const Wheels = ({ w, l, r = 0.32 }: { w: number; l: number; r?: number }) => (
  <>
    {[
      [-w / 2, l / 2 - 0.4],
      [w / 2, l / 2 - 0.4],
      [-w / 2, -l / 2 + 0.4],
      [w / 2, -l / 2 + 0.4],
    ].map(([x, z], i) => (
      <mesh key={i} position={[x!, r, z!]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[r, r, 0.22, 14]} />
        <meshStandardMaterial color="#141414" roughness={0.95} />
      </mesh>
    ))}
  </>
);

function CarBody({ color, w, l, h }: { color: string; w: number; l: number; h: number }) {
  return (
    <group>
      <mesh position={[0, h * 0.42, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, h * 0.55, l]} />
        <meshStandardMaterial color={color} roughness={0.42} metalness={0.5} />
      </mesh>
      <mesh position={[0, h * 0.82, -0.15]} castShadow>
        <boxGeometry args={[w * 0.9, h * 0.42, l * 0.52]} />
        <meshStandardMaterial color="#1d2328" roughness={0.18} metalness={0.3} />
      </mesh>
      <Wheels w={w * 0.96} l={l} />
    </group>
  );
}

function Auto({ color, w, l, h }: { color: string; w: number; l: number; h: number }) {
  return (
    <group>
      <mesh position={[0, h * 0.5, 0]} castShadow>
        <boxGeometry args={[w, h * 0.7, l * 0.8]} />
        <meshStandardMaterial color={color} roughness={0.55} metalness={0.2} />
      </mesh>
      <mesh position={[0, h * 0.92, -0.1]} castShadow>
        <boxGeometry args={[w * 0.98, h * 0.2, l * 0.78]} />
        <meshStandardMaterial color="#1f2a20" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.3, l / 2 - 0.25]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.16, 12]} />
        <meshStandardMaterial color="#141414" />
      </mesh>
      <mesh position={[-w / 2, 0.3, -l / 2 + 0.4]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.3, 0.3, 0.16, 12]} />
        <meshStandardMaterial color="#141414" />
      </mesh>
      <mesh position={[w / 2, 0.3, -l / 2 + 0.4]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.3, 0.3, 0.16, 12]} />
        <meshStandardMaterial color="#141414" />
      </mesh>
    </group>
  );
}

function Bike({ color, l }: { color: string; l: number }) {
  return (
    <group>
      <mesh position={[0, 0.62, 0]} castShadow>
        <boxGeometry args={[0.34, 0.34, l * 0.75]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.45} />
      </mesh>
      <mesh position={[0, 1.15, -0.1]} castShadow>
        <capsuleGeometry args={[0.22, 0.5, 4, 8]} />
        <meshStandardMaterial color="#3b4654" roughness={0.8} />
      </mesh>
      <mesh position={[0, 1.6, -0.1]} castShadow>
        <sphereGeometry args={[0.18, 12, 12]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>
      {[l / 2 - 0.2, -l / 2 + 0.2].map((z, i) => (
        <mesh key={i} position={[0, 0.32, z]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.32, 0.32, 0.12, 14]} />
          <meshStandardMaterial color="#141414" />
        </mesh>
      ))}
    </group>
  );
}

function BigVehicle({ color, w, l, h }: { color: string; w: number; l: number; h: number }) {
  return (
    <group>
      <mesh position={[0, h * 0.55, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, h * 0.8, l]} />
        <meshStandardMaterial color={color} roughness={0.6} metalness={0.15} />
      </mesh>
      <mesh position={[0, h * 0.62, l / 2 + 0.01]}>
        <planeGeometry args={[w * 0.9, h * 0.32]} />
        <meshStandardMaterial color="#26313a" roughness={0.2} />
      </mesh>
      <Wheels w={w * 0.95} l={l * 0.85} r={0.48} />
    </group>
  );
}

function Pedestrian({ color, h }: { color: string; h: number }) {
  return (
    <group>
      <mesh position={[0, h * 0.55, 0]} castShadow>
        <capsuleGeometry args={[0.22, h * 0.5, 4, 10]} />
        <meshStandardMaterial color={color} roughness={0.9} />
      </mesh>
      <mesh position={[0, h * 0.94, 0]} castShadow>
        <sphereGeometry args={[0.16, 12, 12]} />
        <meshStandardMaterial color="#6b4b35" roughness={0.9} />
      </mesh>
    </group>
  );
}

function Cow({ color, w, l, h }: { color: string; w: number; l: number; h: number }) {
  return (
    <group>
      <mesh position={[0, h * 0.68, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <capsuleGeometry args={[w * 0.45, l * 0.6, 4, 10]} />
        <meshStandardMaterial color={color} roughness={0.95} />
      </mesh>
      <mesh position={[0, h * 0.85, l / 2 - 0.1]} castShadow>
        <boxGeometry args={[w * 0.5, h * 0.3, 0.6]} />
        <meshStandardMaterial color={color} roughness={0.95} />
      </mesh>
      {[
        [-w / 3, l / 3],
        [w / 3, l / 3],
        [-w / 3, -l / 3],
        [w / 3, -l / 3],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x!, h * 0.28, z!]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, h * 0.56, 8]} />
          <meshStandardMaterial color="#8d7f70" />
        </mesh>
      ))}
    </group>
  );
}

function Vendor({ color, w, l, h }: { color: string; w: number; l: number; h: number }) {
  return (
    <group>
      <mesh position={[0, h * 0.35, 0]} castShadow>
        <boxGeometry args={[w, h * 0.12, l]} />
        <meshStandardMaterial color="#6b5335" roughness={0.9} />
      </mesh>
      <mesh position={[0, h * 0.92, 0]} rotation={[0.12, 0, 0]} castShadow>
        <boxGeometry args={[w * 1.2, 0.06, l * 1.1]} />
        <meshStandardMaterial color={color} roughness={0.85} />
      </mesh>
      {[
        [-w / 2, -l / 2],
        [w / 2, -l / 2],
        [-w / 2, l / 2],
        [w / 2, l / 2],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x!, h * 0.45, z!]}>
          <cylinderGeometry args={[0.04, 0.04, h * 0.9, 6]} />
          <meshStandardMaterial color="#4a3d2c" />
        </mesh>
      ))}
    </group>
  );
}

export const ActorModel = memo(function ActorModel({
  kind,
  color,
  width,
  length,
  height,
}: {
  kind: ActorKind;
  color: string;
  width: number;
  length: number;
  height: number;
}) {
  switch (kind) {
    case "car":
      return <CarBody color={color} w={width} l={length} h={height} />;
    case "auto":
      return <Auto color={color} w={width} l={length} h={height} />;
    case "bike":
    case "cycle":
      return <Bike color={color} l={length} />;
    case "bus":
    case "truck":
      return <BigVehicle color={color} w={width} l={length} h={height} />;
    case "pedestrian":
      return <Pedestrian color={color} h={height} />;
    case "cow":
      return <Cow color={color} w={width} l={length} h={height} />;
    case "vendor":
      return <Vendor color={color} w={width} l={length} h={height} />;
    case "barrier":
      return (
        <group>
          <mesh position={[0, height / 2, 0]} castShadow>
            <coneGeometry args={[0.34, height, 10]} />
            <meshStandardMaterial color="#e8622c" roughness={0.7} />
          </mesh>
          <mesh position={[0, height * 0.55, 0]}>
            <cylinderGeometry args={[0.2, 0.2, 0.12, 10]} />
            <meshStandardMaterial color="#f2f2f2" />
          </mesh>
        </group>
      );
    case "pothole":
      return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0]} receiveShadow>
          <circleGeometry args={[Math.max(width, length) / 2, 14]} />
          <meshStandardMaterial color="#17181a" roughness={1} />
        </mesh>
      );
    default:
      return (
        <mesh position={[0, height / 2, 0]} castShadow>
          <dodecahedronGeometry args={[Math.max(width, height) / 2, 0]} />
          <meshStandardMaterial color={color} roughness={0.9} />
        </mesh>
      );
  }
});
