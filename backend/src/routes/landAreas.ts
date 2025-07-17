import { Router, Request, Response } from "express";
import { LandDataService } from "../data";
import { ApiResponse, LandArea } from "../types";
import dotenv from "dotenv";

dotenv.config();

const router = Router();
// Initialize with Google Maps API key if available
const landDataService = new LandDataService(process.env.GOOGLE_MAPS_API_KEY);

// GET /api/land-areas - Get all land areas
router.get("/", async (req: Request, res: Response) => {
  try {
    const landAreas = await landDataService.getAllLandAreas();
    const response: ApiResponse<LandArea[]> = {
      success: true,
      data: landAreas,
      message: "Land areas retrieved successfully",
    };
    res.json(response);
  } catch (error) {
    console.error("Error retrieving land areas:", error);
    const response: ApiResponse<null> = {
      success: false,
      error: "Failed to retrieve land areas",
    };
    res.status(500).json(response);
  }
});

// GET /api/land-areas/:id - Get land area by ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const landArea = await landDataService.getLandAreaById(id);

    if (!landArea) {
      const response: ApiResponse<null> = {
        success: false,
        error: "Land area not found",
      };
      return res.status(404).json(response);
    }

    const response: ApiResponse<LandArea> = {
      success: true,
      data: landArea,
      message: "Land area retrieved successfully",
    };
    res.json(response);
  } catch (error) {
    console.error("Error retrieving land area:", error);
    const response: ApiResponse<null> = {
      success: false,
      error: "Failed to retrieve land area",
    };
    res.status(500).json(response);
  }
});

// GET /api/land-areas/type/:type - Get land areas by type
router.get("/type/:type", async (req: Request, res: Response) => {
  try {
    const { type } = req.params;
    const validTypes = [
      "residential",
      "commercial",
      "industrial",
      "agricultural",
    ];

    if (!validTypes.includes(type)) {
      const response: ApiResponse<null> = {
        success: false,
        error: "Invalid land area type",
      };
      return res.status(400).json(response);
    }

    const landAreas = await landDataService.getLandAreasByType(
      type as LandArea["type"]
    );
    const response: ApiResponse<LandArea[]> = {
      success: true,
      data: landAreas,
      message: `Land areas of type '${type}' retrieved successfully`,
    };
    res.json(response);
  } catch (error) {
    console.error("Error retrieving land areas by type:", error);
    const response: ApiResponse<null> = {
      success: false,
      error: "Failed to retrieve land areas by type",
    };
    res.status(500).json(response);
  }
});

// GET /api/land-areas/search - Search land areas
router.get("/search/:query", async (req: Request, res: Response) => {
  try {
    const { query } = req.params;

    if (!query || query.trim().length === 0) {
      const response: ApiResponse<null> = {
        success: false,
        error: "Search query is required",
      };
      return res.status(400).json(response);
    }

    const landAreas = await landDataService.searchLandAreas(query);
    const response: ApiResponse<LandArea[]> = {
      success: true,
      data: landAreas,
      message: `Search results for '${query}'`,
    };
    res.json(response);
  } catch (error) {
    console.error("Error searching land areas:", error);
    const response: ApiResponse<null> = {
      success: false,
      error: "Failed to search land areas",
    };
    res.status(500).json(response);
  }
});

// POST /api/land-areas/add-location - Add a new area by location
router.post("/add-location", async (req: Request, res: Response) => {
  try {
    const { name, address, type, estimatedPrice } = req.body;

    if (!name || !address || !type || !estimatedPrice) {
      const response: ApiResponse<null> = {
        success: false,
        error: "Name, address, type, and estimatedPrice are required",
      };
      return res.status(400).json(response);
    }

    const newArea = await landDataService.addAreaByLocation(
      name,
      address,
      type,
      estimatedPrice
    );

    if (!newArea) {
      const response: ApiResponse<null> = {
        success: false,
        error: "Failed to generate area from location",
      };
      return res.status(400).json(response);
    }

    const response: ApiResponse<LandArea> = {
      success: true,
      data: newArea,
      message: "New area added successfully",
    };
    res.json(response);
  } catch (error) {
    console.error("Error adding area by location:", error);
    const response: ApiResponse<null> = {
      success: false,
      error: "Failed to add area by location",
    };
    res.status(500).json(response);
  }
});

export default router;
