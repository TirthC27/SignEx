#!/usr/bin/env node

const { spawn } = require('child_process');
const os = require('os');

console.log('🧪 Testing SignEX Server Startup...\n');

// Get local IP
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const interface of interfaces[name]) {
      if (interface.family === 'IPv4' && !interface.internal) {
        return interface.address;
      }
    }
  }
  return 'localhost';
}

const localIP = getLocalIP();
const port = 3000;

console.log('📡 Network Information:');
console.log(`   Local IP: ${localIP}`);
console.log(`   Port: ${port}`);
console.log(`   URL: http://${localIP}:${port}`);
console.log('');

// Test if port is available
const net = require('net');
const server = net.createServer();

server.listen(port, '0.0.0.0', () => {
  console.log('✅ Port 3000 is available');
  server.close();
  
  // Start the actual Next.js server
  console.log('🚀 Starting Next.js development server...\n');
  
  const nextProcess = spawn('npm', ['run', 'dev:network'], {
    stdio: 'inherit',
    shell: true
  });
  
  nextProcess.on('error', (error) => {
    console.error('❌ Failed to start server:', error.message);
    console.log('\n🔧 Try these solutions:');
    console.log('   1. Run: npm install');
    console.log('   2. Check if Node.js is installed: node --version');
    console.log('   3. Try: npm run dev (local only)');
    process.exit(1);
  });
  
  nextProcess.on('close', (code) => {
    console.log(`\n📊 Server stopped with code: ${code}`);
  });
  
  // Handle Ctrl+C
  process.on('SIGINT', () => {
    console.log('\n🛑 Stopping server...');
    nextProcess.kill('SIGINT');
    process.exit(0);
  });
  
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log('❌ Port 3000 is already in use');
    console.log('🔧 Solutions:');
    console.log('   1. Kill the process using port 3000');
    console.log('   2. Use a different port: npm run dev:network -- -p 3001');
    console.log('   3. Find what\'s using the port: netstat -ano | findstr :3000');
  } else {
    console.error('❌ Server error:', err.message);
  }
  process.exit(1);
});
