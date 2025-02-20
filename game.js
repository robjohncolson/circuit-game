// Global game variables
let currentLevel = 0; // 0 = menu, 1 = level 1, 2 = level 2, etc.
let player = { 
  x: 50, 
  y: 370, 
  vx: 0, 
  vy: 0, 
  radius: 10, 
  voltage: 9.0 
};
let gravity = 0.5;
let groundY = 380;
let jumpVelocity = -12; // Ensures player can reach platforms
let onGround = true;

// Level definitions
let levels = [
  { // Level 1: Input
    platforms: [],
    components: [],
    door: { x: 700, y: 300, width: 50, height: 100 }
  },
  { // Level 2: Schottky Diode
    platforms: [{ x: 250, y: 340, width: 100, height: 20 }],
    components: [{ type: 'diode', x: 300, y: 290, width: 50, height: 50, toll: 0.3 }],
    door: { x: 700, y: 300, width: 50, height: 100 },
    barrier: { x: 500, y: 350, width: 20, height: 100, lowered: false }
  },
  { // Level 3: Capacitor
    platforms: [{ x: 400, y: 340, width: 100, height: 20 }],
    components: [{ type: 'capacitor', x: 400, y: 290, width: 100, height: 50, chargeTime: 180, chargeLevel: 0 }],
    door: { x: 700, y: 300, width: 50, height: 100 },
    charged: false
  },
  { // Level 4: BQ24133 Charger IC
    platforms: [{ x: 300, y: 340, width: 100, height: 20 }],
    components: [{ type: 'charger', x: 350, y: 290, width: 50, height: 50, targetCurrent: 1.125, current: 0 }],
    door: { x: 700, y: 300, width: 50, height: 100 },
    adjusted: false
  },
  { // Level 5: Lithium-Ion Cell
    platforms: [{ x: 350, y: 340, width: 100, height: 20 }],
    components: [{ type: 'cell', x: 350, y: 290, width: 50, height: 50, voltage: 0, targetVoltage: 4.2 }],
    door: { x: 700, y: 300, width: 50, height: 100 },
    charged: false
  },
  { // Level 6: BMS
    platforms: [{ x: 200, y: 340, width: 100, height: 20 }, { x: 400, y: 340, width: 100, height: 20 }],
    components: [
      { type: 'cell', x: 200, y: 290, width: 50, height: 50, voltage: 3.8, targetVoltage: 4.0 },
      { type: 'cell', x: 400, y: 290, width: 50, height: 50, voltage: 4.2, targetVoltage: 4.0 }
    ],
    door: { x: 700, y: 300, width: 50, height: 100 },
    balanced: false
  },
  { // Level 7: Load Path
    platforms: [{ x: 100, y: 340, width: 600, height: 20 }],
    components: [
      { type: 'resistor', x: 250, y: 290, width: 50, height: 50, toll: 1.0 },
      { type: 'resistor', x: 450, y: 290, width: 50, height: 50, toll: 1.0 }
    ],
    door: { x: 700, y: 300, width: 50, height: 100 },
    minVoltage: 5.0
  }
];

function setup() {
  createCanvas(800, 400);
}

function draw() {
  background(220);
  if (currentLevel === 0) {
    drawMenu();
  } else if (currentLevel > 0 && currentLevel <= levels.length) {
    drawLevel(currentLevel);
  } else {
    textAlign(CENTER);
    textSize(32);
    fill(0);
    text("Game Complete", width / 2, height / 2);
  }
}

function drawMenu() {
  textAlign(CENTER);
  textSize(32);
  fill(0);
  text("Coulomb's Odyssey", width / 2, height / 2 - 50);
  textSize(16);
  text("Press Enter to Start", width / 2, height / 2);
}

function drawLevel(levelNum) {
  let level = levels[levelNum - 1];
  let cameraX = constrain(player.x - width / 2, 0, width); // Camera follows player

  // Parallax background layers with vertical lines
  push();
  translate(-cameraX * 0.2, 0);
  fill(184, 134, 11);
  for (let x = 0; x < width * 2; x += 100) {
    rect(x, 0, 5, height);
  }
  pop();

  push();
  translate(-cameraX * 0.5, 0);
  fill(150);
  for (let x = 0; x < width * 2; x += 50) {
    rect(x, 0, 3, height);
  }
  pop();

  // Draw game world with camera offset
  push();
  translate(-cameraX, 0);

  // Draw ground
  fill(139, 69, 19); // Brown ground
  rect(0, groundY, width * 2, height - groundY);

  // Draw platforms
  for (let p of level.platforms) {
    fill(100);
    rect(p.x, p.y, p.width, p.height);
  }

  // Draw components
  for (let c of level.components) {
    if (c.type === 'diode') {
      fill(192, 192, 192);
      rect(c.x, c.y, c.width, c.height);
      fill(0);
      rect(c.x + c.width / 2, c.y, c.width / 2, c.height);
    } else if (c.type === 'capacitor') {
      fill(0, 0, 255);
      rect(c.x, c.y, c.width, c.height);
      if (c.chargeLevel > 0) {
        let chargeRatio = c.chargeLevel / c.chargeTime;
        fill(0, 255, 0);
        rect(c.x, c.y, c.width * chargeRatio, c.height);
      }
    } else if (c.type === 'charger') {
      fill(255, 215, 0); // Gold
      rect(c.x, c.y, c.width, c.height);
      fill(0);
      text("I: " + c.current.toFixed(3) + "A", c.x, c.y - 10);
    } else if (c.type === 'cell') {
      fill(0, 255, 255); // Cyan
      rect(c.x, c.y, c.width, c.height);
      fill(0);
      text(c.voltage.toFixed(1) + "V", c.x, c.y - 10);
    } else if (c.type === 'resistor') {
      fill(165, 42, 42); // Brown
      rect(c.x, c.y, c.width, c.height);
    }
  }

  // Draw door
  fill(255, 0, 0);
  rect(level.door.x, level.door.y, level.door.width, level.door.height);

  // Draw barrier if present
  if (level.barrier && !level.barrier.lowered) {
    fill(255, 0, 0);
    rect(level.barrier.x, level.barrier.y, level.barrier.width, level.barrier.height);
  }

  // Draw player
  fill(0, 0, 255);
  ellipse(player.x, player.y, player.radius * 2);

  pop();

  // Draw HUD and instructions in screen space (fixed at top-left)
  textAlign(LEFT);
  textSize(16);
  fill(0);
  text("Voltage: " + player.voltage.toFixed(1) + "V", 10, 20);
  
  if (levelNum === 1) {
    text("Reach the door!", 10, 40);
  } else if (levelNum === 2) {
    text("Pay 0.3V at the diode to pass!", 10, 40);
  } else if (levelNum === 3) {
    text("Stand on the capacitor to charge!", 10, 40);
    if (level.charged) {
      text("Charged! Proceed to the door.", 10, 60);
    }
  } else if (levelNum === 4) {
    text("Adjust current to 1.125A, then press Space!", 10, 40);
  } else if (levelNum === 5) {
    text("Stand on the cell to charge it to 4.2V!", 10, 40);
  } else if (levelNum === 6) {
    text("Balance both cells to 4.0V!", 10, 40);
  } else if (levelNum === 7) {
    text("Reach the load with at least 5V!", 10, 40);
  }

  // Update player and game logic (unchanged)
  updatePlayer(level);
}

function updatePlayer(level) {
  // Movement controls
  if (keyIsDown(LEFT_ARROW)) player.vx -= 0.5;
  if (keyIsDown(RIGHT_ARROW)) player.vx += 0.5;
  player.vx *= 0.9; // Friction
  player.x += player.vx;

  // Jumping
  if (keyIsDown(UP_ARROW) && onGround) {
    player.vy = jumpVelocity;
    onGround = false;
  }
  player.vy += gravity;
  player.y += player.vy;

  // Ground collision
  if (player.y >= groundY - player.radius) {
    player.y = groundY - player.radius;
    player.vy = 0;
    onGround = true;
  } else if (player.vy > 0) {
    onGround = false; // In air unless on platform
  }

  // Platform collisions
  for (let p of level.platforms) {
    if (player.vy > 0 && // Falling
        player.y + player.radius > p.y && 
        player.y - player.radius < p.y + p.height && 
        player.x > p.x && 
        player.x < p.x + p.width) {
      player.y = p.y - player.radius;
      player.vy = 0;
      onGround = true;
    }
  }

  // Component interactions
  for (let c of level.components) {
    if (overlap(player, c)) {
      if (c.type === 'diode' && !c.paid) {
        if (player.voltage >= c.toll) {
          player.voltage -= c.toll;
          c.paid = true;
          level.barrier.lowered = true;
        }
      } else if (c.type === 'capacitor' && c.chargeLevel < c.chargeTime) {
        c.chargeLevel++;
        if (c.chargeLevel >= c.chargeTime) {
          player.voltage += 2.0; // Bonus voltage for charging
          level.charged = true;
        }
      } else if (c.type === 'charger' && !level.adjusted) {
        // Charger current adjustment with finer control
        if (keyIsDown(LEFT_ARROW)) {
          c.current = max(0.5, c.current - 0.001);
        }
        if (keyIsDown(RIGHT_ARROW)) {
          c.current = min(2.0, c.current + 0.001);
        }
        // Automatically detect when current matches target
        if (abs(c.current - c.targetCurrent) < 0.01) {
          level.adjusted = true;
        }
      } else if (c.type === 'cell' && c.voltage < c.targetVoltage && player.voltage > 0) {
        // Cell charging
        c.voltage = min(c.targetVoltage, c.voltage + 0.1);
        player.voltage = max(0, player.voltage - 0.1);
        if (c.voltage >= c.targetVoltage) {
          level.charged = true;
        }
      } else if (c.type === 'resistor' && !c.paid) {
        if (player.voltage >= c.toll) {
          player.voltage -= c.toll;
          c.paid = true;
        }
      }
    }
  }

  // BMS balancing (Level 6)
  if (currentLevel === 6) {
    let cells = level.components;
    if (overlap(player, cells[0]) && keyIsDown(32) && player.voltage > 0) {
      cells[0].voltage = min(cells[0].targetVoltage, cells[0].voltage + 0.1);
      player.voltage = max(0, player.voltage - 0.1);
    }
    if (overlap(player, cells[1]) && keyIsDown(32) && player.voltage > 0) {
      cells[1].voltage = min(cells[1].targetVoltage, cells[1].voltage + 0.1);
      player.voltage = max(0, player.voltage - 0.1);
    }
    // Check if cells are balanced
    if (abs(cells[0].voltage - cells[1].voltage) < 0.1 && 
        abs(cells[0].voltage - cells[0].targetVoltage) < 0.1) {
      level.balanced = true;
    }
  }

  // Keep player within level bounds
  player.x = constrain(player.x, player.radius, width * 2 - player.radius);

  // Check level completion conditions
  if (overlap(player, level.door)) {
    if (currentLevel === 1 || // Basic level
        (currentLevel === 2 && level.barrier.lowered) || // Diode level
        (currentLevel === 3 && level.charged) || // Capacitor level
        (currentLevel === 4 && level.adjusted) || // Charger level
        (currentLevel === 5 && level.charged) || // Cell level
        (currentLevel === 6 && level.balanced) || // BMS level
        (currentLevel === 7 && player.voltage >= level.minVoltage)) { // Load level
      currentLevel++;
      player.x = 50;
      player.y = groundY - player.radius;
      player.vx = 0;
      player.vy = 0;
    }
  }
}

function keyPressed() {
  if (currentLevel === 0 && keyCode === ENTER) {
    currentLevel = 1;
  } else if (currentLevel > 0) {
    let level = levels[currentLevel - 1];
    if (keyCode === 32) { // Spacebar
      for (let c of level.components) {
        if (overlap(player, c)) {
          if (c.type === 'diode' && player.voltage >= c.toll) {
            player.voltage -= c.toll;
            level.barrier.lowered = true;
          }
        }
      }
      if (overlap(player, level.door)) {
        if ((currentLevel === 2 && level.barrier.lowered) || 
            currentLevel === 1 || 
            (currentLevel === 3 && level.charged)) {
          currentLevel++;
          player.x = 50;
          player.y = groundY - player.radius;
        }
      }
    }
  }
}

function overlap(obj1, obj2) {
  let closestX = constrain(player.x, obj2.x, obj2.x + obj2.width);
  let closestY = constrain(player.y, obj2.y, obj2.y + obj2.height);
  let distanceX = player.x - closestX;
  let distanceY = player.y - closestY;
  return (distanceX * distanceX + distanceY * distanceY) < (player.radius * player.radius);
}