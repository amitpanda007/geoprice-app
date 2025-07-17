import { LandArea } from "../types";
import {
  GeocodingService,
  manhattanNeighborhoods,
} from "../services/geocodingService";

export class LandAreaGenerator {
  private geocodingService: GeocodingService;

  constructor(googleMapsApiKey: string) {
    this.geocodingService = new GeocodingService(googleMapsApiKey);
  }

  /**
   * Generate land areas for Manhattan neighborhoods using real coordinates
   */
  async generateManhattanAreas(): Promise<LandArea[]> {
    const areas: LandArea[] = [];

    for (let i = 0; i < manhattanNeighborhoods.length; i++) {
      const neighborhood = manhattanNeighborhoods[i];

      try {
        console.log(`Fetching coordinates for ${neighborhood.name}...`);

        // Get area details
        const areaDetails = await this.geocodingService.getAreaDetails(
          neighborhood.searchTerm
        );

        if (areaDetails) {
          let coordinates: Array<[number, number]>;

          // If bounds are available, use them to create a more accurate boundary
          if (areaDetails.bounds) {
            coordinates = this.geocodingService.createBoundaryFromBounds(
              areaDetails.bounds
            );
          } else {
            // Fall back to creating a boundary around the center point
            const boundary = await this.geocodingService.getAreaBoundary(
              neighborhood.searchTerm,
              0.3 // 300m radius for neighborhoods
            );
            coordinates = boundary || [];
          }

          if (coordinates.length > 0) {
            const area: LandArea = {
              id: (i + 1).toString(),
              name: neighborhood.name,
              coordinates,
              pricePerSqFt:
                neighborhood.estimatedPrice + Math.random() * 100 - 50, // Add some variation
              totalArea: Math.floor(Math.random() * 50000) + 30000, // Random area between 30k-80k sq ft
              description: this.generateDescription(
                neighborhood.name,
                neighborhood.type
              ),
              type: neighborhood.type,
            };

            areas.push(area);
            console.log(`✓ Generated area for ${neighborhood.name}`);
          }
        }

        // Add a small delay to avoid hitting rate limits
        await new Promise((resolve) => setTimeout(resolve, 200));
      } catch (error) {
        console.error(`Error generating area for ${neighborhood.name}:`, error);
      }
    }

    return areas;
  }

  /**
   * Generate area data for a custom location
   */
  async generateAreaForLocation(
    name: string,
    address: string,
    type: LandArea["type"],
    estimatedPrice: number,
    radiusKm: number = 0.5
  ): Promise<LandArea | null> {
    try {
      const areaDetails = await this.geocodingService.getAreaDetails(address);

      if (areaDetails) {
        let coordinates: Array<[number, number]>;

        if (areaDetails.bounds) {
          coordinates = this.geocodingService.createBoundaryFromBounds(
            areaDetails.bounds
          );
        } else {
          const boundary = await this.geocodingService.getAreaBoundary(
            address,
            radiusKm
          );
          coordinates = boundary || [];
        }

        if (coordinates.length > 0) {
          return {
            id: Date.now().toString(),
            name,
            coordinates,
            pricePerSqFt: estimatedPrice + Math.random() * 100 - 50,
            totalArea: Math.floor(Math.random() * 100000) + 20000,
            description: this.generateDescription(name, type),
            type,
          };
        }
      }

      return null;
    } catch (error) {
      console.error(`Error generating area for ${name}:`, error);
      return null;
    }
  }

  private generateDescription(name: string, type: LandArea["type"]): string {
    const descriptions = {
      residential: [
        `Beautiful residential area in ${name} with excellent amenities`,
        `Prime residential location in ${name} perfect for families`,
        `Luxury residential district in ${name} with high-end properties`,
        `Charming residential neighborhood in ${name} with great community feel`,
      ],
      commercial: [
        `Thriving commercial district in ${name} with excellent business opportunities`,
        `Prime commercial real estate in ${name} with high foot traffic`,
        `Major commercial hub in ${name} with modern office buildings`,
        `Dynamic commercial area in ${name} perfect for retail and offices`,
      ],
      industrial: [
        `Industrial zone in ${name} with excellent transportation access`,
        `Modern industrial district in ${name} suitable for manufacturing`,
        `Well-connected industrial area in ${name} with great logistics`,
      ],
      agricultural: [
        `Fertile agricultural land in ${name} suitable for farming`,
        `Prime agricultural area in ${name} with excellent soil quality`,
      ],
    };

    const typeDescriptions = descriptions[type];
    return typeDescriptions[
      Math.floor(Math.random() * typeDescriptions.length)
    ];
  }
}

/**
 * Utility function to save generated areas to a file (for development)
 */
export async function generateAndSaveAreas(
  googleMapsApiKey: string
): Promise<void> {
  const generator = new LandAreaGenerator(googleMapsApiKey);

  try {
    console.log("Starting to generate Manhattan land areas...");
    const areas = await generator.generateManhattanAreas();

    console.log(`Generated ${areas.length} areas`);
    console.log("Areas:", JSON.stringify(areas, null, 2));

    // You could save this to a file or database here
    return;
  } catch (error) {
    console.error("Error generating areas:", error);
  }
}
