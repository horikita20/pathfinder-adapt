# SafeAutonomy Hardware Assembly

## Build
- Add a dedicated `/hardware-assembly` walkthrough designed for projector viewing and screen recording.
- Place the ESP32 at the center with the ultrasonic sensor, camera, motor driver, battery, and laptop arranged around it.
- Reveal each connection across five steps, using smooth draw-on animations, component highlights, exact pin labels, and a distinct amber WiFi link.
- Add Previous, Next, Replay, and keyboard arrow controls plus a clear progress indicator and current-step description.
- Add the walkthrough to the existing site navigation without changing the current simulator pages.

## Visual direction
- Deep green-black PCB canvas with a restrained grid and blueprint traces.
- Mint connected states and animated dashed physical wires; amber dashed/wavy wireless link.
- Monospace labels, large readable type, stable 16:9-style composition, and reduced-motion support.

## Technical details
- Implement the schematic as responsive SVG so wires remain aligned at every screen size.
- Keep all walkthrough state client-side; no login or saved data is needed.
- Add unique page metadata and verify the walkthrough in the live preview at desktop and mobile widths.
