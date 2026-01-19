import { JSDOM } from "jsdom";

export default async function web_search(keywords) {
  const url = `https://lite.duckduckgo.com/lite/?q=${encodeURIComponent(keywords)}`;
  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0",
    },
  });

  const html = await response.text();
  const window = (new JSDOM(html)).window;

  const results = window.document.querySelectorAll('table[border] > tbody')[1];

  let data = [];

  for (let index = 0; index < results.children.length - 4 ; index += 4) {
    data.push({
      title: results.children[index].querySelector('a').textContent,
      detail: results.children[index+1].querySelector('.result-snippet').textContent,
      source: results.children[index + 2].querySelector('.link-text').textContent,
    });
  }
  return data;
}
