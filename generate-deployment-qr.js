import qrcode from 'qrcode';
import fs from 'fs';

async function generateDeploymentQR() {
  try {
    // Get the Replit domain URL for the deployed app
    const replId = process.env.REPL_ID || 'dreamspeak-app';
    const deploymentUrl = `https://${replId}.replit.app`;
    
    console.log('Generating QR code for:', deploymentUrl);
    
    // Generate QR code as SVG
    const qrSvg = await qrcode.toString(deploymentUrl, {
      type: 'svg',
      width: 400,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    
    // Save as SVG file
    fs.writeFileSync('dreamspeak-deployment-qr.svg', qrSvg);
    
    // Generate QR code as PNG
    const qrPng = await qrcode.toBuffer(deploymentUrl, {
      type: 'png',
      width: 400,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    
    // Save as PNG file
    fs.writeFileSync('dreamspeak-deployment-qr.png', qrPng);
    
    console.log('QR codes generated successfully!');
    console.log('SVG: dreamspeak-deployment-qr.svg');
    console.log('PNG: dreamspeak-deployment-qr.png');
    console.log('URL:', deploymentUrl);
    
  } catch (error) {
    console.error('Error generating QR code:', error);
  }
}

generateDeploymentQR();