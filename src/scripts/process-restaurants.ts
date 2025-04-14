// Load environment variables first
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

/**
 * This script processes restaurant websites and saves the data to the database.
 * It can be run on a schedule (e.g., once a day) using a cron job or similar.
 * 
 * Run with: npx tsx src/scripts/process-restaurants.ts
 */

import { batchProcessRestaurants, isWebsiteProcessed } from '../utils/ai-workflow';

// Debug: Check if API key is present
const FIRECRAWL_API_KEY = process.env.FIRECRAWL_API_KEY;
console.log('Firecrawl API Key exists:', !!FIRECRAWL_API_KEY);

// Add your restaurant URLs here
const RESTAURANT_URLS = [
  'https://cdmxsecreta.com/comer-y-beber/',
  'https://mbmarcobeteta.com/ciudad/cdmx/',
  // Add more restaurant websites here
];

/**
 * Main function to process all restaurants
 */
async function main() {
  console.log('Starting restaurant processing script...');
  console.log(`Found ${RESTAURANT_URLS.length} restaurant URLs to process`);
  
  try {
    // Filter out already processed websites
    const urlsToProcess = [];
    
    for (const url of RESTAURANT_URLS) {
      const processed = await isWebsiteProcessed(url);
      
      if (processed) {
        console.log(`Skipping already processed: ${url}`);
      } else {
        urlsToProcess.push(url);
      }
    }
    
    console.log(`Processing ${urlsToProcess.length} new restaurants...`);
    
    if (urlsToProcess.length > 0) {
      // Process all new restaurant websites
      const results = await batchProcessRestaurants(urlsToProcess);
      console.log(`Successfully processed ${results.length} restaurants:`);
      
      results.forEach(restaurant => {
        console.log(`- ${restaurant.name} (${restaurant.cuisine_type})`);
      });
    } else {
      console.log('No new restaurants to process');
    }
    
    console.log('Processing completed successfully');
    
  } catch (error) {
    console.error('Error in processing script:', error);
    process.exit(1);
  }
}

// Run the main function
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Unhandled error:', error);
    process.exit(1);
  }); 