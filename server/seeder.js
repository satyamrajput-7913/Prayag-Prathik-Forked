const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Stop = require('./models/stopModel');
const Route = require('./models/routeModel');

dotenv.config();
connectDB();

const createEdges = async () => {
    try {
        // clear old edges
        await Route.deleteMany();

        const stops = await Stop.find({});
        console.log(`Found ${stops.length} stops`);

        const edges = [];

        for (let i = 0; i < stops.length; i++) {
            for (let j = i + 1; j < stops.length; j++) {
                const from = stops[i]._id;
                const to = stops[j]._id;

                const time = Math.floor(Math.random() * 20) + 5;  // 5–25 min
                const cost = Math.floor(Math.random() * 30) + 10; // ₹10–40
                const edgeType = Math.random() > 0.5 ? 'bus' : 'auto';

                // store both directions
                edges.push({ from, to, time, cost, edgeType });
                edges.push({ from: to, to: from, time, cost, edgeType });
            }
        }

        await Route.insertMany(edges);
        console.log(`✅ Inserted ${edges.length} edges`);
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

createEdges();
