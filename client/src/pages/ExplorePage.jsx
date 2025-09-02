import { useEffect, useState } from "react";
import MapView from "../components/MapView";
import DestinationSidebar from "../components/DestinationSidebar";
import RoutesSidebar from "../components/RoutesSidebar";
import axios from "axios";
import { Tooltip } from "@mui/material";
import MenuIcon from "@mui/icons-material/MenuOpen";
import CloseIcon from "@mui/icons-material/Close";

export default function ExplorePage() {
    const [userLocation, setUserLocation] = useState(null);
    const [selectedDestination, setSelectedDestination] = useState(null);
    const [routes, setRoutes] = useState([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isPathSidebarOpen, setIsPathSidebarOpen] = useState(false);
    const [selectedStart, setSelectedStart] = useState("");
    const [pathLoading, setPathLoading] = useState(false);
    const [activeStep, setActiveStep] = useState(null);
    const [touristSpots, setTouristSpots] = useState([]);
    const [allSpots, setAllSpots] = useState([]);   // 🔹 new
    const [zoomLevel, setZoomLevel] = useState(13);

    useEffect(() => {
        // fetch tourist spots
        const fetchTouristSpots = async () => {
            try {
                const res = await axios.get("http://localhost:5001/api/routes/tourist-spots");
                const spots = res.data.spots.map(s => ({
                    id: s._id,
                    name: s.name,
                    lat: s.location.coordinates[1],
                    lng: s.location.coordinates[0]
                }));
                setTouristSpots(spots);
            } catch (err) {
                console.error("Error fetching tourist spots:", err);
            }
        };

        // fetch all starting spots
        const fetchAllSpots = async () => {
            try {
                const res = await axios.get("http://localhost:5001/api/routes/all-spots");
                const spots = res.data.spots.map(s => ({
                    id: s._id,
                    name: s.name,
                    lat: s.location.coordinates[1],
                    lng: s.location.coordinates[0]
                }));
                setAllSpots(spots);
            } catch (err) {
                console.error("Error fetching all spots:", err);
            }
        };

        fetchTouristSpots();
        fetchAllSpots();
    }, []);

    useEffect(() => {
        if (selectedStart) {
            const spot = allSpots.find(s => s.id === selectedStart);
            if (spot) {
                setUserLocation({ lat: spot.lat, lng: spot.lng });
            } else {
                setUserLocation(null);
            }
        }
    }, [selectedStart, allSpots]);

    const handleFindPath = async () => {
        if (!userLocation || !selectedDestination) return;
        setPathLoading(true);
        setIsPathSidebarOpen(true);

        try {
            // Ensure selectedDestination is always an array of objects with id, lat, lng
            console.log(selectedDestination)
            const destinationsPayload = (Array.isArray(selectedDestination) ? selectedDestination : [selectedDestination])
                .map(dest => {
                    const spot = touristSpots.find(s => s.id === dest.id || s.id === dest);
                    return spot
                        ? { id: spot.id, lat: spot.lat, lng: spot.lng }
                        : null;
                })
                .filter(Boolean);

            const res = await axios.post("http://localhost:5001/api/routes/calculate", {
                startLat: userLocation.lat,
                startLng: userLocation.lng,
                destinations: destinationsPayload
            });

            const pathData = res?.data;
            if (pathData) {
                const transformedRoute = {
                    startStop: pathData.startStop,
                    plan: pathData.plan,
                    totalCost: pathData.totalCost,
                    days: pathData.days,
                };

                setRoutes([transformedRoute]);
            } else {
                setRoutes([]);
            }

            setActiveStep(null);
        } catch (err) {
            console.error("Error fetching path:", err);
            setRoutes([]);
        } finally {
            setPathLoading(false);
        }
    };


    return (
        <div className="flex min-h-screen bg-gradient-to-br from-indigo-50 via-white to-amber-50 font-sans relative">

            {/* Destination Sidebar */}
            <DestinationSidebar
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                predefinedDestinations={touristSpots}
                predefinedStarts={allSpots}
                selectedDestination={selectedDestination}
                setSelectedDestination={setSelectedDestination}
                selectedStart={selectedStart}
                setSelectedStart={setSelectedStart}
                handleFindPath={handleFindPath}
                userLocation={userLocation}
                pathLoading={pathLoading}
            />

            {/* Sidebar Toggle Button */}
            <div className={`absolute bottom-4 z-[1000] transition-all duration-300`}>
                <Tooltip title={isSidebarOpen ? "Close Destinations Sidebar" : "Open Destinations Sidebar"}>
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className={`bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg rounded-full w-12 h-12 flex items-center justify-center transition-all duration-300
                            absolute bottom-0
                            ${isSidebarOpen ? "left-[23rem] -translate-x-6" : "left-0 translate-x-6"}
                        `}
                    >
                        {isSidebarOpen ? <CloseIcon /> : <MenuIcon />}
                    </button>
                </Tooltip>
            </div>

            {/* Map */}
            <main className="flex-1 relative transition-all duration-500 z-0">
                <MapView
                    userLocation={userLocation}
                    destinations={selectedDestination}
                    activeStep={activeStep}
                    zoomLevel={zoomLevel}
                    // routes={routes}
                />
            </main>

            {/* Routes Sidebar */}
            <RoutesSidebar
                isOpen={isPathSidebarOpen}
                setIsOpen={setIsPathSidebarOpen}
                routes={routes}
                activeStep={activeStep}
                setActiveStep={setActiveStep}
            />
        </div>
    );
}
