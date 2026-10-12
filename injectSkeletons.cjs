const fs = require('fs');

// Replace in Home.jsx
let home = fs.readFileSync('src/pages/Home.jsx', 'utf8');
home = home.replace(
  /<div className="py-20 text-center text-gray-500 font-medium">Loading products...<\/div>/g,
  '<ProductGridSkeleton count={8} />'
);
if (!home.includes('ProductGridSkeleton')) {
  home = home.replace('import React', 'import React;\nimport { ProductGridSkeleton } from \'../components/Skeletons\';');
}
fs.writeFileSync('src/pages/Home.jsx', home);

// Replace in Shop.jsx
let shop = fs.readFileSync('src/pages/Shop.jsx', 'utf8');
shop = shop.replace(
  /<div className="py-20 text-center text-gray-500 font-medium">Loading products...<\/div>/g,
  '<ProductGridSkeleton count={8} />'
);
if (!shop.includes('ProductGridSkeleton')) {
  shop = shop.replace('import React', 'import React;\nimport { ProductGridSkeleton } from \'../components/Skeletons\';');
}
fs.writeFileSync('src/pages/Shop.jsx', shop);

// Replace in ProductDetails.jsx
let prodDetails = fs.readFileSync('src/pages/ProductDetails.jsx', 'utf8');
prodDetails = prodDetails.replace(
  /if \(loading\) return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-500 font-medium">Loading product...<\/div>;/g,
  'if (loading) return <DetailSkeleton />;'
);
if (!prodDetails.includes('DetailSkeleton')) {
  prodDetails = prodDetails.replace('import React', 'import React;\nimport { DetailSkeleton } from \'../components/Skeletons\';');
}
fs.writeFileSync('src/pages/ProductDetails.jsx', prodDetails);

// Replace in MyOrders.jsx
let myOrders = fs.readFileSync('src/pages/MyOrders.jsx', 'utf8');
myOrders = myOrders.replace(
  /<div className="py-20 text-center text-gray-500 font-medium">Loading your orders...<\/div>/g,
  '<div className="mt-8"><TableSkeleton rows={3} /></div>'
);
if (!myOrders.includes('TableSkeleton')) {
  myOrders = myOrders.replace('import React', 'import React;\nimport { TableSkeleton } from \'../components/Skeletons\';');
}
fs.writeFileSync('src/pages/MyOrders.jsx', myOrders);

// Admin Pages
const adminPages = ['Users', 'Products', 'Orders', 'Dashboard', 'Categories'];
adminPages.forEach(page => {
  let file = `src/pages/admin/${page}.jsx`;
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(
      /<div className="py-20 text-center text-gray-500 font-medium">Loading[\s\S]*?<\/div>/g,
      '<TableSkeleton rows={5} />'
    );
    if (!content.includes('TableSkeleton')) {
      content = content.replace('import React', 'import React;\nimport { TableSkeleton } from \'../../components/Skeletons\';');
    }
    fs.writeFileSync(file, content);
  }
});

console.log('Skeleton injected');
