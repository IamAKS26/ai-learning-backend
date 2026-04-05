const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, 'src/controllers');
const files = fs.readdirSync(dir);
files.forEach(file => {
  const p = path.join(dir, file);
  let content = fs.readFileSync(p, 'utf8');
  // replace the catch blocks
  const targetCatchPattern = /catch\s*\((.*?)\)\s*\{([\s\S]*?res\.status\(500\)\.json\([\s\S]*?)\}/g;
  content = content.replace(targetCatchPattern, (match, errVar, inner) => {
    return `catch (${errVar}) {
    console.error("API Error:", ${errVar});
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: ${errVar}.message
    });
  }`;
  });
  fs.writeFileSync(p, content);
});
console.log('Done refactoring controllers.');
