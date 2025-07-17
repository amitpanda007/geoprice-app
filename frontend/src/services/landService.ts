import axios from "axios";
import { LandArea, ApiResponse } from "../types";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:3001/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export class LandService {
  static async getAllLandAreas(): Promise<LandArea[]> {
    try {
      const response = await api.get<ApiResponse<LandArea[]>>("/land-areas");
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error(response.data.error || "Failed to fetch land areas");
    } catch (error) {
      console.error("Error fetching land areas:", error);
      throw error;
    }
  }

  static async getLandAreaById(id: string): Promise<LandArea> {
    try {
      const response = await api.get<ApiResponse<LandArea>>(
        `/land-areas/${id}`
      );
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error(response.data.error || "Failed to fetch land area");
    } catch (error) {
      console.error("Error fetching land area:", error);
      throw error;
    }
  }

  static async getLandAreasByType(type: LandArea["type"]): Promise<LandArea[]> {
    try {
      const response = await api.get<ApiResponse<LandArea[]>>(
        `/land-areas/type/${type}`
      );
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error(
        response.data.error || "Failed to fetch land areas by type"
      );
    } catch (error) {
      console.error("Error fetching land areas by type:", error);
      throw error;
    }
  }

  static async searchLandAreas(query: string): Promise<LandArea[]> {
    try {
      const response = await api.get<ApiResponse<LandArea[]>>(
        `/land-areas/search/${encodeURIComponent(query)}`
      );
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error(response.data.error || "Failed to search land areas");
    } catch (error) {
      console.error("Error searching land areas:", error);
      throw error;
    }
  }

  static async addAreaByLocation(
    name: string,
    address: string,
    type: LandArea["type"],
    estimatedPrice: number
  ): Promise<LandArea> {
    try {
      const response = await api.post<ApiResponse<LandArea>>(
        "/land-areas/add-location",
        {
          name,
          address,
          type,
          estimatedPrice,
        }
      );
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error(response.data.error || "Failed to add area by location");
    } catch (error) {
      console.error("Error adding area by location:", error);
      throw error;
    }
  }
}
