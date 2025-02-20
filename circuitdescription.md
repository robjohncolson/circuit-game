Detailed Description of the Analog Charging Circuit (4 Units, One Per Cell)
Purpose
The analog charger charges each Li-ion cell (Cells 1-4) independently to 4.2V at 1.125A, using a linear CC/CV profile, powered by 9V USB-C PD. It uses discrete components for simplicity and deadbug compatibility.
Components and Connections
Input: 9V, 4.5A from USB-C PD, distributed via a common 1N5819 Schottky diode (40V, 1A, through-hole) for reverse polarity protection, mounted upside-down on the ground plane.
Per Charger (for Each Cell, e.g., Cell 1):
Zener Diode (D1, 4.2V, 1W, 1N4732A, DO-41): Sets the constant voltage limit at 4.2V for CV charging, triggering when the cell reaches 4.2V. Mounted upside-down, connected between BAT (cell positive) and GND, with 24-28 AWG signal wires.
NPN Transistor (Q1, 2N3904, TO-92): Acts as a current limiter and switch for CC mode, regulating 1.125A via base bias. Connected with collector to BAT, emitter to R1, base to R2/R3, mounted upside-down with 16-18 AWG power wires.
PNP Transistor (Q2, 2N2907, TO-92): Complements Q1 for current regulation in CC/CV, connected with emitter to BAT, collector to Q1, base to R2/R3, mounted upside-down.
Resistor (R1, 0.62Ω, 5W, through-hole, axial): Sets charge current to 1.125A (V = I × R = 0.7V / 0.62Ω ≈ 1.13A) in CC mode, connected between Q1 emitter and GND. Dissipates 0.784W, requiring a TO-92/axial heatsink, mounted upside-down with 16-18 AWG wires.
Resistor (R2, 10kΩ, 1/4W, through-hole, axial): Provides bias for Q1/Q2, stabilizing current, connected between Q1 base and BAT, mounted upside-down with 24-28 AWG wires.
Resistor (R3, 1kΩ, 1/4W, through-hole, axial): Limits base current to Q1/Q2, connected between Q2 base and GND, mounted upside-down.
Capacitor (C1, 10µF, 16V, electrolytic, through-hole): Filters input noise, connected between 9V input and GND, mounted upside-down with 16-18 AWG wires.
Capacitor (C2, 1µF, 10V, ceramic, through-hole): Stabilizes output voltage to the cell, connected between BAT and GND, mounted upside-down.
LED (Optional, 3mm, red/green, through-hole): Indicates charge status (red for charging, green at 4.2V), connected between Q1 collector and GND via R4, mounted upside-down with 24-28 AWG wires.
Resistor (R4, Optional, 330Ω-1kΩ, 1/4W, through-hole, axial): Limits LED current, connected in series with LED, mounted upside-down.
Output: 4.2V, 1.125A to each cell (Cells 1-4), connected via 16-18 AWG wires to BAT terminals, splitting 4.5A total across the four chargers.
Functionality
CC Mode: Q1/Q2 limit current to 1.125A per cell using R1, with 9V input dropping to ~4.2V across the cell as it charges.
CV Mode: When the cell reaches 4.2V, D1 conducts, reducing Q1/Q2 current, tapering to maintain 4.2V until charge completes.
Protection: D2 prevents reverse polarity, and Q1/Q2 limit overcurrent. Thermal protection isn’t built-in but can be added with an NTC thermistor and relay (see BMS).
Deadbug Layout
Each charger occupies ~50mm x 50mm on the ground plane, with D2, Q1/Q2, R1-R4, C1/C2, and LED mounted upside-down on isolated pads. 16-18 AWG wires connect 9V input (via D2) to VIN, BAT to cells, and GND to the plane. Heatsinks on Q1/Q2 and R1 manage 0.784W heat per charger (3.136W total for 2S2P).
Detailed Description of the Analog BMS Circuit (2 Units, One Per 2S String)
Purpose
The analog BMS protects and balances each 2S string (Cells 1-2 and Cells 3-4) at 2.25A (4.5A total in parallel), handling overcharge (4.2V/cell), overdischarge (~2.5V-2.8V/cell), overcurrent (2.25A), short circuit, and overtemperature, with passive balancing to ensure uniform 4.2V per cell.
Components and Connections
Per BMS (for Each 2S String, e.g., Cells 1-2):
Voltage Divider Resistors (R5, R6, 10kΩ, 1/4W, through-hole, axial): Monitor cell voltages (2.5V-4.2V), with R5 across Cell 1 (B- to B1) and R6 across Cell 2 (B1 to B2), connected to Q3/Q4 gates via 24-28 AWG wires, mounted upside-down.
Zener Diode (D3, 4.2V, 1W, 1N4732A, DO-41): Sets overcharge threshold at 4.2V for Cell 1, connected between R5 and GND, triggering Q3, mounted upside-down.
Zener Diode (D4, 4.2V, 1W, 1N4732A, DO-41): Sets overcharge threshold at 4.2V for Cell 2, connected between R6 and GND, triggering Q4, mounted upside-down.
Zener Diode (D5, 2.7V, 1.3W, BZX85C2V7-TR, DO-41): Sets overdischarge threshold at ~2.5V-2.8V for Cell 1, connected between R5 and GND, triggering Q4, mounted upside-down.
Zener Diode (D6, 2.7V, 1.3W, BZX85C2V7-TR, DO-41): Sets overdischarge threshold at ~2.5V-2.8V for Cell 2, connected between R6 and GND, triggering Q4, mounted upside-down.
N-Channel MOSFET (Q3, IRF9540N, TO-220): Controls charge cutoff for overcharge, connected with drain to P+, source to B-, gate to D3/D4, mounted upside-down with 16-18 AWG wires, heatsink for 1.0125W at 2.25A.
N-Channel MOSFET (Q4, IRF9540N, TO-220): Controls discharge cutoff for overdischarge, connected with drain to B2, source to P-, gate to D5/D6, mounted upside-down, heatsink for 1.0125W.
P-Channel MOSFET (Q5, IRF9540N or equivalent, TO-220): Controls overcurrent/short circuit, connected with source to P+, drain to B2, gate to R7, mounted upside-down, heatsink for 1.0125W.
Sense Resistor (R7, 0.01Ω, 2W, Ohmite WLCR010FET, axial): Detects overcurrent at 2.25A (22.5mV) or 4.5A (45mV), connected between P+ and B2, mounted upside-down with 16-18 AWG wires, heatsink for 0.050625W-0.2025W.
Capacitor (C3, 1µF, 50V, ceramic, through-hole): Filters noise on voltage lines, connected between B-, B1, B2 and GND, mounted upside-down with 24-28 AWG wires.
Relay (K1, Song Chuan 833H-1C-C-12VDC, sugar cube, 19mm x 15mm x 15mm): Disconnects P+ (NO) and P- (NC) for faults, with COM to charger/load, coil (12VDC, 33mA) powered by MT3608 via LCQT-SOT23-6, mounted upside-down with 14-18 AWG wires, heatsink optional.
Diode (D7, 1N4007, 1000V, 1A, through-hole, axial): Protects K1 coil from back-EMF, connected across coil terminals, mounted upside-down with 24-28 AWG wires.
NTC Thermistor (T1, 10kΩ at 25°C, through-hole): Monitors temperature, connected between B- and R8, triggering Q6 via voltage drop at >50°C, mounted upside-down with 24-28 AWG wires.
Resistor (R8, 4.7kΩ, 1/4W, through-hole, axial): Pulls thermistor voltage, connected between T1 and GND, mounted upside-down.
Balancing Resistor (R11, 10Ω-100Ω, 1W, through-hole, axial): Balances Cell 1, connected across B- and B1, activated via Q3, mounted upside-down with 16-18 AWG wires, heatsink for 0.4W max.
Balancing Resistor (R12, 10Ω-100Ω, 1W, through-hole, axial): Balances Cell 2, connected across B1 and B2, activated via Q4, mounted upside-down, heatsink for 0.4W max.
LED (Optional, 3mm, red/green, through-hole): Indicates faults, connected between Q3/Q4/Q5 gates and GND via R9/R10, mounted upside-down with 24-28 AWG wires.
Resistor (R9, Optional, 330Ω-1kΩ, 1/4W, through-hole, axial): Limits LED current for fault indication, connected in series with LED, mounted upside-down.
Resistor (R10, Optional, 330Ω-1kΩ, 1/4W, through-hole, axial): Limits LED current, mounted upside-down.
Boost Converter (MT3608 with LCQT-SOT23-6):
MT3608 IC (SOT23-6): Boosts 9V to 12V, mounted in LCQT-SOT23-6 (6-pin DIP, 9mm x 6mm, through-hole), connected to VIN (9V), GND, and VOUT (12V) with 16-18 AWG wires.
Inductor (22µH, 1.5A, Wurth 744772100, radial through-hole): Energy storage, connected between VIN and MT3608 switch pin, mounted upside-down.
Capacitor (Input, 10µF-22µF, 16V, through-hole): Filters 9V input, connected between VIN and GND, mounted upside-down.
Capacitor (Output, 10µF-22µF, 16V, through-hole): Stabilizes 12V output, connected between VOUT and GND, mounted upside-down.
Diode (1N5819, 40V, 1A, through-hole): Rectifies output, connected between MT3608 and VOUT, mounted upside-down.
Resistor (R1, 240kΩ, 1/4W, through-hole, axial): Sets 12V output, connected in feedback with R2, mounted upside-down.
Resistor (R2, 10kΩ, 1/4W, through-hole, axial): Pairs with R1 for 12V, mounted upside-down.
Output: P- and P+ connect to charger/load via K1, with 16-18 AWG wires for 4.5A, paralleled for 2P via a junction (screw terminal).
Functionality
Cell Voltage Monitoring: R5/R6 divide cell voltages, triggering D3/D4 (4.2V) for overcharge or D5/D6 (2.7V) for overdischarge, activating Q3/Q4.
Cell Balancing: R11/R12 (10Ω-100Ω, 1W) bleed excess voltage (50-200mA) during charging, activated via Q3/Q4, ensuring 4.2V per cell.
Overcharge Protection: D3/D4 trigger Q3 at 4.2V, cutting P+ via K1.
Overdischarge Protection: D5/D6 trigger Q4 at 2.5V-2.8V, cutting P- via K1.
Overcurrent/Short Circuit: R7 (0.01Ω, 2W) senses 2.25A (22.5mV) or 4.5A (45mV), triggering Q5 to activate K1.
Temperature Monitoring: T1/R8 detect >50°C, triggering Q6 to activate K1.
Boost Converter: MT3608 (via LCQT-SOT23-6) boosts 9V to 12V at 66mA for K1 coils, using 22µH inductor, capacitors, diode, and resistors.
Deadbug Layout
Each BMS occupies ~100mm x 100mm on the ground plane, with components mounted upside-down on isolated pads. 16-18 AWG wires connect B-, B1, B2, P-, P+; 24-28 AWG for signals. Heatsinks on Q3-Q5, R7, and K1 manage 5W per string (10W total for 2S2P). The LCQT-SOT23-6 with MT3608 occupies ~50mm x 50mm per boost, mounted upside-down with 16-18 AWG wires.
Integration and Power Flow
USB-C PD (9V, 4.5A) → 1N5819 (reverse protection) → Split to:
Chargers: 4.5A total (1.125A per cell) via R1, Q1/Q2, D1 to Cells 1-4 at 4.2V.
BMS: Monitors cells, controls via Q3-Q5, K1, powered by MT3608 (9V to 12V via LCQT-SOT23-6) for K1 coils.
Output: P- and P+ to load (Lego build HAT + Raspberry Pi, 9V at 4.5A via boost converter) or battery discharge, controlled by K1.
Notes on LCQT-SOT23-6 and MT3608
The LCQT-SOT23-6 adapter (9mm x 6mm, 0.1”/2.54mm pins) simplifies MT3608 integration, mounting upside-down with 16-18 AWG wires, reducing deadbug complexity for the boost converter.
17-week lead time is a concern; consider alternatives like BB-PWR-3608 (5 weeks) if delays are problematic.
This detailed description covers your charging and BMS circuits, leveraging discrete components and the LCQT-SOT23-6 for deadbug ease. Let me know if you’d like refinements, schematics, BOM updates, or help with layout or testing!