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

  // BETA mode: Higher limit for analytical content like Jungian interpretations
  const maxLength = 400; // Increased for meaningful analytical content
  let truncatedText = text;
  
  if (text.length > maxLength) {
    // Find natural break point at sentence boundary
    let breakPoint = maxLength;
    
    // Look for sentence endings near the limit
    for (let i = maxLength - 30; i <= Math.min(maxLength + 30, text.length); i++) {
      if (text[i] && /[.!?]/.test(text[i])) {
        breakPoint = i + 1;
        break;
      }
    }
    
    // If no sentence ending, find word boundary
    if (breakPoint === maxLength) {
      for (let i = maxLength; i >= maxLength - 20; i--) {
        if (text[i] && /\s/.test(text[i])) {
          breakPoint = i;
          break;
        }
      }
    }
    
    truncatedText = text.substring(0, breakPoint).trim();
    
    // Add note that text was truncated for testing
    if (breakPoint < text.length) {
      truncatedText += ' [BETA: truncated to save credits]';
    }
  }
  
  console.log(`Text length: ${text.length}, using: ${truncatedText.length} characters`);

  // Use most efficient model first
  const models = ['eleven_monolingual_v1', 'eleven_multilingual_v2', 'eleven_turbo_v2_5'];
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
          text: truncatedText,
          model_id: model,
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.0,
            use_speaker_boost: false, // Disable to save credits
            ...settings,
          },
        }),
      });

      if (response.ok) {
        console.log(`Successfully used model: ${model} with ${truncatedText.length} characters`);
        break;
      } else {
        const errorData = await response.text();
        lastError = `Model ${model} failed with status ${response.status}: ${errorData}`;
        console.log(lastError);
      }
    } catch (err: any) {
      lastError = `Model ${model} failed: ${err?.message || 'Unknown error'}`;
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