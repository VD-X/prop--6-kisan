const fs = require('fs');
const content = fs.readFileSync('App.tsx', 'utf8');
const lines = content.split('\n');

const searchTerms = ['My Crop Supply', 'Edit Details', 'onDeleteListing', 'Trash2', 'PauseCircle'];

searchTerms.forEach(term => {
    console.log(`Checking for "${term}":`);
    lines.forEach((line, index) => {
        if (line.includes(term)) {
            console.log(`  Line ${index + 1}: ${line.trim()}`);
        }
    });
});
