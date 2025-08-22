import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function removeNonSectionComments(content) {
  const lines = content.split('\n');
  const result = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    // Skip empty lines and preserve them
    if (trimmed === '') {
      result.push(line);
      continue;
    }
    
    // Skip single-line // comments (except URLs and special cases)
    if (trimmed.startsWith('//') && 
        !trimmed.includes('http') && 
        !trimmed.includes('@') && 
        !trimmed.includes('filepath:')) {
      continue;
    }
    
    // Preserve JSX section comments (like {/* Section Name */})
    if (trimmed.startsWith('{/*') && trimmed.endsWith('*/}') && 
        trimmed.length < 100) { // Section comments are usually short
      result.push(line);
      continue;
    }
    
    // Remove inline // comments but preserve URLs
    if (line.includes('//') && !line.includes('http') && !line.includes('@')) {
      const codeBeforeComment = line.split('//')[0];
      // Only remove if there's actual code before the comment
      if (codeBeforeComment.trim().length > 0) {
        result.push(codeBeforeComment.trimEnd());
      } else if (codeBeforeComment.trim().length === 0) {
        // This is a full line comment, skip it
        continue;
      } else {
        result.push(line);
      }
    } else {
      result.push(line);
    }
  }
  
  // Remove multiple consecutive empty lines
  const finalResult = [];
  let consecutiveEmpty = 0;
  
  for (const line of result) {
    if (line.trim() === '') {
      consecutiveEmpty++;
      if (consecutiveEmpty <= 2) { // Allow max 2 consecutive empty lines
        finalResult.push(line);
      }
    } else {
      consecutiveEmpty = 0;
      finalResult.push(line);
    }
  }
  
  return finalResult.join('\n');
}

function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const cleaned = removeNonSectionComments(content);
    
    if (content !== cleaned) {
      fs.writeFileSync(filePath, cleaned, 'utf8');
      console.log(`✓ Cleaned: ${filePath}`);
    }
  } catch (error) {
    console.error(`✗ Error processing ${filePath}:`, error.message);
  }
}

function walkDirectory(dir, excludeDirs = ['node_modules', '.git', 'dist', 'build', '.next']) {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      if (!excludeDirs.includes(item)) {
        walkDirectory(fullPath, excludeDirs);
      }
    } else if (stat.isFile()) {
      const ext = path.extname(item).toLowerCase();
      if (['.ts', '.tsx', '.js', '.jsx'].includes(ext)) {
        processFile(fullPath);
      }
    }
  }
}

// Start processing from src directory
const srcDir = path.join(__dirname, 'src');
if (fs.existsSync(srcDir)) {
  console.log('Starting comment cleanup process...');
  walkDirectory(srcDir);
  console.log('Comment cleanup completed for src directory!');
} else {
  console.error('src directory not found!');
}

// Also process root files
const rootFiles = ['middleware.ts', 'next.config.ts'];
rootFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    processFile(filePath);
  }
});

console.log('All files processed!');
