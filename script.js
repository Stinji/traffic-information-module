const targetAircraft = {};
const intruderAircraft = {};

const isVFR = () => {
    return Math.random() > 0.8 ? false : true;
};

const isMIL = () => {
    return Math.random() > 0.2 ? false : true;
};

const pickAircraft = () => {
    if (targetAircraft.isVFR) {
        const selectVfr = vfrList[Math.floor(Math.random() * vfrList.length)];
        return selectVfr;
    }
    else {
        const selectIfr = ifrList[Math.floor(Math.random() * ifrList.length)];
        return selectIfr;
    }
};

const pickedTarget = pickAircraft();
const pickedIntruder = pickAircraft();

const heading = () => {
    return Math.floor(Math.random() * 360 + 1);
}

targetAircraft.isVFR = isVFR();
targetAircraft.type = pickedTarget.type;
targetAircraft.wtc = pickedTarget.name;
targetAircraft.heading = heading();

console.log(targetAircraft);


// document.addEventListener('DOMContentLoaded', () => {
//     const startButton = document.querySelector('.btn');
//     const startScreen = document.querySelector('.start-screen');
//     const exerciseScreen = document.querySelector('.exercise-screen');

//     startButton.addEventListener('click', () => {
//         startScreen.classList.add('hidden');
//         exerciseScreen.classList.remove('hidden');
//     });
// });


// function clockToCoordinates(clock, distanceNM, centerX, centerY, maxDistanceNM = 15, radius = 185) {
//     const angleDeg = ((clock % 12) * 30) - 90; // 12 = 0°, 3 = 90°, etc.
//     const angleRad = angleDeg * (Math.PI / 180);
//     const scale = radius / maxDistanceNM;

//     const x = centerX + distanceNM * scale * Math.cos(angleRad);
//     const y = centerY + distanceNM * scale * Math.sin(angleRad);
//     return { x, y };
// }

// const center = 150;
// const { x, y } = clockToCoordinates(11, 4, center, center);
// centerIntX = x;
// centerIntY = y;
// const headingInt = scenarios.intruder.heading;
// const headingTgt = scenarios.target.heading;
// const intruderHdg = clockToCoordinates(headingInt / 30, 2, centerIntX, centerIntY);
// const targetHdg = clockToCoordinates(headingTgt / 30, 2, center, center);

// function renderIntruder(x, y, callsign, type, level) {
//     const svg = document.querySelector(".radar-screen svg");

//     // Aircraft square (intruder)
//     const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
//     rect.setAttribute("x", x - 5);
//     rect.setAttribute("y", y - 5);
//     rect.setAttribute("width", "10");
//     rect.setAttribute("height", "10");
//     rect.setAttribute("fill", "#FFF");
//     svg.appendChild(rect);


//     // Leader line (intruder)
//     const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
//     line.setAttribute("x1", x);
//     line.setAttribute("y1", y);
//     line.setAttribute("x2", intruderHdg.x);
//     line.setAttribute("y2", intruderHdg.y);
//     line.setAttribute("stroke", "#FFF");
//     line.setAttribute("stroke-width", "1");
//     svg.appendChild(line);
// }

// function renderTgt(x, y, callsign, type, level) {
//     const svg = document.querySelector(".radar-screen svg");

//     // Aircraft square (target)
//     const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
//     rect.setAttribute("x", center - 5);
//     rect.setAttribute("y", center - 5);
//     rect.setAttribute("width", "10");
//     rect.setAttribute("height", "10");
//     rect.setAttribute("fill", "#FFF");
//     svg.appendChild(rect);


//     // Leader line (target)
//     const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
//     line.setAttribute("x1", center);
//     line.setAttribute("y1", center);
//     line.setAttribute("x2", targetHdg.x);
//     line.setAttribute("y2", targetHdg.y);
//     line.setAttribute("stroke", "#FFF");
//     line.setAttribute("stroke-width", "1");
//     svg.appendChild(line);
// }

// renderIntruder(x, y)
// renderTgt(x, y)