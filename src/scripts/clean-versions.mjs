import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const categoriesDir = path.join(__dirname, '../../public/data/categories');

function cleanVersions() {
  console.log("Starting Version Cleanup & Deduplication Process...");
  if (!fs.existsSync(categoriesDir)) {
    console.error(`Directory not found: ${categoriesDir}`);
    return;
  }

  const files = fs.readdirSync(categoriesDir).filter(f => f.endsWith('.json'));
  const globalSeenTerms = new Set();
  let totalDuplicatesRemoved = 0;
  let totalSuffixesCleaned = 0;

  for (const file of files) {
    const filePath = path.join(categoriesDir, file);
    try {
      const fileData = fs.readFileSync(filePath, 'utf8');
      const terms = JSON.parse(fileData);
      const uniqueCleanedTerms = [];
      let duplicatesRemovedInFile = 0;
      let suffixesCleanedInFile = 0;

      for (const item of terms) {
        if (!item.term) continue;
        
        let cleanedTerm = item.term.replace(/\s*\(Bản\s*\d+\)/gi, '').trim();
        let cleanedFullName = item.fullName ? item.fullName.replace(/\s*\(Bản\s*\d+\)/gi, '').trim() : "";
        
        if (cleanedTerm !== item.term) {
          suffixesCleanedInFile++;
          item.term = cleanedTerm;
        }
        
        if (cleanedFullName !== item.fullName) {
          item.fullName = cleanedFullName;
        }

        const normalizedTerm = cleanedTerm.toLowerCase();
        
        if (globalSeenTerms.has(normalizedTerm)) {
          duplicatesRemovedInFile++;
        } else {
          globalSeenTerms.add(normalizedTerm);
          uniqueCleanedTerms.push(item);
        }
      }

      totalDuplicatesRemoved += duplicatesRemovedInFile;
      totalSuffixesCleaned += suffixesCleanedInFile;

      if (duplicatesRemovedInFile > 0 || suffixesCleanedInFile > 0) {
        fs.writeFileSync(filePath, JSON.stringify(uniqueCleanedTerms, null, 2), 'utf8');
        console.log(`[${file}] Cleaned ${suffixesCleanedInFile} '(Bản X)' suffixes. Removed ${duplicatesRemovedInFile} duplicate records. Remaining terms: ${uniqueCleanedTerms.length}`);
      } else {
        console.log(`[${file}] No suffixes or duplicates found. Remaining terms: ${uniqueCleanedTerms.length}`);
      }

    } catch (e) {
      console.error(`Failed to process ${file}:`, e);
    }
  }

  console.log(`\nCleanup Finished!`);
  console.log(`Total '(Bản X)' suffixes cleaned: ${totalSuffixesCleaned}`);
  console.log(`Total duplicate records removed across all files: ${totalDuplicatesRemoved}`);
  console.log(`Total unique terms in system: ${globalSeenTerms.size}`);
}

cleanVersions();
