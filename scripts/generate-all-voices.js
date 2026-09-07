const fs = require('fs');
const path = require('path');
const https = require('https');

const API_KEY = process.env.CARTESIA_API_KEY || 'sk_car_aBHryhYoSFddao7c2VbCvc';
const VOICE_ID = 'e9e30a44-cd20-4127-807a-1843bddb75d9'; // Your custom cloned voice
const MODEL_ID = 'sonic-3.6';
const CARTESIA_VERSION = '2024-06-10';

const outputDir = path.join(__dirname, '..', 'public', 'audio', 'voices');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

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
          console.log(`✓ Saved: ${path.basename(outputFile)} (${sizeKb} KB)`);
          resolve();
        });
      } else {
        let err = '';
        res.on('data', chunk => err += chunk);
        res.on('end', () => {
          console.error(`Failed ${outputFile}: HTTP ${res.statusCode} - ${err}`);
          reject(new Error(err));
        });
      }
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

// Fun Telugu + English blend capturing the exact meaning & spirit of the RPG card content
const teachersData = [
  {
    id: 'teacher-01',
    detectText: 'Target locked! Mana Yallisha Rani Mam! Java and Web Technologies architect detected!',
    profileText: 'Yallisha Rani Mam! Charm and strictness ki perfect definition boss! Training lo NCC cadet, ambition lo PhD scholar, profession lo mana super teacher! Class loki enter ayyi, "Ardam ayyinda?" ani adagagane, class antha unified ga "Yes Madam!" ani aravatam mandatory routine ikkada! Inka notes and assignments gurinchi aithe cheppanavasaram ledu... oka notebook tho batch pass avvatam impossible, stacks of books nimpeyyalsinde!'
  },
  {
    id: 'teacher-02',
    detectText: 'Target confirmed! Rama Sri Mam! Cybersecurity Grand Cipher Scholar detected!',
    profileText: 'Rama Sri Mam! Prathee topic modalupette mundu, "This is very important" ani cheppadam mam trademark style boss! Unlimited patience tho, computer science lo PhD chesthu, andaritho chala cool ga untaru. Kani board meeda mam handwriting chusthe matram... wow! Antha neat and perfect handwriting chusi students kooda low-key jealous feel aipotharu!'
  },
  {
    id: 'teacher-03',
    detectText: 'Frequency tuned! Sravani Mam! Information and Communication Technology detected!',
    profileText: 'Sravani Mam! Communication Technology ki walking encyclopedia boss! Evaru velli doubts adigina, full patient ga guide chesthu, super suggestions istharu. And mam special trait enti thelusa? Venaka bench lo evaru vintunnaru, evaru daydreaming chestunnaru ani worry avvaru... shradhdhaga vinna vaallaki matram full wisdom packet transfer aipothundi!'
  },
  {
    id: 'teacher-04',
    detectText: 'Signal locked! Ratna Kumari Mam! Cybersecurity and Web Tech mentor detected!',
    profileText: 'Ratna Kumari Mam! Amazing knowledge, beautiful handwriting, and crystal-clear teaching style boss! Complex topics ni kooda chala simple ga explain chestharu... malli manalni test cheyadaniki oka chinna twist question vesi confuse chesi navvutharu! Strict when needed, fun when least expected, eppudu face meeda bright supportive smile tho full youthful energy tho untaru!'
  },
  {
    id: 'teacher-05',
    detectText: 'Alert! Pin-drop silence zone! Aparna Mam detected!',
    profileText: 'Aparna Mam! Mam class loki entry ivvagane, godava antha magic la vanish aipoyi pin-drop silence aipovalsinde! Complex Data Structures ni super simple ga nerpistharu, kani running notes rasukovalante jet speed undali boss! Internals lo strict correction endukante university exams lo manam top cheyalani. Evadu matladuthunnado mam ki automatically thelisipothundi. And main rule: eppudu pen ready ga pettukondi, surprise test eppudu drop avvuddo evariki theleedhu!'
  },
  {
    id: 'teacher-06',
    detectText: 'Teacher detected! Sunitha Mam! Digital Logic Design and Computer Organisation!',
    profileText: 'Sunitha Mam! The teacher who says "It is easy" right before giving us the hardest question! Turns five-minute explanations into full lectures, picks the most interesting topics, and has unlimited patience. Gives extra appreciation to good handwriting, a small tip for students: "if your handwriting is good you have full marks", has great saree taste, and is always supportive of students! Always observing everything silently, until suddenly comes the lecture! And of course, her professors stories are always part of the class! She regrets that she passed her college days sadly instead of lot of enjoyment, moments, trips therefore sees herself in students who are active and playful, of course tolerates some indiscipline but acts strict when it is time.'
  },
  {
    id: 'teacher-07',
    detectText: 'Teacher detected! Uma Pavani Mam! Python core architect detected!',
    profileText: 'Uma Pavani Mam! Python specialist boss! Very strict, maybe that is what comes with great knowledge! Always pushes students to maintain high standards, and has one golden rule: Attendance matters!'
  },
  {
    id: 'teacher-08',
    detectText: "Target confirmed! Uma Ma'am! Computer Science H O D and Big Madam detected!",
    profileText: "Uma Ma'am! Known for her leadership and, of course, Big Madam status! Always fighting to bring interviews and opportunities to this tier-three college, so that students can reach better positions. Ma'am has unlimited patience, always encourages students to reach their goals, and is ever ready with guidance. And when it comes to teaching, she has her own unique style: conceptual clarity, comprehensive explanation, and clarity until the concept is completely clear! But when it comes to practicals, Ma'am becomes strict mode ON!"
  },
  {
    id: 'teacher-09',
    detectText: "Target confirmed! Krupa Ma'am! Legendary Mathematics H O D detected!",
    profileText: "Krupa Ma'am! Maths H O D Ma'am, the most experienced Maths faculty in our college! Very strong, very cheerful, and surprisingly close with students, even from other departments! She has a soft corner for students, always making sure concepts are easier to learn. Always busy with teaching, giving pin-to-pin explanation for every single step, and strictly sticking to the basics. And one of the most important things: Ma'am knows exactly who is talking in the class, no matter which corner they are hiding in! And when it comes to practicals, she is one of the best faculty! And one of the cutest things about Ma'am is how much she loves her daughter. Sometimes, during leisure time in class, Ma'am even does her daughter's homework, that itself shows how much love she has for her! And Ma'am even plays alphabet games with us in classroom, which makes us feel like she is simply continuing her habit of playing with her daughter! She always aims to see her daughter in a great position, and just like that, she wants all of us to reach great positions too."
  },
  {
    id: 'teacher-10',
    detectText: "Target confirmed! Sunitha Ma'am! Chemistry and Most Experienced Faculty Award detected!",
    profileText: "Sunitha Ma'am! Chemistry Ma'am, the most experienced Chemistry faculty in our college! Very kind hearted, simple in nature, and extremely generous. Her way of teaching makes even difficult concepts feel easy to understand. She is especially known for her calm and peaceful personality. Ma'am taught our C S department only in the first semester, but even after that, C S will always remember her and her wonderful personality! Last time, she received the Most Experienced Faculty Award in the college, and honestly, Ma'am probably knows almost every story that happened in this college! But even after knowing all those stories, she never has that aggressive intent: always calm, always kind!"
  }
];

async function main() {
  console.log('Generating voice audio files strictly synced with data/teachers.ts (192kbps, Telugu+English conversational tone)...\n');

  // For each teacher in teachersData: generate synchronized detect and profile audio
  for (const t of teachersData) {
    const detectFile = path.join(outputDir, `detect-${t.id}.mp3`);
    console.log(`Generating detect for ${t.id}...`);
    await synthesizeSpeech(t.detectText, detectFile, 1.0);
    await new Promise(r => setTimeout(r, 300));

    const profileFile = path.join(outputDir, `profile-${t.id}.mp3`);
    console.log(`Generating profile for ${t.id}...`);
    await synthesizeSpeech(t.profileText, profileFile, 1.0);
    await new Promise(r => setTimeout(r, 300));
  }

  console.log('\nAll synced voice audio files generated successfully!');
}

main().catch(err => {
  console.error('Generation failed:', err);
  process.exit(1);
});
