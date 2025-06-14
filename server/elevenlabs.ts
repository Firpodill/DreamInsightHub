export async function getElevenLabsVoices() {
  if (!process.env.ELEVENLABS_API_KEY) {
    throw new Error('ELEVENLABS_API_KEY not configured');
  }

  const response = await fetch('https://api.elevenlabs.io/v1/voices', {
    headers: {
      'xi-api-key': process.env.ELEVENLABS_API_KEY,
    },
  });

  if (!response.ok) {
    throw new Error(`ElevenLabs API error: ${response.status}`);
  }

  const data = await response.json() as any;
  return data.voices || [];
}

export async function synthesizeElevenLabsSpeech(text: string, voiceId: string, settings?: any) {
  if (!process.env.ELEVENLABS_API_KEY) {
    throw new Error('ELEVENLABS_API_KEY not configured');
  }
  
  console.log('Using API key:', process.env.ELEVENLABS_API_KEY ? process.env.ELEVENLABS_API_KEY.substring(0, 15) + '...' : 'NOT SET');

  // Try different model configurations for compatibility
  const models = ['eleven_turbo_v2_5', 'eleven_multilingual_v2', 'eleven_monolingual_v1'];
  let response;
  let lastError;

  for (const model of models) {
    try {
      response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': process.env.ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
          text,
          model_id: model,
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.0,
            use_speaker_boost: true,
            ...settings,
          },
        }),
      });

      if (response.ok) {
        console.log(`Successfully used model: ${model}`);
        break;
      } else {
        lastError = `Model ${model} failed with status ${response.status}`;
        console.log(lastError);
      }
    } catch (err) {
      lastError = `Model ${model} failed: ${err.message}`;
      console.log(lastError);
    }
  }

  if (!response || !response.ok) {
    const errorText = response ? await response.text() : 'No response';
    console.log(`ElevenLabs synthesis failed: ${response?.status} - ${errorText}`);
    throw new Error(`ElevenLabs TTS error: ${response?.status} - Character limit may be exceeded`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}