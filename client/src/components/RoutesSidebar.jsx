import {
    Drawer,
    Divider,
    Chip,
    IconButton,
} from "@mui/material";
import { MapPin, Clock, Navigation, Calendar, ChevronLeft, ChevronRight } from "lucide-react";

export default function RoutesSidebar({ routes, isOpen, setIsOpen }) {
    if (!routes?.length) return null;

    const route = routes[0];
    const { startStop, plan, totalCost, days } = route;

    return (
        <>
            {/* Floating toggle button */}
            <IconButton
                onClick={() => setIsOpen(!isOpen)}
                sx={{
                    position: "fixed",
                    bottom: 24,
                    right: isOpen ? 440 : 24, // when open, sit beside sidebar
                    zIndex: 1301,
                    background: "white",
                    border: "1px solid #ddd",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    "&:hover": { background: "#f9fafb" },
                }}
            >
                {isOpen ? <ChevronRight /> : <ChevronLeft />}
            </IconButton>

            {/* Sidebar */}
            <Drawer
                anchor="right"
                open={isOpen}
                variant="persistent"
                sx={{
                    "& .MuiDrawer-paper": {
                        width: 420,
                        boxSizing: "border-box",
                        padding: 0,
                        borderTopLeftRadius: 0,
                        borderBottomLeftRadius: 0,
                        background: "white",
                    },
                }}
            >
                {/* Header */}
                <div className="px-6 py-5 border-b border-emerald-200 bg-gradient-to-r from-emerald-600 to-teal-500 shadow-sm">
                    <h1 className="text-xl font-bold text-white tracking-wide">
                        Route Overview
                    </h1>
                    <p className="text-xs text-emerald-100 mt-1">
                        Your optimized journey plan
                    </p>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6 text-sm text-neutral-800">
                    {/* Starting Point */}
                    {startStop && (
                        <div className="p-4 rounded-xl border bg-white shadow-sm">
                            <div className="flex items-center gap-2 mb-2">
                                <Navigation className="w-4 h-4 text-emerald-600" />
                                <span className="font-semibold text-neutral-700 text-sm">
                                    Starting Point
                                </span>
                            </div>
                            <p className="font-medium text-neutral-900">{startStop.name}</p>
                            <p className="text-xs text-neutral-500">
                                Distance from you: {startStop.distanceFromUserKm} km
                            </p>
                        </div>
                    )}

                    {/* Summary */}
                    <div className="flex justify-between">
                        <Chip
                            icon={<Calendar size={14} />}
                            label={`Days: ${days}`}
                            sx={{
                                borderRadius: "9999px",
                                fontSize: "0.8rem",
                                fontWeight: 500,
                                paddingLeft : 1
                            }}
                            color="primary"
                            variant="outlined"
                        />
                        <Chip
                            label={`Total Cost: ₹${totalCost}`}
                            sx={{
                                borderRadius: "9999px",
                                fontSize: "0.8rem",
                                fontWeight: 500,
                            }}
                            color="success"
                            variant="outlined"
                        />
                    </div>

                    <Divider />

                    {/* Plan Steps */}
                    {plan && plan.length > 0 ? (
                        <div className="space-y-4">
                            {plan.map((step, idx) => (
                                <div
                                    key={idx}
                                    className="p-4 rounded-xl border bg-white shadow-sm space-y-3"
                                >
                                    {/* Travel Info */}
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <MapPin className="w-4 h-4 text-emerald-600" />
                                            <span className="font-semibold text-neutral-700 text-sm">
                                                Travel
                                            </span>
                                        </div>
                                        <p className="text-xs text-neutral-500">
                                            Mode:{" "}
                                            <span className="font-medium text-neutral-800">
                                                {step.travel.mode}
                                            </span>
                                        </p>
                                        <p className="text-xs text-neutral-500">
                                            From: {step.travel.from.name} → To:{" "}
                                            {step.travel.to.name}
                                        </p>
                                        <p className="text-xs text-neutral-500">
                                            Time: {step.travel.time} mins | Cost: ₹
                                            {step.travel.cost}
                                        </p>
                                    </div>

                                    <Divider />

                                    {/* Visit Info */}
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <Clock className="w-4 h-4 text-emerald-600" />
                                            <span className="font-semibold text-neutral-700 text-sm">
                                                Visit
                                            </span>
                                        </div>
                                        <p className="font-medium text-neutral-900">
                                            {step.visit.stop.name}
                                        </p>
                                        <p className="text-xs text-neutral-500">
                                            Arrival:{" "}
                                            {new Date(
                                                step.visit.arrival
                                            ).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </p>
                                        <p className="text-xs text-neutral-500">
                                            Leave:{" "}
                                            {new Date(
                                                step.visit.leave
                                            ).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </p>
                                        <p className="text-xs text-neutral-500">
                                            Explore Time: {step.visit.exploreTime} mins
                                        </p>
                                        <span className="inline-block mt-2 px-3 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-700">
                                            Day {step.visit.day}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-xs text-neutral-400">No plan available.</p>
                    )}
                </div>
            </Drawer>
        </>
    );
}
