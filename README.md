# Pathfinder Adapt

### Adaptive Autonomous Navigation for Unstructured Indian Roads

Pathfinder Adapt is an autonomous navigation prototype designed to address the challenges of navigating complex and unstructured road environments. The project focuses on environmental perception, occupancy mapping, adaptive path planning, trajectory generation, and vehicle control.

---

## Overview

Indian road environments are highly dynamic and often lack clearly defined lanes and predictable traffic patterns. Autonomous vehicles operating in such environments need to handle mixed traffic, pedestrians, two-wheelers, irregular road boundaries, static obstacles, and continuously changing road conditions.

Pathfinder Adapt proposes a modular navigation pipeline that enables an autonomous system to:

* Perceive the surrounding environment
* Represent the environment using an occupancy grid
* Identify free and occupied regions
* Generate adaptive paths
* Produce feasible trajectories
* Control vehicle movement based on the planned trajectory

The architecture is designed to support future integration with real-time sensors, edge AI systems, and autonomous vehicle hardware.

---

## System Architecture

```text
                         ENVIRONMENT
                              |
                              v
                    +-------------------+
                    |     PERCEPTION    |
                    | Object / Road     |
                    |    Detection      |
                    +---------+---------+
                              |
                              v
                    +-------------------+
                    |  OCCUPANCY GRID   |
                    | Free / Occupied   |
                    |      Space        |
                    +---------+---------+
                              |
                              v
                    +-------------------+
                    |  ADAPTIVE PATH    |
                    |     PLANNER       |
                    +---------+---------+
                              |
                              v
                    +-------------------+
                    |    TRAJECTORY     |
                    |    GENERATION     |
                    +---------+---------+
                              |
                              v
                    +-------------------+
                    |     VEHICLE       |
                    |     CONTROL       |
                    +---------+---------+
                              |
                              v
                       AUTONOMOUS
                        NAVIGATION
```

---

## Key Features

* Environment perception and obstacle analysis
* Occupancy-grid based environment representation
* Adaptive path planning
* Dynamic obstacle handling
* Trajectory generation
* Vehicle control logic
* Interactive navigation visualization
* Modular software architecture
* Designed for future real-time sensor integration
* Suitable for simulation and prototype development

---

## Navigation Pipeline

The navigation workflow follows a modular perception-to-control architecture:

```text
Sensor / Environment Input
            |
            v
       Perception
            |
            v
  Environment Representation
            |
            v
      Occupancy Grid
            |
            v
    Adaptive Path Planning
            |
            v
   Trajectory Generation
            |
            v
     Vehicle Controller
            |
            v
    Autonomous Navigation
```

Each stage can be independently improved or replaced, allowing the system to evolve from a software prototype toward a real-world autonomous driving platform.

---

## Technology Stack

| Category         | Technologies                |
| ---------------- | --------------------------- |
| Frontend         | React, TypeScript           |
| Build Tool       | Vite                        |
| Styling          | Tailwind CSS                |
| Routing          | TanStack Router             |
| 3D Visualization | Three.js, React Three Fiber |
| Development      | Node.js, npm                |
| Version Control  | Git, GitHub                 |

---

## Project Structure

```text
pathfinder-adapt/
│
├── public/
│
├── src/
│   ├── components/
│   ├── routes/
│   ├── lib/
│   └── main.tsx
│
├── package.json
├── vite.config.ts
├── tsconfig.json
├── README.md
└── ...
```

---

## Getting Started

### Prerequisites

Make sure the following are installed:

* Node.js
* npm
* Git

### Clone the Repository

```bash
git clone https://github.com/horikita20/pathfinder-adapt.git
cd pathfinder-adapt
```

### Install Dependencies

```bash
npm install --legacy-peer-deps
```

### Start Development Server

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:8080/
```

---

## Production Build

Create a production build using:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

---

## Evaluation Metrics

The prototype can be evaluated using the following metrics:

* Path feasibility
* Obstacle avoidance performance
* Planning adaptability
* Navigation stability
* Planning latency
* Safety margin
* Trajectory smoothness
* Computational efficiency

These metrics can be extended as the system moves toward simulation-based and real-world evaluation.

---

## Future Scope

The project can be extended through:

* Real-time camera-based perception
* Advanced object detection and tracking
* Camera-LiDAR sensor fusion
* Real-time occupancy-grid generation
* Predictive trajectory planning
* Vehicle dynamics modelling
* Hardware-in-the-loop testing
* Indian road-specific datasets
* Edge AI deployment
* Autonomous vehicle hardware integration
* Real-world road testing

---

## Project Status

**Prototype — Active Development**

The current implementation focuses on demonstrating the software architecture and navigation workflow. Further development is planned toward real-time perception, advanced planning, hardware integration, and real-world validation.

---

## Repository

GitHub:
https://github.com/horikita20/pathfinder-adapt

---

## Author

**Monika Sharma**

B.Tech — Computer Science & Engineering (Artificial Intelligence)
Maharana Pratap Engineering College, Kanpur

GitHub:
https://github.com/horikita20
