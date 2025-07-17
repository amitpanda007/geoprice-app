import React, { useEffect, useState } from "react";
import { APIProvider, Map, useMap } from "@vis.gl/react-google-maps";
import { MapProps, LandArea } from "../types";

const getColorByType = (type: LandArea["type"]): string => {
  switch (type) {
    case "residential":
      return "#10b981"; // emerald
    case "commercial":
      return "#3b82f6"; // blue
    case "industrial":
      return "#f59e0b"; // amber
    case "agricultural":
      return "#8b5cf6"; // purple
    default:
      return "#6b7280"; // gray
  }
};

const getFillColorByPrice = (pricePerSqFt: number): string => {
  // More sophisticated color gradient for price ranges
  if (pricePerSqFt < 300) return "#dcfdf7"; // very light green
  if (pricePerSqFt < 600) return "#fef3c7"; // light yellow
  if (pricePerSqFt < 900) return "#fed7d7"; // light red
  if (pricePerSqFt < 1200) return "#e0e7ff"; // light purple
  return "#fce7f3"; // light pink for highest prices
};

const getStrokeColorByPrice = (pricePerSqFt: number): string => {
  // Corresponding stroke colors for price ranges
  if (pricePerSqFt < 300) return "#059669"; // green
  if (pricePerSqFt < 600) return "#d97706"; // amber
  if (pricePerSqFt < 900) return "#dc2626"; // red
  if (pricePerSqFt < 1200) return "#7c3aed"; // purple
  return "#be185d"; // pink for highest prices
};

// Custom Polygon component for Google Maps
const MapPolygon: React.FC<{
  area: LandArea;
  isSelected: boolean;
  onAreaClick: (area: LandArea) => void;
}> = ({ area, isSelected, onAreaClick }) => {
  const map = useMap();
  const [polygon, setPolygon] = useState<google.maps.Polygon | null>(null);

  useEffect(() => {
    if (!map) return;

    // Convert coordinates to Google Maps format
    const paths = area.coordinates.map(([lat, lng]) => ({ lat, lng }));

    // Create polygon with enhanced styling for geographic boundaries
    const polygonInstance = new google.maps.Polygon({
      paths: paths,
      strokeColor: getStrokeColorByPrice(area.pricePerSqFt),
      strokeOpacity: 0.9,
      strokeWeight: isSelected ? 4 : 2.5,
      fillColor: getFillColorByPrice(area.pricePerSqFt),
      fillOpacity: isSelected ? 0.6 : 0.4,
      clickable: true,
      zIndex: isSelected ? 2 : 1,
    });

    // Create info window
    const infoWindowInstance = new google.maps.InfoWindow({
      content: `
        <div style="padding: 12px; min-width: 256px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <h3 style="font-weight: bold; font-size: 18px; color: #374151; margin: 0 0 8px 0;">
            ${area.name}
          </h3>
          <div style="font-size: 14px; line-height: 1.5;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
              <span style="color: #6b7280;">Type:</span>
              <span style="font-weight: 500; text-transform: capitalize;">${
                area.type
              }</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
              <span style="color: #6b7280;">Price per sq ft:</span>
              <span style="font-weight: bold; color: #059669;">$${area.pricePerSqFt.toFixed(
                2
              )}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
              <span style="color: #6b7280;">Total Area:</span>
              <span style="font-weight: 500;">${area.totalArea.toLocaleString()} sq ft</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
              <span style="color: #6b7280;">Total Value:</span>
              <span style="font-weight: bold; color: #dc2626;">$${(
                area.pricePerSqFt * area.totalArea
              ).toLocaleString()}</span>
            </div>
            ${
              area.description
                ? `
              <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #e5e7eb;">
                <p style="color: #374151; font-size: 12px; margin: 0;">${area.description}</p>
              </div>
            `
                : ""
            }
          </div>
        </div>
      `,
    });

    // Add click event listener
    polygonInstance.addListener("click", (event: google.maps.MapMouseEvent) => {
      onAreaClick(area);
      if (event.latLng) {
        infoWindowInstance.setPosition(event.latLng);
        infoWindowInstance.open(map);
      }
    });

    // Set polygon on map
    polygonInstance.setMap(map);

    setPolygon(polygonInstance);

    return () => {
      polygonInstance.setMap(null);
      infoWindowInstance.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, area, isSelected, onAreaClick]);

  // Update polygon appearance when selection changes
  useEffect(() => {
    if (polygon) {
      polygon.setOptions({
        strokeWeight: isSelected ? 4 : 2.5,
        fillOpacity: isSelected ? 0.6 : 0.4,
        zIndex: isSelected ? 2 : 1,
      });
    }
  }, [polygon, isSelected]);

  return null;
};

const MapComponent: React.FC<MapProps> = ({
  landAreas,
  onAreaClick,
  selectedArea,
}) => {
  // Component to handle map instance and selected area bounds
  const MapController: React.FC = () => {
    const map = useMap();

    useEffect(() => {
      if (selectedArea && map) {
        // Calculate bounds of selected area
        const bounds = new google.maps.LatLngBounds();
        selectedArea.coordinates.forEach(([lat, lng]) => {
          bounds.extend(new google.maps.LatLng(lat, lng));
        });
        map.fitBounds(bounds, 20);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedArea, map]);

    return null;
  };

  return (
    <div className="h-full w-full">
      <APIProvider apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ""}>
        <Map
          defaultCenter={{ lat: 40.7505, lng: -73.9934 }} // Centered on Manhattan
          defaultZoom={12}
          style={{ width: "100%", height: "100%" }}
          mapId="geoprice-map"
          mapTypeControl={false}
          streetViewControl={false}
          fullscreenControl={false}
        >
          <MapController />
          {landAreas.map((area) => (
            <MapPolygon
              key={area.id}
              area={area}
              isSelected={selectedArea?.id === area.id}
              onAreaClick={onAreaClick || (() => {})}
            />
          ))}
        </Map>
      </APIProvider>
    </div>
  );
};

export default MapComponent;
