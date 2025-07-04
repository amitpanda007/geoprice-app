import React from "react";
import { LandArea } from "../types";

interface LandAreaCardProps {
  area: LandArea;
  isSelected?: boolean;
  onClick?: () => void;
}

const getTypeColor = (type: LandArea["type"]): string => {
  switch (type) {
    case "residential":
      return "bg-green-100 text-green-800";
    case "commercial":
      return "bg-blue-100 text-blue-800";
    case "industrial":
      return "bg-orange-100 text-orange-800";
    case "agricultural":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getPriceColor = (pricePerSqFt: number): string => {
  if (pricePerSqFt < 100) return "text-green-600";
  if (pricePerSqFt < 200) return "text-yellow-600";
  if (pricePerSqFt < 300) return "text-orange-600";
  return "text-red-600";
};

const LandAreaCard: React.FC<LandAreaCardProps> = ({
  area,
  isSelected = false,
  onClick,
}) => {
  const totalValue = area.pricePerSqFt * area.totalArea;

  return (
    <div
      className={`bg-white rounded-lg shadow-md border-2 p-4 cursor-pointer transition-all duration-200 hover:shadow-lg ${
        isSelected
          ? "border-primary-500 bg-primary-50"
          : "border-gray-200 hover:border-gray-300"
      }`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-bold text-lg text-gray-800 truncate mr-2">
          {area.name}
        </h3>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(
            area.type
          )}`}
        >
          {area.type.charAt(0).toUpperCase() + area.type.slice(1)}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Price per sq ft:</span>
          <span
            className={`font-bold text-lg ${getPriceColor(area.pricePerSqFt)}`}
          >
            ${area.pricePerSqFt.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Total Area:</span>
          <span className="font-medium text-gray-800">
            {area.totalArea.toLocaleString()} sq ft
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Total Value:</span>
          <span className="font-bold text-lg text-secondary-600">
            ${totalValue.toLocaleString()}
          </span>
        </div>

        {area.description && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-sm text-gray-600 line-clamp-2">
              {area.description}
            </p>
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-xs text-gray-500">ID: {area.id}</div>
        <div className="text-xs text-gray-500">Click to view on map</div>
      </div>
    </div>
  );
};

export default LandAreaCard;
