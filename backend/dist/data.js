"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LandDataService = exports.sampleLandAreas = void 0;
// Sample data for demonstration
exports.sampleLandAreas = [
    {
        id: '1',
        name: 'Downtown Commercial District',
        coordinates: [
            [40.7589, -73.9851],
            [40.7595, -73.9851],
            [40.7595, -73.9841],
            [40.7589, -73.9841],
            [40.7589, -73.9851]
        ],
        pricePerSqFt: 450.50,
        totalArea: 50000,
        description: 'Prime commercial real estate in the heart of downtown',
        type: 'commercial'
    },
    {
        id: '2',
        name: 'Riverside Residential Area',
        coordinates: [
            [40.7610, -73.9821],
            [40.7620, -73.9821],
            [40.7620, -73.9801],
            [40.7610, -73.9801],
            [40.7610, -73.9821]
        ],
        pricePerSqFt: 280.75,
        totalArea: 75000,
        description: 'Beautiful residential area near the river',
        type: 'residential'
    },
    {
        id: '3',
        name: 'Industrial Zone North',
        coordinates: [
            [40.7640, -73.9881],
            [40.7660, -73.9881],
            [40.7660, -73.9851],
            [40.7640, -73.9851],
            [40.7640, -73.9881]
        ],
        pricePerSqFt: 125.25,
        totalArea: 120000,
        description: 'Large industrial zone with excellent transportation access',
        type: 'industrial'
    },
    {
        id: '4',
        name: 'Suburban Family Neighborhood',
        coordinates: [
            [40.7520, -73.9891],
            [40.7540, -73.9891],
            [40.7540, -73.9861],
            [40.7520, -73.9861],
            [40.7520, -73.9891]
        ],
        pricePerSqFt: 195.90,
        totalArea: 85000,
        description: 'Quiet suburban area perfect for families',
        type: 'residential'
    },
    {
        id: '5',
        name: 'Agricultural Valley',
        coordinates: [
            [40.7480, -73.9931],
            [40.7520, -73.9931],
            [40.7520, -73.9881],
            [40.7480, -73.9881],
            [40.7480, -73.9931]
        ],
        pricePerSqFt: 45.80,
        totalArea: 200000,
        description: 'Fertile agricultural land suitable for farming',
        type: 'agricultural'
    }
];
class LandDataService {
    getAllLandAreas() {
        return exports.sampleLandAreas;
    }
    getLandAreaById(id) {
        return exports.sampleLandAreas.find(area => area.id === id);
    }
    getLandAreasByType(type) {
        return exports.sampleLandAreas.filter(area => area.type === type);
    }
    searchLandAreas(query) {
        const lowercaseQuery = query.toLowerCase();
        return exports.sampleLandAreas.filter(area => area.name.toLowerCase().includes(lowercaseQuery) ||
            area.description?.toLowerCase().includes(lowercaseQuery) ||
            area.type.toLowerCase().includes(lowercaseQuery));
    }
}
exports.LandDataService = LandDataService;
//# sourceMappingURL=data.js.map