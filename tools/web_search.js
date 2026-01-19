export default async function web_search(keywords, lang = "us-en") {
  try {
    const url =
      `https://api.duckduckgo.com/?` +
      `q=${encodeURIComponent(keywords)}` +
      `&format=json&no_redirect=1&no_html=1&kl=${lang}`;

    const res = await fetch(url);
    const raw = await res.json();

    return {
      query: keywords,
      summary: raw?.AbstractText ?? "",
      confidence: raw?.AbstractText ? 0.7 : 0.2,
      sources: raw?.AbstractSource
        ? [{ name: raw.AbstractSource }]
        : [],
      related_topics: Array.isArray(raw?.RelatedTopics)
        ? raw.RelatedTopics
            .map(t => t?.Text)
            .filter(Boolean)
            .map(t => t.split(" - ")[0])
        : [],
      limitations: [
        "DuckDuckGo Instant Answer API only provides summaries"
      ]
    };
  } catch (e) {
    return {
      query: keywords,
      summary: "",
      confidence: 0,
      sources: [],
      related_topics: [],
      limitations: ["Web search failed"]
    };
  }
}
