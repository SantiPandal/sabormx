import { scrapeRestaurantData, batchScrapeRestaurants } from './scraper';
import { processRestaurantData, batchProcessRestaurants as batchAIProcess } from './processor';
import { saveRestaurantToDatabase, batchSaveToDatabase, restaurantExists } from './database';
import { RestaurantRawData, ProcessedRestaurantData } from './types';
import { Restaurants } from '../../types/database';

/**
 * Complete workflow to scrape, process, and save restaurant data
 * @param url URL of the restaurant website to process
 * @returns The saved restaurant data
 */
export async function processRestaurantWebsite(url: string): Promise<Restaurants> {
  try {
    console.log(`Starting workflow for ${url}`);
    
    // Step 1: Scrape the website
    const rawData = await scrapeRestaurantData(url);
    
    // Step 2: Process with AI
    const processedData = await processRestaurantData(rawData);
    
    // Step 3: Save to database
    const savedData = await saveRestaurantToDatabase(processedData);
    
    console.log(`Completed workflow for ${url}`);
    return savedData;
    
  } catch (error) {
    console.error('Error in processRestaurantWebsite workflow:', error);
    throw new Error(`Failed to process restaurant website ${url}: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Batch process multiple restaurant websites
 * @param urls Array of restaurant website URLs
 * @returns Array of saved restaurant data
 */
export async function batchProcessRestaurants(urls: string[]): Promise<Restaurants[]> {
  try {
    console.log(`Starting batch workflow for ${urls.length} URLs`);
    
    // Step 1: Scrape all the websites
    const rawDataArray = await batchScrapeRestaurants(urls);
    
    // Step 2: Process all the data
    const processedDataArray = await batchAIProcess(rawDataArray);
    
    // Step 3: Save all the data
    const savedDataArray = await batchSaveToDatabase(processedDataArray);
    
    console.log(`Completed batch workflow for ${urls.length} URLs`);
    return savedDataArray;
  } catch (error) {
    console.error('Error in batchProcessRestaurants workflow:', error);
    throw new Error(`Failed to batch process restaurant websites: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Checks if a restaurant website has already been processed
 * @param url The restaurant website URL
 * @param name The restaurant name (if known)
 * @param address The restaurant address (if known)
 * @returns True if the restaurant exists, false otherwise
 */
export async function isWebsiteProcessed(url: string, name?: string, address?: string): Promise<boolean> {
  try {
    // If we have name and address, check directly
    if (name && address) {
      return await restaurantExists(name, address);
    }
    
    // Otherwise, we need to scrape and check
    const rawData = await scrapeRestaurantData(url);
    const processedData = await processRestaurantData(rawData);
    return await restaurantExists(processedData.name, processedData.address);
    
  } catch (error) {
    console.error('Error checking if website is processed:', error);
    return false; // Assume not processed if there's an error
  }
}

// Export everything for use elsewhere in the application
export {
  scrapeRestaurantData,
  batchScrapeRestaurants,
  processRestaurantData,
  batchAIProcess,
  saveRestaurantToDatabase,
  batchSaveToDatabase,
  restaurantExists,
};

export type {
  RestaurantRawData,
  ProcessedRestaurantData,
}; 