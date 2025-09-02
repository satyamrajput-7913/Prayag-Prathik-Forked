import { useState } from "react";

export default function LocationButton({ onLocationSelect }) {
    const [error, setError] = useState(null);

    const handleGetLocation = () => {
        if (!navigator.geolocation) {
            setError("Geolocation not supported by your browser.");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                onLocationSelect(latitude, longitude);
                setError(null);
            },
            (err) => setError("Failed to get location: " + err.message)
        );
    };

    return (
        <div>
            <button
                onClick={handleGetLocation}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
                📍 Use My Location
            </button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
    );
}
