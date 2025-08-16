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
    const getWeightedCharCount = (weights) => {
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
        let repeat = target.isVFR && c > 2 ?
            (c == 5 ? 3 : 2) : 1;

        for (let i = 0; i < repeat; i++) {
            str += Math.floor(Math.random() * 9 + 1).toString();
        }

        c -= str.length;
        for (let i = 0; i < c; i++) {
            if (str[str.length - 1].match(/[A-Z]/) || Math.random() > (target.isVFR ? 0.1 : 0.75)) {
                str = str.concat(String.fromCharCode(65 + Math.floor(Math.random() * 26)));
            } else {
                str = str.concat((Math.floor(Math.random() * 10)).toString());
            }
        }
        return str;
    }

    if (intruder.isVFR && intruder.isMil) { // Military callsign
        const milCode = milCallsign[Math.floor(Math.random() * milCallsign.length)];
        return milCode.concat(Math.floor(Math.random() * 10).toString());
    }
    else if (target.isVFR) { // VFR callsign
        const country = vfrCallsign[Math.floor(Math.random() * vfrCallsign.length)];
        const vfrCode = country.countryCode;
        const vfrPresentation = country.presentation;
        let vfrSuffix = "";
        if (country.country == "United States") {
            const weights = [
                { number: 5, weight: 300 },
                { number: 4, weight: 150 },
                { number: 3, weight: 75 },
                { number: 2, weight: 20 },
                { number: 1, weight: 10 }
            ]
            const charCount = getWeightedCharCount(weights);
            const vfrSuffix = addSuffix(charCount);
            return vfrCode + vfrSuffix;
        } else {
            for (let i = 0; i < vfrPresentation.length; i++) {
                let charCode = vfrPresentation[i].charCodeAt();
                vfrSuffix = vfrSuffix.concat(String.fromCharCode(65 + Math.floor(Math.random() * (charCode - 65 + 1))));
            }
        }
        return vfrCode + vfrSuffix;
    }
    else { // IFR callsign
        const airline = airlineCode[Math.floor(Math.random() * airlineCode.length)];
        const code = airline.icao;
        const weights = [
            { number: 3, weight: 150 },
            { number: 4, weight: 45 },
            { number: 2, weight: 20 },
            { number: 1, weight: 10 }
        ]
        const charCount = getWeightedCharCount(weights);
        const suffix = addSuffix(charCount);
        return code + suffix;
    }
}

const heading = () => {
    return Math.floor(Math.random() * 360 + 1);
}

const level = () => {
    if (target.level) {
        const l = target.isVFR ? 4 : 8;
        const relativeDifference = Math.floor(Math.random() * l) + 2;

        if (target.level < 10 || (target.level < 70 && !target.isVFR)) {
            return target.level + relativeDifference;
        } else if ((target.level > 50 && target.isVFR) || target.level > 230) {
            return target.level - relativeDifference;
        } else {
            return Math.random() > 0.5 ? target.level + relativeDifference : target.level - relativeDifference;
        }
    }

    if (target.isVFR) {
        return Math.floor(Math.random() * 51) + 5;
    } else {
        return Math.floor(Math.random() * 91) + 60;
    }
}

const levelChange = () => {
    if (target.level != intruder.level && !target.isVFR && Math.random() > 0.7 && target.level > 70) {
        let changingTo;
        while (!changingTo || changingTo == target.level) {
            if (target.level > intruder.level) {
                changingTo = intruder.level + 10;
            } else {
                changingTo = intruder.level - 10;
            }
            return Math.round(changingTo / 5) * 5;
        }
    } else {
        return 0;
    }
}

const speed = (selected) => {
    const min = selected.speed.min;
    const max = selected.speed.max;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const clock = () => {
    const randomClock = Math.floor(Math.random() * 12) + 1;
    const clockStr = randomClock + " o'clock";
    return clockStr;
}

const distance = () => {
    const randomDistance = Math.floor(Math.random() * 8) + 2;
    const distanceStr = randomDistance + " miles";
    return distanceStr;
}

const direction = () => {

}

const solutionLevel = () => {
    const levelDifference = target.level - intruder.level;
    const aboveBelow = () => {
        if (levelDifference < 0) {
            return "feet above";
        } else if (levelDifference > 0) {
            return "feet below";
        } else {
            return "same level";
        }
    }
    const levelStr = () => {
        if (levelDifference != 0) {
            return (Math.abs(levelDifference) * 100) + " " + aboveBelow();
        } else {
            return aboveBelow();
        }
    }
    return levelStr();
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
intruder.levelChange = levelChange();
intruder.speed = speed(pickedIntruder);

// Generate Solution
solution.callsign = target.callsign;
solution.clock = clock();
solution.distance = distance();
solution.direction = direction();
solution.level = solutionLevel();
solution.type = intruder.type;
solution.wtc = intruder.wtc;

const createSolution = () => {
    let str = "";
    str += solution.callsign + ", ";
    str += "Traffic, ";
    str += solution.clock + ", ";
    str += solution.distance + ", ";
    // Str += solution.direction + ", ";
    str += solution.level + ", ";
    str += solution.type;
    solution.wtc == "H" ? str += ", Heavy" : str;
    return str;
}

const solutionPhrase = createSolution();

console.log(target);
console.log(intruder);
console.log(solution);
console.log(solutionPhrase);