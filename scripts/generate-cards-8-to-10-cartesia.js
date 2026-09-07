const fs = require('fs');
const path = require('path');
const https = require('https');

const API_KEY = process.env.CARTESIA_API_KEY || 'sk_car_aBHryhYoSFddao7c2VbCvc';
const VOICE_ID = 'e9e30a44-cd20-4127-807a-1843bddb75d9'; // Cloned voice
const MODEL_ID = 'sonic-3.6';
const CARTESIA_VERSION = '2024-06-10';

const outputDir = path.join(__dirname, '..', 'public', 'audio', 'voices');

const cardsData = [
  {
    id: 'teacher-08',
    detectText: 'Target confirmed! Mana Uma Mam! Computer Science HOD and Big Madam detected!',
    profileText: 'Uma Mam! Leadership and Big Madam status ki brand ambassador boss! Mana tier-three college ki maximum interviews and placements theppinchalani eppudu fight chesthoone untaru! Unlimited patience tho mana future and goals kosam super guidance istharu. Teaching lo aithe concept complete ga clear ayye varaku explain cheyyadam mam unique trademark style! Kani okka vishayam boss... practicals vachesariki matram, mam complete strict mode ON aipothundi!'
  },
  {
    id: 'teacher-09',
    detectText: 'Signal locked! Mana Krupa Mam! Legendary Mathematics HOD detected!',
    profileText: 'Krupa Mam! College lo most experienced Maths HOD boss! Full energetic, cheerful ga untu, other departments students tho kooda chala close ga untaru! Prathi step ki pin-to-pin explanation isthu, basics nunchi super easy ga explain chestharu. Kani class lo evadu edavataniki try chesina, ae corner lo dakkunna mam radar ki dorikipovalsinde! And mam special cute trait enti thelusa? Free time lo valla daughter homework chesthu, class lo maatho alphabet games aadutharu! Valla daughter ni entha high position lo chudalani anukuntaro, manalni kooda anthe great positions lo chudalani korukuntaru!'
  },
  {
    id: 'teacher-10',
    detectText: 'Beacon locked! Mana Sunitha Mam! Chemistry Most Experienced Faculty Award winner detected!',
    profileText: 'Sunitha Mam! Chemistry department lo college lone most experienced faculty boss! Chala kind-hearted, simple, and eppudu peaceful personality tho untaru. Entha tough concept aina chala easy ga ardamayyela cheptharu. Mana CS department ki first semester lone cheppina, CS batch mam ni eppatiki marchipoledu! College lo jarigina prathi single story mam ki thelusu, and Most Experienced Faculty Award winner kooda! Entha thelisina kani eppudu no aggression, pure calm and kindness anthe!'
  }
];

function synthesizeSpeech(text, outputFile, speed = 1.0) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      model_id: MODEL_ID,
      transcript: text,
      voice: {
        mode: 'id',
        id: VOICE_ID
      },
      output_format: {
        container: 'mp3',
        bit_rate: 192000,
        sample_rate: 44100
      },
      language: 'te',
      generation_config: {
        speed: speed,
        volume: 1.0,
        emotion: 'conversational'
      }
    });

    const req = https.request({
      hostname: 'api.cartesia.ai',
      path: '/tts/bytes',
      method: 'POST',
      headers: {
        'X-API-Key': API_KEY,
        'Cartesia-Version': CARTESIA_VERSION,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, res => {
      if (res.statusCode === 200) {
        const fileStream = fs.createWriteStream(outputFile);
        res.pipe(fileStream);
        fileStream.on('finish', () => {
          const sizeKb = (fs.statSync(outputFile).size / 1024).toFixed(1);
          console.log(`[OK] Saved: ${path.basename(outputFile)} (${sizeKb} KB)`);
          resolve();
        });
      } else {
        let err = '';
        res.on('data', chunk => err += chunk);
        res.on('end', () => {
          console.error(`[Error] ${path.basename(outputFile)}: HTTP ${res.statusCode} - ${err}`);
          reject(new Error(`HTTP ${res.statusCode}: ${err}`));
        });
      }
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function main() {
  console.log(`Using Cartesia Voice ID: ${VOICE_ID}`);
  console.log('Generating fun Telugu + English voiceovers for cards 8, 9, 10...\n');

  for (const c of cardsData) {
    const detectFile = path.join(outputDir, `detect-${c.id}.mp3`);
    console.log(`Synthesizing detect-${c.id}...`);
    await synthesizeSpeech(c.detectText, detectFile);
    await new Promise(r => setTimeout(r, 400));

    const profileFile = path.join(outputDir, `profile-${c.id}.mp3`);
    console.log(`Synthesizing profile-${c.id}...`);
    await synthesizeSpeech(c.profileText, profileFile);
    await new Promise(r => setTimeout(r, 400));
  }

  console.log('\nAll cards 8 to 10 voiceovers synthesized successfully!');
}

main().catch(err => {
  console.error('\nProcess stopped:', err.message);
  process.exit(1);
});
