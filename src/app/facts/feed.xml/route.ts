import { getAllArticles } from "@/lib/facts/blog";
import { NextResponse } from "next/server";

const SITE_URL = "https://didyouknow.app";
const SITE_TITLE = "Did You Know? — A Modern Almanac of Fascinating Facts";
const SITE_DESCRIPTION =
  "Discover surprising facts about space, animals, history, science, and more. A beautifully designed almanac for the curious mind.";

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const articles = getAllArticles();

  const items = articles
    .map(
      (a) => `
    <item>
      <title>${escapeXml(a.title)}</title>
      <link>${SITE_URL}/blog/${a.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/blog/${a.slug}</guid>
      <description>${escapeXml(a.description)}</description>
      <pubDate>${new Date(a.publishedAt).toUTCString()}</pubDate>
      <category>${escapeXml(a.category)}</category>
    </item>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_TITLE)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
    <managingEditor>hello@didyouknow.app (Did You Know?)</managingEditor>
    <webMaster>hello@didyouknow.app (Did You Know?)</webMaster>
    <ttl>1440</ttl>
${items}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
