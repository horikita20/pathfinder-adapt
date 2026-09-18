export type ObstacleKind = "car" | "twoWheeler" | "pedestrian" | "cattle" | "auto";

export type SpawnRule = {
  kind: ObstacleKind;
  /** spawns per second */
  rate: number;
  /** lateral range in meters relative to road centre */
  xRange: [number, number];
  /** forward speed range in m/s (negative = oncoming / crossing down) */
  speed: [number, number];
  /** lateral drift speed range in m/s */
  drift: [number, number];
  /** spawn ahead of the ego by this distance range */
  ahead: [number, number];
};

export type Scenario = {
  id: string;
  name: string;
  blurb: string;
  roadHalfWidth: number;
  goalDistance: number;
  egoTargetSpeed: number;
  initial: number;
  rules: SpawnRule[];
};

export const KIND_META: Record<ObstacleKind, { label: string; color: string; w: number; l: number }> = {
  car: { label: "Car", color: "#60a5fa", w: 1.8, l: 4.2 },
  auto: { label: "Auto-rickshaw", color: "#fbbf24", w: 1.4, l: 2.7 },
  twoWheeler: { label: "Two-wheeler", color: "#f472b6", w: 0.8, l: 1.9 },
  pedestrian: { label: "Pedestrian", color: "#a78bfa", w: 0.6, l: 0.6 },
  cattle: { label: "Cattle", color: "#fb923c", w: 1.1, l: 2.2 },
};

export const SCENARIOS: Scenario[] = [
  {
    id: "village",
    name: "Village Road",
    blurb: "Sparse traffic, occasional cattle, no lane markings.",
    roadHalfWidth: 5,
    goalDistance: 220,
    egoTargetSpeed: 11,
    initial: 4,
    rules: [
      { kind: "cattle", rate: 0.16, xRange: [-4, 4], speed: [-0.6, 0.8], drift: [-0.4, 0.4], ahead: [60, 180] },
      { kind: "twoWheeler", rate: 0.35, xRange: [-4.2, 4.2], speed: [-9, 7], drift: [-0.8, 0.8], ahead: [70, 200] },
      { kind: "auto", rate: 0.2, xRange: [-3.5, 3.5], speed: [-7, 5], drift: [-0.4, 0.4], ahead: [70, 200] },
      { kind: "pedestrian", rate: 0.18, xRange: [-5, 5], speed: [-1, 1], drift: [-1.1, 1.1], ahead: [60, 180] },
    ],
  },
  {
    id: "market",
    name: "Dense Market Street",
    blurb: "Crowded, tight space, pedestrians crossing constantly.",
    roadHalfWidth: 4,
    goalDistance: 150,
    egoTargetSpeed: 6,
    initial: 14,
    rules: [
      { kind: "pedestrian", rate: 1.5, xRange: [-4, 4], speed: [-1.4, 1.4], drift: [-1.4, 1.4], ahead: [25, 140] },
      { kind: "twoWheeler", rate: 0.7, xRange: [-3.5, 3.5], speed: [-5, 4], drift: [-1, 1], ahead: [35, 150] },
      { kind: "auto", rate: 0.35, xRange: [-3, 3], speed: [-4, 3], drift: [-0.5, 0.5], ahead: [40, 150] },
      { kind: "cattle", rate: 0.1, xRange: [-3, 3], speed: [-0.4, 0.4], drift: [-0.3, 0.3], ahead: [40, 140] },
    ],
  },
  {
    id: "intersection",
    name: "Unsignalized Intersection",
    blurb: "Crossing traffic from both sides, nobody yields.",
    roadHalfWidth: 6,
    goalDistance: 180,
    egoTargetSpeed: 9,
    initial: 8,
    rules: [
      { kind: "car", rate: 0.55, xRange: [-14, 14], speed: [-1, 1], drift: [-6, 6], ahead: [50, 130] },
      { kind: "twoWheeler", rate: 0.8, xRange: [-14, 14], speed: [-2, 2], drift: [-7, 7], ahead: [45, 140] },
      { kind: "auto", rate: 0.4, xRange: [-12, 12], speed: [-1, 1], drift: [-5, 5], ahead: [50, 140] },
      { kind: "pedestrian", rate: 0.5, xRange: [-8, 8], speed: [-1, 1], drift: [-1.6, 1.6], ahead: [40, 130] },
    ],
  },
  {
    id: "highway",
    name: "Highway Merge",
    blurb: "Fast vehicles merging in from the shoulder.",
    roadHalfWidth: 7,
    goalDistance: 320,
    egoTargetSpeed: 18,
    initial: 7,
    rules: [
      { kind: "car", rate: 0.9, xRange: [-6, 6], speed: [8, 22], drift: [-1.6, 1.6], ahead: [90, 320] },
      { kind: "car", rate: 0.35, xRange: [6, 9], speed: [10, 18], drift: [-2.4, -0.8], ahead: [100, 300] },
      { kind: "twoWheeler", rate: 0.3, xRange: [-6.5, 6.5], speed: [9, 16], drift: [-1, 1], ahead: [90, 300] },
    ],
  },
  {
    id: "cattle",
    name: "Cattle Crossing",
    blurb: "A slow herd drifting straight across the lane.",
    roadHalfWidth: 5.5,
    goalDistance: 170,
    egoTargetSpeed: 10,
    initial: 9,
    rules: [
      { kind: "cattle", rate: 0.8, xRange: [-7, 7], speed: [-0.4, 0.6], drift: [-1.2, 1.2], ahead: [40, 160] },
      { kind: "twoWheeler", rate: 0.25, xRange: [-4, 4], speed: [-6, 5], drift: [-0.6, 0.6], ahead: [60, 170] },
      { kind: "pedestrian", rate: 0.25, xRange: [-6, 6], speed: [-1, 1], drift: [-1, 1], ahead: [40, 160] },
    ],
  },
];
