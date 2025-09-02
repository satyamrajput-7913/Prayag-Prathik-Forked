const { planDay } = require("../services/dayPlanner");
const Stop = require("../models/stopModel"); // assuming you have a Stop model

const getAllSpots = async (req, res) => {
    try {
        const spots = await Stop.find({}); // no filter = all documents

        res.status(200).json({
            success: true,
            count: spots.length,
            spots,
        });
    } catch (error) {
        console.error("Error fetching all spots:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching all spots",
        });
    }
};

const getAllTouristSpots = async (req, res) => {
    try {
        const spots = await Stop.find({ type: "tourist_spot" });

        res.status(200).json({
            success: true,
            count: spots.length,
            spots,
        });
    } catch (error) {
        console.error("Error fetching tourist spots:", error);
        res.status(500).json({ success: false, message: "Error fetching tourist spots" });
    }
};

const calculateRoute = async (req, res) => {
    const { startLat, startLng, destinations } = req.body;

    // destinations should be an array of objects: [{ id, lat, lng }, ...]
    if (
        typeof startLat !== "number" ||
        typeof startLng !== "number" ||
        !Array.isArray(destinations) ||
        destinations.length === 0 ||
        destinations.some(
            (d) =>
                !d.id ||
                typeof d.lat !== "number" ||
                typeof d.lng !== "number"
        )
    ) {
        return res
            .status(400)
            .json({ message: "Missing or invalid coordinates." });
    }

    try {
        // fetch all stops from DB
        const allStops = await Stop.find({});

        // helper to calculate haversine distance
        const haversine = (lat1, lon1, lat2, lon2) => {
            const toRad = (x) => (x * Math.PI) / 180;
            const R = 6371; // Earth radius km
            const dLat = toRad(lat2 - lat1);
            const dLon = toRad(lon2 - lon1);
            const a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(toRad(lat1)) *
                Math.cos(toRad(lat2)) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return R * c;
        };

        // find nearest stop
        let nearestStop = null;
        let minDist = Infinity;
        for (const stop of allStops) {
            const dist = haversine(
                startLat,
                startLng,
                stop.location.coordinates[1],
                stop.location.coordinates[0]
            );
            if (dist < minDist) {
                minDist = dist;
                nearestStop = stop;
            }
        }

        if (!nearestStop) {
            return res.status(404).json({ message: "No nearby stops found." });
        }

        // get only destination IDs (tourist spots)
        const destinationIds = destinations.map((d) => d.id);

        // run planner starting from nearest stop
        const result = await planDay(nearestStop._id.toString(), destinationIds, "10:00");

        res.status(200).json({
            success: true,
            startStop: {
                id: nearestStop._id,
                name: nearestStop.name,
                distanceFromUserKm: minDist.toFixed(2)
            },
            ...result, // { plan, totalCost, days }
        });
    } catch (error) {
        console.error("Routing Controller Error:", error);
        res
            .status(500)
            .json({ message: "Error calculating multi-day route." });
    }
};

module.exports = { calculateRoute, getAllTouristSpots ,getAllSpots };
