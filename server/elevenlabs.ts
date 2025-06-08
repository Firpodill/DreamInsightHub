import fetch from 'node-fetch';

interface ElevenLabsVoice {
  voice_id: string;
  name: string;
  category: string;
  preview_url?: string;
  settings?: {
    stability: number;
    similarity_boost: number;
  };
}

interface TextToSpeechRequest {
  text: string;
  voice_id: string;
  model_id?: string;
  voice_settings?: {
    stability: number;
    similarity_boost: number;
    style?: number;
    use_speaker_boost?: boolean;
  };
}

class ElevenLabsService {
  private apiKey: string;
  private baseUrl = 'https://api.elevenlabs.io/v1';

  constructor() {
    if (!process.env.ELEVENLABS_API_KEY) {
      throw new Error('ELEVENLABS_API_KEY environment variable is required');
    }
    this.apiKey = process.env.ELEVENLABS_API_KEY;
  }

  private getHeaders() {
    return {
      'Accept': 'audio/mpeg',
      'Content-Type': 'application/json',
      'xi-api-key': this.apiKey,
    };
  }

  async getVoices(): Promise<ElevenLabsVoice[]> {
    try {
      const response = await fetch(`${this.baseUrl}/voices`, {
        method: 'GET',
        headers: {
          'xi-api-key': this.apiKey,
        },
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.status}`);
      }

      const data = await response.json() as { voices: ElevenLabsVoice[] };
      return data.voices;
    } catch (error) {
      console.error('Error fetching ElevenLabs voices:', error);
      throw error;
    }
  }

  async synthesizeSpeech(request: TextToSpeechRequest): Promise<Buffer> {
    try {
      const url = `${this.baseUrl}/text-to-speech/${request.voice_id}`;
      
      const payload = {
        text: request.text,
        model_id: request.model_id || 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5,
          style: 0.0,
          use_speaker_boost: true,
          ...request.voice_settings,
        },
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs TTS error: ${response.status}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      return Buffer.from(arrayBuffer);
    } catch (error) {
      console.error('Error synthesizing speech:', error);
      throw error;
    }
  }

  async getVoiceSettings(voiceId: string) {
    try {
      const response = await fetch(`${this.baseUrl}/voices/${voiceId}/settings`, {
        method: 'GET',
        headers: {
          'xi-api-key': this.apiKey,
        },
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching voice settings:', error);
      throw error;
    }
  }
}

export const elevenLabsService = new ElevenLabsService();
export type { ElevenLabsVoice, TextToSpeechRequest };