const fs = require('fs');
const path = require('path');

function findInDir(dir, filter, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      findInDir(filePath, filter, fileList);
    } else if (filter.test(filePath)) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const files = findInDir('src', /\.jsx$/);
let totalReplaced = 0;

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  let original = content;

  // 1. Replace text-white with text-gray-900 when bg-primary-teal, bg-secondary-teal, or bg-accent-orange is present
  content = content.replace(/className=(['"])(.*?)\1/g, (match, quote, classes) => {
    let newClasses = classes;
    
    // Check if background is pastel
    if (newClasses.includes('bg-primary-teal') || 
        newClasses.includes('bg-secondary-teal') || 
        newClasses.includes('bg-accent-orange') ||
        newClasses.includes('hover:bg-primary-teal') ||
        newClasses.includes('hover:bg-secondary-teal') ||
        newClasses.includes('hover:bg-accent-orange')) {
      
      // We are on a pastel bg, replace white text with dark text
      newClasses = newClasses.replace(/\btext-white\b/g, 'text-gray-900');
    }

    // 2. Check if text color is pastel
    if (newClasses.includes('text-primary-teal') || 
        newClasses.includes('text-secondary-teal') || 
        newClasses.includes('text-accent-orange')) {
      
      // If NOT on a dark background, change text to dark
      const hasDarkBg = /\bbg-(gray-800|gray-900|black|black\/.*)\b/.test(newClasses);
      if (!hasDarkBg) {
        newClasses = newClasses.replace(/\btext-primary-teal\b/g, 'text-gray-900 font-bold');
        newClasses = newClasses.replace(/\btext-secondary-teal\b/g, 'text-gray-800');
        newClasses = newClasses.replace(/\btext-accent-orange\b/g, 'text-gray-900');
      }
    }

    // 3. Fix hover text colors
    if (newClasses.includes('hover:text-primary-teal') ||
        newClasses.includes('hover:text-secondary-teal') ||
        newClasses.includes('hover:text-accent-orange')) {
        
        const hasDarkBg = /\bbg-(gray-800|gray-900|black|black\/.*)\b/.test(newClasses);
        if (!hasDarkBg) {
            newClasses = newClasses.replace(/\bhover:text-primary-teal\b/g, 'hover:text-gray-700');
            newClasses = newClasses.replace(/\bhover:text-secondary-teal\b/g, 'hover:text-gray-600');
            newClasses = newClasses.replace(/\bhover:text-accent-orange\b/g, 'hover:text-gray-700');
        }
    }

    return 'className=' + quote + newClasses + quote;
  });

  // Handle template literals: className={`...`}
  content = content.replace(/className=\{`(.*?)`\}/g, (match, classes) => {
    let newClasses = classes;
    
    // Check if background is pastel
    if (newClasses.includes('bg-primary-teal') || 
        newClasses.includes('bg-secondary-teal') || 
        newClasses.includes('bg-accent-orange')) {
      newClasses = newClasses.replace(/\btext-white\b/g, 'text-gray-900');
    }

    // Check if text color is pastel
    if (newClasses.includes('text-primary-teal') || 
        newClasses.includes('text-secondary-teal') || 
        newClasses.includes('text-accent-orange')) {
      const hasDarkBg = /\bbg-(gray-800|gray-900|black|black\/.*)\b/.test(newClasses);
      if (!hasDarkBg) {
        newClasses = newClasses.replace(/\btext-primary-teal\b/g, 'text-gray-900 font-bold');
        newClasses = newClasses.replace(/\btext-secondary-teal\b/g, 'text-gray-800');
        newClasses = newClasses.replace(/\btext-accent-orange\b/g, 'text-gray-900');
      }
    }

    if (newClasses.includes('hover:text-primary-teal') ||
        newClasses.includes('hover:text-secondary-teal') ||
        newClasses.includes('hover:text-accent-orange')) {
        
        const hasDarkBg = /\bbg-(gray-800|gray-900|black|black\/.*)\b/.test(newClasses);
        if (!hasDarkBg) {
            newClasses = newClasses.replace(/\bhover:text-primary-teal\b/g, 'hover:text-gray-700');
            newClasses = newClasses.replace(/\bhover:text-secondary-teal\b/g, 'hover:text-gray-600');
            newClasses = newClasses.replace(/\bhover:text-accent-orange\b/g, 'hover:text-gray-700');
        }
    }

    return 'className={`' + newClasses + '`}';
  });

  if (content !== original) {
    fs.writeFileSync(f, content);
    totalReplaced++;
  }
});
console.log('Modified files:', totalReplaced);
