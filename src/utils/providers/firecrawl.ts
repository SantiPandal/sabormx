import FirecrawlApp from '@mendable/firecrawl-js';

const firecrawl = new FirecrawlApp({apiKey: process.env.FIRECRAWL_API_KEY});

export default firecrawl;