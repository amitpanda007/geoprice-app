export interface LandArea {
  id: string;
  name: string;
  coordinates: [number, number][];
  pricePerSqFt: number;
  totalArea: number;
  description?: string;
  type: "residential" | "commercial" | "industrial" | "agricultural";
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface MapProps {
  landAreas: LandArea[];
  onAreaClick?: (area: LandArea) => void;
  selectedArea?: LandArea | null;
}

export interface SearchFilters {
  type?: LandArea["type"];
  minPrice?: number;
  maxPrice?: number;
  query?: string;
}
