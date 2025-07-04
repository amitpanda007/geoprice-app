import React, { useEffect, useState } from "react";
import { APIProvider, Map, useMap } from "@vis.gl/react-google-maps";
import { MapProps, LandArea } from "../types";

const getColorByType = (type: LandArea["type"]): string => {
  switch (type) {
    case "residential":
      return "#22c55e"; // green
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

const getColorByPrice = (pricePerSqFt: number): string => {
  if (pricePerSqFt < 100) return "#22c55e";
  if (pricePerSqFt < 200) return "#f59e0b";
  if (pricePerSqFt < 300) return "#ef4444";
  return "#dc2626";
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

    // Create polygon
    const polygonInstance = new google.maps.Polygon({
      paths: paths,
      strokeColor: getColorByType(area.type),
      strokeOpacity: 1.0,
      strokeWeight: isSelected ? 4 : 2,
      fillColor: getColorByPrice(area.pricePerSqFt),
      fillOpacity: isSelected ? 0.8 : 0.6,
      clickable: true,
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
        strokeWeight: isSelected ? 4 : 2,
        fillOpacity: isSelected ? 0.8 : 0.6,
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
          defaultCenter={{ lat: 40.7589, lng: -73.9851 }} // New York coordinates
          defaultZoom={13}
          style={{ width: "100%", height: "100%" }}
          mapId="geoprice-map"
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
