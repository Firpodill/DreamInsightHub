import QRCode from 'qrcode';
import fs from 'fs';

// This will be the deployed URL format
const deployedUrl = `https://${process.env.REPL_ID || 'b6e2195d-9d45-47f1-97d6-70f86c4eff86'}.replit.app`;

console.log('Creating deployment-ready QR code for:', deployedUrl);

// Generate high-quality QR code for deployment
QRCode.toFile('final-qr-code.png', deployedUrl, {
  width: 500,
  margin: 3,
  color: {
    dark: '#000000',
    light: '#FFFFFF'
  },
  errorCorrectionLevel: 'M'
}, function (err) {
  if (err) {
    console.error('Error generating deployment QR code:', err);
  } else {
    console.log('✓ Final QR code saved as: final-qr-code.png');
    console.log('✓ Deployment URL:', deployedUrl);
    console.log('✓ This QR code will work once deployment completes');
  }
});

// Also create SVG version for scalability
QRCode.toString(deployedUrl, {
  type: 'svg',
  width: 500,
  margin: 3,
  color: {
    dark: '#000000',
    light: '#FFFFFF'
  },
  errorCorrectionLevel: 'M'
}, function (err, svg) {
  if (err) {
    console.error('Error generating SVG:', err);
  } else {
    fs.writeFileSync('final-qr-code.svg', svg);
    console.log('✓ SVG version saved as: final-qr-code.svg');
  }
});