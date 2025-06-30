import QRCode from 'qrcode';

const deployedUrl = `https://${process.env.REPL_ID || 'b6e2195d-9d45-47f1-97d6-70f86c4eff86'}.replit.app`;

async function checkDeployment() {
  try {
    const response = await fetch(deployedUrl);
    if (response.ok) {
      console.log('🎉 DEPLOYMENT IS READY!');
      console.log('✅ URL is live:', deployedUrl);
      
      // Generate the working QR code
      await new Promise((resolve, reject) => {
        QRCode.toFile('live-qr-code.png', deployedUrl, {
          width: 400,
          margin: 2,
          color: { dark: '#000000', light: '#FFFFFF' },
          errorCorrectionLevel: 'M'
        }, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
      
      console.log('📱 Working QR code saved as: live-qr-code.png');
      console.log('Ready to share!');
      return true;
    } else {
      console.log(`Still deploying... (Status: ${response.status})`);
      return false;
    }
  } catch (error) {
    console.log('Deployment not accessible yet...');
    return false;
  }
}

checkDeployment();