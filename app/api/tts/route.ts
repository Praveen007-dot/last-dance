import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const DEFAULT_VOICE_ID = process.env.NEXT_PUBLIC_CARTESIA_VOICE_ID || '8e95b430-ecc3-49ab-b943-8313287c1c59';
const DEFAULT_MODEL = process.env.CARTESIA_MODEL_ID || 'sonic-3.6';
const CARTESIA_API_KEY = process.env.CARTESIA_API_KEY || 'sk_car_gpgmt5fTKpYuy7cww1rRPD';
const CARTESIA_VERSION = '2024-06-10';

export async function POST(request: NextRequest) {
  try {
    const { transcript, voiceId, language = 'en', emotion = 'calm', speed = 0.96 } = await request.json();

    if (!transcript || typeof transcript !== 'string') {
      return NextResponse.json({ error: 'transcript is required' }, { status: 400 });
    }

    const targetVoiceId = voiceId || DEFAULT_VOICE_ID;

    const payload = {
      model_id: DEFAULT_MODEL,
      transcript: transcript.trim(),
      voice: {
        mode: 'id',
        id: targetVoiceId,
      },
      output_format: {
        container: 'mp3',
        bit_rate: 192000,
        sample_rate: 44100,
      },
      language,
      generation_config: {
        speed,
        volume: 1.1,
        emotion,
      },
    };

    const cartesiaRes = await fetch('https://api.cartesia.ai/tts/bytes', {
      method: 'POST',
      headers: {
        'X-API-Key': CARTESIA_API_KEY,
        'Cartesia-Version': CARTESIA_VERSION,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!cartesiaRes.ok) {
      const errorText = await cartesiaRes.text();
      console.error('[Cartesia TTS Error]', cartesiaRes.status, errorText);
      return NextResponse.json(
        { error: 'Cartesia TTS error', details: errorText },
        { status: cartesiaRes.status }
      );
    }

    const audioBuffer = await cartesiaRes.arrayBuffer();

    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.byteLength.toString(),
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    console.error('[Cartesia TTS Handler Error]', err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
