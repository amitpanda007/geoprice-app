import React, { useState } from "react";
import { LandArea, SearchFilters } from "../types";

interface SearchBarProps {
  onSearch: (filters: SearchFilters) => void;
  isLoading?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  isLoading = false,
}) => {
  const [filters, setFilters] = useState<SearchFilters>({});
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    onSearch({
      ...filters,
      query: query.trim() || undefined,
    });
  };

  const handleTypeChange = (type: LandArea["type"] | "") => {
    setFilters((prev) => ({
      ...prev,
      type: type || undefined,
    }));
  };

  const handlePriceChange = (field: "minPrice" | "maxPrice", value: string) => {
    const numValue = value ? parseFloat(value) : undefined;
    setFilters((prev) => ({
      ...prev,
      [field]: numValue,
    }));
  };

  const clearFilters = () => {
    setFilters({});
    setQuery("");
    onSearch({});
  };

  return (
    <div className="bg-white p-4 shadow-lg rounded-lg border">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* Search Query */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search
          </label>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or description..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>

        {/* Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Property Type
          </label>
          <select
            value={filters.type || ""}
            onChange={(e) =>
              handleTypeChange(e.target.value as LandArea["type"] | "")
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">All Types</option>
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
            <option value="industrial">Industrial</option>
            <option value="agricultural">Agricultural</option>
          </select>
        </div>

        {/* Min Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Min Price ($/sq ft)
          </label>
          <input
            type="number"
            value={filters.minPrice || ""}
            onChange={(e) => handlePriceChange("minPrice", e.target.value)}
            placeholder="0"
            min="0"
            step="0.01"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* Max Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Max Price ($/sq ft)
          </label>
          <input
            type="number"
            value={filters.maxPrice || ""}
            onChange={(e) => handlePriceChange("maxPrice", e.target.value)}
            placeholder="∞"
            min="0"
            step="0.01"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleSearch}
          disabled={isLoading}
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? "Searching..." : "Search"}
        </button>
        <button
          onClick={clearFilters}
          disabled={isLoading}
          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
