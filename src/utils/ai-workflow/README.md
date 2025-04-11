# AI Restaurant Data Collection Workflow

This folder contains a complete workflow for automatically collecting restaurant data from websites using AI. The workflow:

1. Scrapes restaurant websites
2. Uses AI to extract structured information
3. Saves the data to your Supabase database
4. Displays the data in the dashboard

## Setup Instructions

1. Install the additional dependency:

```bash
npm install tsx --save-dev
```

2. Add your Firecrawl API key to `.env`:

```
FC_API_KEY=your_firecrawl_api_key_here
```

3. Update the restaurant URLs in `src/scripts/process-restaurants.ts` with actual restaurant websites:

```javascript
const RESTAURANT_URLS = [
  'https://actual-restaurant1.com',
  'https://actual-restaurant2.com',
  // Add more restaurants...
];
```

## Running the Workflow

To manually run the workflow:

```bash
npm run process-restaurants
```

## Setting Up a Schedule

### On macOS/Linux (Cron):

Add a cron job to run the script daily at midnight:

1. Open your crontab:
```bash
crontab -e
```

2. Add this line:
```
0 0 * * * cd /path/to/your/project && npm run process-restaurants >> logs/restaurant-processing.log 2>&1
```

### On Windows (Task Scheduler):

1. Create a batch file `process-restaurants.bat` with:
```batch
cd C:\path\to\your\project
npm run process-restaurants
```

2. Set up a Task Scheduler task to run this batch file daily

## How It Works

- `scraper.ts`: Collects raw HTML/markdown from restaurant websites
- `processor.ts`: Uses AI to extract structured information
- `database.ts`: Saves processed data to Supabase
- `index.ts`: Coordinates the entire workflow

## Viewing the Data

The restaurant data is automatically displayed in the dashboard (`/dashboard`) since it's fetched directly from the database.

## Troubleshooting

- Check `FC_API_KEY` is set correctly
- Ensure your Supabase credentials are correct
- Try processing a single restaurant first to debug issues
- Look at restaurant website parsing - if certain websites aren't being processed correctly, you might need to adjust the AI prompts 