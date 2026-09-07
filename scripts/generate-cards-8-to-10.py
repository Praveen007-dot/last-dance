import asyncio
import os
import edge_tts

voice = 'en-IN-NeerjaNeural'
output_dir = os.path.join(os.path.dirname(__file__), '..', 'public', 'audio', 'voices')

items = [
    {
        'file': 'detect-teacher-08.mp3',
        'text': "Target confirmed! Uma Ma'am! Computer Science H O D and Big Madam detected!"
    },
    {
        'file': 'profile-teacher-08.mp3',
        'text': "Uma Ma'am! Known for her leadership and, of course, Big Madam status! Always fighting to bring interviews and opportunities to this tier-three college, so that students can reach better positions. Ma'am has unlimited patience, always encourages students to reach their goals, and is ever ready with guidance. And when it comes to teaching, she has her own unique style: conceptual clarity, comprehensive explanation, and clarity until the concept is completely clear! But when it comes to practicals, Ma'am becomes strict mode ON!"
    },
    {
        'file': 'detect-teacher-09.mp3',
        'text': "Target confirmed! Krupa Ma'am! Legendary Mathematics H O D detected!"
    },
    {
        'file': 'profile-teacher-09.mp3',
        'text': "Krupa Ma'am! Maths H O D Ma'am, the most experienced Maths faculty in our college! Very strong, very cheerful, and surprisingly close with students, even from other departments! She has a soft corner for students, always making sure concepts are easier to learn. Always busy with teaching, giving pin-to-pin explanation for every single step, and strictly sticking to the basics. And one of the most important things: Ma'am knows exactly who is talking in the class, no matter which corner they are hiding in! And when it comes to practicals, she is one of the best faculty! And one of the cutest things about Ma'am is how much she loves her daughter. Sometimes, during leisure time in class, Ma'am even does her daughter's homework, that itself shows how much love she has for her! And Ma'am even plays alphabet games with us in classroom, which makes us feel like she is simply continuing her habit of playing with her daughter! She always aims to see her daughter in a great position, and just like that, she wants all of us to reach great positions too."
    },
    {
        'file': 'detect-teacher-10.mp3',
        'text': "Target confirmed! Sunitha Ma'am! Chemistry and Most Experienced Faculty Award detected!"
    },
    {
        'file': 'profile-teacher-10.mp3',
        'text': "Sunitha Ma'am! Chemistry Ma'am, the most experienced Chemistry faculty in our college! Very kind hearted, simple in nature, and extremely generous. Her way of teaching makes even difficult concepts feel easy to understand. She is especially known for her calm and peaceful personality. Ma'am taught our C S department only in the first semester, but even after that, C S will always remember her and her wonderful personality! Last time, she received the Most Experienced Faculty Award in the college, and honestly, Ma'am probably knows almost every story that happened in this college! But even after knowing all those stories, she never has that aggressive intent: always calm, always kind!"
    }
]

async def main():
    for item in items:
        out_path = os.path.join(output_dir, item['file'])
        print(f"Generating {item['file']}...")
        comm = edge_tts.Communicate(item['text'], voice, rate='+1%', pitch='+0Hz')
        await comm.save(out_path)
        size = os.path.getsize(out_path) / 1024
        print(f"[OK] Saved {item['file']} ({size:.1f} KB)")

if __name__ == '__main__':
    asyncio.run(main())
