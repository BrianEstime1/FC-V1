# FC-V1 — Custom STM32 Development Board

Custom 2-layer development board designed from scratch in **KiCad 9.0** around the **STM32F411CEU6** (UFQFPN-48).

---

## Overview

The FC-V1 is a compact embedded development platform built as a foundation for sensor-fusion and data-acquisition firmware. All schematics and PCB layout were done in KiCad. Gerber files are included in this repo for reference.

**Board dimensions:** 43 mm × 36 mm  
**Layer stackup:** 2-layer (F.Cu / B.Cu)  
**EDA tool:** KiCad 9.0.6  
**Status:** Ordered — breadboard prototype in progress

---

## Hardware Features

| Block | Details |
|---|---|
| MCU | STM32F411CEU6 · UFQFPN-48 · 100 MHz Cortex-M4F |
| IMU | 6-DOF inertial sensor · connected via I²C |
| Power | USB-C input → LDO 3.3 V rail |
| Debug | SWD header (SWDIO / SWDCLK / nRST / 3V3 / GND) |
| GPIO | 2×20 breakout header |
| Crystal | 25 MHz HSE for USB |
| Decoupling | 0402 MLCCs on every power pin |

---

## Schematic & PCB Notes

```
Top layer (F.Cu)  — signal routing, power traces, component pads
Bottom layer (B.Cu) — ground plane + return current paths
Silkscreen (F.Silk) — component reference designators, board label
Edge cuts — rounded-corner 43×36 mm outline
```

Key design decisions:
- STM32F411CEU6 chosen for its 512 KB flash, FPU, and small UFQFPN-48 footprint
- USB-C connector wired for USB FS (12 Mbps) via the MCU's integrated USB peripheral
- IMU on I²C bus with 4.7 kΩ pull-ups to 3.3 V
- SWD header placed on board edge for easy ST-Link access
- LDO placed close to USB-C to minimize inrush current path length

<img width="1150" height="1063" alt="IMG_2641" src="https://github.com/user-attachments/assets/bd5c8bcc-e107-43ba-b3c6-879e7841edc0" />

<img width="751" height="451" alt="preview (1)" src="https://github.com/user-attachments/assets/b86c0c75-746b-45fa-88ab-f8fcac19de80" />






---

## The 0402 Problem

The board was ordered with **0402 passive components** (resistors, capacitors) — a standard SMD size used in production PCBs. What I didn't fully appreciate at design time: 0402 components have 0.5 mm pads spaced ~1 mm apart, making them effectively impossible to hand-solder at home without a reflow oven and stencil.

The fabricated PCBs arrived correct. Soldering them is the blocker.

**Current plan:** Build a breadboard equivalent of the MCU circuit using a Blue Pill (STM32F103) and breakout boards for the IMU. This lets firmware development continue — especially the Kalman filter — while I figure out a reflow solution for the FC-V1 boards.

---

## Breadboard Prototype — Kalman Filter

The breadboard prototype mirrors the FC-V1 sensor topology:

```
STM32F4 (Blue Pill equiv.)
  └── I²C → IMU (accel + gyro)
       └── Kalman filter (6-state: roll, pitch, yaw + rates)
            └── UART output → host for logging / plotting
```

**Filter structure:**

```c
// Discrete-time Kalman filter — angle estimation from IMU
// State vector: [angle, gyro_bias]
// Measurement: accelerometer-derived angle
// Process noise Q tuned for 1 kHz sensor loop
```

The filter fuses gyroscope integration (fast, drifts) with accelerometer angle (noisy, no drift) to get a clean attitude estimate — groundwork for the flight controller firmware the FC-V1 is named after.

---

## Gerber Files

Located in the repo root (exported from KiCad):

| File | Layer |
|---|---|
| `Stm32-pcb-F_Cu.gtl` | Front copper |
| `Stm32-pcb-B_Cu.gbl` | Back copper |
| `Stm32-pcb-F_Mask.gts` | Front soldermask |
| `Stm32-pcb-B_Mask.gbs` | Back soldermask |
| `Stm32-pcb-F_Paste.gtp` | Front solder paste |
| `Stm32-pcb-B_Paste.gbp` | Back solder paste |
| `Stm32-pcb-F_Silkscreen.gto` | Front silkscreen |
| `Stm32-pcb-B_Silkscreen.gbo` | Back silkscreen |
| `Stm32-pcb-Edge_Cuts.gm1` | Board outline |
| `Stm32-pcb-PTH.drl` | Plated through-holes drill file |
| `Stm32-pcb-NPTH.drl` | Non-plated through-holes drill file |

Open `Stm32-pcb-job.gbrjob` in KiCad's Gerber Viewer or upload to any PCB fab (JLCPCB, PCBWay, OSH Park) to view or order.

---

## Portfolio

The `src/` directory contains the React portfolio website. To run locally:

```bash
npm install
npm run dev
```

To build for deployment:

```bash
npm run build
```

---

## Author

**Brian Estime**  
EE Student · Transferring to UCF Fall 2026  
[github.com/BrianEstime1](https://github.com/BrianEstime1) · [linkedin.com/in/brianestime](https://linkedin.com/in/brianestime)
