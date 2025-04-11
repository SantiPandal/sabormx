import { RestaurantRawData } from './types';
import FirecrawlApp, { ScrapeResponse } from '@mendable/firecrawl-js';

// Environment variables should be used for API keys
// Add FC_API_KEY to your .env file
const API_KEY = process.env.FC_API_KEY || '';

// Initialize the Firecrawl app
const firecrawl = new FirecrawlApp({apiKey: API_KEY});

/**
 * Scrapes restaurant data from a given URL
 * @param url The website URL to scrape
 * @returns Promise with the raw restaurant data
 */
export async function scrapeRestaurantData(url: string): Promise<RestaurantRawData> {
  try {
    console.log(`Starting to scrape: ${url}`);
    
    // Use Firecrawl to scrape the website
    const scrapeResult = await firecrawl.scrapeUrl(url, { 
      formats: ['markdown', 'html'] 
    }) as ScrapeResponse;
    
    // Handle unsuccessful scraping
    if (!scrapeResult.success) {
      throw new Error(`Failed to scrape: ${scrapeResult.error}`);
    }
    
    console.log(`Successfully scraped ${url}`);
    
    // Return the raw data
    return {
      rawHtml: scrapeResult.html || '',
      rawMarkdown: scrapeResult.markdown || '',
      scrapedUrl: url,
      // Timestamp when scraping was done
      scrapedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error in scrapeRestaurantData:', error);
    throw new Error(`Failed to scrape data from ${url}: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Scrapes multiple restaurant URLs in parallel
 * @param urls Array of website URLs to scrape
 * @returns Promise with array of raw restaurant data
 */
export async function batchScrapeRestaurants(urls: string[]): Promise<RestaurantRawData[]> {
  try {
    console.log(`Starting batch scrape of ${urls.length} URLs`);
    
    // Process URLs in smaller batches to avoid overwhelming the API
    const results = [];
    const batchSize = 3; // Process 3 at a time
    
    for (let i = 0; i < urls.length; i += batchSize) {
      const batch = urls.slice(i, i + batchSize);
      
      // Use Promise.all to scrape batch in parallel
      const batchPromises = batch.map(url => scrapeRestaurantData(url));
      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
      
      // Add a small delay between batches to avoid rate limiting
      if (i + batchSize < urls.length) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    console.log(`Completed batch scrape of ${urls.length} URLs`);
    return results;
  } catch (error) {
    console.error('Error in batchScrapeRestaurants:', error);
    throw new Error(`Failed to batch scrape URLs: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
