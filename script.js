const startScreen = document.getElementById("start-screen");
const exerciseScreen = document.getElementById("exercise-screen");
const startBtn = document.getElementById("start");

const changeScreen = () => {                // When button is clicked, change screen to exercise
  startScreen.classList.add("hidden");
  exerciseScreen.classList.remove("hidden");
  return;
}

startBtn.addEventListener("click", changeScreen);


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

calculateDirection(intruderSquare, clockToDeg(), speedToLength(intruder.speed), "x", "y");
calculateDirection(intruderLeader, clockToDeg(), speedToLength(intruder.speed), "x1", "y1");
calculateDirection(intruderLeader, intruder.heading, speedToLength(intruder.speed), "x2", "y2");

// let selected = target;
// const squareSize = 10;
// const leaderLength = speedToLength(selected.speed);

// updateAttr(targetSquare, ["width", "height"], squareSize);      // square size
// updateAttr(targetSquare, ["x", "y"], center - squareSize / 2);  // square positioning

// function leaderEnd(x0, y0, headingDeg, length) {
//   const θ = headingDeg * Math.PI / 180;   // degrees → radians
//   const dx = length * Math.sin(θ);        // east/west component
//   const dy = -length * Math.cos(θ);       // north/south component (flipped for screen coords)
//   return { x: x0 + dx, y: y0 + dy };
// }

// function updateLeaderLine(lineEl, x0, y0, headingDeg, length) {
//   const { x, y } = leaderEnd(x0, y0, headingDeg, length);
//   console.log({ x, y })
//   lineEl.setAttribute("x1", x0);
//   lineEl.setAttribute("y1", y0);
//   lineEl.setAttribute("x2", x);
//   lineEl.setAttribute("y2", y);
// }

// updateLeaderLine(targetLeader, center, center, selected.heading, leaderLength);

// // Intruder SVGs
// selected = intruder;

// updateAttr(targetSquare, ["width", "height"], squareSize);      // square size
// updateAttr(targetSquare, ["x", "y"], center - squareSize / 2);  // square positioning

// updateLeaderLine(intruderLeader, center, center, selected.heading, leaderLength);


// // Generate intruder X miles on Y clock position
// const calculateStuff = () => {
//   const heading = (solution.clock % 12) * 30;
//   const toRad = heading * Math.PI / 180;
//   const dx = solution.distance * 10 * Math.sin(toRad);
//   const dy = -solution.distance * 10 * Math.sin(toRad);

//   targetSquare.setAttribute("x", dx + center);
//   targetSquare.setAttribute("y", dy + center);
//   targetLeader.setAttribute("x1", dx + center);
//   targetLeader.setAttribute("y1", dy + center);
// }

// calculateStuff();