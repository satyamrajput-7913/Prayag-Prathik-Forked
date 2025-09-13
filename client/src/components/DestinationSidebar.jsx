import React, { useEffect, useState } from "react";
import {
  Search,
  MapPin,
  ChevronDown,
  ChevronRight,
  Crosshair,
} from "lucide-react";
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  ListSubheader,
} from "@mui/material";
import { useSelector } from "react-redux";
import axios from "axios";

export default function DestinationSidebar({
  isSidebarOpen,
  setIsSidebarOpen,
  predefinedDestinations,
  predefinedStarts,
  selectedDestination,
  setSelectedDestination,
  selectedStart,
  setSelectedStart,
  handleFindPath,
  handleUseCurrentLocation,
  userLocation,
  pathLoading,
  setIsTranslating,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDestinationsOpen, setIsDestinationsOpen] = useState(true);
  const [isStartOpen, setIsStartOpen] = useState(true);

  const [translatedDestinations, setTranslatedDestinations] = useState([]);
  const [translatedStarts, setTranslatedStarts] = useState([]);

  const filteredDestinations = (translatedDestinations.length > 0 ? translatedDestinations : predefinedDestinations)
    .filter((dest) =>
      (dest.translatedName || dest.name).toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) =>
      (a.translatedName || a.name).localeCompare(b.translatedName || b.name)
    );


  const sortedStarts = (translatedStarts.length > 0 ? translatedStarts : predefinedStarts)
    .sort((a, b) =>
      (a.translatedName || a.name).localeCompare(b.translatedName || b.name)
    );


  const language = useSelector((state) => state.language.selectedLanguage);
  const [texts, setTexts] = useState({});

  useEffect(() => {
    setTranslatedDestinations(predefinedDestinations.map(dest => ({
      ...dest,
      translatedName: dest.name
    })));
    setTranslatedStarts(predefinedStarts.map(start => ({
      ...start,
      translatedName: start.name
    })));
  }, [predefinedDestinations, predefinedStarts]);

  const translateText = async (text, targetLang) => {
    const cacheKey = `${text}_${targetLang}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const res = await axios.get("https://api.mymemory.translated.net/get", {
        params: { q: text, langpair: `en|${targetLang}` },
      });
      const translated = res.data.responseData.translatedText;
      localStorage.setItem(cacheKey, translated);
      return translated;
    } catch (err) {
      console.error("Translation error:", err);
      return text;
    }
  };


  useEffect(() => {
    const doTranslation = async () => {
      if (language === "en") {
        setTexts({
          explorerTitle: "Prayagraj Explorer",
          planYourJourney: "Plan your journey smartly",
          destinations: "Destinations",
          startingPoint: "Starting Point",
          searchDestinations: "Search destinations...",
          startHere: "Start Here",
          savedSpots: "Saved Spots",
          useCurrent: "Use Current Location",
          findingPath: "Finding Path...",
          findPath: "Find Path",
          closeSidebar: "Close Destinations Sidebar",
          openSidebar: "Open Destinations Sidebar",
        });

        setTranslatedDestinations(predefinedDestinations.map(dest => ({
          ...dest,
          translatedName: dest.name
        })));
        setTranslatedStarts(predefinedStarts.map(start => ({
          ...start,
          translatedName: start.name
        })));
      } else {
        setIsTranslating(true); // Start spinner
        try {
          const keys = [
            { key: "explorerTitle", text: "Prayagraj Explorer" },
            { key: "planYourJourney", text: "Plan your journey smartly" },
            { key: "destinations", text: "Destinations" },
            { key: "startingPoint", text: "Starting Point" },
            { key: "searchDestinations", text: "Search destinations..." },
            { key: "startHere", text: "Start Here" },
            { key: "savedSpots", text: "Saved Spots" },
            { key: "useCurrent", text: "Use Current Location" },
            { key: "findingPath", text: "Finding Path..." },
            { key: "findPath", text: "Find Path" },
            { key: "closeSidebar", text: "Close Destinations Sidebar" },
            { key: "openSidebar", text: "Open Destinations Sidebar" },
          ];

          const translations = await Promise.all(
            keys.map((item) =>
              translateText(item.text, language).then((translated) => ({
                key: item.key,
                text: translated,
              }))
            )
          );

          const newTexts = {};
          translations.forEach(({ key, text }) => {
            newTexts[key] = text;
          });

          const translatedDest = await Promise.all(
            predefinedDestinations.map(dest =>
              translateText(dest.name, language).then(translatedName => ({
                ...dest,
                translatedName
              }))
            )
          );
          setTranslatedDestinations(translatedDest);

          // Translate starts
          const translatedSts = await Promise.all(
            predefinedStarts.map(start =>
              translateText(start.name, language).then(translatedName => ({
                ...start,
                translatedName
              }))
            )
          );
          setTranslatedStarts(translatedSts);

          setTexts(newTexts); // Update texts after all translations are done
        } catch (error) {
          console.error("Translation failed:", error);

          setTexts({
            explorerTitle: "Prayagraj Explorer",
            planYourJourney: "Plan your journey smartly",
            destinations: "Destinations",
            startingPoint: "Starting Point",
            searchDestinations: "Search destinations...",
            startHere: "Start Here",
            savedSpots: "Saved Spots",
            useCurrent: "Use Current Location",
            findingPath: "Finding Path...",
            findPath: "Find Path",
            closeSidebar: "Close Destinations Sidebar",
            openSidebar: "Open Destinations Sidebar",
          });

          setTranslatedDestinations(predefinedDestinations.map(dest => ({
            ...dest,
            translatedName: dest.name
          })));

          setTranslatedStarts(predefinedStarts.map(start => ({
            ...start,
            translatedName: start.name
          })));
        } finally {
          setIsTranslating(false); // Stop spinner only after translations are complete
        }
      }
    };

    doTranslation();
  }, [language]);


  return (
    <aside
      className={`fixed z-40 top-0 left-0 h-full w-80
            bg-white/95 backdrop-blur-lg border-r border-emerald-200 shadow-xl
            transform transition-all duration-300 ease-in-out
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
            flex flex-col`}
    >
      {/* Header */}
      <div className="px-6 py-5 border-b border-emerald-200 bg-gradient-to-r from-emerald-600 to-teal-500 shadow-sm">
        <h1 className="text-xl font-bold text-white tracking-wide">
          {texts.explorerTitle || "Prayagraj Explorer"}
        </h1>
        <p className="text-xs text-emerald-100 mt-1">
          {texts.planYourJourney || "Plan your journey smartly"}
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-8 text-sm text-neutral-800">
        {/* Destination Section */}
        <div className="flex flex-col">
          <div
            className="flex items-center justify-between cursor-pointer select-none mb-3"
            onClick={() => setIsDestinationsOpen(!isDestinationsOpen)}
          >
            <h3 className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">
              {texts.destinations}
            </h3>
            {isDestinationsOpen ? (
              <ChevronDown className="w-4 h-4 text-neutral-500" />
            ) : (
              <ChevronRight className="w-4 h-4 text-neutral-500" />
            )}
          </div>

          <div
            className={`transition-all duration-300 ease-in-out overflow-hidden
                            ${isDestinationsOpen
                ? "max-h-[400px] opacity-100"
                : "max-h-0 opacity-0"
              }`}
          >
            <div className="sticky top-0 bg-white/95 pb-3 z-10">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder={texts.searchDestinations}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-neutral-300 bg-neutral-50 text-sm shadow-inner focus:outline-none"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-1 space-y-3 mt-2 h-72">
              {filteredDestinations.length > 0 ? (
                filteredDestinations.map((dest) => {
                  const translatedDest = translatedDestinations.find(d => d.id === dest.id) || dest;
                  return (
                    <div
                      key={dest.id}
                      className={`flex items-center gap-3 px-3 py-3 rounded-xl border shadow-sm transition cursor-pointer
                                            ${Array.isArray(
                        selectedDestination
                      ) &&
                          selectedDestination.some(
                            (d) =>
                              d.lat === dest.lat &&
                              d.lng === dest.lng
                          )
                          ? "bg-emerald-50 border-emerald-300"
                          : "bg-white hover:bg-neutral-50 border-neutral-200"
                        }`}
                      onClick={() => {
                        if (
                          Array.isArray(selectedDestination) &&
                          selectedDestination.some(
                            (d) => d.lat === dest.lat && d.lng === dest.lng
                          )
                        ) {
                          setSelectedDestination((prev) =>
                            prev.filter(
                              (d) => d.lat !== dest.lat || d.lng !== dest.lng
                            )
                          );
                        } else {
                          setSelectedDestination((prev) => [
                            ...(Array.isArray(prev) ? prev : []),
                            dest,
                          ]);
                        }
                      }}
                    >
                      <input
                        type="checkbox"
                        readOnly
                        checked={
                          Array.isArray(selectedDestination) &&
                          selectedDestination.some(
                            (d) => d.lat === dest.lat && d.lng === dest.lng
                          )
                        }
                        className="w-4 h-4 accent-emerald-600"
                      />
                      <MapPin className="w-4 h-4 text-emerald-600" />
                      <span className="truncate font-medium">{translatedDest.translatedName}</span>
                    </div>)
                })
              ) : (
                <p className="text-xs text-neutral-400 px-2">
                  No matches found
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Starting Point Section */}
        <div>
          <div
            className="flex items-center justify-between cursor-pointer select-none mb-3"
            onClick={() => setIsStartOpen(!isStartOpen)}
          >
            <h3 className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">
              {texts.startingPoint}
            </h3>
            {isStartOpen ? (
              <ChevronDown className="w-4 h-4 text-neutral-500" />
            ) : (
              <ChevronRight className="w-4 h-4 text-neutral-500" />
            )}
          </div>

          <div
            className={`transition-all duration-300 ease-in-out overflow-hidden
            ${isStartOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"}`}
          >
            <FormControl
              fullWidth
              size="small"
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "9999px",
                  backgroundColor: "#f9fafb",
                  fontSize: "0.9rem",
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 500,
                  color: "#374151",
                  "& fieldset": {
                    border: "1px solid #d1d5db",
                    borderRadius: "9999px",
                  },
                  "&:hover fieldset": {
                    borderColor: "#10b981",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#10b981",
                    boxShadow: "0 0 0 2px rgba(16, 185, 129, 0.3)",
                  },
                },
                "& .MuiInputLabel-root": {
                  fontSize: "0.85rem",
                  color: "#6b7280",
                },
                "& .MuiSelect-icon": { color: "#6b7280" },
              }}
            >
              <Select
                labelId="start-select-label"
                value={selectedStart}
                onChange={(e) => setSelectedStart(e.target.value)}
                displayEmpty
              >
                <ListSubheader
                  disableSticky
                  className="px-3 py-1 text-xs text-neutral-500"
                >
                  Start Here
                </ListSubheader>
                <MenuItem
                  value="current-location"
                  onClick={handleUseCurrentLocation}
                  sx={{
                    fontSize: "0.9rem",
                    borderRadius: "12px",
                    mx: 0.5,
                    my: 0.5,
                    fontFamily: "Inter, sans-serif",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    "&:hover": { backgroundColor: "rgba(16,185,129,0.08)" },
                    "&.Mui-selected": {
                      backgroundColor: "rgba(16,185,129,0.15) !important",
                      fontWeight: 600,
                      color: "#065f46",
                    },
                  }}
                >
                  <div className="flex gap-2">
                    <Crosshair className="w-4 h-4 text-emerald-600" />
                    <span className="">{texts.useCurrent}</span>
                  </div>
                </MenuItem>

                <ListSubheader
                  disableSticky
                  className="px-3 py-1 text-xs text-neutral-500"
                >
                  Saved Spots
                </ListSubheader>
                {sortedStarts.map((place) => {
                  const translatedPlace = translatedStarts.find(s => s.id === place.id) || place;
                  return (
                    <MenuItem
                      key={place.id}
                      value={place.id}
                      sx={{
                        fontSize: "0.9rem",
                        borderRadius: "12px",
                        mx: 0.5,
                        my: 0.5,
                        fontFamily: "Inter, sans-serif",
                        "&:hover": { backgroundColor: "rgba(16,185,129,0.08)" },
                        "&.Mui-selected": {
                          backgroundColor: "rgba(16,185,129,0.15) !important",
                          fontWeight: 600,
                          color: "#065f46",
                        },
                      }}
                    >
                      {translatedPlace.translatedName}
                    </MenuItem>)
                })}
              </Select>
            </FormControl>
          </div>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="px-5 py-4 border-t border-neutral-200 bg-white">
        <button
          onClick={handleFindPath}
          disabled={!selectedDestination || !userLocation || pathLoading}
          className={`w-full py-3 rounded-lg font-medium text-sm transition-all duration-200
                        ${selectedDestination && userLocation && !pathLoading
              ? "bg-emerald-600 text-white hover:bg-emerald-500 shadow-lg"
              : "bg-neutral-200 text-neutral-500 cursor-not-allowed"
            }`}
        >
          {pathLoading ? `${texts.findingPath}` : `🌿 ${texts.findPath}`}
        </button>
      </div>

    </aside>
  );
}
