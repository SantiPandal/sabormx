import { z } from 'zod';

/**
 * Schema for raw scraped data from restaurant websites
 */
export const RestaurantRawDataSchema = z.object({
  rawHtml: z.string().optional(),
  rawMarkdown: z.string().optional(),
  scrapedUrl: z.string().url().optional(),
  scrapedAt: z.string().datetime().optional(),
});

// Create type from schema
export type RestaurantRawData = z.infer<typeof RestaurantRawDataSchema>;

/**
 * Schema for processed restaurant data
 */
export const RestaurantSchema = z.object({
  name: z.string().min(1).describe("The restaurant's full name"),
  cuisine_type: z.string().describe("The type of cuisine"),
  price_level: z.number().min(1).max(4).describe("Price level from 1-4"),
  address: z.string().describe("The full street address"),
  city: z.string().describe("Just the city name"),
  rating: z.number().min(1).max(5).describe("Rating from 1-5"),
  image_url: z.string().url().optional().describe("URL to image"),
  is_hot_spot: z.boolean().describe("Is this a popular place?"),
  good_for_date: z.boolean().describe("Good for a date?"),
  highlights: z.array(z.string()).max(5).describe("Top highlights"),
  hours: z.string().optional().describe("Opening hours"),
});

// Extend the base schema with metadata
export const ProcessedRestaurantDataSchema = RestaurantSchema.extend({
  source_url: z.string().url(),
  processed_at: z.string().datetime(),
});

// Create type from schema
export type ProcessedRestaurantData = z.infer<typeof ProcessedRestaurantDataSchema>;
