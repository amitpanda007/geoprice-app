# GeoPrice Backend - Real Coordinates Integration

This backend now supports fetching real coordinates for land areas using Google's Geocoding API instead of manually hardcoded coordinates.

## Setup

### 1. Google Maps API Key

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Geocoding API
   - Maps JavaScript API (for frontend)
4. Create credentials (API Key)
5. Restrict the API key to your domain for security

### 2. Environment Configuration

1. Copy the example environment file:

   ```bash
   cp .env.example .env
   ```

2. Add your Google Maps API key to the `.env` file:
   ```
   GOOGLE_MAPS_API_KEY=your_actual_api_key_here
   ```

## Usage

### Using Real Coordinates

When you provide a Google Maps API key, the application will automatically use real coordinates for Manhattan neighborhoods. The first request might take a bit longer as it fetches the coordinates from Google's API, but subsequent requests will use cached data.

### Generating Areas from Locations

You can add new areas by providing a location name and address:

```bash
POST /api/land-areas/add-location
Content-Type: application/json

{
  "name": "Times Square District",
  "address": "Times Square, New York, NY",
  "type": "commercial",
  "estimatedPrice": 1200
}
```

### Manual Coordinate Generation

You can also generate coordinates manually using the script:

```bash
npm run generate-areas
```

This will output the generated areas with real coordinates that you can use in your data.

## API Endpoints

### Existing Endpoints (now async)

- `GET /api/land-areas` - Get all land areas
- `GET /api/land-areas/:id` - Get land area by ID
- `GET /api/land-areas/type/:type` - Get areas by type
- `GET /api/land-areas/search/:query` - Search areas

### New Endpoints

- `POST /api/land-areas/add-location` - Add area by location

## Fallback Behavior

If no Google Maps API key is provided, the application will fall back to using the manually created sample data with approximate Manhattan coordinates.

## Manhattan Neighborhoods Included

When using real coordinates, the system includes these Manhattan neighborhoods:

- Financial District
- SoHo
- Greenwich Village
- Chelsea
- Midtown
- Upper East Side
- Upper West Side
- Tribeca
- East Village
- Hell's Kitchen

## Technical Details

### Coordinate Generation

- Uses Google Geocoding API to get center points
- Creates polygon boundaries around neighborhoods
- Handles both precise bounds (when available) and estimated boundaries
- Caches results to minimize API calls

### Data Structure

The coordinate format remains the same: `Array<[latitude, longitude]>` representing polygon vertices.

### Error Handling

- Graceful fallback to sample data if geocoding fails
- Detailed error logging for debugging
- Rate limiting consideration with delays between API calls
