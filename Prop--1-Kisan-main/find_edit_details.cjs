const fs = require('fs');
const content = fs.readFileSync('App.tsx', 'utf8');
const lines = content.split('\n');

const term = 'Edit Details';
lines.forEach((line, index) => {
    if (line.includes(term)) {
        console.log(`Match at line ${index + 1}:`);
        for (let i = Math.max(0, index - 5); i <= Math.min(lines.length - 1, index + 20); i++) {
            console.log(`${i + 1}: ${lines[i]}`);
        }
        console.log('---');
    }
});
