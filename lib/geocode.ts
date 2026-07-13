// Reverse-geocodes coordinates to a Nigerian LGA (Local Government Area) name
// using OpenStreetMap's Nominatim service - free, no API key required.
// Same reasoning as choosing Leaflet+OSM for the map instead of Google Maps.

const NOMINATIM_URL = "https://nominatim.openstreetmap.org/reverse";

export async function reverseGeocodeToLga(lat: number, lng: number): Promise<string | null> {
  try {
    const url = `${NOMINATIM_URL}?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`;

    const res = await fetch(url, {
      headers: {
        // Nominatim requires a real identifying User-Agent, generic fetch defaults get blocked
        "User-Agent": "TrashVill-Hackathon/1.0 (waste-management platform)",
      },
    });

    if (!res.ok) {
      console.error("Nominatim reverse geocode failed", res.status);
      return null;
    }

    const data = await res.json();
    const address = data.address ?? {};

    // Nigerian LGAs typically surface as state_district or county in OSM's
    // address breakdown - state_district is the more reliable match.
    const lga = address.state_district ?? address.county ?? null;

    // Nominatim doesn't always append "LGA" - normalize so it matches the
    // free-text format used at signup (e.g. "Ife Central LGA")
    if (lga && !lga.toLowerCase().includes("lga")) {
      return `${lga} LGA`;
    }
    return lga;
  } catch (err) {
    console.error("Reverse geocode error", err);
    return null;
  }
}