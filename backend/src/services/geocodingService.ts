import axios from "axios";

interface GeocodeResult {
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
    bounds?: {
      northeast: { lat: number; lng: number };
      southwest: { lat: number; lng: number };
    };
  };
  formatted_address: string;
}

interface GeocodeResponse {
  results: GeocodeResult[];
  status: string;
}

export class GeocodingService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Get coordinates for a specific address or place
   */
  async getCoordinates(
    address: string
  ): Promise<{ lat: number; lng: number } | null> {
    try {
      const response = await axios.get<GeocodeResponse>(
        `https://maps.googleapis.com/maps/api/geocode/json`,
        {
          params: {
            address,
            key: this.apiKey,
          },
        }
      );

      if (response.data.status === "OK" && response.data.results.length > 0) {
        const location = response.data.results[0].geometry.location;
        return { lat: location.lat, lng: location.lng };
      }

      return null;
    } catch (error) {
      console.error("Geocoding error:", error);
      return null;
    }
  }

  /**
   * Get boundary coordinates for a neighborhood or area
   * This creates a rough boundary based on the center point
   */
  async getAreaBoundary(
    centerAddress: string,
    radiusKm: number = 0.5
  ): Promise<Array<[number, number]> | null> {
    const center = await this.getCoordinates(centerAddress);
    if (!center) return null;

    // Create a rough polygon around the center point
    // 1 degree ≈ 111 km, so we calculate offset based on radius
    const latOffset = radiusKm / 111;
    const lngOffset = radiusKm / (111 * Math.cos((center.lat * Math.PI) / 180));

    // Create an octagon for more natural-looking boundaries
    const points: Array<[number, number]> = [
      [center.lat + latOffset, center.lng], // North
      [center.lat + latOffset * 0.7, center.lng + lngOffset * 0.7], // NE
      [center.lat, center.lng + lngOffset], // East
      [center.lat - latOffset * 0.7, center.lng + lngOffset * 0.7], // SE
      [center.lat - latOffset, center.lng], // South
      [center.lat - latOffset * 0.7, center.lng - lngOffset * 0.7], // SW
      [center.lat, center.lng - lngOffset], // West
      [center.lat + latOffset * 0.7, center.lng - lngOffset * 0.7], // NW
      [center.lat + latOffset, center.lng], // Close the polygon
    ];

    return points;
  }

  /**
   * Get detailed area information including bounds if available
   */
  async getAreaDetails(address: string): Promise<{
    center: { lat: number; lng: number };
    bounds?: {
      northeast: { lat: number; lng: number };
      southwest: { lat: number; lng: number };
    };
    formattedAddress: string;
  } | null> {
    try {
      const response = await axios.get<GeocodeResponse>(
        `https://maps.googleapis.com/maps/api/geocode/json`,
        {
          params: {
            address,
            key: this.apiKey,
          },
        }
      );

      if (response.data.status === "OK" && response.data.results.length > 0) {
        const result = response.data.results[0];
        return {
          center: result.geometry.location,
          bounds: result.geometry.bounds,
          formattedAddress: result.formatted_address,
        };
      }

      return null;
    } catch (error) {
      console.error("Geocoding error:", error);
      return null;
    }
  }

  /**
   * Create boundary coordinates from bounds if available
   */
  createBoundaryFromBounds(bounds: {
    northeast: { lat: number; lng: number };
    southwest: { lat: number; lng: number };
  }): Array<[number, number]> {
    const { northeast: ne, southwest: sw } = bounds;

    return [
      [ne.lat, sw.lng], // NW
      [ne.lat, ne.lng], // NE
      [sw.lat, ne.lng], // SE
      [sw.lat, sw.lng], // SW
      [ne.lat, sw.lng], // Close polygon
    ];
  }
}

// Manhattan neighborhood definitions
export const manhattanNeighborhoods = [
  {
    name: "Financial District",
    searchTerm: "Financial District, Manhattan, New York, NY",
    type: "commercial" as const,
    estimatedPrice: 850,
  },
  {
    name: "SoHo",
    searchTerm: "SoHo, Manhattan, New York, NY",
    type: "commercial" as const,
    estimatedPrice: 775,
  },
  {
    name: "Greenwich Village",
    searchTerm: "Greenwich Village, Manhattan, New York, NY",
    type: "residential" as const,
    estimatedPrice: 695,
  },
  {
    name: "Chelsea",
    searchTerm: "Chelsea, Manhattan, New York, NY",
    type: "commercial" as const,
    estimatedPrice: 680,
  },
  {
    name: "Midtown",
    searchTerm: "Midtown, Manhattan, New York, NY",
    type: "commercial" as const,
    estimatedPrice: 925,
  },
  {
    name: "Upper East Side",
    searchTerm: "Upper East Side, Manhattan, New York, NY",
    type: "residential" as const,
    estimatedPrice: 1150,
  },
  {
    name: "Upper West Side",
    searchTerm: "Upper West Side, Manhattan, New York, NY",
    type: "residential" as const,
    estimatedPrice: 1000,
  },
  {
    name: "Tribeca",
    searchTerm: "Tribeca, Manhattan, New York, NY",
    type: "residential" as const,
    estimatedPrice: 1300,
  },
  {
    name: "East Village",
    searchTerm: "East Village, Manhattan, New York, NY",
    type: "residential" as const,
    estimatedPrice: 580,
  },
  {
    name: "Hell's Kitchen",
    searchTerm: "Hell's Kitchen, Manhattan, New York, NY",
    type: "residential" as const,
    estimatedPrice: 720,
  },
];
