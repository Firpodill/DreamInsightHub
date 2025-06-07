import QRCode from 'qrcode';

// Get the current Replit environment details
const replId = process.env.REPL_ID || 'workspace';
const replOwner = process.env.REPL_OWNER || 'user';

// Construct the Replit preview URL
const appUrl = `https://${replId}.replit.app`;

console.log('Dream Analysis App - Mobile Access');
console.log('==================================');
console.log();

// Generate ASCII QR code with better visibility
QRCode.toString(appUrl, {
  type: 'terminal',
  small: true,
  errorCorrectionLevel: 'M'
}, function (err, qrString) {
  if (err) {
    console.log('QR Code generation failed, but you can access the app at:');
    console.log(appUrl);
  } else {
    console.log('Scan this QR code with your phone camera:');
    console.log();
    // Replace spaces with visible characters for better terminal display
    const visibleQR = qrString.replace(/ /g, '░').replace(/█/g, '▓');
    console.log(visibleQR);
    console.log();
  }
  
  console.log(`Direct URL: ${appUrl}`);
  console.log();
  console.log('Instructions:');
  console.log('1. Open your phone camera app');
  console.log('2. Point it at the QR code above');
  console.log('3. Tap the notification to open in browser');
  console.log('4. Start exploring your dreams on mobile!');
  console.log();
  console.log('Mobile Features to Test:');
  console.log('• Voice dream recording');
  console.log('• Touch-based vision board creation');  
  console.log('• Photo upload from camera roll');
  console.log('• Audio playback of interpretations');
  console.log('• Export and share functionality');
});