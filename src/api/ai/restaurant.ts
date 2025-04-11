import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai/operations';
import { z } from 'zod';

// Define the Restaurant schema
const RestaurantSchema = z.object({
  name: z.string().min(1).describe("The restaurant's full name"),
  cuisine_type: z.string().describe("The type of cuisine (e.g. Italian, Mexican)"),
  price_level: z.number().min(1).max(4).describe("Price level from 1-4 (1=inexpensive, 4=very expensive)"),
  address: z.string().describe("The full street address"),
  city: z.string().describe("Just the city name"),
  rating: z.number().min(1).max(5).describe("Estimated rating from 1-5 based on reviews"),
  image_url: z.string().url().optional().describe("URL to the restaurant's main image if found"),
  is_hot_spot: z.boolean().describe("Is this a popular/trendy place?"),
  good_for_date: z.boolean().describe("Is this good for a date night?"),
  highlights: z.array(z.string()).max(5).describe("Top 5 highlights or special features"),
  hours: z.string().optional().describe("Opening hours if available"),
});

export async function POST(req: Request) {
  try {
    // Extract content from request
    const { content } = await req.json();
    
    if (!content) {
      return Response.json(
        { success: false, error: "Content is required" },
        { status: 400 }
      );
    }
    
    // Use AI to extract restaurant data with our schema
    const restaurantData = await generateObject({
      model: openai('gpt-4o'),
      schema: RestaurantSchema,
      prompt: `
        You are a restaurant data extraction expert. Extract structured information from the following restaurant website content.
        
        RESTAURANT CONTENT:
        ${content.substring(0, 15000)}
        
        Extract all restaurant information as accurately as possible. Use the information directly from the content.
        If information is not provided, make reasonable estimates based on context.
      `
    });
    
    // Return the structured data
    return Response.json({
      success: true,
      data: restaurantData,
      metadata: {
        processed_at: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('Error processing restaurant data:', error);
    return Response.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 