let currentLevel = 0;
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
let jumpVelocity = -12;
let onGround = true;
let showIntro = true;
let cameraX = 0;

let levels = [
  {
    name: "Input",
    intro: "Welcome to Coulomb's Odyssey! Reduce ripple by charging capacitors to grow the goal circle, then jump through to proceed.",
    platforms: [],
    components: [
      { type: 'capacitor', x: 200, y: 350, width: 50, height: 30, chargeTime: 180, chargeLevel: 0, charged: false, rippleReduction: 5 },
      { type: 'capacitor', x: 500, y: 350, width: 50, height: 30, chargeTime: 180, chargeLevel: 0, charged: false, rippleReduction: 5 }
    ],
    ripple: { initial: 10, current: 10 },
    goalCircle: { x: 700, y: 300, baseSize: 5, maxSize: 50 }
  },
  {
    name: "Schottky Diode",
    intro: "Pay 0.3V at the diode to lower the barrier. Charge capacitors to reduce ripple and grow the goal circle!",
    platforms: [{ x: 250, y: 340, width: 100, height: 20 }],
    components: [
      { type: 'diode', x: 300, y: 290, width: 50, height: 50, toll: 0.3, paid: false },
      { type: 'capacitor', x: 100, y: 350, width: 50, height: 30, chargeTime: 180, chargeLevel: 0, charged: false, rippleReduction: 5 },
      { type: 'capacitor', x: 600, y: 350, width: 50, height: 30, chargeTime: 180, chargeLevel: 0, charged: false, rippleReduction: 5 }
    ],
    ripple: { initial: 10, current: 10 },
    goalCircle: { x: 700, y: 300, baseSize: 5, maxSize: 50 },
    barrier: { x: 500, y: 350, width: 20, height: 100, lowered: false }
  },
  {
    name: "Capacitor",
    intro: "Charge the main capacitor to gain 2V. Use additional capacitors to reduce ripple and grow the goal circle.",
    platforms: [{ x: 400, y: 340, width: 100, height: 20 }],
    components: [
      { type: 'capacitor', x: 400, y: 290, width: 100, height: 50, chargeTime: 180, chargeLevel: 0, charged: false, rippleReduction: 5, isMain: true },
      { type: 'capacitor', x: 200, y: 350, width: 50, height: 30, chargeTime: 180, chargeLevel: 0, charged: false, rippleReduction: 5 }
    ],
    ripple: { initial: 10, current: 10 },
    goalCircle: { x: 700, y: 300, baseSize: 5, maxSize: 50 },
    charged: false
  },
  {
    name: "BQ24133 Charger IC",
    intro: "Adjust the charger's current to 1.125A. Charge capacitors to reduce ripple and grow the goal circle.",
    platforms: [{ x: 300, y: 340, width: 100, height: 20 }],
    components: [
      { type: 'charger', x: 350, y: 290, width: 50, height: 50, targetCurrent: 1.125, current: 0 },
      { type: 'capacitor', x: 100, y: 350, width: 50, height: 30, chargeTime: 180, chargeLevel: 0, charged: false, rippleReduction: 5 },
      { type: 'capacitor', x: 600, y: 350, width: 50, height: 30, chargeTime: 180, chargeLevel: 0, charged: false, rippleReduction: 5 }
    ],
    ripple: { initial: 10, current: 10 },
    goalCircle: { x: 700, y: 300, baseSize: 5, maxSize: 50 },
    adjusted: false
  },
  {
    name: "Lithium-Ion Cell",
    intro: "Charge the cell to 4.2V. Use capacitors to reduce ripple and grow the goal circle.",
    platforms: [{ x: 350, y: 340, width: 100, height: 20 }],
    components: [
      { type: 'cell', x: 350, y: 290, width: 50, height: 50, voltage: 0, targetVoltage: 4.2 },
      { type: 'capacitor', x: 100, y: 350, width: 50, height: 30, chargeTime: 180, chargeLevel: 0, charged: false, rippleReduction: 5 },
      { type: 'capacitor', x: 600, y: 350, width: 50, height: 30, chargeTime: 180, chargeLevel: 0, charged: false, rippleReduction: 5 }
    ],
    ripple: { initial: 10, current: 10 },
    goalCircle: { x: 700, y: 300, baseSize: 5, maxSize: 50 },
    charged: false
  },
  {
    name: "Battery Management System",
    intro: "Balance cells to 4.0V each with Space. Charge capacitors to reduce ripple and grow the goal circle.",
    platforms: [{ x: 200, y: 340, width: 100, height: 20 }, { x: 400, y: 340, width: 100, height: 20 }],
    components: [
      { type: 'cell', x: 200, y: 290, width: 50, height: 50, voltage: 3.8, targetVoltage: 4.0 },
      { type: 'cell', x: 400, y: 290, width: 50, height: 50, voltage: 4.2, targetVoltage: 4.0 },
      { type: 'capacitor', x: 100, y: 350, width: 50, height: 30, chargeTime: 180, chargeLevel: 0, charged: false, rippleReduction: 5 },
      { type: 'capacitor', x: 600, y: 350, width: 50, height: 30, chargeTime: 180, chargeLevel: 0, charged: false, rippleReduction: 5 }
    ],
    ripple: { initial: 10, current: 10 },
    goalCircle: { x: 700, y: 300, baseSize: 5, maxSize: 50 },
    balanced: false
  },
  {
    name: "Load Path",
    intro: "Reach the goal with 5V after resistors drain 1V each. Charge capacitors to reduce ripple.",
    platforms: [{ x: 100, y: 340, width: 600, height: 20 }],
    components: [
      { type: 'resistor', x: 250, y: 290, width: 50, height: 50, toll: 1.0, paid: false },
      { type: 'resistor', x: 450, y: 290, width: 50, height: 50, toll: 1.0, paid: false },
      { type: 'capacitor', x: 100, y: 350, width: 50, height: 30, chargeTime: 180, chargeLevel: 0, charged: false, rippleReduction: 5 },
      { type: 'capacitor', x: 600, y: 350, width: 50, height: 30, chargeTime: 180, chargeLevel: 0, charged: false, rippleReduction: 5 }
    ],
    ripple: { initial: 10, current: 10 },
    goalCircle: { x: 700, y: 300, baseSize: 5, maxSize: 50 },
    minVoltage: 5.0
  }
];

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background(220);
  
  if (currentLevel === 0) {
    drawMenu();
  } else if (currentLevel > 0 && currentLevel <= levels.length) {
    let level = levels[currentLevel - 1];
    if (showIntro) {
      textAlign(CENTER);
      textSize(24 * (min(width / 800, height / 400)));
      fill(0);
      text("Level " + currentLevel + ": " + level.name, width / 2, height / 2 - 20 * (height / 400));
      textSize(16 * (min(width / 800, height / 400)));
      text(level.intro, width / 2, height / 2);
      text("Press Enter to continue", width / 2, height / 2 + 20 * (height / 400));
      if (keyIsPressed && keyCode === ENTER) {
        showIntro = false;
      }
    } else {
      drawLevel(currentLevel);
    }
  } else {
    textAlign(CENTER);
    textSize(32 * (min(width / 800, height / 400)));
    fill(0);
    text("Game Complete!", width / 2, height / 2);
  }
}

function drawMenu() {
  textAlign(CENTER);
  textSize(32 * (min(width / 800, height / 400)));
  fill(0);
  text("Coulomb's Odyssey", width / 2, height / 2 - 50 * (height / 400));
  textSize(16 * (min(width / 800, height / 400)));
  text("Press Enter to Start", width / 2, height / 2);
}

function drawLevel(levelNum) {
  let level = levels[levelNum - 1];
  let levelWidth = width * 2;
  let scaleX = width / 800;
  let scaleY = height / 400;
  let scale = min(scaleX, scaleY);

  let targetCameraX = constrain(player.x * scaleX - width / 2, 0, levelWidth - width);
  cameraX = lerp(cameraX, targetCameraX, 0.1);

  fill(120, 100, 50);
  for (let x = -cameraX * 0.2; x < levelWidth; x += 50) {
    rect(x, 0, 3, height);
  }

  fill(180, 160, 100);
  for (let x = -cameraX * 0.5; x < levelWidth; x += 30) {
    rect(x, 0, 2, height);
  }

  push();
  translate(-cameraX, 0);

  fill(139, 69, 19);
  rect(0, groundY * scaleY, levelWidth, height - groundY * scaleY);

  for (let p of level.platforms) {
    fill(100);
    rect(p.x * scaleX, p.y * scaleY, p.width * scaleX, p.height * scaleY);
  }

  for (let c of level.components) {
    let scaledX = c.x * scaleX;
    let scaledY = c.y * scaleY;
    let scaledWidth = c.width * scaleX;
    let scaledHeight = c.height * scaleY;

    if (c.type === 'diode') {
      fill(192, 192, 192);
      rect(scaledX, scaledY, scaledWidth, scaledHeight);
      fill(0);
      rect(scaledX + scaledWidth / 2, scaledY, scaledWidth / 2, scaledHeight);
    } else if (c.type === 'capacitor') {
      fill(0, 0, 255);
      rect(scaledX, scaledY, scaledWidth, scaledHeight);
      if (c.chargeLevel > 0) {
        let chargeRatio = c.chargeLevel / c.chargeTime;
        fill(0, 255, 0);
        rect(scaledX, scaledY, scaledWidth * chargeRatio, scaledHeight);
      }
    } else if (c.type === 'charger') {
      fill(255, 215, 0);
      rect(scaledX, scaledY, scaledWidth, scaledHeight);
      fill(0);
      text("I: " + c.current.toFixed(3) + "A", scaledX, scaledY - 10 * scaleY);
    } else if (c.type === 'cell') {
      fill(0, 255, 255);
      rect(scaledX, scaledY, scaledWidth, scaledHeight);
      fill(0);
      text(c.voltage.toFixed(1) + "V", scaledX, scaledY - 10 * scaleY);
    } else if (c.type === 'resistor') {
      fill(165, 42, 42);
      rect(scaledX, scaledY, scaledWidth, scaledHeight);
    }
  }

  if (level.barrier && !level.barrier.lowered) {
    fill(255, 0, 0);
    rect(level.barrier.x * scaleX, level.barrier.y * scaleY, 
         level.barrier.width * scaleX, level.barrier.height * scaleY);
  }

  // Goal Circle with visual feedback
  let playerCenter = { x: player.x * scaleX, y: player.y * scaleY };
  let goalCenter = { x: level.goalCircle.x * scaleX, y: level.goalCircle.y * scaleY };
  let distance = dist(playerCenter.x, playerCenter.y, goalCenter.x, goalCenter.y);
  let rippleFraction = max(0, (level.ripple.initial - level.ripple.current) / level.ripple.initial);
  let goalSize = (level.goalCircle.baseSize + (level.goalCircle.maxSize - level.goalCircle.baseSize) * rippleFraction) * scale;
  let goalRadius = goalSize / 2;

  if (distance + player.radius * scale < goalRadius) {
    fill(0, 255, 0, sin(frameCount * 0.1) * 127 + 128); // Pulsing green
    text("Press Space to proceed!", 10, 80 * scaleY); // HUD message
  } else {
    fill(0, 255, 0); // Regular green
  }
  ellipse(level.goalCircle.x * scaleX, level.goalCircle.y * scaleY, goalSize);

  fill(0, 0, 255);
  let maxShake = 5; // Maximum shake amount in pixels
  let shakeAmount = (level.ripple.current / level.ripple.initial) * maxShake;
  let shakeX = random(-shakeAmount, shakeAmount);
  let shakeY = random(-shakeAmount, shakeAmount);
  ellipse(player.x * scaleX + shakeX, player.y * scaleY + shakeY, player.radius * 2 * scale);

  pop();

  textAlign(LEFT);
  textSize(16 * scale);
  fill(0);
  text("Voltage: " + player.voltage.toFixed(1) + "V", 10, 20 * scaleY);
  text("Ripple: " + level.ripple.current.toFixed(1), 10, 40 * scaleY);
  
  if (levelNum === 1) {
    text("Jump through the goal circle!", 10, 60 * scaleY);
  } else if (levelNum === 2) {
    text("Pay 0.3V at the diode to pass!", 10, 60 * scaleY);
  } else if (levelNum === 3) {
    text("Stand on the main capacitor to charge!", 10, 60 * scaleY);
    if (level.charged) text("Charged! Jump through the goal.", 10, 80 * scaleY);
  } else if (levelNum === 4) {
    text("Adjust current to 1.125A with arrow keys!", 10, 60 * scaleY);
  } else if (levelNum === 5) {
    text("Stand on the cell to charge it to 4.2V!", 10, 60 * scaleY);
  } else if (levelNum === 6) {
    text("Press Space on cells to balance to 4.0V!", 10, 60 * scaleY);
  } else if (levelNum === 7) {
    text("Reach the goal with at least 5V!", 10, 60 * scaleY);
  }

  updatePlayer(level);
}

function updatePlayer(level) {
  if (keyIsDown(LEFT_ARROW)) player.vx -= 0.5;
  if (keyIsDown(RIGHT_ARROW)) player.vx += 0.5;
  player.vx *= 0.9;
  player.x += player.vx;

  if (keyIsDown(UP_ARROW) && onGround) {
    player.vy = jumpVelocity;
    onGround = false;
  }
  player.vy += gravity;
  player.y += player.vy;

  if (player.y >= groundY - player.radius) {
    player.y = groundY - player.radius;
    player.vy = 0;
    onGround = true;
  } else if (player.vy > 0) {
    onGround = false;
  }

  for (let p of level.platforms) {
    if (player.vy > 0 && 
        player.y + player.radius > p.y && 
        player.y - player.radius < p.y + p.height && 
        player.x > p.x && 
        player.x < p.x + p.width) {
      player.y = p.y - player.radius;
      player.vy = 0;
      onGround = true;
    }
  }

  for (let c of level.components) {
    if (overlap(player, c)) {
      if (c.type === 'diode' && !c.paid) {
        if (player.voltage >= c.toll) {
          player.voltage -= c.toll;
          c.paid = true;
          level.barrier.lowered = true;
        }
      } else if (c.type === 'capacitor' && !c.charged) {
        c.chargeLevel++;
        if (c.chargeLevel >= c.chargeTime) {
          c.charged = true;
          level.ripple.current = max(0, level.ripple.current - c.rippleReduction);
          if (currentLevel === 3 && c.isMain) {
            player.voltage += 2.0;
            level.charged = true;
          }
        }
      } else if (c.type === 'charger' && !level.adjusted) {
        let rate = keyIsDown(SHIFT) ? 0.01 : 0.001;
        if (keyIsDown(LEFT_ARROW)) {
          c.current = max(0, c.current - rate);
        }
        if (keyIsDown(RIGHT_ARROW)) {
          c.current = min(2.0, c.current + rate);
        }
        if (keyIsPressed && key === ' ') {
          if (abs(c.current - c.targetCurrent) < 0.01) {
            level.adjusted = true;
          }
        }
      } else if (c.type === 'cell') {
        if (keyIsDown(CONTROL)) {
          if (keyIsDown(UP_ARROW)) {
            if (player.voltage > 0.1) {
              c.voltage += 0.1;
              player.voltage -= 0.1;
            }
          } else if (keyIsDown(DOWN_ARROW)) {
            if (c.voltage > 0) {
              c.voltage -= 0.1;
              player.voltage += 0.1;
            }
          }
        }
      } else if (c.type === 'resistor' && !c.paid) {
        if (player.voltage >= c.toll) {
          player.voltage -= c.toll;
          c.paid = true;
        }
      }
    }
  }

  if (currentLevel === 6) {
    let cells = level.components.filter(c => c.type === 'cell');
    if (abs(cells[0].voltage - cells[1].voltage) < 0.1 && 
        abs(cells[0].voltage - cells[0].targetVoltage) < 0.1) {
      level.balanced = true;
    }
  }

  player.x = constrain(player.x, player.radius, width * 2 - player.radius);

  // Check goal circle completion
  let scaleX = width / 800;
  let scaleY = height / 400;
  let scale = min(scaleX, scaleY);
  let rippleFraction = max(0, (level.ripple.initial - level.ripple.current) / level.ripple.initial);
  let goalSize = (level.goalCircle.baseSize + (level.goalCircle.maxSize - level.goalCircle.baseSize) * rippleFraction) * scale;
  
  let playerCenter = { x: player.x * scaleX, y: player.y * scaleY };
  let goalCenter = { x: level.goalCircle.x * scaleX, y: level.goalCircle.y * scaleY };
  let distance = dist(playerCenter.x, playerCenter.y, goalCenter.x, goalCenter.y);
  let goalRadius = goalSize / 2;

  if (distance + player.radius * scale < goalRadius && keyIsPressed && key === ' ') {
    // Player is completely inside and pressed spacebar
    if (currentLevel === 1 || 
        (currentLevel === 2 && level.barrier.lowered) || 
        (currentLevel === 3 && level.charged) || 
        (currentLevel === 4 && level.adjusted) || 
        (currentLevel === 5 && level.charged) || 
        (currentLevel === 6 && level.balanced) || 
        (currentLevel === 7 && player.voltage >= level.minVoltage)) {
      currentLevel++;
      showIntro = true;
      player.x = 50;
      player.y = groundY - player.radius;
      player.vx = 0;
      player.vy = 0;
      // Reset ripple and capacitors for the next level
      if (currentLevel <= levels.length) {
        let nextLevel = levels[currentLevel - 1];
        nextLevel.ripple.current = nextLevel.ripple.initial;
        for (let c of nextLevel.components) {
          if (c.type === 'capacitor') {
            c.charged = false;
            c.chargeLevel = 0;
          }
        }
      }
    }
  }
}

function keyPressed() {
  if (currentLevel === 0 && keyCode === ENTER) {
    currentLevel = 1;
    showIntro = true;
  } else if (showIntro && keyCode === ENTER) {
    showIntro = false;
  }
}

function overlap(obj1, obj2) {
  let closestX = constrain(player.x, obj2.x, obj2.x + obj2.width);
  let closestY = constrain(player.y, obj2.y, obj2.y + obj2.height);
  let distanceX = player.x - closestX;
  let distanceY = player.y - closestY;
  return (distanceX * distanceX + distanceY * distanceY) < (player.radius * player.radius);
}

function circleOverlap(circle1, circle2) {
  let dx = circle1.x - circle2.x;
  let dy = circle1.y - circle2.y;
  let distance = sqrt(dx * dx + dy * dy);
  return distance < (circle1.radius + circle2.radius);
}