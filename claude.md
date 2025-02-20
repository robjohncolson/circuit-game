Part 1: Lower-Tech, Analog Charger for 2S2P (Deadbug Style)
Functions of a Charger IC (for 1-Cell Li-Ion, 4.2V, 1.125A)
A typical Li-ion charger IC (e.g., MAX1898EUB42+T, BQ24133) performs the following functions for a single cell:
Constant Current (CC) Charging: Limits the charge current to a safe level (e.g., 1.125A per cell) until the cell reaches its full voltage.
Constant Voltage (CV) Charging: Maintains a constant voltage (4.2V) as the current tapers off to complete charging, preventing overcharge.
Overvoltage Protection: Ensures the cell voltage doesn’t exceed 4.2V.
Overcurrent Protection: Limits charge current to prevent damage or overheating.
Thermal Protection: Reduces current or shuts off if the charger or cell overheats.
Input Voltage Regulation: Handles 9V input, stepping it down to 4.2V for the cell.
For your 2S2P pack, you need four such chargers (one per cell, Cells 1-4) to handle 1.125A each, totaling 4.5A, with 9V USB-C PD input.
Lower-Tech, Analog Charger Design (Deadbug Style)
We’ll design a simple, analog charger for a single Li-ion cell (4.2V, 1.125A) using basic components (resistors, capacitors, diodes, transistors, op-amps) that are easy to deadbug. This design will be replicated four times for your 2S2P pack.
Components
Zener Diode (D1): 4.2V, 1W (e.g., 1N4732A, through-hole) – Sets the constant voltage limit at 4.2V for CV charging.
NPN Transistor (Q1): 2N3904 or TIP31C (TO-92 or TO-220, through-hole) – Acts as a current limiter and switch for CC/CV control.
PNP Transistor (Q2): 2N2907 or TIP32C (TO-92 or TO-220, through-hole) – Complements Q1 for current regulation.
Resistor (R1): 0.1Ω, 5W, through-hole – Sets the charge current (1.125A, I = 0.7V / R1, where 0.7V is the base-emitter drop of Q1).
Resistor (R2): 10kΩ, 1/4W, through-hole – Provides bias for Q1/Q2 to regulate current.
Resistor (R3): 1kΩ, 1/4W, through-hole – Limits base current to Q1/Q2.
Capacitor (C1): 10µF, 16V, electrolytic or ceramic, through-hole – Filters input voltage ripple.
Capacitor (C2): 1µF, 10V, ceramic or electrolytic, through-hole – Stabilizes output voltage.
Schottky Diode (D2): 1N5819, 40V, 1A, through-hole – Prevents reverse current and protects against input polarity reversal.
LED (Optional): 3mm or 5mm, red/green, through-hole – Indicates charge status (e.g., red for charging, green for full).
Resistor (R4, Optional): 330Ω-1kΩ, 1/4W, through-hole – Limits LED current.
Copper-Clad PCB: Single-sided, ~50mm x 50mm per charger (four total for 2S2P).
Circuit Description
Input: 9V from USB-C PD (via D2 for reverse protection), filtered by C1.
CC Mode (Constant Current, 1.125A):
Q1 (NPN) and Q2 (PNP) form a current regulator. R1 (0.1Ω) sets the current: I = 0.7V / R1 = 0.7V / 0.1Ω = 7A theoretically, but Q1/Q2 limit it to 1.125A by adjusting base voltage via R2 and R3.
Adjust R1 to 0.62Ω (5W) for 1.125A (I = 0.7V / 0.62Ω ≈ 1.13A), ensuring safe charging for Li-ion cells.
CV Mode (Constant Voltage, 4.2V):
D1 (4.2V Zener) regulates the output voltage to 4.2V. When the cell reaches 4.2V, Q1/Q2 reduce current, transitioning to CV mode, tapering off as the cell charges fully.
Protection:
D2 prevents reverse polarity.
Q1/Q2 limit overcurrent (set by R1).
Thermal protection isn’t built-in but can be added with an NTC thermistor and relay (see BMS section).
Output: 4.2V to each cell (Cells 1-4), stabilized by C2.
Deadbug Layout (Per Charger)
Ground Plane (Copper-Clad, ~50mm x 50mm)
  +------------------+
  |                  |
  |  D2 (1N5819)    |--- USB-C (9V, 4.5A) ---+--- C1 (10uF, 16V) ---+
  |                  |                          |                      |
  |                  |                          |                      v (BAT: Cell, 4.2V)
  |  Z1 (4.2V)      |                          |                      +--- R1 (0.62Ω, 5W) --- Q1 (2N3904) --- Q2 (2N2907) --- R2 (10kΩ) --- R3 (1kΩ) ---+
  |                  |                          |                      |
  |  C2 (1uF, 10V)   |                          +--- LED (Optional) --- R4 (330Ω-1kΩ) --- GND
  |                  |
  +------------------+----------------------------------------------------+
  v (GND: Copper-Clad Plane)
Mount D2, Z1, Q1, Q2, R1-R3, C1, C2, and LED/R4 upside-down on isolated pads or through-hole pins on the ground plane.
Solder 16-18 AWG wires for power (USB-C input, BAT output) and 24-28 AWG for signals (LED).
Use heatsinks on Q1/Q2 and R1 for 1.125A (5W heat dissipation per charger, total 20W for 2S2P).
Advantages
Deadbug-Friendly: Through-hole components (TO-92, TO-220, radial caps/resistors) are easy to solder and wire on the ground plane.
Low-Tech: No fine-pitch ICs, all analog components are robust and widely available.
Cost: ~$1-2 per charger (D1 $0.20, Q1/Q2 $0.10 each, R1 $0.50, R2/R3 $0.05 each, C1/C2 $0.20 each, D2 $0.10, LED/R4 $0.20), total $4-8 for four chargers.
Limitations
No Integrated Protection: Lacks built-in thermal shutdown or advanced overcurrent protection; add an NTC and relay for safety.
Heat: Linear design generates heat at 1.125A (5W per charger), requiring heatsinks and ventilation.
Precision: Less precise than ICs, but sufficient for 1.125A/4.2V with careful component selection.
Part 2: Lower-Tech, Analog BMS for 2S2P (Deadbug Style)
Functions of a BMS IC (for 2S, 2.25A per String, 4.5A Total)
A typical BMS IC (e.g., BQ3060PWR, BQ76930) performs the following for each 2S string in your 2S2P pack:
Cell Voltage Monitoring: Ensures each cell stays within 2.5V-4.2V.
Cell Balancing: Equalizes cell voltages (e.g., 4.2V each) to prevent imbalances.
Overcharge Protection: Cuts off charging if any cell exceeds 4.2V.
Overdischarge Protection: Cuts off discharge if any cell drops below 2.5V-3.0V.
Overcurrent Protection: Limits charge/discharge to 2.25A per string (4.5A total).
Short Circuit Protection: Disconnects the battery if a short occurs.
Temperature Monitoring: Shuts off if temperatures exceed safe limits.
For 2S2P, you need two BMS circuits (one per 2S string, Cells 1-2 and Cells 3-4), handling 2.25A per string (4.5A total in parallel).
Lower-Tech, Analog BMS Design (Deadbug Style)
We’ll design a simple, analog BMS for each 2S string using basic components (resistors, capacitors, diodes, transistors, relays) that are easy to deadbug. This design will be replicated twice for your 2S2P pack.
Components (Per 2S String)
Voltage Divider Resistors (R5, R6): 10kΩ, 1/4W, through-hole – Monitors cell voltages (2.5V-4.2V) for each cell.
Zener Diodes (D3, D4): 4.2V, 1W (e.g., 1N4732A, through-hole) – Sets overcharge threshold (4.2V/cell).
Zener Diodes (D5, D6): 2.7V, 1W (e.g., 1N4729A, through-hole) – Sets overdischarge threshold (2.7V/cell, ~2.5V actual with tolerance).
N-Channel MOSFETs (Q3, Q4): IRF9540N, TO-220, through-hole – Controls charge/discharge for overcharge/overdischarge.
P-Channel MOSFETs (Q5, Q6): IRF9540N (or P-channel equivalent, e.g., IRF9540N with gate inversion), TO-220, through-hole – Controls short circuit/overcurrent.
Sense Resistor (R7): 0.01Ω, 2W, through-hole – Detects overcurrent (2.25A, I = 22.5mV / 0.01Ω).
Capacitor (C3): 1µF, 50V, ceramic or electrolytic, through-hole – Filters noise on voltage monitoring lines.
Relay (K1): SPDT, 12V coil, 10A contacts, through-hole – Disconnects battery for all faults (overcharge, overdischarge, overcurrent, short circuit).
Diode (D7): 1N4007, 1000V, 1A, through-hole – Protects relay coil from back-EMF.
NTC Thermistor (T1): 10kΩ at 25°C, through-hole – Monitors temperature, triggering K1 if overheating (>50°C).
Resistor (R8): 4.7kΩ, 1/4W, through-hole – Pulls thermistor voltage for temperature sensing.
LEDs (Optional): 3mm or 5mm, red/green, through-hole – Indicates faults (e.g., red for overcharge/overdischarge, green for normal).
Resistors (R9, R10, Optional): 330Ω-1kΩ, 1/4W, through-hole – Limits LED current.
Copper-Clad PCB: Single-sided, ~100mm x 100mm per BMS (two total for 2S2P).
Circuit Description (Per 2S String, e.g., Cells 1-2)
Cell Voltage Monitoring (2.5V-4.2V):
R5/R6 (10kΩ each) form a voltage divider for each cell: Cell 1 (B-) to B1, Cell 2 (B1) to B2.
D3 (4.2V Zener) triggers Q3 (N-Channel) to cut off charge if Cell 1 > 4.2V; D4 does the same for Cell 2.
D5 (2.7V Zener) triggers Q4 to cut off discharge if Cell 1 < 2.7V; D6 does the same for Cell 2.
Cell Balancing:
Use 1kΩ-10kΩ balancing resistors (R11, R12) across each cell, activated via Q3/Q4 during charging to bleed excess voltage, ensuring ~4.2V per cell (passive balancing, 50-200mA).
Overcurrent Protection (2.25A):
R7 (0.01Ω) senses current between P+ and B2. If voltage across R7 > 22.5mV (I = 2.25A), Q5 (P-Channel) activates, cutting off P+ via K1.
Short Circuit Protection:
Q5 also detects rapid current spikes (via R7), triggering K1 instantly to disconnect P+ and P-.
Temperature Monitoring:
T1 (NTC) and R8 form a voltage divider. If temperature > 50°C (resistance drops below ~5kΩ), Q6 activates K1 to disconnect the battery.
Relay Control (K1):
K1 (12V coil) disconnects P+ and P- for all faults, powered by 9V USB-C PD via D7 for coil protection.
Output: P- and P+ connect to charger/load, controlled by K1 for safety.
Deadbug Layout (Per 2S String)
Ground Plane (Copper-Clad, ~100mm x 100mm)
  +------------------+
  |                  |
  |  B- (Cell 1-) ---+--- R5 (10kΩ) ---+--- D3 (4.2V) --- Q3 (IRF9540N) --- K1 (Relay, NO) --- P+
  |                  |                 |                          |
  |                  |                 +--- D5 (2.7V) --- Q4 (IRF9540N) --- K1 (NC) --- P-
  |                  |
  |  B1 (Cell 1+/2-) ---+--- R6 (10kΩ) ---+--- D4 (4.2V) --- Q3 --- K1 (NO) --- P+
  |                  |                     |                          |
  |                  |                     +--- D6 (2.7V) --- Q4 --- K1 (NC) --- P-
  |                  |
  |  B2 (Cell 2+) ---+--- R7 (0.01Ω, 2W) --- Q5 (IRF9540N) --- K1 (NO/NC) --- P+/P-
  |                  |
  |  T1 (NTC, 10kΩ) --- R8 (4.7kΩ) --- Q6 (IRF9540N) --- K1 (Coil) --- D7 (1N4007) --- USB-C (9V)
  |                  |
  |  R11 (1kΩ), R12 (1kΩ) --- Balancing across B-/B1, B1/B2 (via Q3/Q4)
  |                  |
  |  C3 (1uF, 50V) --- Noise filter on B-, B1, B2
  |                  |
  |  LED (Fault) --- R9 (330Ω) --- Q3/Q4/Q5/Q6 --- GND
  |                  |
  +------------------+
  v (GND: Copper-Clad Plane)
Mount D3-D7, Q3-Q6, R5-R12, C3, T1, K1, and LED/R9 upside-down on isolated pads or through-hole pins on the ground plane.
Solder 14-18 AWG wires for power (B-, B1, B2, P-, P+) and 24-28 AWG for signals (thermistor, LED).
Use heatsinks on Q3-Q6, R7, and K1 for 2.25A (heat dissipation ~5W per string, total 10W for 2S2P).
Advantages
Deadbug-Friendly: Through-hole components (TO-220, TO-92, radial resistors/caps) are easy to solder and wire on the ground plane.
Low-Tech: No fine-pitch ICs, all analog components are robust and widely available.
Cost: ~$5-10 per BMS (D3-D6 $0.20 each, Q3-Q6 $0.50 each, R5-R12 $0.05 each, C3 $0.20, T1 $0.50, K1 $2-5, D7 $0.10, LED/R9 $0.20), total $10-20 for two BMS circuits.
Limitations
No SoC: Lacks state-of-charge estimation; add a simple voltage-based SoC (e.g., voltage divider and voltmeter) if needed.
Manual Balancing: Passive balancing (resistors) is slow and less efficient than IC-based active balancing, but sufficient for 2S with matched cells.
Heat: Requires heatsinks and ventilation for 2.25A per string (4.5A total).
Complexity: More components than IC-based BMS, but deadbug-friendly and reliable with testing.
Integration for 2S2P
Charger: Use four analog chargers (one per cell, Cells 1-4) at 1.125A each (4.5A total), connected to 9V USB-C PD via a 1N5819 diode.
BMS: Use two analog BMS circuits (one per 2S string, Cells 1-2 and 3-4) at 2.25A each (4.5A total in parallel), connected to charger outputs and battery cells.
Boost Converter: Add a boost converter (e.g., LM2577, TO-220) to step up 6V-8.4V to 9V at 4.5A for the Lego build HAT + Raspberry Pi.
Deadbug Construction Tips
Use a copper-clad ground plane (~150mm x 100mm total) for all components, isolating pads with a Dremel or nail polish.
Solder through-hole components upside-down, using 14-18 AWG for power and 24-28 AWG for signals.
Add heatsinks to transistors, resistors, and relays, with ventilation holes in your 3D-printed cube.
Test with dummy batteries and a lab power supply (9V, 4.5A) to verify CC/CV, protection, and balancing.
Cost and Availability
Charger (4 units): $4-8 total.
BMS (2 units): $10-20 total.
Boost Converter: $1-5.
Total: $15-33, plus wires, connectors, and heatsinks ($5-15), much cheaper than IC-based solutions ($58.34 + breakouts).
Conclusion
These analog solutions are simpler, cheaper, and deadbug-friendly, using through-hole components for easy soldering and wiring on your ground plane. They meet your 2S2P, 4.5A requirements but lack advanced features (SoC, active balancing) and require careful thermal management. Let me know if you’d like detailed schematics, BOM updates, or help testing these designs! I can also refine the layouts or suggest specific component suppliers.