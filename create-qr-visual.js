import QRCode from 'qrcode';
import fs from 'fs';

async function createQRCodeImage() {
  const url = 'https://b6e2195d-9d45-47f1-97d6-70f86c4eff86-00-12k1zs8jp9eml.riker.replit.dev';
  
  // Create a large, high-quality QR code
  const options = {
    type: 'png',
    quality: 0.92,
    margin: 2,
    color: {
      dark: '#000000',
      light: '#FFFFFF'
    },
    width: 512,
    errorCorrectionLevel: 'M'
  };

  try {
    // Generate PNG buffer
    const qrBuffer = await QRCode.toBuffer(url, options);
    
    // Save to file
    fs.writeFileSync('dreamspeak-qr-large.png', qrBuffer);
    
    console.log('Large QR code created: dreamspeak-qr-large.png');
    console.log('URL:', url);
    
    return qrBuffer;
  } catch (error) {
    console.error('Error creating QR code:', error);
  }
}

createQRCodeImage();