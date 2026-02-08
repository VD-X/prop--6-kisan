const fs = require('fs');
const content = fs.readFileSync('App.tsx', 'utf8');
const lines = content.split('\n');

lines.forEach((line, index) => {
    if (line.includes('const FarmerDashboard =')) {
        console.log(`FarmerDashboard definition at line ${index + 1}: ${line.trim()}`);
    }
});
