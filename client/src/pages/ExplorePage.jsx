import { useEffect, useState } from "react";
import MapView from "../components/MapView";
import DestinationSidebar from "../components/DestinationSidebar";
import RoutesSidebar from "../components/RoutesSidebar";
import axios from "axios";
import {
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  CircularProgress,
  Backdrop,
  Typography,
  Box,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/MenuOpen";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setLanguage } from "../store/languageSlice/languageSlice";

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
  const [allSpots, setAllSpots] = useState([]);
  const [zoomLevel, setZoomLevel] = useState(13);

  const language = useSelector((state) => state.language.selectedLanguage);
  const dispatch = useDispatch();

  // Spinner states
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [isFetchingPath, setIsFetchingPath] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);

  // Modal
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  const [texts, setTexts] = useState({
    useCurrent: "Use Current Location",
    findPath: "Find Path",
    locationInfo: "Location Info",
    closeSidebar: "Close Destinations Sidebar",
    openSidebar: "Open Destinations Sidebar",
  });

  const navigate = useNavigate();

  const translateText = async (text, targetLang) => {
    try {
      const res = await axios.get("https://api.mymemory.translated.net/get", {
        params: { q: text, langpair: `en|${targetLang}` },
      });
      return res.data.responseData.translatedText;
    } catch (err) {
      console.error("Translation error:", err);
      return text;
    }
  };

  useEffect(() => {
    const doTranslation = async () => {
      if (language === "en") {
        setTexts({
          useCurrent: "Current Location",
          findPath: "Find Path",
          locationInfo: "Location Info",
          closeSidebar: "Close Destinations Sidebar",
          openSidebar: "Open Destinations Sidebar",
        });
      } else {
        setIsTranslating(true);
        const useCurrent = await translateText(
          "Use Current Location",
          language
        );
        const findPath = await translateText("Find Path", language);
        const locationInfo = await translateText("Location Info", language);
        const closeSidebar = await translateText(
          "Close Destinations Sidebar",
          language
        );
        const openSidebar = await translateText(
          "Open Destinations Sidebar",
          language
        );
        setTexts({
          useCurrent,
          findPath,
          locationInfo,
          closeSidebar,
          openSidebar,
        });
        setIsTranslating(false);
      }
    };
    doTranslation();
  }, [language]);

  // Clear routes when start/destination changes
  useEffect(() => {
    setRoutes([]);
  }, [selectedStart, selectedDestination]);

  useEffect(() => {
    const fetchTouristSpots = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5001/api/routes/tourist-spots"
        );
        const spots = res.data.spots.map((s) => ({
          id: s._id,
          name: s.name,
          lat: s.location.coordinates[1],
          lng: s.location.coordinates[0],
        }));
        setTouristSpots(spots);
      } catch (err) {
        console.error("Error fetching tourist spots:", err);
      }
    };

    const fetchAllSpots = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5001/api/routes/all-spots"
        );
        const spots = res.data.spots.map((s) => ({
          id: s._id,
          name: s.name,
          lat: s.location.coordinates[1],
          lng: s.location.coordinates[0],
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
      const spot = allSpots.find((s) => s.id === selectedStart);
      if (spot) setUserLocation({ lat: spot.lat, lng: spot.lng });
      else setUserLocation(null);
    }
  }, [selectedStart, allSpots]);

  const handleFindPath = async () => {
    if (!userLocation || !selectedDestination) return;
    setPathLoading(true);
    setIsPathSidebarOpen(true);
    setIsFetchingPath(true);

    try {
      const destinationsPayload = (
        Array.isArray(selectedDestination)
          ? selectedDestination
          : [selectedDestination]
      )
        .map((dest) => {
          const spot = touristSpots.find(
            (s) => s.id === dest.id || s.id === dest
          );
          return spot ? { id: spot.id, lat: spot.lat, lng: spot.lng } : null;
        })
        .filter(Boolean);

      const res = await axios.post(
        "http://localhost:5001/api/routes/calculate",
        {
          startLat: userLocation.lat,
          startLng: userLocation.lng,
          destinations: destinationsPayload,
        }
      );

      const pathData = res?.data;
      if (pathData) {
        const transformedRoute = {
          startStop: pathData.startStop,
          plan: pathData.plan,
          totalCost: pathData.totalCost,
          days: pathData.days,
        };
        setRoutes([transformedRoute]);
      } else setRoutes([]);

      setActiveStep(null);
    } catch (err) {
      console.error("Error fetching path:", err);
      setRoutes([]);
    } finally {
      setPathLoading(false);
      setIsFetchingPath(false);
    }
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsFetchingLocation(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          setSelectedStart("current-location");
          setDialogMessage(texts.useCurrent + " set!");
          setDialogOpen(true);
          setIsFetchingLocation(false);
          setTimeout(() => setDialogOpen(false), 1000);
        },
        (error) => {
          console.error("Geolocation error:", error);
          setDialogMessage("Unable to fetch location.");
          setDialogOpen(true);
          setIsFetchingLocation(false);
          setTimeout(() => setDialogOpen(false), 1000);
        }
      );
    } else {
      setDialogMessage("Geolocation is not supported.");
      setDialogOpen(true);
      setTimeout(() => setDialogOpen(false), 1000);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-indigo-50 via-white to-amber-50 font-sans relative">
      {/* Language Dropdown */}
      <div className="absolute top-4 right-4 z-[1000]">
        <select
          value={language}
          onChange={(e) => dispatch(setLanguage(e.target.value))}
          className="border border-gray-300 rounded px-2 py-1 text-sm bg-white"
        >
          <option value="en">English</option>
          <option value="hi">Hindi</option>
          <option value="bn">Bengali</option>
          <option value="te">Telugu</option>
          <option value="mr">Marathi</option>
          <option value="ta">Tamil</option>
          <option value="ur">Urdu</option>
          <option value="gu">Gujarati</option>
          <option value="kn">Kannada</option>
          <option value="or">Odia</option>
          <option value="pa">Punjabi</option>
          <option value="ml">Malayalam</option>
        </select>
      </div>

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
        handleUseCurrentLocation={handleUseCurrentLocation}
        userLocation={userLocation}
        pathLoading={pathLoading}
        setIsTranslating={setIsTranslating}
      />

      {/* Sidebar Toggle Button */}
      <div className={`absolute bottom-4 z-[1000] transition-all duration-300`}>
        <Tooltip title={isSidebarOpen ? texts.closeSidebar : texts.openSidebar}>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg rounded-full w-12 h-12 flex items-center justify-center transition-all duration-300 absolute bottom-0 ${isSidebarOpen
              ? "left-[23rem] -translate-x-6"
              : "left-0 translate-x-6"
              }`}
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
          setActiveStep={setActiveStep}
          zoomLevel={zoomLevel}
          routes={routes}
        />
      </main>

      {/* Routes Sidebar */}
      <RoutesSidebar
        isOpen={isPathSidebarOpen}
        setIsOpen={setIsPathSidebarOpen}
        routes={routes}
        activeStep={activeStep}
        setActiveStep={setActiveStep}
        setIsTranslating={setIsTranslating}
      />

      {/* Modal */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        TransitionProps={{ timeout: 300 }}
        PaperProps={{
          sx: {
            border: "1px solid #10b981",
            borderRadius: "12px",
            bgcolor: "white",
            fontFamily: "Inter, sans-serif",
            fontWeight: 600,
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            transition: "all 0.3s ease",
            position: "fixed",
            bottom: 16,
            left: "50%",
            transform: "translateX(-50%)",
            width: "auto",
            maxWidth: "90%",
            minWidth: 200,
            textAlign: "center",
            px: 2,
            py: 1,
          },
        }}
      >
        <DialogTitle sx={{ fontSize: "1.1rem", color: "#065f46", p: 0 }}>
          {texts.locationInfo}
        </DialogTitle>
        <DialogContent sx={{ fontSize: "0.95rem", color: "#374151", p: 0 }}>
          {dialogMessage}
        </DialogContent>
      </Dialog>

      {/* Spinner */}
      <Backdrop
        open={isFetchingLocation || isFetchingPath || isTranslating}
        sx={{ color: "#fff", zIndex: 1200, flexDirection: "column" }}
      >
        <CircularProgress color="inherit" />
        <Box mt={2}>
          <Typography variant="h6" sx={{ color: "#fff" }}>
            {isFetchingLocation
              ? "Fetching current location..."
              : isFetchingPath
                ? "Fetching current path..."
                : "Translating content..."}
          </Typography>
        </Box>
      </Backdrop>
    </div>
  );
}
