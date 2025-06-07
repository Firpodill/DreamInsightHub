import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

export interface DreamAnalysis {
  summary: string;
  archetypes: string[];
  symbols: string[];
  predominantSymbol: {
    name: string;
    meaning: string;
    jungianSignificance: string;
  };
  jungianInterpretation: string;
  shadowWork: string;
  individuationStage: string;
  emotionalTone: string;
  recommendations: string;
}

export async function analyzeDream(dreamContent: string, previousDreams?: string[]): Promise<DreamAnalysis> {
  try {
    const contextPrompt = previousDreams && previousDreams.length > 0 
      ? `\n\nPrevious dreams for context: ${previousDreams.slice(-3).join('; ')}`
      : '';

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a Jungian dream analyst with deep expertise in Carl Jung's theories of the unconscious, archetypes, and individuation. Analyze dreams using authentic Jungian principles including:

- Archetypal symbolism (Hero, Shadow, Anima/Animus, Self, Wise Old Man/Woman, Trickster, Mother, etc.)
- Personal and collective unconscious elements
- Shadow work and integration
- Individuation process stages
- Symbolic interpretation through amplification
- Compensation theory (how dreams balance conscious attitudes)

Focus on identifying the single most significant symbol that carries the deepest psychological meaning according to Jung's symbolic framework. This should be the symbol that most powerfully represents the dream's core message about the dreamer's unconscious state.

Respond with valid JSON in this exact format:

{
  "summary": "Brief summary of dream themes",
  "archetypes": ["array", "of", "detected", "archetypes"],
  "symbols": ["key", "symbolic", "elements"],
  "predominantSymbol": {
    "name": "The single most psychologically significant symbol",
    "meaning": "What this symbol represents in the dream context",
    "jungianSignificance": "Deep Jungian interpretation of why this symbol is the most important for the dreamer's psychological development"
  },
  "jungianInterpretation": "Detailed Jungian analysis of the dream's meaning and psychological significance",
  "shadowWork": "Insights about shadow elements and integration opportunities",
  "individuationStage": "Assessment of where this dream fits in the individuation journey",
  "emotionalTone": "Emotional quality and psychological mood of the dream",
  "recommendations": "A cohesive paragraph with actionable suggestions for working with dream insights, using proper punctuation and complete sentences."
}`
        },
        {
          role: "user",
          content: `Please analyze this dream using Jungian principles: ${dreamContent}${contextPrompt}`
        }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    return {
      summary: result.summary || 'Dream analysis completed',
      archetypes: Array.isArray(result.archetypes) ? result.archetypes : [],
      symbols: Array.isArray(result.symbols) ? result.symbols : [],
      predominantSymbol: result.predominantSymbol || {
        name: 'Unknown Symbol',
        meaning: 'Symbol analysis in progress',
        jungianSignificance: 'Psychological significance being evaluated'
      },
      jungianInterpretation: result.jungianInterpretation || 'Analysis pending',
      shadowWork: result.shadowWork || 'Shadow work insights to be explored',
      individuationStage: result.individuationStage || 'Stage assessment in progress',
      emotionalTone: result.emotionalTone || 'Emotional tone being evaluated',
      recommendations: result.recommendations || 'Recommendations for integrating dream insights are being processed.'
    };
  } catch (error) {
    console.error('Dream analysis error:', error);
    throw new Error(`Failed to analyze dream: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Image generation functions removed to reduce GPU requirements and deployment complexity
        throw new Error(`Image generation failed: Content policy issue`);
      }
    }
    
    throw new Error(`Failed to generate image: ${error.message || 'Unknown error'}`);
  }
}

export async function transcribeAudio(audioBuffer: Buffer): Promise<{ text: string }> {
  try {
    // Note: In a real implementation, you'd save the buffer to a temporary file
    // For now, we'll simulate the transcription
    throw new Error('Audio transcription requires file upload - implement with temporary file storage');
  } catch (error) {
    console.error('Audio transcription error:', error);
    throw new Error(`Failed to transcribe audio: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
