import QRCode from 'qrcode';
import fs from 'fs';

// Try different URL formats for Replit
const replId = process.env.REPL_ID || 'b6e2195d-9d45-47f1-97d6-70f86c4eff86';
const replOwner = process.env.REPL_OWNER || 'francescaletter';
const replSlug = process.env.REPL_SLUG || 'workspace';

// Use the most reliable Replit URL format
const appUrl = `https://${replId}-5000.${replOwner}.replit.app`;

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