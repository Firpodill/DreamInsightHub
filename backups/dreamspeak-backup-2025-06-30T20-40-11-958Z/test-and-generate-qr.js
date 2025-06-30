import QRCode from 'qrcode';
import fs from 'fs';

// Test the deployment URL
const deployedUrl = `https://${process.env.REPL_ID || 'b6e2195d-9d45-47f1-97d6-70f86c4eff86'}.replit.app`;

console.log('Testing deployment URL:', deployedUrl);

// Test if the deployment is live
fetch(deployedUrl)
  .then(response => {
    if (response.ok) {
      console.log('✅ Deployment is LIVE and working!');
      console.log('Status:', response.status);
      
      // Generate the final working QR code
      QRCode.toFile('working-qr-code.png', deployedUrl, {
        width: 400,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        errorCorrectionLevel: 'M'
      }, function (err) {
        if (err) {
          console.error('Error generating QR code:', err);
        } else {
          console.log('🎉 WORKING QR code saved as: working-qr-code.png');
          console.log('📱 Ready to share:', deployedUrl);
          console.log('');
          console.log('You can now:');
          console.log('• Screenshot the QR code and share it');
          console.log('• Send the URL directly');
          console.log('• Test on your mobile device');
        }
      });
    } else {
      console.log('❌ Deployment not ready yet');
      console.log('Status:', response.status);
      console.log('Try running this script again in a few minutes');
    }
  })
  .catch(error => {
    console.log('❌ Deployment not accessible yet');
    console.log('This is normal - try again in 2-3 minutes');
    console.log('Error:', error.message);
  });