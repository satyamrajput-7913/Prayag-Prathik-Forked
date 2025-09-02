import { useState } from "react";
import LocationButton from "./LocationButton";
import { findRoute } from "../services/api";

export default function RouteForm() {
    const [start, setStart] = useState(null);
    const [end, setEnd] = useState(null);
    const [route, setRoute] = useState(null);

    const handleSubmit = async () => {
        if (!start || !end) return;
        const data = await findRoute(start.lat, start.lng, end.lat, end.lng);
        setRoute(data);
    };

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold">Plan Your Route</h2>

            <LocationButton onLocationSelect={(lat, lng) => setStart({ lat, lng })} />
            {start && (
                <p className="text-green-600">
                    Start: {start.lat}, {start.lng}
                </p>
            )}

            <input
                type="text"
                placeholder="Enter destination (lat,lng)"
                onBlur={(e) => {
                    const [lat, lng] = e.target.value.split(",").map(Number);
                    setEnd({ lat, lng });
                }}
                className="border p-2 rounded w-full"
            />

            <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-green-600 text-white rounded-lg"
            >
                🚍 Find Route
            </button>

            {route && (
                <div className="mt-4 p-4 border rounded bg-gray-100">
                    <h3 className="font-semibold">Route Found</h3>
                    <pre className="text-sm">{JSON.stringify(route, null, 2)}</pre>
                </div>
            )}
        </div>
    );
}
