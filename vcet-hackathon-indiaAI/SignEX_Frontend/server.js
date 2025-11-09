#!/usr/bin/env node

const { execSync } = require('child_process');
const os = require('os');

// Function to get the local IP address
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  
  for (const name of Object.keys(interfaces)) {
    for (const interface of interfaces[name]) {
      // Skip internal and non-IPv4 addresses
      if (interface.family === 'IPv4' && !interface.internal) {
        return interface.address;
      }
    }
  }
  
  return 'localhost';
}

// Function to display server information
function displayServerInfo() {
  const localIP = getLocalIP();
  const port = process.env.PORT || 3000;
  
  console.log('\n🚀 SignEX Server Starting...\n');
  console.log('📱 Access your app from any device on the same network:');
  console.log(`   Local:    http://localhost:${port}`);
  console.log(`   Network:  http://${localIP}:${port}`);
  console.log('\n📋 Instructions for other devices:');
  console.log(`   1. Connect to the same WiFi network`);
  console.log(`   2. Open browser and go to: http://${localIP}:${port}`);
  console.log(`   3. Make sure Windows Firewall allows Node.js if prompted`);
  console.log('\n🔧 Troubleshooting:');
  console.log('   - Make sure your device is on the same network');
  console.log('   - Check firewall settings if connection fails');
  console.log('   - Try disabling antivirus temporarily if needed');
  console.log('\n💡 Press Ctrl+C to stop the server\n');
  console.log('=' * 60);
}

// Check if running in development or production
const isDev = process.argv.includes('--dev') || process.argv.includes('-d');
const command = isDev ? 'npm run dev:network' : 'npm run start:network';

try {
  displayServerInfo();
  
  // Start the server
  execSync(command, {
    stdio: 'inherit',
    cwd: process.cwd()
  });
} catch (error) {
  console.error('\n❌ Failed to start server:', error.message);
  console.log('\n🔧 Try running one of these commands instead:');
  console.log('   npm run server        (development mode)');
  console.log('   npm run dev:network    (development mode)');
  console.log('   npm run start:network  (production mode)');
  process.exit(1);
}
