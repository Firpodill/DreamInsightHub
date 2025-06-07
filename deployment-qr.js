import QRCode from 'qrcode';
import fs from 'fs';

// The app will be deployed to this URL after deployment
const deployedUrl = `https://${process.env.REPL_ID || 'b6e2195d-9d45-47f1-97d6-70f86c4eff86'}.replit.app`;

console.log('Creating QR code for deployed app URL:', deployedUrl);

// Generate QR code as PNG image for deployment
QRCode.toFile('dream-decoder-deployed-qr.png', deployedUrl, {
  width: 400,
  margin: 2,
  color: {
    dark: '#000000',
    light: '#FFFFFF'
  }
}, function (err) {
  if (err) {
    console.error('Error generating deployment QR code:', err);
  } else {
    console.log('Deployment QR code saved as: dream-decoder-deployed-qr.png');
    console.log('This QR code will work after the app is deployed.');
  }
});

console.log('Generated QR code for post-deployment sharing');
console.log('URL:', deployedUrl);