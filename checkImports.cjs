const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const filesOut = execSync('git ls-tree -r main --name-only').toString();
const files = filesOut.split('\n').map(x => x.trim()).filter(Boolean);
let output = '';

for (const file of files) {
  if (!file.endsWith('.js')) continue;
  
  const code = fs.readFileSync(file, 'utf8');
  for (const line of code.split('\n')) {
    const m = line.match(/import\s+(?:.*?\s+from\s+)?['"](\.[^'"]+)['"]/);
    if (m) {
      let target = m[1];
      if (!target.endsWith('.js')) target += '.js';
      
      const tPath = path.posix.join(path.dirname(file), target);
      if (!files.includes(tPath)) {
        output += `Error in ${file}: imports ${tPath} which is not tracked in git\n`;
      }
    }
  }
}

fs.writeFileSync('out.txt', output, 'utf8');
