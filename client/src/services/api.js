export async function findRoute(startLat, startLng, endLat, endLng) {
    const res = await fetch("http://localhost:5000/api/route", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startLat, startLng, endLat, endLng })
    });
    return res.json();
}
