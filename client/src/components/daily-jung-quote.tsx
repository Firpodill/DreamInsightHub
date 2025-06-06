import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Quote, Lightbulb } from 'lucide-react';

interface JungQuote {
  text: string;
  context: string;
  theme: string;
}

const jungQuotes: JungQuote[] = [
  {
    text: "Your vision becomes clear when you look into your heart. Who looks outside, dreams. Who looks inside, awakens.",
    context: "On the importance of self-reflection and inner exploration",
    theme: "Self-Discovery"
  },
  {
    text: "Everything that irritates us about others can lead us to an understanding of ourselves.",
    context: "From his work on projection and shadow integration",
    theme: "Shadow Work"
  },
  {
    text: "The meeting of two personalities is like the contact of two chemical substances: if there is any reaction, both are transformed.",
    context: "On the transformative nature of relationships",
    theme: "Relationships"
  },
  {
    text: "Until you make the unconscious conscious, it will direct your life and you will call it fate.",
    context: "On the importance of bringing unconscious material to awareness",
    theme: "Consciousness"
  },
  {
    text: "Dreams are the royal road to the unconscious.",
    context: "Building on Freud's work while developing his own approach to dream analysis",
    theme: "Dreams"
  },
  {
    text: "The privilege of a lifetime is to become who you truly are.",
    context: "On the individuation process and becoming authentic",
    theme: "Individuation"
  },
  {
    text: "In all chaos there is a cosmos, in all disorder a secret order.",
    context: "On finding meaning and patterns in apparent randomness",
    theme: "Order & Chaos"
  },
  {
    text: "The greatest and most important problems of life are all fundamentally insoluble. They can never be solved but only outgrown.",
    context: "On psychological development and personal growth",
    theme: "Growth"
  },
  {
    text: "One does not become enlightened by imagining figures of light, but by making the darkness conscious.",
    context: "On the necessity of confronting and integrating the shadow",
    theme: "Shadow Integration"
  },
  {
    text: "The word 'happiness' would lose its meaning if it were not balanced by sadness.",
    context: "On the importance of experiencing the full spectrum of emotions",
    theme: "Balance"
  },
  {
    text: "Every form of addiction is bad, no matter whether the narcotic be alcohol, morphine, or idealism.",
    context: "On the dangers of extremes and unconscious attachments",
    theme: "Moderation"
  },
  {
    text: "The creation of something new is not accomplished by the intellect but by the play instinct acting from inner necessity.",
    context: "On creativity and the role of the unconscious in innovation",
    theme: "Creativity"
  },
  {
    text: "We cannot change anything until we accept it. Condemnation does not liberate, it oppresses.",
    context: "On the importance of acceptance in psychological healing",
    theme: "Acceptance"
  },
  {
    text: "The most terrifying thing is to accept oneself completely.",
    context: "On the courage required for true self-acceptance",
    theme: "Self-Acceptance"
  },
  {
    text: "Where love rules, there is no will to power, and where power predominates, love is lacking.",
    context: "On the relationship between love and power in human interactions",
    theme: "Love & Power"
  },
  {
    text: "The pendulum of the mind oscillates between sense and nonsense, not between right and wrong.",
    context: "On the nature of psychological balance and mental states",
    theme: "Mental Balance"
  },
  {
    text: "A dream is a small hidden door in the deepest and most intimate sanctum of the soul.",
    context: "On the profound significance of dreams in understanding the psyche",
    theme: "Dreams"
  },
  {
    text: "The shoe that fits one person pinches another; there is no recipe for living that suits all cases.",
    context: "On individual differences and the uniqueness of each person's path",
    theme: "Individuality"
  },
  {
    text: "Knowing your own darkness is the best method for dealing with the darknesses of other people.",
    context: "On shadow work and understanding others through self-knowledge",
    theme: "Shadow Knowledge"
  },
  {
    text: "The debt we owe to the play of imagination is incalculable.",
    context: "On the importance of imagination in psychological development",
    theme: "Imagination"
  }
];

export function DailyJungQuote() {
  const [todaysQuote, setTodaysQuote] = useState<JungQuote | null>(null);

  useEffect(() => {
    // Use today's date as seed for consistent daily quote
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    const quoteIndex = dayOfYear % jungQuotes.length;
    setTodaysQuote(jungQuotes[quoteIndex]);
  }, []);

  if (!todaysQuote) return null;

  return (
    <Card className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 border-purple-700/50">
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-purple-600/20 flex items-center justify-center">
              <Quote className="w-5 h-5 text-purple-300" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <Lightbulb className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-semibold text-purple-200">Daily Jung Quote</span>
              <div className="px-2 py-1 bg-purple-600/30 rounded text-xs text-purple-200">
                {todaysQuote.theme}
              </div>
            </div>
            <blockquote className="text-white text-sm leading-relaxed mb-3 italic">
              "{todaysQuote.text}"
            </blockquote>
            <p className="text-xs text-purple-300 leading-relaxed">
              {todaysQuote.context}
            </p>
            <div className="mt-3 text-right">
              <span className="text-xs text-purple-400 font-medium">— Carl Gustav Jung</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}