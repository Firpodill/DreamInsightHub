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
          content: `You are a Jungian dream analyst with deep expertise in Carl Jung's theories. Analyze dreams for ALL applicable archetypes from Jung's complete framework:

REQUIRED: Examine for these specific archetypes and include ALL that are present:
- The Hero (journeys, quests, overcoming challenges)
- The Shadow (dark aspects, fears, rejected parts)
- The Anima/Animus (feminine/masculine aspects, relationships, inner opposite)
- The Self (wholeness, integration, center of personality)
- The Wise Old Man/Woman (guidance, wisdom, mentorship)
- The Mother (nurturing, care, protection, fertility)
- The Father (authority, structure, discipline)
- The Trickster (chaos, humor, disruption, transformation)
- The Innocent (purity, new beginnings, hope)
- The Ruler (control, leadership, power)
- The Lover (passion, relationships, connection)
- The Sage (knowledge, understanding, teaching)

CRITICAL: You must actively search for evidence of each archetype. Include an archetype in the array if ANY element in the dream relates to its themes, even subtly. Be thorough and inclusive rather than restrictive.

Also analyze:
- Personal and collective unconscious elements
- Shadow work and integration opportunities
- Individuation process stages
- Symbolic interpretation through amplification
- Compensation theory (how dreams balance conscious attitudes)

Respond with valid JSON in this exact format:

{
  "summary": "Brief summary of dream themes",
  "archetypes": ["List ALL detected archetypes using exact names: The Hero, The Shadow, The Anima/Animus, The Self, The Sage, The Innocent, The Ruler, The Lover, The Trickster, The Mother, The Father, The Shape Shifter"],
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

export async function generateDreamVisualization(dreamContent: string, analysis: DreamAnalysis): Promise<{ url: string }> {
  try {
    // Extract key words and themes ONLY from the Jungian analysis
    const analysisWords = [
      ...analysis.archetypes,
      ...analysis.symbols,
      analysis.predominantSymbol?.name,
      ...analysis.jungianInterpretation.split(' ').filter(word => word.length > 4),
      ...analysis.shadowWork.split(' ').filter(word => word.length > 4),
      ...analysis.summary.split(' ').filter(word => word.length > 4)
    ].filter(Boolean).slice(0, 15); // Limit to most relevant terms

    const archetypeElements = analysis.archetypes.length > 0 
      ? `Jungian archetypes as visual metaphors: ${analysis.archetypes.join(', ')}. ` 
      : '';
    
    const symbolElements = analysis.symbols.length > 0 
      ? `Psychological symbols: ${analysis.symbols.join(', ')}. ` 
      : '';
    
    const predominantSymbolElement = analysis.predominantSymbol?.name 
      ? `Central focal point: ${analysis.predominantSymbol.name} with surreal distortions. ` 
      : '';
    
    const emotionalTone = analysis.emotionalTone 
      ? `Emotional atmosphere: ${analysis.emotionalTone}. ` 
      : '';

    const prompt = `Create a textless Pop Art comic book style visual collage representing these dream symbols: ${analysisWords.join(', ')}. 

${archetypeElements}${symbolElements}${predominantSymbolElement}${emotionalTone}

CRITICAL: This must be a purely visual image with absolutely no text, letters, words, signs, labels, or written language of any kind.

Style: Classic Pop Art comic book aesthetic with bold, clean lines and vibrant colors. Create a dynamic visual collage that uses only imagery, shapes, and colors to represent psychological themes.

Visual elements:
- Bold comic book outlines and clean geometric shapes
- Bright primary colors (red, blue, yellow) with high contrast
- Classic halftone dot patterns and Ben-Day dots
- Roy Lichtenstein inspired clean graphic style with pure imagery
- Andy Warhol style color blocking and repetition
- Abstract symbolic representations using only visual elements
- Dynamic angular compositions with bold graphics
- Multiple visual panels showing different symbolic imagery
- NO TEXT, NO LETTERS, NO WORDS, NO SIGNS, NO LABELS

Focus on pure visual symbolism: use abstract shapes, colors, and imagery to represent the psychological concepts. Think museum-quality Pop Art that communicates through visual metaphor alone, not text.`;

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "hd",
      style: "vivid",
    });

    return { url: response.data?.[0]?.url || '' };
  } catch (error) {
    console.error('Image generation error:', error);
    throw new Error(`Failed to generate dream visualization: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function generateImage(prompt: string): Promise<{ url: string }> {
  try {
    const cleanPrompt = `Abstract artistic interpretation: ${prompt}. Style: peaceful, artistic, colorful, inspirational.`;
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: cleanPrompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    return { url: response.data?.[0]?.url || '' };
  } catch (error: any) {
    console.error('Image generation error:', error);
    throw new Error(`Failed to generate image: ${error.message || 'Unknown error'}`);
  }
}

// Audio transcription removed to reduce resource usage
