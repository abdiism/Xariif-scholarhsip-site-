const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { marked } = require('marked'); // <-- 1. IMPORT MARKED

const contentDir = path.join(__dirname, '../content');
const outputDir = path.join(__dirname, '../src/data');
const outputFile = path.join(outputDir, 'content.json');

function getAllContent() {
  const allContent = {};
  const contentTypes = fs.readdirSync(contentDir);

  contentTypes.forEach(type => {
    const typeDir = path.join(contentDir, type);
    if (fs.lstatSync(typeDir).isDirectory()) {
      const files = fs.readdirSync(typeDir).filter(file => file.endsWith('.md'));
      
      allContent[type] = files.map(file => {
        const filePath = path.join(typeDir, file);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const { data, content } = matter(fileContent);
        
        // Create a unique ID from the filename
        const id = path.basename(file, '.md');

        // <-- 2. CONVERT MARKDOWN TO HTML
        const htmlContent = marked(content);

        return {
          id,
          ...data,
          content: htmlContent, // <-- 3. USE 'content' KEY and the new HTML
        };
      });
    }
  });

  return allContent;
}

function buildContent() {
  const content = getAllContent();
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }
  
  fs.writeFileSync(outputFile, JSON.stringify(content, null, 2));
  console.log('✅ Content built successfully!');
}

buildContent();