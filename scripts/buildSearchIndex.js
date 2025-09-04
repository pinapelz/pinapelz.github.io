import fs from "fs";
import path from "path";
import MiniSearch from "minisearch";

// Function to parse frontmatter from markdown files
function parseFrontmatter(content) {
  const frontmatterRegex = /^---\n(.*?)\n---\n(.*)/s;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    return { frontmatter: {}, body: content };
  }
  
  const frontmatterText = match[1];
  const body = match[2];
  
  // Simple YAML parser for our specific needs
  const frontmatter = {};
  const lines = frontmatterText.split('\n');
  
  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) continue;
    
    const key = line.slice(0, colonIndex).trim();
    let value = line.slice(colonIndex + 1).trim();
    
    // Remove quotes if present
    if ((value.startsWith('"') && value.endsWith('"')) || 
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    
    // Handle arrays (simple case for tags)
    if (value.startsWith('[') && value.endsWith(']')) {
      value = value.slice(1, -1).split(',').map(v => v.trim().replace(/['"]/g, ''));
    }
    
    frontmatter[key] = value;
  }
  
  return { frontmatter, body: body.trim() };
}

// Function to extract excerpt from content
function extractExcerpt(content, maxLength = 200) {
  // Remove markdown syntax for a cleaner excerpt
  let excerpt = content
    .replace(/#{1,6}\s+/g, '') // Remove headers
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.*?)\*/g, '$1') // Remove italic
    .replace(/`(.*?)`/g, '$1') // Remove code
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links, keep text
    .trim();
  
  if (excerpt.length > maxLength) {
    excerpt = excerpt.substring(0, maxLength) + '...';
  }
  
  return excerpt;
}

export async function buildSearch() {
  try {
    const microblogDir = path.join(process.cwd(), 'src/content/microblog');
    const files = fs.readdirSync(microblogDir).filter(file => {
      // Include .md files or files without extensions that contain frontmatter
      if (file.endsWith('.md')) return true;
      if (!file.includes('.')) {
        // Check if file contains frontmatter
        const filePath = path.join(microblogDir, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        return content.startsWith('---');
      }
      return false;
    });
    
    const docs = [];
    
    for (const file of files) {
      const filePath = path.join(microblogDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const { frontmatter, body } = parseFrontmatter(content);
      
      // Extract ID from filename (remove .md extension if present)
      const id = file.endsWith('.md') ? path.basename(file, '.md') : file;
      
      // Create the document
      const doc = {
        id: id,
        title: frontmatter.title || body.substring(0, 100) + '...',
        excerpt: extractExcerpt(body),
        date: frontmatter.pubDate || new Date().toISOString(),
        tags: frontmatter.tags || [],
        content: body
      };
      
      docs.push(doc);
    }
    
    // Sort by date (newest first)
    docs.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Create MiniSearch index
    const miniSearch = new MiniSearch({
      fields: ['title', 'content', 'tags'],
      storeFields: ['title', 'excerpt', 'date', 'tags', 'id']
    });
    
    miniSearch.addAll(docs);
    
    // Create the search data structure that includes both the index and documents
    const searchData = {
      ...miniSearch.toJSON(),
      documents: docs
    };
    
    // Ensure public directory exists
    const publicDir = path.join(process.cwd(), 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    
    // Write the search index
    fs.writeFileSync(
      path.join(publicDir, 'search.json'),
      JSON.stringify(searchData, null, 2)
    );
    
    console.log(`✓ Built search index with ${docs.length} documents`);
    
  } catch (error) {
    console.error('Error building search index:', error);
    throw error;
  }
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  await buildSearch();
}