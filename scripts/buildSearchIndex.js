import { getCollection } from "astro:content";
import fs from "fs";
import MiniSearch from "minisearch";

export async function buildSearch() {
  const posts = await getCollection("microblog");

  const docs = posts.map((p) => ({
    id: p.id,
    title: p.body.substring(0, 100) + '...', // use first part of content as title
    date: p.data.pubDate,
    tags: p.data.tags || [],
    content: p.body, // raw markdown text
  }));

  const miniSearch = new MiniSearch({
    fields: ["title", "content", "tags"], // what to search
    storeFields: ["title", "date", "tags", "id"], // what to return
  });

  miniSearch.addAll(docs);

  fs.writeFileSync(
    "public/search.json",
    JSON.stringify(miniSearch.toJSON(), null, 2)
  );
}

await buildSearch();
