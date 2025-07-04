import React, { useState, useEffect, useCallback } from "react";
import MapComponent from "./components/MapComponent";
import SearchBar from "./components/SearchBar";
import LandAreaCard from "./components/LandAreaCard";
import LoadingSpinner from "./components/LoadingSpinner";
import ErrorMessage from "./components/ErrorMessage";
import { LandArea, SearchFilters } from "./types";
import { LandService } from "./services/landService";

function App() {
  const [landAreas, setLandAreas] = useState<LandArea[]>([]);
  const [filteredAreas, setFilteredAreas] = useState<LandArea[]>([]);
  const [selectedArea, setSelectedArea] = useState<LandArea | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Load initial data
  useEffect(() => {
    loadLandAreas();
  }, []);

  const loadLandAreas = async () => {
    try {
      setLoading(true);
      setError(null);
      const areas = await LandService.getAllLandAreas();
      setLandAreas(areas);
      setFilteredAreas(areas);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load land areas"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = useCallback(
    async (filters: SearchFilters) => {
      try {
        setSearchLoading(true);
        setError(null);

        let results = [...landAreas];

        // Apply filters
        if (filters.type) {
          results = results.filter((area) => area.type === filters.type);
        }

        if (filters.minPrice !== undefined) {
          results = results.filter(
            (area) => area.pricePerSqFt >= filters.minPrice!
          );
        }

        if (filters.maxPrice !== undefined) {
          results = results.filter(
            (area) => area.pricePerSqFt <= filters.maxPrice!
          );
        }

        if (filters.query) {
          // If there's a search query, use the API search
          const searchResults = await LandService.searchLandAreas(
            filters.query
          );

          // Apply other filters to search results
          if (filters.type) {
            results = searchResults.filter(
              (area) => area.type === filters.type
            );
          } else {
            results = searchResults;
          }

          if (filters.minPrice !== undefined) {
            results = results.filter(
              (area) => area.pricePerSqFt >= filters.minPrice!
            );
          }

          if (filters.maxPrice !== undefined) {
            results = results.filter(
              (area) => area.pricePerSqFt <= filters.maxPrice!
            );
          }
        }

        setFilteredAreas(results);
        setSelectedArea(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Search failed");
      } finally {
        setSearchLoading(false);
      }
    },
    [landAreas]
  );

  const handleAreaClick = (area: LandArea) => {
    setSelectedArea(area);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" text="Loading GeoPrice App..." />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <h1 className="text-2xl font-bold text-gray-900">🗺️ GeoPrice</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              {filteredAreas.length} of {landAreas.length} areas
            </span>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div
          className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${
            sidebarOpen ? "w-96" : "w-0"
          } overflow-hidden`}
        >
          {/* Search Bar */}
          <div className="p-4 border-b border-gray-200">
            <SearchBar onSearch={handleSearch} isLoading={searchLoading} />
          </div>

          {/* Results */}
          <div className="flex-1 overflow-y-auto p-4">
            {error ? (
              <ErrorMessage message={error} onRetry={loadLandAreas} />
            ) : searchLoading ? (
              <LoadingSpinner text="Searching..." />
            ) : filteredAreas.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <p className="text-gray-500">No land areas found</p>
                <p className="text-sm text-gray-400 mt-1">
                  Try adjusting your search criteria
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAreas.map((area) => (
                  <LandAreaCard
                    key={area.id}
                    area={area}
                    isSelected={selectedArea?.id === area.id}
                    onClick={() => handleAreaClick(area)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Map */}
        <div className="flex-1 relative">
          <MapComponent
            landAreas={filteredAreas}
            onAreaClick={handleAreaClick}
            selectedArea={selectedArea}
          />

          {/* Map overlay info */}
          {selectedArea && (
            <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-sm">
              <h3 className="font-bold text-lg mb-2">{selectedArea.name}</h3>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span>Type:</span>
                  <span className="capitalize font-medium">
                    {selectedArea.type}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Price/sq ft:</span>
                  <span className="font-bold text-primary-600">
                    ${selectedArea.pricePerSqFt}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Total Value:</span>
                  <span className="font-bold text-secondary-600">
                    $
                    {(
                      selectedArea.pricePerSqFt * selectedArea.totalArea
                    ).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
