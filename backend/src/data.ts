import { LandArea } from "./types";
import { LandAreaGenerator } from "./utils/landAreaGenerator";

// Sample data with realistic Manhattan area boundaries (manually created)
// For real coordinates, use the LandAreaGenerator with Google Maps API
export const sampleLandAreas: LandArea[] = [
  {
    id: "1",
    name: "Lower Manhattan Financial District",
    coordinates: [
      [40.7074, -74.0113],
      [40.708, -74.008],
      [40.706, -74.007],
      [40.704, -74.008],
      [40.703, -74.009],
      [40.702, -74.01],
      [40.701, -74.011],
      [40.7, -74.012],
      [40.701, -74.013],
      [40.703, -74.014],
      [40.705, -74.013],
      [40.7074, -74.0113],
    ],
    pricePerSqFt: 850.5,
    totalArea: 75000,
    description:
      "Prime financial district with world-class commercial properties",
    type: "commercial",
  },
  {
    id: "2",
    name: "Central Park West Residential",
    coordinates: [
      [40.7829, -73.9734],
      [40.785, -73.972],
      [40.787, -73.971],
      [40.789, -73.972],
      [40.79, -73.974],
      [40.789, -73.976],
      [40.787, -73.977],
      [40.785, -73.976],
      [40.7829, -73.9734],
    ],
    pricePerSqFt: 1250.75,
    totalArea: 45000,
    description: "Luxury residential area overlooking Central Park",
    type: "residential",
  },
  {
    id: "3",
    name: "Midtown Commercial Hub",
    coordinates: [
      [40.758, -73.9855],
      [40.759, -73.984],
      [40.761, -73.983],
      [40.762, -73.984],
      [40.763, -73.986],
      [40.762, -73.988],
      [40.76, -73.989],
      [40.758, -73.988],
      [40.757, -73.987],
      [40.758, -73.9855],
    ],
    pricePerSqFt: 925.25,
    totalArea: 85000,
    description: "Heart of Manhattan with major office buildings and retail",
    type: "commercial",
  },
  {
    id: "4",
    name: "Greenwich Village Historic District",
    coordinates: [
      [40.7335, -74.0027],
      [40.735, -74.001],
      [40.7365, -74.0],
      [40.738, -74.001],
      [40.7385, -74.003],
      [40.738, -74.005],
      [40.7365, -74.006],
      [40.735, -74.0055],
      [40.7335, -74.0045],
      [40.733, -74.0035],
      [40.7335, -74.0027],
    ],
    pricePerSqFt: 695.9,
    totalArea: 35000,
    description: "Charming historic neighborhood with unique character",
    type: "residential",
  },
  {
    id: "5",
    name: "SoHo Arts District",
    coordinates: [
      [40.723, -74.005],
      [40.725, -74.003],
      [40.727, -74.002],
      [40.7285, -74.003],
      [40.729, -74.005],
      [40.7285, -74.007],
      [40.727, -74.008],
      [40.725, -74.0075],
      [40.7235, -74.0065],
      [40.723, -74.005],
    ],
    pricePerSqFt: 775.8,
    totalArea: 42000,
    description: "Trendy arts district with galleries, lofts and boutiques",
    type: "commercial",
  },
  {
    id: "6",
    name: "Upper East Side Residential",
    coordinates: [
      [40.7794, -73.9632],
      [40.781, -73.962],
      [40.7825, -73.9615],
      [40.784, -73.962],
      [40.785, -73.9635],
      [40.7845, -73.965],
      [40.7835, -73.966],
      [40.782, -73.9655],
      [40.7805, -73.9645],
      [40.7794, -73.9632],
    ],
    pricePerSqFt: 1150.25,
    totalArea: 55000,
    description:
      "Prestigious residential area with luxury apartments and townhouses",
    type: "residential",
  },
  {
    id: "7",
    name: "Chelsea Market District",
    coordinates: [
      [40.742, -74.0065],
      [40.7435, -74.005],
      [40.745, -74.004],
      [40.7465, -74.0045],
      [40.7475, -74.006],
      [40.747, -74.008],
      [40.7455, -74.009],
      [40.744, -74.0085],
      [40.7425, -74.0075],
      [40.742, -74.0065],
    ],
    pricePerSqFt: 680.4,
    totalArea: 38000,
    description: "Vibrant neighborhood known for food markets and galleries",
    type: "commercial",
  },
];

export class LandDataService {
  private landAreaGenerator?: LandAreaGenerator;
  private useRealCoordinates: boolean = false;
  private cachedRealAreas?: LandArea[];

  constructor(googleMapsApiKey?: string) {
    if (googleMapsApiKey) {
      this.landAreaGenerator = new LandAreaGenerator(googleMapsApiKey);
      this.useRealCoordinates = true;
    }
  }

  async getAllLandAreas(): Promise<LandArea[]> {
    if (this.useRealCoordinates && this.landAreaGenerator) {
      // Use cached real areas if available, otherwise generate them
      if (!this.cachedRealAreas) {
        console.log("Generating real coordinates for land areas...");
        this.cachedRealAreas =
          await this.landAreaGenerator.generateManhattanAreas();
      }
      return this.cachedRealAreas;
    }

    // Fall back to sample data
    return sampleLandAreas;
  }

  async getLandAreaById(id: string): Promise<LandArea | undefined> {
    const areas = await this.getAllLandAreas();
    return areas.find((area) => area.id === id);
  }

  async getLandAreasByType(type: LandArea["type"]): Promise<LandArea[]> {
    const areas = await this.getAllLandAreas();
    return areas.filter((area) => area.type === type);
  }

  async searchLandAreas(query: string): Promise<LandArea[]> {
    const areas = await this.getAllLandAreas();
    const lowercaseQuery = query.toLowerCase();
    return areas.filter(
      (area) =>
        area.name.toLowerCase().includes(lowercaseQuery) ||
        area.description?.toLowerCase().includes(lowercaseQuery) ||
        area.type.toLowerCase().includes(lowercaseQuery)
    );
  }

  /**
   * Add a new area using real coordinates
   */
  async addAreaByLocation(
    name: string,
    address: string,
    type: LandArea["type"],
    estimatedPrice: number
  ): Promise<LandArea | null> {
    if (!this.landAreaGenerator) {
      throw new Error(
        "Google Maps API key required for real coordinate generation"
      );
    }

    const newArea = await this.landAreaGenerator.generateAreaForLocation(
      name,
      address,
      type,
      estimatedPrice
    );

    if (newArea && this.cachedRealAreas) {
      this.cachedRealAreas.push(newArea);
    }

    return newArea;
  }

  /**
   * Force refresh of real coordinates
   */
  async refreshRealCoordinates(): Promise<void> {
    if (this.landAreaGenerator) {
      this.cachedRealAreas = undefined;
      await this.getAllLandAreas(); // This will regenerate the cache
    }
  }
}
