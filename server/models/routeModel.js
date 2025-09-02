const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
    from: { type: mongoose.Schema.Types.ObjectId, ref: 'Stop', required: true },
    to: { type: mongoose.Schema.Types.ObjectId, ref: 'Stop', required: true },
    time: { type: Number, required: true },  // minutes
    cost: { type: Number, required: true },  // fare in INR
    edgeType: {
        type: String,
        enum: ['bus', 'auto'],  // what kind of connection
        required: true
    }
});

const Route = mongoose.model('Route', routeSchema);
module.exports = Route;
