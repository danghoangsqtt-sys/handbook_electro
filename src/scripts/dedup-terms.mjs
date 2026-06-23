import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const categoriesDir = path.join(__dirname, '../../public/data/categories');

function dedupTerms() {
  console.log("Starting Deduplication Process...");
  if (!fs.existsSync(categoriesDir)) {
    console.error(`Directory not found: ${categoriesDir}`);
    return;
  }

  const files = fs.readdirSync(categoriesDir).filter(f => f.endsWith('.json'));
  const globalTermNames = new Set();
  let totalDuplicatesRemoved = 0;

  for (const file of files) {
    const filePath = path.join(categoriesDir, file);
    try {
      const fileData = fs.readFileSync(filePath, 'utf8');
      const terms = JSON.parse(fileData);
      const uniqueTerms = [];
      let duplicatesRemoved = 0;

      for (const term of terms) {
        if (!term.term) continue;
        const normalizedTerm = term.term.trim().toLowerCase();
        
        if (globalTermNames.has(normalizedTerm)) {
          duplicatesRemoved++;
          totalDuplicatesRemoved++;
        } else {
          globalTermNames.add(normalizedTerm);
          uniqueTerms.push(term);
        }
      }

      if (duplicatesRemoved > 0) {
        fs.writeFileSync(filePath, JSON.stringify(uniqueTerms, null, 2), 'utf8');
        console.log(`[${file}] Removed ${duplicatesRemoved} duplicates. Total remaining: ${uniqueTerms.length}`);
      } else {
        console.log(`[${file}] No duplicates found. Total: ${uniqueTerms.length}`);
      }

    } catch (e) {
      console.error(`Failed to process ${file}:`, e);
    }
  }

  console.log(`Deduplication finished. Total duplicates removed across all files: ${totalDuplicatesRemoved}`);
}

dedupTerms();
