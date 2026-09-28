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
  /** m/s */
  egoTargetSpeed: number;
  initial: number;
  /** vehicles + vulnerable road users per kilometre of road, for the HUD */
  densityPerKm: number;
  /** short note on where the speed/density figures come from */
  reference: string;
  rules: SpawnRule[];
};

export const KIND_META: Record<ObstacleKind, { label: string; color: string; w: number; l: number }> = {
  car: { label: "Car", color: "#60a5fa", w: 1.8, l: 4.2 },
  auto: { label: "Auto-rickshaw", color: "#fbbf24", w: 1.4, l: 2.7 },
  twoWheeler: { label: "Two-wheeler", color: "#f472b6", w: 0.8, l: 1.9 },
  pedestrian: { label: "Pedestrian", color: "#a78bfa", w: 0.6, l: 0.6 },
  cattle: { label: "Cattle", color: "#fb923c", w: 1.1, l: 2.2 },
};

/*
 * Speeds are set from observed Indian operating speeds rather than posted limits:
 *  - rural / village roads: 30-40 km/h      -> 9.5 m/s (~34 km/h)
 *  - dense urban market street: 10-15 km/h  -> 3.6 m/s (~13 km/h)
 *  - unsignalized urban intersection approach: 20-25 km/h -> 6.1 m/s (~22 km/h)
 *  - national highway cruise: 75-85 km/h    -> 22 m/s  (~79 km/h)
 *  - cattle / herd crossing approach: 25 km/h -> 7 m/s
 * Two-wheelers make up the majority of the mix in every urban scenario, which is
 * why their spawn rates dominate cars everywhere except the highway.
 */

export const SCENARIOS: Scenario[] = [
  {
    id: "village",
    name: "Village Road",
    blurb: "Sparse traffic, occasional cattle, no lane markings.",
    roadHalfWidth: 5.5,
    goalDistance: 220,
    egoTargetSpeed: 9.5, // ~34 km/h
    initial: 5,
    densityPerKm: 28,
    reference: "Rural single-carriageway, observed 30–40 km/h operating speed",
    rules: [
      { kind: "cattle", rate: 0.14, xRange: [-4, 4], speed: [-0.6, 0.8], drift: [-0.4, 0.4], ahead: [60, 180] },
      { kind: "twoWheeler", rate: 0.5, xRange: [-4.2, 4.2], speed: [-10, 8], drift: [-0.8, 0.8], ahead: [70, 200] },
      { kind: "auto", rate: 0.2, xRange: [-3.5, 3.5], speed: [-7, 5], drift: [-0.4, 0.4], ahead: [70, 200] },
      { kind: "car", rate: 0.16, xRange: [-3.5, 3.5], speed: [-11, 8], drift: [-0.3, 0.3], ahead: [80, 200] },
      { kind: "pedestrian", rate: 0.22, xRange: [-5, 5], speed: [-1, 1], drift: [-1.1, 1.1], ahead: [60, 180] },
    ],
  },
  {
    id: "market",
    name: "Dense Market Street",
    blurb: "Crowded, tight space, pedestrians crossing constantly.",
    roadHalfWidth: 4.5,
    goalDistance: 150,
    egoTargetSpeed: 3.6, // ~13 km/h
    initial: 22,
    densityPerKm: 210,
    reference: "Urban bazaar street, observed 10–15 km/h crawl speed",
    rules: [
      { kind: "pedestrian", rate: 1.9, xRange: [-4, 4], speed: [-1.4, 1.4], drift: [-1.4, 1.4], ahead: [20, 120] },
      { kind: "twoWheeler", rate: 1.1, xRange: [-3.5, 3.5], speed: [-4, 3.5], drift: [-1, 1], ahead: [25, 130] },
      { kind: "auto", rate: 0.5, xRange: [-3, 3], speed: [-3, 2.5], drift: [-0.5, 0.5], ahead: [30, 130] },
      { kind: "car", rate: 0.18, xRange: [-2.5, 2.5], speed: [-2.5, 2], drift: [-0.3, 0.3], ahead: [35, 130] },
      { kind: "cattle", rate: 0.12, xRange: [-3, 3], speed: [-0.4, 0.4], drift: [-0.3, 0.3], ahead: [30, 120] },
    ],
  },
  {
    id: "intersection",
    name: "Unsignalized Intersection",
    blurb: "Crossing traffic from both sides, nobody yields.",
    roadHalfWidth: 7,
    goalDistance: 180,
    egoTargetSpeed: 6.1, // ~22 km/h
    initial: 12,
    densityPerKm: 130,
    reference: "Urban uncontrolled junction, 20–25 km/h approach speed",
    rules: [
      { kind: "twoWheeler", rate: 1.2, xRange: [-14, 14], speed: [-2, 2], drift: [-6.5, 6.5], ahead: [40, 130] },
      { kind: "car", rate: 0.6, xRange: [-14, 14], speed: [-1, 1], drift: [-5.5, 5.5], ahead: [45, 130] },
      { kind: "auto", rate: 0.55, xRange: [-12, 12], speed: [-1, 1], drift: [-4.5, 4.5], ahead: [45, 130] },
      { kind: "pedestrian", rate: 0.7, xRange: [-8, 8], speed: [-1, 1], drift: [-1.6, 1.6], ahead: [35, 120] },
      { kind: "cattle", rate: 0.06, xRange: [-6, 6], speed: [-0.4, 0.4], drift: [-0.6, 0.6], ahead: [40, 120] },
    ],
  },
  {
    id: "highway",
    name: "Highway Merge",
    blurb: "Fast vehicles merging in from the shoulder.",
    roadHalfWidth: 8.5,
    goalDistance: 340,
    egoTargetSpeed: 22, // ~79 km/h
    initial: 8,
    densityPerKm: 42,
    reference: "National highway carriageway, 75–85 km/h cruise",
    rules: [
      { kind: "car", rate: 0.95, xRange: [-6, 6], speed: [14, 27], drift: [-1.6, 1.6], ahead: [110, 330] },
      { kind: "car", rate: 0.4, xRange: [6, 9], speed: [11, 19], drift: [-2.4, -0.8], ahead: [120, 320] },
      { kind: "twoWheeler", rate: 0.35, xRange: [-6.5, 6.5], speed: [11, 19], drift: [-1, 1], ahead: [110, 320] },
      { kind: "auto", rate: 0.12, xRange: [5, 8.5], speed: [6, 10], drift: [-1.2, 0], ahead: [120, 320] },
    ],
  },
  {
    id: "cattle",
    name: "Cattle Crossing",
    blurb: "A slow herd drifting straight across the lane.",
    roadHalfWidth: 6.5,
    goalDistance: 170,
    egoTargetSpeed: 7, // ~25 km/h
    initial: 11,
    densityPerKm: 95,
    reference: "Rural approach with herd crossing, 25 km/h approach",
    rules: [
      { kind: "cattle", rate: 0.95, xRange: [-7, 7], speed: [-0.4, 0.6], drift: [-1.2, 1.2], ahead: [40, 160] },
      { kind: "twoWheeler", rate: 0.4, xRange: [-4, 4], speed: [-7, 6], drift: [-0.6, 0.6], ahead: [60, 170] },
      { kind: "car", rate: 0.16, xRange: [-3.5, 3.5], speed: [-8, 6], drift: [-0.3, 0.3], ahead: [70, 170] },
      { kind: "pedestrian", rate: 0.28, xRange: [-6, 6], speed: [-1, 1], drift: [-1, 1], ahead: [40, 160] },
    ],
  },
];
