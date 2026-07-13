export interface DumpSiteNode {
  id: string;
  name: string;
  lga: "Ife Central" | "Moro";
  coordinates: [number, number]; // [Latitude, Longitude]
  fillRatePercentage: number;     // Mock sensor volume reading
  daysToFullPollution: number;    // Sensor time matrix prediction
  avgDailyDumps: number;          // Traffic throughput node metric
}

export const mockDumpSites: DumpSiteNode[] = [
  // --- IFE CENTRAL LGA SITES ---
  {
    id: "ds-ife-01",
    name: "Akinfolarin Dump House (Stallion Way)",
    lga: "Ife Central",
    coordinates: [7.4833, 4.5667], // Near OAU Campus / Ife core
    fillRatePercentage: 84,
    daysToFullPollution: 2,
    avgDailyDumps: 340,
  },
  {
    id: "ds-ife-02",
    name: "Sabogida Central Collection Basin",
    lga: "Ife Central",
    coordinates: [7.4785, 4.5580],
    fillRatePercentage: 42,
    daysToFullPollution: 9,
    avgDailyDumps: 115,
  },
  {
    id: "ds-ife-03",
    name: "Ibadan Road Aggregation Point",
    lga: "Ife Central",
    coordinates: [7.4910, 4.5320],
    fillRatePercentage: 91,
    daysToFullPollution: 1,
    avgDailyDumps: 520,
  },

  // --- MORO LGA SITES ---
  {
    id: "ds-moro-01",
    name: "Bode Saadu Transit Vault",
    lga: "Moro",
    coordinates: [8.8412, 4.7821], // Moro Kwara boundaries
    fillRatePercentage: 61,
    daysToFullPollution: 5,
    avgDailyDumps: 190,
  },
  {
    id: "ds-moro-02",
    name: "Jebba Road Logistics Site",
    lga: "Moro",
    coordinates: [8.7845, 4.6930],
    fillRatePercentage: 23,
    daysToFullPollution: 14,
    avgDailyDumps: 75,
  }
];