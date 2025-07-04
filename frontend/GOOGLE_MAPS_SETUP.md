# Google Maps Setup Instructions

## Getting a Google Maps API Key

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Maps JavaScript API:
   - Go to "APIs & Services" > "Library"
   - Search for "Maps JavaScript API"
   - Click on it and enable it
4. Create credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy the API key

## Setting up the Environment Variable

1. Copy the `.env.example` file to `.env`:

   ```
   cp .env.example .env
   ```

2. Edit the `.env` file and replace `your_google_maps_api_key_here` with your actual API key:
   ```
   REACT_APP_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
   ```

## Optional: Restrict your API Key

For security, you should restrict your API key:

1. In Google Cloud Console, go to "APIs & Services" > "Credentials"
2. Click on your API key
3. Under "Application restrictions", select "HTTP referrers"
4. Add your domain(s), e.g., `localhost:3000/*` for development
5. Under "API restrictions", select "Restrict key" and choose "Maps JavaScript API"

## Note

- Never commit your `.env` file to version control
- The `.env` file is already included in `.gitignore`
- Make sure to restart your development server after adding the API key
