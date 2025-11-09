#!/usr/bin/env node

const os = require('os');
const { execSync } = require('child_process');

console.log('\n🌐 SignEX Network Information\n');

// Function to get all network interfaces
function getNetworkInfo() {
  const interfaces = os.networkInterfaces();
  const results = [];
  
  for (const name of Object.keys(interfaces)) {
    for (const interface of interfaces[name]) {
      if (interface.family === 'IPv4' && !interface.internal) {
        results.push({
          name: name,
          ip: interface.address,
          netmask: interface.netmask,
          mac: interface.mac
        });
      }
    }
  }
  
  return results;
}

// Get network information
const networkInfo = getNetworkInfo();

if (networkInfo.length === 0) {
  console.log('❌ No network connections found');
  console.log('   Make sure you are connected to WiFi or Ethernet');
  process.exit(1);
}

console.log('📡 Available Network Connections:');
console.log('================================');

networkInfo.forEach((info, index) => {
  console.log(`\n${index + 1}. ${info.name}`);
  console.log(`   IP Address: ${info.ip}`);
  console.log(`   Subnet:     ${info.netmask}`);
  console.log(`   MAC:        ${info.mac}`);
  
  // Show access URL
  console.log(`   Access URL: http://${info.ip}:3000`);
});

// Try to detect the primary interface
const primaryInterface = networkInfo.find(info => 
  info.ip.startsWith('192.168.') || 
  info.ip.startsWith('10.') || 
  info.ip.startsWith('172.')
);

if (primaryInterface) {
  console.log('\n🎯 Primary Network (Recommended):');
  console.log(`   IP: ${primaryInterface.ip}`);
  console.log(`   URL: http://${primaryInterface.ip}:3000`);
}

// Show QR code option
console.log('\n📱 For Mobile Access:');
console.log('   1. Connect your phone/tablet to the same WiFi');
console.log('   2. Scan QR code or manually enter the URL above');
console.log('   3. Make sure to use the same network!');

// Platform-specific instructions
const platform = os.platform();
console.log('\n🔧 Quick Start:');

if (platform === 'win32') {
  console.log('   Windows: Double-click start-server.bat');
  console.log('   Or run:  npm run server');
} else if (platform === 'darwin') {
  console.log('   macOS:   npm run server');
} else {
  console.log('   Linux:   npm run server');
}

console.log('\n💡 Tips:');
console.log('   - Use the same WiFi network on all devices');
console.log('   - Allow Node.js through firewall if prompted');
console.log('   - Bookmark the URL on your mobile device');

console.log('\n' + '='.repeat(50));

// Try to generate a simple QR code using ASCII
if (primaryInterface) {
  const url = `http://${primaryInterface.ip}:3000`;
  console.log(`\n📋 Copy this URL to your mobile device:`);
  console.log(`   ${url}`);
  
  // Try to open QR code generator (optional)
  try {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;
    console.log(`\n🔗 QR Code Generator:`);
    console.log(`   ${qrUrl}`);
  } catch (error) {
    // Ignore QR code generation errors
  }
}
