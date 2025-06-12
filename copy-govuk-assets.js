const fs = require('fs');
const path = require('path');

// Create directories if they don't exist
const assetsDir = path.join(__dirname, 'public/assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

const fontsDir = path.join(__dirname, 'public/assets/fonts');
if (!fs.existsSync(fontsDir)) {
  fs.mkdirSync(fontsDir, { recursive: true });
}

// Copy GOV.UK Frontend JavaScript
const sourceJs = path.join(__dirname, 'node_modules/govuk-frontend/dist/govuk/govuk-frontend.min.js');
const destJs = path.join(__dirname, 'public/assets/govuk-frontend.js');

fs.copyFile(sourceJs, destJs, (err) => {
  if (err) {
    console.error('Error copying JavaScript file:', err);
  } else {
    console.log('GOV.UK Frontend JavaScript copied successfully');
  }
});

// Copy GOV.UK Frontend fonts
const sourceFonts = path.join(__dirname, 'node_modules/govuk-frontend/dist/govuk/assets/fonts');
const destFonts = path.join(__dirname, 'public/assets/fonts');

fs.readdir(sourceFonts, (err, files) => {
  if (err) {
    console.error('Error reading fonts directory:', err);
    return;
  }
  
  files.forEach(file => {
    const sourceFile = path.join(sourceFonts, file);
    const destFile = path.join(destFonts, file);
    
    fs.copyFile(sourceFile, destFile, (err) => {
      if (err) {
        console.error(`Error copying font file ${file}:`, err);
      } else {
        console.log(`Font file ${file} copied successfully`);
      }
    });
  });
});