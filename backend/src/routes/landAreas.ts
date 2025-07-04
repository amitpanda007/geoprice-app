import { Router, Request, Response } from "express";
import { LandDataService } from "../data";
import { ApiResponse, LandArea } from "../types";

const router = Router();
const landDataService = new LandDataService();

// GET /api/land-areas - Get all land areas
router.get("/", (req: Request, res: Response) => {
  try {
    const landAreas = landDataService.getAllLandAreas();
    const response: ApiResponse<LandArea[]> = {
      success: true,
      data: landAreas,
      message: "Land areas retrieved successfully",
    };
    res.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: "Failed to retrieve land areas",
    };
    res.status(500).json(response);
  }
});

// GET /api/land-areas/:id - Get land area by ID
router.get("/:id", (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const landArea = landDataService.getLandAreaById(id);

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
    const response: ApiResponse<null> = {
      success: false,
      error: "Failed to retrieve land area",
    };
    res.status(500).json(response);
  }
});

// GET /api/land-areas/type/:type - Get land areas by type
router.get("/type/:type", (req: Request, res: Response) => {
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

    const landAreas = landDataService.getLandAreasByType(
      type as LandArea["type"]
    );
    const response: ApiResponse<LandArea[]> = {
      success: true,
      data: landAreas,
      message: `Land areas of type '${type}' retrieved successfully`,
    };
    res.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: "Failed to retrieve land areas by type",
    };
    res.status(500).json(response);
  }
});

// GET /api/land-areas/search - Search land areas
router.get("/search/:query", (req: Request, res: Response) => {
  try {
    const { query } = req.params;

    if (!query || query.trim().length === 0) {
      const response: ApiResponse<null> = {
        success: false,
        error: "Search query is required",
      };
      return res.status(400).json(response);
    }

    const landAreas = landDataService.searchLandAreas(query);
    const response: ApiResponse<LandArea[]> = {
      success: true,
      data: landAreas,
      message: `Search results for '${query}'`,
    };
    res.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: "Failed to search land areas",
    };
    res.status(500).json(response);
  }
});

export default router;
