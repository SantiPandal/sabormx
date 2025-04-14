import { RestaurantRawData, RestaurantSchema } from './types';
import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';

// Get the API key from environment variables
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';

/**
 * Simple data structure for restaurant information
 */
export interface ProcessedRestaurantData {
  // Basic restaurant info
  name: string;
  cuisine_type: string;
  address: string;
  city: string;
  
  // Ratings and categories
  rating: number;              // 1-5 stars
  price_level: number;         // 1-4 price level
  is_hot_spot: boolean;        // Is it popular/trendy?
  good_for_date: boolean;      // Good for dates?
  
  // Additional details
  image_url?: string;          // Main restaurant image
  highlights: string[];        // Key features (up to 5)
  hours?: string;              // Operating hours
  
  // Source tracking
  source_url: string;          // Where we got the data
  processed_at: string;        // When we processed it
}

/**
 * Takes raw website data and extracts restaurant information using AI
 */
export async function processRestaurantData(rawData: RestaurantRawData): Promise<ProcessedRestaurantData> {
  // Step 1: Check if we have data to process
  console.log(`Starting to process data from: ${rawData.scrapedUrl}`);
  
  if (!rawData.rawMarkdown && !rawData.rawHtml) {
    throw new Error('No website content available to process');
  }
  
  // Check if OpenAI API key is available
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key is missing. Please add OPENAI_API_KEY to your .env file.');
  }
  
  try {
    // Step 2: Get the website content (prefer markdown if available)
    const websiteContent = rawData.rawMarkdown || rawData.rawHtml || '';
    
    // Step 3: Use AI to analyze the website content
    console.log('Asking AI to extract restaurant information...');
    const result = await generateObject({
      model: openai('gpt-4o'),
      schema: RestaurantSchema,
      prompt: `
        Analyze the following restaurant data:
        
        ${websiteContent.substring(0, 15000)}
      `,
      // Add any other required configuration
    });
    
    // Step 4: Get the extracted restaurant data
    const restaurantInfo = result.object;
    
    // Step 5: Add source information and return the result
    const finalData = {
      ...restaurantInfo,
      source_url: rawData.scrapedUrl || '',
      processed_at: new Date().toISOString(),
    };
    
    console.log(`Successfully extracted info for: ${finalData.name}`);
    return finalData;
    
  } catch (error) {
    // Handle any errors that occurred
    console.error('Something went wrong during processing:', error);
    
    // Add better debugging information for OpenAI API key errors
    if (error instanceof Error) {
      if (error.message.includes('Incorrect API key provided') || error.message.includes('invalid_api_key')) {
        console.error('OpenAI API KEY ERROR: Your OpenAI API key is invalid or has incorrect format.');
        console.error('Please check the following:');
        console.error('1. Ensure your OPENAI_API_KEY in .env file is correct and doesn\'t have extra quotes or spaces');
        console.error('2. Make sure you\'re using a standard OpenAI API key (starts with sk-)');
        console.error('3. If using a Vercel AI SDK project key (starts with sk-proj-), you need to configure the AI SDK properly');
      }
    }
    
    throw new Error(`Failed to process restaurant data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Process multiple restaurants but in smaller batches to avoid overloading
 */
export async function batchProcessRestaurants(websites: RestaurantRawData[]): Promise<ProcessedRestaurantData[]> {
  console.log(`Need to process ${websites.length} restaurant websites`);
  
  try {
    // Process in smaller groups of 3 at a time
    const allResults = [];
    const BATCH_SIZE = 3;
    
    // Loop through the websites in small batches
    for (let i = 0; i < websites.length; i += BATCH_SIZE) {
      console.log(`Processing batch ${Math.floor(i/BATCH_SIZE) + 1}...`);
      
      // Get the next 3 websites (or fewer if at the end)
      const currentBatch = websites.slice(i, i + BATCH_SIZE);
      
      // Process this batch in parallel
      const batchResults = await Promise.all(
        currentBatch.map(website => processRestaurantData(website))
      );
      
      // Add the results to our collection
      allResults.push(...batchResults);
      
      // Take a short break between batches (if more batches remain)
      if (i + BATCH_SIZE < websites.length) {
        console.log('Taking a short break before the next batch...');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    console.log(`Finished processing all ${websites.length} restaurants!`);
    return allResults;
    
  } catch (error) {
    console.error('Something went wrong during batch processing:', error);
    throw new Error(`Failed to process multiple restaurants: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
