import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

export default function MapView({ userLocation, routes, destinations, activeStep, setActiveStep }) {
    const prayagrajCenter = [25.4358, 81.8463];

    // console.log(destinations)

    return (
        <MapContainer
            center={prayagrajCenter}
            zoom={13}
            style={{ height: "100vh", width: "100%" }}
        >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {/* Start Location (Red Marker) */}
            {userLocation && (
                <Marker
                    position={[userLocation.lat, userLocation.lng]}
                    icon={L.icon({
                        iconUrl: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
                        iconSize: [30, 30]
                    })}
                >
                    <Popup>Start Location</Popup>
                </Marker>
            )}

            {/* Destinations (Green Markers) */}
            {Array.isArray(destinations) &&
                destinations.map((dest, idx) => (
                    <Marker
                        key={dest.id || idx}
                        position={[dest.lat, dest.lng]}
                        icon={L.icon({
                            iconUrl: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
                            iconSize: [30, 30]
                        })}
                    >
                        <Popup>{dest.name}</Popup>
                    </Marker>
                ))}

            {/* Draw Path if available */}
            {Array.isArray(routes) &&
                routes.map((route, i) => {
                    const geometry = route.geometry?.coordinates || [];
                    const path = geometry.map(([lng, lat]) => [lat, lng]);

                    // prepend userLocation if available
                    if (userLocation) {
                        path.unshift([userLocation.lat, userLocation.lng]);
                    }

                    // append last destination if available
                    if (Array.isArray(destinations) && destinations.length > 0) {
                        const lastDest = destinations[destinations.length - 1];
                        path.push([lastDest.lat, lastDest.lng]);
                    }

                    return (
                        <Polyline
                            key={`route-${i}`}
                            positions={path}
                            color="blue"
                            weight={5}
                            opacity={0.7}
                        />
                    );
                })}

            {/* Stops Markers */}
            {Array.isArray(routes) &&
                routes.flatMap((route, i) =>
                    route.stops.map((stop, idx) => (
                        <Marker
                            key={`${i}-stop-${idx}`}
                            position={[stop.coords[1], stop.coords[0]]}
                            icon={L.divIcon({
                                className: "custom-stop-marker",
                                html: `<div style="
                                    background:${activeStep === idx ? "#2563eb" : "#fff"};
                                    border:2px solid ${activeStep === idx ? "#2563eb" : "#333"};
                                    border-radius:50%;
                                    width:22px;height:22px;
                                    line-height:22px;
                                    text-align:center;
                                    font-size:12px;
                                    font-weight:bold;
                                    color:${activeStep === idx ? "#fff" : "#000"};
                                ">${idx + 1}</div>`
                            })}
                            eventHandlers={{
                                click: () => setActiveStep(idx)
                            }}
                        >
                            <Popup>{stop.name}</Popup>
                        </Marker>
                    )) 
                )}
        </MapContainer>
    );
}
