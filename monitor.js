const { spawn } = require('child_process');
const path = require('path');

function startServer() {
  console.log('🚀 Starting server with monitoring...');
  
  const server = spawn('node', ['server.js'], {
    cwd: __dirname,
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'development' }
  });
  
  server.on('close', (code) => {
    console.log(`\n❌ Server exited with code ${code}`);
    
    if (code === 0) {
      console.log('✅ Server shut down gracefully');
      return;
    }
    
    console.log('⏳ Restarting server in 5 seconds...');
    setTimeout(() => {
      startServer();
    }, 5000);
  });
  
  server.on('error', (error) => {
    console.error('❌ Server spawn error:', error);
    console.log('⏳ Retrying in 5 seconds...');
    setTimeout(() => {
      startServer();
    }, 5000);
  });
  
  // Handle process termination
  process.on('SIGINT', () => {
    console.log('\n📤 Received SIGINT, shutting down server...');
    server.kill('SIGINT');
  });
  
  process.on('SIGTERM', () => {
    console.log('\n📤 Received SIGTERM, shutting down server...');
    server.kill('SIGTERM');
  });
}

// Start monitoring
console.log('🔍 Backend Server Monitor');
console.log('========================');
console.log('Press Ctrl+C to stop monitoring');
console.log('');

startServer();