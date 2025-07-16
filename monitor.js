const { spawn } = require('child_process');
const path = require('path');

console.log('🔍 Starting WhatsApp Numbers API Monitor...');

function startServer() {
  console.log('🚀 Starting server...');
  
  const server = spawn('node', ['server.js'], {
    cwd: __dirname,
    stdio: 'inherit',
    env: process.env
  });
  
  server.on('close', (code) => {
    console.log(`❌ Server exited with code ${code}`);
    console.log('⏳ Restarting server in 5 seconds...');
    
    setTimeout(() => {
      console.log('🔄 Restarting server...');
      startServer();
    }, 5000);
  });
  
  server.on('error', (error) => {
    console.error('❌ Server error:', error);
    console.log('⏳ Restarting server in 5 seconds...');
    
    setTimeout(() => {
      console.log('🔄 Restarting server...');
      startServer();
    }, 5000);
  });
  
  // Handle process termination
  process.on('SIGTERM', () => {
    console.log('📤 SIGTERM received, stopping monitor...');
    server.kill('SIGTERM');
    process.exit(0);
  });
  
  process.on('SIGINT', () => {
    console.log('📤 SIGINT received, stopping monitor...');
    server.kill('SIGINT');
    process.exit(0);
  });
}

// Start monitoring
startServer();