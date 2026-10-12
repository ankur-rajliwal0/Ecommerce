const fs = require('fs');
const path = require('path');

function replaceInDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      replaceInDir(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const originalContent = content;
      content = content.replace(/'\/admin'/g, "'/store-control'");
      content = content.replace(/"\/admin"/g, '"/store-control"');
      content = content.replace(/'\/admin\//g, "'/store-control/");
      content = content.replace(/"\/admin\//g, '"/store-control/');
      content = content.replace(/`\/admin\//g, "`/store-control/");
      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Replaced in ${fullPath}`);
      }
    }
  }
}

replaceInDir('c:/Users/HP/Desktop/ecom/src');
