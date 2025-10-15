// netlify/functions/rss.js
import Parser from "rss-parser";

const parser = new Parser();

const FEED_MAP = {
  top: "https://feeds.bbci.co.uk/news/rss.xml",
  world: "https://feeds.bbci.co.uk/news/world/rss.xml",
  uk: "https://feeds.bbci.co.uk/news/uk/rss.xml",
  business: "https://feeds.bbci.co.uk/news/business/rss.xml",
  technology: "https://feeds.bbci.co.uk/news/technology/rss.xml",
  entertainment: "https://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml",
  science: "https://feeds.bbci.co.uk/news/science_and_environment/rss.xml",
  health: "https://feeds.bbci.co.uk/news/health/rss.xml",
};

export async function handler(event, context) {
  const feedKey = (event.queryStringParameters.feed || "").toLowerCase();
  const url = FEED_MAP[feedKey];
  if (!url)
    return { statusCode: 400, body: JSON.stringify({ error: "Unknown feed" }) };

  try {
    const feed = await parser.parseURL(url);
    const items = feed.items.map((i) => ({
      title: i.title,
      link: i.link,
      pubDate: i.isoDate || i.pubDate || null,
    }));
    return {
      statusCode: 200,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ feed: feed.title, items }),
    };
  } catch (err) {
    return { statusCode: 502, body: JSON.stringify({ error: "RSS error" }) };
  }
}
