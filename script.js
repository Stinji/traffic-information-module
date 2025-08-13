const target = {};
const intruder = {};
const solution = {};

const isVFR = () => {
    return Math.random() > 0.75 ? false : true;
};

const isMil = () => {
    if (target.isVFR) {
        return Math.random() > 0.10 ? false : true;
    } else {
        return false;
    }
};

const pickAircraft = () => {
    if (target.isVFR) {
        const selectVfr = vfrList[Math.floor(Math.random() * vfrList.length)];
        return selectVfr;
    }
    else {
        const selectIfr = ifrList[Math.floor(Math.random() * ifrList.length)];
        return selectIfr;
    }
};

const callsign = () => {
    const getWeightedCharCount = () => {
        const weights = [
            { number: 3, weight: 150 },
            { number: 4, weight: 45 },
            { number: 2, weight: 20 },
            { number: 1, weight: 10 }
        ]

        const cumulativeWeights = []

        for (let i = 0; i < weights.length; i++) {
            cumulativeWeights[i] = weights[i].weight + (cumulativeWeights[i - 1] || 0);
        }

        const maxCumulativeWeight = cumulativeWeights[cumulativeWeights.length - 1];
        const randomNumber = Math.random() * maxCumulativeWeight;

        for (let numberIndex = 0; numberIndex < weights.length; numberIndex++) {
            if (cumulativeWeights[numberIndex] >= randomNumber) {
                return weights[numberIndex].number;
            }
        }
    }

    const addSuffix = (c) => {
        let str = "";
        str += Math.floor(Math.random() * 10).toString();
        for (let i = 1; i < c; i++) {
            if (str[str.length - 1].match(/[A-Z]/) || Math.random() > 0.75) {
                str = str.concat(String.fromCharCode(65 + Math.floor(Math.random() * 26)));
            } else {
                str = str.concat((Math.floor(Math.random() * 10)).toString());
            }
        }
        return str;
    }

    if (intruder.isVFR && intruder.isMil) {
        return "military";
    } else if (target.isVFR) {
        return "VFR";
    } else {
        const airline = airlineCode[Math.floor(Math.random() * airlineCode.length)];
        const code = airline.icao;
        const charCount = getWeightedCharCount();
        const suffix = addSuffix(charCount);
        return code + suffix;
    }
}

const heading = () => {
    return Math.floor(Math.random() * 360 + 1);
}

const level = () => {
    if (target.isVFR) {
        return Math.floor(Math.random() * 51) + 5;
    } else {
        return Math.floor(Math.random() * 91) + 60;
    }
}

const speed = (selected) => {
    const min = selected.speed.min;
    const max = selected.speed.max;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

target.isVFR = isVFR();
intruder.isVFR = target.isVFR;
const pickedTarget = pickAircraft();
const pickedIntruder = pickAircraft();

// Generate Target Aircraft
target.type = pickedTarget.type;
target.wtc = pickedTarget.wtc;
target.callsign = callsign();
target.heading = heading();
target.level = level();
target.speed = speed(pickedTarget);

// Generate Intruder Aircraft
intruder.isMil = isMil();
intruder.type = pickedIntruder.type;
intruder.wtc = pickedIntruder.wtc;
intruder.callsign = callsign();
intruder.heading = heading();
intruder.level = level();
intruder.speed = speed(pickedIntruder);


console.log(target);
console.log(intruder);

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