/**
 * Cartesia Voice Cloning Script
 * 
 * Usage:
 *   node scripts/clone-voice.js <path-to-audio-file> [voiceName] [language] [description]
 * 
 * Example:
 *   node scripts/clone-voice.js ./my-sample.wav "Teacher Voice" "te" "Cloned teacher voice"
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const API_KEY = process.env.CARTESIA_API_KEY || 'sk_car_gpgmt5fTKpYuy7cww1rRPD';
const CARTESIA_VERSION = '2024-06-10';

async function cloneVoice(filePath, name = 'Cloned Voice', language = 'en', description = '') {
  if (!fs.existsSync(filePath)) {
    console.error(`Error: Audio file not found at ${filePath}`);
    process.exit(1);
  }

  const boundary = '----CartesiaFormBoundary' + Math.random().toString(36).substring(2);
  const fileData = fs.readFileSync(filePath);
  const fileName = path.basename(filePath);

  const formParts = [
    `--${boundary}\r\nContent-Disposition: form-data; name="name"\r\n\r\n${name}`,
    `--${boundary}\r\nContent-Disposition: form-data; name="language"\r\n\r\n${language}`,
    `--${boundary}\r\nContent-Disposition: form-data; name="description"\r\n\r\n${description}`,
    `--${boundary}\r\nContent-Disposition: form-data; name="clip"; filename="${fileName}"\r\nContent-Type: audio/wav\r\n\r\n`
  ];

  const headerBuffers = formParts.slice(0, 3).map(p => Buffer.from(p + '\r\n'));
  const fileHeaderBuffer = Buffer.from(formParts[3]);
  const closingBuffer = Buffer.from(`\r\n--${boundary}--\r\n`);

  const payload = Buffer.concat([
    ...headerBuffers,
    fileHeaderBuffer,
    fileData,
    closingBuffer
  ]);

  console.log(`Connecting to Cartesia API to clone voice from: ${fileName}...`);

  const req = https.request({
    hostname: 'api.cartesia.ai',
    path: '/voices/clone',
    method: 'POST',
    headers: {
      'X-API-Key': API_KEY,
      'Cartesia-Version': CARTESIA_VERSION,
      'Content-Type': `multipart/form-data; boundary=${boundary}`,
      'Content-Length': payload.length
    }
  }, (res) => {
    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const voice = JSON.parse(body);
        console.log('\n Voice cloned successfully!');
        console.log(`Voice ID:    ${voice.id}`);
        console.log(`Name:        ${voice.name}`);
        console.log(`Language:    ${voice.language}`);
        console.log(`Created At:  ${voice.created_at}`);
      } else {
        console.error(`\nFailed to clone voice (HTTP ${res.statusCode}):`, body);
      }
    });
  });

  req.on('error', (err) => {
    console.error('Request error:', err);
  });

  req.write(payload);
  req.end();
}

const [,, inputPath, voiceName, lang, desc] = process.argv;
if (!inputPath) {
  console.log('Usage: node scripts/clone-voice.js <path-to-audio-file> [voiceName] [language] [description]');
  process.exit(0);
}

cloneVoice(inputPath, voiceName, lang, desc);
