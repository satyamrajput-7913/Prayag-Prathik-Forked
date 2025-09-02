const express = require('express');
const router = express.Router();
const { calculateRoute, getAllTouristSpots, getAllSpots } = require('../controllers/routingController');

router.post('/calculate', calculateRoute);
router.get("/tourist-spots", getAllTouristSpots);
router.get("/all-spots", getAllSpots);

module.exports = router;