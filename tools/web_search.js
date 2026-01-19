export default async function web_search(keywords, lang = "us-en") {
  const url =
    `https://api.duckduckgo.com/?` +
    `q=${encodeURIComponent(keywords)}` +
    `&format=json` +
    `&no_redirect=1` +
    `&no_html=1` +
    `&kl=${lang}`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`DuckDuckGo API error: ${res.status}`);
  }

  const raw = await res.json();

  return {
    query: keywords,
    summary: raw.AbstractText || "",
    confidence: raw.AbstractText ? 0.7 : 0.2,
    sources: raw.AbstractSource
      ? [{ name: raw.AbstractSource }]
      : [],
    related_topics: Array.isArray(raw.RelatedTopics)
      ? raw.RelatedTopics
          .map(t => t.Text)
          .filter(Boolean)
          .map(t => t.split(" - ")[0])
      : [],
    limitations: [
      "DuckDuckGo Instant Answer API does not return full search results",
      "Content is mostly encyclopedic"
    ]
  };
}
