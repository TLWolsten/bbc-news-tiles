// api/rss/index.js
import Parser from 'rss-parser';


const parser = new Parser();


const FEED_MAP = {
top: 'https://feeds.bbci.co.uk/news/rss.xml',
world: 'https://feeds.bbci.co.uk/news/world/rss.xml',
uk: 'https://feeds.bbci.co.uk/news/uk/rss.xml',
business: 'https://feeds.bbci.co.uk/news/business/rss.xml',
technology: 'https://feeds.bbci.co.uk/news/technology/rss.xml',
entertainment:'https://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml',
science: 'https://feeds.bbci.co.uk/news/science_and_environment/rss.xml',
health: 'https://feeds.bbci.co.uk/news/health/rss.xml'
};


export default async function (context, req) {
const feedKey = (req.query.feed || '').toLowerCase();
const url = FEED_MAP[feedKey];
if (!url) {
context.res = { status: 400, jsonBody: { error: 'Unknown feed key' } };
return;
}
try {
const feed = await parser.parseURL(url);
const items = (feed.items || []).map(i => ({
title: i.title,
link: i.link,
pubDate: i.isoDate || i.pubDate || null,
guid: i.guid || null
}));
context.res = {
headers: {
'content-type': 'application/json',
'cache-control': 'public, max-age=180' // cache 3 minutes
},
jsonBody: { feed: feed.title, items }
};
} catch (err) {
context.log('RSS error', err);
context.res = { status: 502, jsonBody: { error: 'Failed to fetch RSS' } };
}
}
