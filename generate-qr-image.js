import QRCode from 'qrcode';
import fs from 'fs';

const appUrl = 'https://b6e2195d-9d45-47f1-97d6-70f86c4eff86.replit.app';

// Generate QR code as PNG image
QRCode.toFile('dream-decoder-qr.png', appUrl, {
  width: 400,
  margin: 2,
  color: {
    dark: '#000000',
    light: '#FFFFFF'
  }
}, function (err) {
  if (err) {
    console.error('Error generating QR code image:', err);
  } else {
    console.log('QR code image saved as: dream-decoder-qr.png');
    console.log('App URL:', appUrl);
  }
});

// Also generate SVG version
QRCode.toString(appUrl, {
  type: 'svg',
  width: 400,
  margin: 2,
  color: {
    dark: '#000000',
    light: '#FFFFFF'
  }
}, function (err, svg) {
  if (err) {
    console.error('Error generating SVG:', err);
  } else {
    fs.writeFileSync('dream-decoder-qr.svg', svg);
    console.log('QR code SVG saved as: dream-decoder-qr.svg');
  }
});