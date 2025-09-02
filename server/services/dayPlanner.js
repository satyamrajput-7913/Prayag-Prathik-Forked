const Stop = require("../models/stopModel");
const Route = require("../models/routeModel");

const explorationTimes = {
    "Anand Bhavan": 90,
    "Triveni Sangam": 60,
    "Allahabad Fort": 120,
    "Khusro Bagh": 60,
    default: 60
};

// Convert "10:00 AM" -> minutes since midnight
function parseTimeToMinutes(timeStr) {
    const [time, modifier] = timeStr.trim().split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    if (modifier?.toLowerCase() === "pm" && hours !== 12) hours += 12;
    if (modifier?.toLowerCase() === "am" && hours === 12) hours = 0;

    return hours * 60 + (minutes || 0);
}

// Get timings for a stop on a specific day
function getDayTimings(stop, date) {
    const days = [
        "sunday", "monday", "tuesday", "wednesday",
        "thursday", "friday", "saturday"
    ];
    const dayName = days[date.getDay()];
    const timingsStr = stop.time?.[dayName];

    if (!timingsStr) return [];

    if (timingsStr.toLowerCase().includes("open 24 hours")) {
        return [{ open: "12:00 AM", close: "11:59 PM" }];
    }
    if (timingsStr.toLowerCase().includes("open 24 Hours")) {
        return [{ open: "12:00 AM", close: "11:59 PM" }];
    }

    return timingsStr.split(",").map(range => {
        const [open, close] = range.trim().split(" - ");
        return { open: open.trim(), close: close.trim() };
    });
}

function isWithinOpenHours(arrivalMinutes, timings) {
    for (const { open, close } of timings) {
        const openMinutes = parseTimeToMinutes(open);
        const closeMinutes = parseTimeToMinutes(close);
        if (arrivalMinutes >= openMinutes && arrivalMinutes < closeMinutes) {
            return true;
        }
    }
    return false;
}

async function buildGraph() {
    const routes = await Route.find().populate("from to");
    const graph = {};
    for (const r of routes) {
        const fromId = r.from._id.toString();
        const toId = r.to._id.toString();

        if (!graph[fromId]) graph[fromId] = [];
        graph[fromId].push({
            to: toId,
            time: r.time,
            cost: r.cost,
            edgeType: r.edgeType
        });
    }
    return graph;
}

async function planDay(startStopId, destinationIds, startTime = "10:00 AM") {
    const graph = await buildGraph();

    // Fetch both start stop + destinations
    const stops = await Stop.find({ _id: { $in: [startStopId, ...destinationIds] } });

    // Map for quick lookup
    const stopMap = stops.reduce((acc, s) => {
        acc[s._id.toString()] = s;
        return acc;
    }, {});

    let currentTime = parseTimeToMinutes(startTime);
    const currDate = new Date();
    currDate.setHours(Math.floor(currentTime / 60), currentTime % 60, 0, 0);

    let current = startStopId.toString();
    let totalCost = 0;
    const plan = [];
    const remaining = new Set(destinationIds.map(id => id.toString()));
    let day = 1;

    let safetyCounter = 0;
    const maxIterations = destinationIds.length * 5;

    while (remaining.size > 0 && safetyCounter < maxIterations) {
        safetyCounter++;

        let nextStop = null;
        let bestScore = Infinity;
        let bestEdge = null;

        for (const candidate of remaining) {
            if (!graph[current]) continue;
            for (const edge of graph[current]) {
                if (edge.to === candidate) {
                    const candidateStop = stopMap[candidate];
                    if (!candidateStop) continue;

                    const arrivalTime = currentTime + edge.time;
                    const timings = getDayTimings(candidateStop, currDate);

                    if (!isWithinOpenHours(arrivalTime, timings)) continue;

                    const score = edge.time + edge.cost;
                    if (score < bestScore) {
                        bestScore = score;
                        nextStop = candidate;
                        bestEdge = edge;
                    }
                }
            }
        }

        if (!nextStop) {
            // Move to next day
            day++;
            currentTime = parseTimeToMinutes("10:00 AM");
            currDate.setDate(currDate.getDate() + 1);
            currDate.setHours(10, 0, 0, 0);
            continue;
        }

        const stop = stopMap[nextStop];
        const exploreTime = explorationTimes[stop.name] || explorationTimes.default;
        const arrivalTime = currentTime + bestEdge.time;
        const leaveTime = arrivalTime + exploreTime;

        const timings = getDayTimings(stop, currDate);
        let fitsToday = timings.some(({ close }) => leaveTime <= parseTimeToMinutes(close));

        if (!fitsToday) {
            // Next day
            day++;
            currentTime = parseTimeToMinutes("10:00 AM");
            currDate.setDate(currDate.getDate() + 1);
            currDate.setHours(10, 0, 0, 0);
            continue;
        }

        const arrivalDate = new Date(currDate);
        arrivalDate.setMinutes(arrivalDate.getMinutes() + (arrivalTime - parseTimeToMinutes(startTime)));

        const leaveDate = new Date(arrivalDate);
        leaveDate.setMinutes(leaveDate.getMinutes() + exploreTime);

        plan.push({
            travel: {
                from: stopMap[current],  // ✅ now always a full stop object
                to: stopMap[nextStop],   // ✅ full stop object
                mode: bestEdge.edgeType,
                time: bestEdge.time,
                cost: bestEdge.cost
            },
            visit: {
                stop: stop,  // ✅ full stop object
                arrival: arrivalDate.toISOString(),
                leave: leaveDate.toISOString(),
                exploreTime,
                day
            }
        });

        current = nextStop;
        currentTime = leaveTime;
        totalCost += bestEdge.cost;
        remaining.delete(nextStop);
    }

    if (safetyCounter >= maxIterations) {
        throw new Error("PlanDay exceeded maximum iterations. Possible disconnected graph.");
    }

    return { plan, totalCost, days: day };
}


module.exports = { planDay };
