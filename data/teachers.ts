import { Teacher } from '@/types/teacher';

// Exact OpenStreetMap Geocoded Coordinates for:
// PRISM Degree and PG College, Gurudwara Junction - Dwarakanagar Road, Seetamma Peta, Dwaraka Nagar, Visakhapatnam 530016
// OSM Way ID: 133959014 (lat: 17.7304354, lon: 83.3084191)
export const TARGET_LOCATION = {
  lat: 17.730435,
  lng: 83.308419,
  name: 'PRISM Degree & PG College',
  address: '50-57-1/1, Rajendra Nagar, Seetamma Peta, Dwaraka Nagar, Visakhapatnam, Andhra Pradesh 530016',
};

export const VIZAG_CENTER = { lat: TARGET_LOCATION.lat, lng: TARGET_LOCATION.lng };
export const INDIA_CENTER = { lat: 22.9734, lng: 78.6569 };

// Specific real positions around the PRISM Degree College campus building and adjacent street points
// All 10 teacher logos positioned strictly inside the PRISM Degree & PG College building block
const CAMPUS_POINTS = [
  { lat: 17.730435, lng: 83.308419 }, // PRISM College Block - Center Main Hall
  { lat: 17.730495, lng: 83.308420 }, // PRISM College Block - North Entrance Wing
  { lat: 17.730375, lng: 83.308418 }, // PRISM College Block - South Academic Wing
  { lat: 17.730435, lng: 83.308480 }, // PRISM College Block - East Lab Wing
  { lat: 17.730435, lng: 83.308355 }, // PRISM College Block - West Seminar Hall
  { lat: 17.730480, lng: 83.308465 }, // PRISM College Block - North-East PG Section
  { lat: 17.730385, lng: 83.308370 }, // PRISM College Block - South-West Tech Quad
  { lat: 17.730470, lng: 83.308380 }, // PRISM College Block - Central Courtyard
  { lat: 17.730390, lng: 83.308460 }, // PRISM College Block - Innovation Hub
  { lat: 17.730440, lng: 83.308440 }, // PRISM College Block - Executive Wing
];

export const teachers: Teacher[] = [
  {
    id: 'teacher-01',
    name: 'Yallisha Rani Mam',
    subject: 'OOP Through Java, Software Engineering, Applications of Web Designing using PHP and MySQL',
    photo: '/teachers/teacher-01.jpg',
    rank: 'LEGENDARY NCC CADET ARCHITECT',
    location: CAMPUS_POINTS[0],
    stats: { knowledge: 98, patience: 82, anger: 48, humour: 74, classControl: 96 },
    mood: 'ARDAM AYYINDA?',
    moodEmoji: '📝',
    moodDescription: 'The Madam who frequently asks "ardam ayyinda?" And our answer is "Yes Madam"...',
    specialAbility: 'PLENTY OF NOTES & ASSIGNMENTS',
    specialAbilityDesc: 'Known for giving us plenty of notes and assignments — because apparently, one notebook is never enough! 😄',
    description:
      'Well known for her charm and strictness. NCC cadet by training, PhD scholar by ambition, and teacher by profession. The Madam who frequently asks "ardam ayyinda?" And our answer is "Yes Madam"... and this mam also known for giving us plenty of notes and assignments — because apparently, one notebook is never enough! 😄',
  },
  {
    id: 'teacher-02',
    name: 'Rama Sri Mam',
    subject: 'Cybersecurity',
    photo: '/teachers/teacher-02.jpg',
    rank: 'GRAND CIPHER SCHOLAR',
    location: CAMPUS_POINTS[1],
    stats: { knowledge: 96, patience: 98, anger: 18, humour: 72, classControl: 91 },
    mood: 'THIS IS VERY IMPORTANT',
    moodEmoji: '✍️',
    moodDescription: 'The teacher who says "This is very important" before every topic.',
    specialAbility: 'MOST BEAUTIFUL HANDWRITING',
    specialAbilityDesc: 'Has the most beautiful handwriting — so neat and perfect, even some students feel a little jealous!',
    description:
      'The teacher who says "This is very important" before every topic. The teacher with unlimited patience… mostly and besides maybe that\'s the reason doing a PhD in computer science. She also has the most beautiful handwriting — so neat and perfect, even some students feel a little jealous!',
  },
  {
    id: 'teacher-03',
    name: 'Sravani Mam',
    subject: 'Information and Communication Technology',
    photo: '/teachers/teacher-03.jpg',
    rank: 'ENCYCLOPEDIA OF SIGNALS',
    location: CAMPUS_POINTS[2],
    stats: { knowledge: 97, patience: 94, anger: 15, humour: 78, classControl: 89 },
    mood: 'FULL WISDOM',
    moodEmoji: '📡',
    moodDescription: 'Makes sure that whoever is listening gets the full wisdom!',
    specialAbility: 'ENCYCLOPEDIA GUIDANCE',
    specialAbilityDesc: 'Always ready to guide anyone who approaches her, help with suggestions, and share something interesting.',
    description:
      'A true encyclopedia of Communication Technology! 📚✨ She’s always ready to guide anyone who approaches her, help with suggestions, and share something interesting. And her special trait? She doesn’t worry about who’s listening — she simply makes sure that whoever is listening gets the full wisdom.',
  },
  {
    id: 'teacher-04',
    name: 'Ratna Kumari Mam',
    subject: 'Cybersecurity, Web Technologies',
    photo: '/teachers/teacher-04.jpg',
    rank: 'KINETIC MATRIX MENTOR',
    location: CAMPUS_POINTS[3],
    stats: { knowledge: 97, patience: 88, anger: 35, humour: 85, classControl: 93 },
    mood: 'ALWAYS SMILING',
    moodEmoji: '✨',
    moodDescription: 'Strict when needed, fun when least expected, always smiling, supportive, active, and full of youthful energy.',
    specialAbility: 'CRYSTAL-CLEAR TEACHING',
    specialAbilityDesc: 'Can turn the most complex topics into simple ones… and sometimes, just for a little extra challenge, make even the simplest topics feel complex!',
    description:
      'Known for her amazing knowledge, beautiful handwriting, and crystal-clear teaching style! ✨ She can turn the most complex topics into simple ones… and sometimes, just for a little extra challenge, make even the simplest topics feel complex! Strict when needed, fun when least expected, always smiling, supportive, active, and full of youthful energy.',
  },
  {
    id: 'teacher-05',
    name: 'Aparna Mam',
    subject: 'Data Structures, Data Communication and Computer Networks',
    photo: '/teachers/teacher-05.jpg',
    rank: 'THE SILENT PROTOCOL COMMANDER',
    location: CAMPUS_POINTS[4],
    stats: { knowledge: 99, patience: 76, anger: 58, humour: 65, classControl: 100 },
    mood: 'NOISE MAGICALLY DISAPPEARS',
    moodEmoji: '🤫',
    moodDescription: 'The teacher who enters the class and the noise magically disappears.',
    specialAbility: 'SURPRISE CLASS TEST',
    specialAbilityDesc: 'One golden rule: always be ready… because a surprise class test can appear anytime! 😭📚',
    description:
      'The teacher who enters the class and the noise magically disappears. The teacher who can turn high-standard Computer Science concepts into surprisingly simple ones! 💻✨ She teaches so much that sometimes there’s barely time to write running notes — because apparently, learning comes first! 😂 Strict evaluation in exams? Absolutely! Because she wants us to score better in the final exams. No unnecessary discussions, no escape routes — and somehow, she always knows exactly who was talking! 👀😂 She may look strict and sound strict, but deep down, she genuinely wants us to do well. ❤️ And one golden rule: always be ready… because a surprise class test can appear anytime! 😭📚',
  },
  {
    id: 'teacher-06',
    name: 'Sunitha Mam',
    subject: 'Digital Logic Design, Computer Organisation, Fundamentals of Data Science',
    photo: '/teachers/teacher-06.jpg',
    rank: 'LOGIC GATE SENTINEL',
    location: CAMPUS_POINTS[5],
    stats: { knowledge: 98, patience: 97, anger: 28, humour: 86, classControl: 91 },
    mood: 'IT’S EASY',
    moodEmoji: '💡',
    moodDescription: 'The teacher who says "It’s easy" right before giving us the hardest question! 😂📚',
    specialAbility: 'HANDWRITING FULL MARKS',
    specialAbilityDesc: 'Gives extra appreciation to good handwriting, a small tip for students: "if your handwriting is good you have full marks".',
    description:
      'The teacher who says "It’s easy" right before giving us the hardest question! 😂📚 Turns five-minute explanations into full lectures, picks the most interesting topics, and has unlimited patience. ✨ Gives extra appreciation to good handwriting, a small tip for students: "if your handwriting is good you have full marks", has great saree taste, and is always supportive of students! 😄 Always observing everything silently… until suddenly comes the lecture! 👀😂 And of course, her professors’ stories are always part of the class! She regrets that she passed her college days sadly instead of lot of enjoyment, moments, trips therefore sees herself in students who are active and playful, of course tolerates some indiscipline but acts strict when it\'s time.',
  },
  {
    id: 'teacher-07',
    name: 'Uma Pavani Mam',
    subject: 'Python',
    photo: '/teachers/teacher-07.jpg',
    rank: 'PYTHON CORE ARCHITECT',
    location: CAMPUS_POINTS[6],
    stats: { knowledge: 98, patience: 78, anger: 62, humour: 68, classControl: 98 },
    mood: 'ATTENDANCE MATTERS',
    moodEmoji: '🐍',
    moodDescription: 'Has one golden rule: Attendance matters!',
    specialAbility: 'HIGH STANDARD DIRECTIVE',
    specialAbilityDesc: 'Very strict — maybe that’s what comes with great knowledge! Always pushes students to maintain high standards.',
    description:
      'Very strict — maybe that’s what comes with great knowledge! Always pushes students to maintain high standards, and has one golden rule Attendance matters.',
  },
  {
    id: 'teacher-08',
    name: 'Uma Mam',
    subject: 'Python, AI, Database Management System, Computer Science HOD',
    photo: '/teachers/teacher-08.jpg',
    rank: 'BIG MADAM // CS HOD',
    location: CAMPUS_POINTS[7],
    stats: { knowledge: 100, patience: 99, anger: 35, humour: 88, classControl: 100 },
    mood: 'BIG MADAM STATUS',
    moodEmoji: '👑',
    moodDescription: 'Known for her leadership and, of course, Big Madam status! 😄',
    specialAbility: 'PRACTICALS STRICT MODE',
    specialAbilityDesc: 'Always fighting to bring interviews and opportunities to this tier-three college. But when it comes to practicals, Ma’am becomes strict mode ON! 😂',
    description:
      'Known for her leadership and, of course, Big Madam status! 😄 Always fighting to bring interviews and opportunities to this tier-three college, so that students can reach better positions. Ma’am has unlimited patience, always encourages students to reach their goals, and is ever ready with guidance. And when it comes to teaching, she has her own unique style — conceptual clarity, comprehensive explanation, and clarity until the concept is completely clear! 😄 But when it comes to practicals, Ma’am becomes strict mode ON! 😂',
  },
  {
    id: 'teacher-09',
    name: 'Krupa Mam',
    subject: 'Mathematics, Mathematics HOD',
    photo: '/teachers/teacher-09.jpg',
    rank: 'LEGENDARY MATHS HOD',
    location: CAMPUS_POINTS[8],
    stats: { knowledge: 100, patience: 99, anger: 25, humour: 92, classControl: 98 },
    mood: 'CHEERFUL & PIN-TO-PIN',
    moodEmoji: '📐',
    moodDescription: 'Very strong, very cheerful, and surprisingly close with students! 😄',
    specialAbility: 'PIN-TO-PIN EXPLANATION',
    specialAbilityDesc: 'Pin-to-pin explanation for every single step, and strictly sticking to the basics. Plus, she knows exactly who is talking in class no matter which corner they are hiding in! 😂',
    description:
      'Maths HOD Ma’am — the most experienced Maths faculty in our college. Very strong, very cheerful, and surprisingly close with students — even from other departments! 😄 She has a soft corner for students, always making sure concepts are easier to learn. Always busy with teaching, giving pin-to-pin explanation for every single step, and strictly sticking to the basics. And one of the most important things — Ma’am knows exactly who is talking in the class, no matter which corner they are hiding in! 😂 And when it comes to practicals, she’s one of the best faculty! 😄 And one of the cutest things about Ma’am is how much she loves her daughter. Sometimes, during leisure time in class, Ma’am even does her daughter’s homework — that itself shows how much love she has for her! ❤️ And Ma’am even plays alphabet games with us in classroom, which makes us feel like she’s simply continuing her habit of playing with her daughter! 😄 She always aims to see her daughter in a great position, and just like that,she want all of us to reach great positions too.',
  },
  {
    id: 'teacher-10',
    name: 'Sunitha Mam',
    subject: 'Chemistry, Most Experienced Faculty',
    photo: '/teachers/teacher-10.jpg',
    rank: 'MOST EXPERIENCED FACULTY AWARD // CHEMISTRY',
    location: CAMPUS_POINTS[9],
    stats: { knowledge: 100, patience: 100, anger: 10, humour: 88, classControl: 95 },
    mood: 'CALM & PEACEFUL',
    moodEmoji: '🕊️',
    moodDescription: 'Especially known for her calm, peaceful personality and kind-hearted nature. ❤️',
    specialAbility: 'TIMELESS WISDOM & GENEROSITY',
    specialAbilityDesc: 'Makes even difficult concepts feel easy to understand. Knows almost every story that happened in this college — but always calm, always kind! ❤️',
    description:
      'Chemistry Ma’am — the most experienced Chemistry faculty in our college. Very kind-hearted, simple in nature, and extremely generous. Her way of teaching makes even difficult concepts feel easy to understand. She is especially known for her calm and peaceful personality. ❤️ Ma’am taught our CS department only in the first semester, but even after that, CS will always remember her and her wonderful personality! 😄 Last time, she received the Most Experienced Faculty Award in the college — and honestly, Ma’am probably knows almost every story that happened in this college! 😂 But even after knowing all those stories, she never has that aggressive intent — always calm, always kind! ❤️',
  },
];

