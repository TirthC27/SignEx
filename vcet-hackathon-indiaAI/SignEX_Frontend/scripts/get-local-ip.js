const os = require('os');

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  
  for (const name of Object.keys(interfaces)) {
    for (const interface of interfaces[name]) {
      // Skip over non-IPv4 and internal addresses
      if (interface.family === 'IPv4' && !interface.internal) {
        return interface.address;
      }
    }
  }
  
  return 'localhost';
}

const localIP = getLocalIP();
console.log('\n🌐 Your local IP address is:', localIP);
console.log('📱 Other devices can access the app at:');
console.log(`   https://${localIP}:3000`);
console.log('\n⚠️  Remember to accept the certificate warning on each device!\n');
