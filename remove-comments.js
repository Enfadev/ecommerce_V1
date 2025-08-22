const fs = require('fs');
const path = require('path');

// Function to remove non-section comments from a file
function removeComments(content) {
  // Remove single line comments (// comments) but keep JSX comments ({/* ... */})
  // Remove inline comments that are not section comments
  let result = content;
  
  // Remove single line // comments that are not URLs or JSX
  result = result.replace(/^[\s]*\/\/(?!.*https?:\/\/)(?!.*@)(?!\s*\/\/).*$/gm, '');
  
  // Remove inline // comments but preserve URLs
  result = result.replace(/(?<!:)\/\/(?!.*https?:\/\/)(?!\/)(?!\s*@)\s*[^\r\n]*$/gm, '');
  
  // Remove empty lines that were created by comment removal
  result = result.replace(/\n\s*\n\s*\n/g, '\n\n');
  
  return result;
}

// Function to process TypeScript/JavaScript files
function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const cleanedContent = removeComments(content);
    
    if (content !== cleanedContent) {
      fs.writeFileSync(filePath, cleanedContent);
      console.log(`Processed: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

// Function to walk directory recursively
function walkDirectory(dir, excludeDirs = ['node_modules', '.git', 'dist', 'build']) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      if (!excludeDirs.includes(file)) {
        walkDirectory(filePath, excludeDirs);
      }
    } else if (stat.isFile()) {
      const ext = path.extname(file);
      if (['.ts', '.tsx', '.js', '.jsx'].includes(ext)) {
        processFile(filePath);
      }
    }
  }
}

// Start processing from src directory
const srcDir = path.join(__dirname, 'src');
if (fs.existsSync(srcDir)) {
  console.log('Starting comment removal process...');
  walkDirectory(srcDir);
  console.log('Comment removal completed!');
} else {
  console.error('src directory not found!');
}

// Also process middleware.ts and next.config.ts
const rootFiles = ['middleware.ts', 'next.config.ts'];
rootFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    processFile(filePath);
  }
});
