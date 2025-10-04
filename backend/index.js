// Simple entry point for Render deployment
// This file will start the TypeScript application

require('dotenv').config();

// Start the TypeScript application using tsx
const { spawn } = require('child_process');

const tsx = spawn('npx', ['tsx', 'src/app.ts'], {
  stdio: 'inherit',
  cwd: __dirname
});

tsx.on('error', (error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});

tsx.on('exit', (code) => {
  console.log(`Application exited with code ${code}`);
  process.exit(code || 0);
});