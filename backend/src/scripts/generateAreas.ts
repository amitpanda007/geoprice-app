import dotenv from "dotenv";
import { generateAndSaveAreas } from "../utils/landAreaGenerator";

// Load environment variables
dotenv.config();

async function main() {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    console.error("GOOGLE_MAPS_API_KEY environment variable is required");
    console.log(
      "Please add GOOGLE_MAPS_API_KEY=your_api_key to your .env file"
    );
    process.exit(1);
  }

  await generateAndSaveAreas(apiKey);
}

main().catch(console.error);
