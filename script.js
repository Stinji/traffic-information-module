
const startScreen = document.getElementById("start-screen");
const exerciseScreen = document.getElementById("exercise-screen");
const startBtn = document.getElementById("start");
const nextBtn = document.getElementById("next");

const changeScreen = () => {                // When button is clicked, change screen to exercise
  startScreen.classList.add("hidden");
  exerciseScreen.classList.remove("hidden");
  return;
}

startBtn.addEventListener("click", changeScreen);
startBtn.addEventListener("click", startGeneration);
nextBtn.addEventListener("click", startGeneration);


function draw(target, intruder, solution) {
  // SVGs
  const drawingDimensions = 400;
  const center = drawingDimensions / 2;

  updateAttr = (element, name, value) => {    // Update multiple attributes for one element
    for (let i = 0; i < name.length; i++) {
      element.setAttribute(name[i], value)
    }
  }

  // Radar SVGs
  const drawing = document.getElementById("drawing");
  const radarBackground = document.getElementById("radar-background");
  const radarCrosshairRTL = document.getElementById("radar-crosshair-rtl");
  const radarCrosshairLTR = document.getElementById("radar-crosshair-ltr");
  const radar3NM = document.getElementById("radar-3nm");
  const radar6NM = document.getElementById("radar-6nm");
  const radar9NM = document.getElementById("radar-9nm");
  const testCircle = document.getElementById("test");

  updateAttr(drawing, ["height", "width"], drawingDimensions)

  updateAttr(radarBackground, ["r", "cx", "cy"], center);

  updateAttr(radarCrosshairLTR, ["x1", "x2"], center);
  updateAttr(radarCrosshairLTR, ["y2"], drawingDimensions);

  updateAttr(radarCrosshairRTL, ["y1", "y2"], center);
  updateAttr(radarCrosshairRTL, ["x2"], drawingDimensions);

  updateAttr(radar3NM, ["cx", "cy"], center);
  updateAttr(radar6NM, ["cx", "cy"], center);
  updateAttr(radar9NM, ["cx", "cy"], center);
  updateAttr(radar3NM, ["r"], drawingDimensions / 8);
  updateAttr(radar6NM, ["r"], drawingDimensions / 4);
  updateAttr(radar9NM, ["r"], drawingDimensions / 8 * 3);

  //Target SVGs
  const speedToLength = (speed, sMin = 60, sMax = 350, Lmin = 15, Lmax = 45) => {
    const selectedSpeed = Math.max(sMin, Math.min(sMax, speed));
    const ratio = (selectedSpeed - sMin) / (sMax - sMin);         // Determine speed between 0 and 1
    return Lmin + ratio * (Lmax - Lmin);                          // 0 = Lmin px and 1 = Lmax px
  }

  const calculateDirection = (selected, deg, length, x, y) => {   // Kinda working but not really
    const degToRad = deg * Math.PI / 180;
    const dx = length * Math.sin(degToRad);
    const dy = -length * Math.cos(degToRad);
    selected.setAttribute(x, dx + center);
    selected.setAttribute(y, dy + center);
  }

  const clockToDeg = () => {
    return (solution.clock % 12) * 30;
  }

  const squareSize = 10;
  const targetSquare = document.getElementById("target-square");
  const targetLeader = document.getElementById("target-leaderline");
  const intruderSquare = document.getElementById("intruder-square");
  const intruderLeader = document.getElementById("intruder-leaderline");

  targetSquare.setAttribute("x", center - squareSize / 2);
  targetSquare.setAttribute("y", center - squareSize / 2);
  targetLeader.setAttribute("x1", center);
  targetLeader.setAttribute("y1", center);
  calculateDirection(targetLeader, target.heading, speedToLength(target.speed), "x2", "y2");
  // calculateDirection(intruderSquare, clockToDeg(), speedToLength(intruder.speed), "x", "y");
  // calculateDirection(intruderLeader, clockToDeg(), speedToLength(intruder.speed), "x1", "y1");
  // calculateDirection(intruderLeader, intruder.heading, speedToLength(intruder.speed), "x2", "y2");



  // ========================================================
  // === Helper math functions for headings and vectors =====
  // ========================================================

  // Degrees ↔ Radians conversion constants
  const DEG2RAD = Math.PI / 180;
  const RAD2DEG = 180 / Math.PI;

  /**
   * Convert an aviation heading (degrees) to a unit vector.
   * Aviation convention: 0°/360° = north (up), 90° = east (right).
   * Screen Y grows downward, so we flip the cosine term.
   */
  function headingToVector(headingDeg) {
    const θ = headingDeg * DEG2RAD;
    return { x: Math.sin(θ), y: -Math.cos(θ) };
  }

  /**
   * Convert a vector (x,y) into an aviation heading in degrees (1..360).
   */
  function vectorToHeading(vx, vy) {
    const angleDeg = Math.atan2(vx, -vy) * RAD2DEG; // atan2 returns -180..180
    return wrapDeg360(angleDeg);
  }

  /**
   * Keep any angle in the 1..360 range.
   */
  function wrapDeg360(angle) {
    const wrapped = ((angle % 360) + 360) % 360; // 0..359
    return wrapped === 0 ? 360 : wrapped;        // replace 0 with 360
  }

  /**
   * Convert a clock position (1–12) into a relative bearing in degrees.
   * 12 = 0° (ahead), 3 = 90° (right), 6 = 180° (behind), 9 = 270° (left).
   */
  function clockToRelativeBearing(clock) {
    return (clock % 12) * 30;
  }

  /**
   * Pick a random number between a and b.
   */
  function randBetween(a, b) {
    return a + Math.random() * (b - a);
  }

  // ========================================================
  // === Core functions for geometry ========================
  // ========================================================

  /**
   * Find the intersection point in front of the target.
   * Example: 4 miles ahead of the target in its current heading.
   */
  function getIntersectionPoint(target, distanceAhead) {
    const forward = headingToVector(target.heading);
    return {
      x: center + forward.x * distanceAhead,
      y: center + forward.y * distanceAhead
    };
  }

  function calculateAngle(A, B, C) {
    let AB = Math.sqrt(Math.pow(B.x - A.x, 2) + Math.pow(B.y - A.y, 2));
    let BC = Math.sqrt(Math.pow(B.x - C, 2) + Math.pow(B.y - C, 2));
    let AC = Math.sqrt(Math.pow(C - A.x, 2) + Math.pow(C - A.y, 2));
    console.log(Math.acos((BC * BC + AB * AB - AC * AC) / (2 * BC * AB)) * 180 / Math.PI);
    return Math.acos((BC * BC + AB * AB - AC * AC) / (2 * BC * AB));
  }

  /**
   * Place an intruder relative to the target at a given clock position & range.
   * Example: "3 NM at 10 o'clock".
   */
  function placeIntruderAtClock(target, clock, range, intersection) {
    // Step 1: relative bearing (in degrees) from clock value
    const relBearing = clockToRelativeBearing(clock);

    // Step 2: absolute bearing = target heading + relative bearing
    const absBearing = wrapDeg360(target.heading + relBearing);

    // Step 3: convert bearing to a unit vector
    const direction = headingToVector(absBearing);

    // Step 4: intruder position = target position + direction * range
    let intruderCenter = {
      x: center + direction.x * range,
      y: center + direction.y * range
    };
    let angle = calculateAngle(intruderCenter, intersection, center) * 180 / Math.PI;

    console.log(intruderCenter);

    while (angle < 55 || angle > 125) { // works 90% but sometimes says it's a bigger angle than it actually is
      solution.distance = Math.floor(Math.random() * 6) + 2;
      range = solution.distance / 3 * 50;
      intruderCenter = {
        x: center - 5 + direction.x * range,
        y: center - 5 + direction.y * range
      };
      angle = calculateAngle(intruderCenter, intersection, center) * 180 / Math.PI;
    }
    console.log("angle: " + angle);
    return {
      x: center - 5 + direction.x * range,
      y: center - 5 + direction.y * range
    };
  }

  /**
   * Compute the heading from one point to another.
   * Example: intruder → intersection point.
   */
  function headingTowardPoint(from, to) {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    return vectorToHeading(dx, dy);
  }

  // ========================================================
  // === Main function: spawn intruder crossing left→right ==
  // ========================================================

  /**
   * Spawns an intruder aircraft that will cross from left to right
   * in front of the target aircraft.
   *
   * target = {
   *   pos: {x, y},         // target position
   *   headingDeg: number,  // target heading (1..360)
   * }
   */
  function spawnIntruderCrossingLeftToRight(target) {
    // Step 1: pick one of the allowed clock positions / intruder range / intersection ahead
    const clock = Math.floor(Math.random() * 2) + 10;   // Number between 10 - 11
    let range = solution.distance / 3 * 50;
    const ahead = Math.floor(Math.random() * 5 + 2) / 3 * 50;    // Number between 2 - 6

    // Step 2: compute intersection point in front of target
    const intersection = getIntersectionPoint(target, ahead);
    testCircle.setAttribute("cx", intersection.x);
    testCircle.setAttribute("cy", intersection.y);

    // Step 3: place intruder at chosen clock & range
    const intruderCenter = placeIntruderAtClock(target, clock, range, intersection);

    // Step 4: intruder heading = from intruder position to intersection
    intruder.heading = headingTowardPoint(intruderCenter, intersection);

    // Draw all parameters
    const HALF = squareSize / 2;
    intruderSquare.setAttribute("x", intruderCenter.x - HALF);
    intruderSquare.setAttribute("y", intruderCenter.y - HALF);
    intruderLeader.setAttribute("x1", intruderCenter.x);
    intruderLeader.setAttribute("y1", intruderCenter.y);

    const v = headingToVector(intruder.heading);
    const L = speedToLength(intruder.speed);

    intruderLeader.setAttribute("x2", intruderCenter.x + v.x * L);
    intruderLeader.setAttribute("y2", intruderCenter.y + v.y * L);

    return {
      pos: intruderCenter,
      headingDeg: intruder.heading,
      speed: intruder.speed,
      meta: { clockUsed: clock, intersection }
    };
  }

  const intruderCalc = spawnIntruderCrossingLeftToRight(target);
}