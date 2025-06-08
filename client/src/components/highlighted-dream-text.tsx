import { useState } from 'react';
import { SymbolDefinitionModal } from './symbol-definition-modal';

interface HighlightedDreamTextProps {
  text: string;
  className?: string;
}

// Enhanced detection for proper names, places, significant entities, and archetypes
type HighlightableTerm = { term: string; start: number; end: number; type: 'person' | 'place' | 'entity' | 'archetype' };

function detectHighlightableTerms(text: string): HighlightableTerm[] {
  const terms: HighlightableTerm[] = [];
  
  // Common place indicators and specific locations
  const placePatterns = [
    /\b(Mount|Mt\.?)\s+[A-Z][a-z]+/gi,  // Mount Shasta, Mt. Everest
    /\b[A-Z][a-z]+\s+(Lake|River|Beach|Park|City|Town|Street|Avenue|Road|Boulevard|Highway)/gi,
    /\b(Lake|River)\s+[A-Z][a-z]+/gi,  // Lake Tahoe, River Thames
    /\b[A-Z][a-z]+\s+(California|Texas|Florida|New York|Illinois|Nevada|Oregon|Washington|Arizona|Colorado|Utah|Alaska|Hawaii)/gi,
    /\b(Los Angeles|San Francisco|New York|Chicago|Boston|Seattle|Portland|Denver|Phoenix|Las Vegas|Miami|Orlando|Atlanta|Dallas|Houston|Austin|Nashville|Memphis|Detroit|Cleveland|Pittsburgh|Philadelphia|Baltimore|Washington DC)/gi,
    /\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*(?:\s+(?:National Park|State Park|Forest|Desert|Valley|Canyon|Mountain|Range|Island|Beach|Harbor|Bay))/gi
  ];
  
  // Personal name patterns
  const namePatterns = [
    /\b[A-Z][a-z]{2,}(?:\s+[A-Z][a-z]{2,})?/g,  // Capitalized names (2+ chars to avoid single letters)
  ];
  
  // Jung and Campbell archetypes to detect
  const archetypes = [
    'Hero', 'Shadow', 'Anima', 'Animus', 'Self', 'Wise Old Man', 'Great Mother', 'Trickster', 
    'The Lover', 'The Sage', 'The Ruler', 'The Father', 'Mother', 'Father', 'Mentor', 'Guardian'
  ];

  // Common proper names and famous people to specifically catch
  const commonNames = [
    'Angie', 'Angela', 'Christopher', 'Michael', 'Sarah', 'David', 'Lisa', 'Emily', 'James', 'Mary', 
    'Robert', 'Patricia', 'William', 'Jennifer', 'Richard', 'Elizabeth', 'John', 'Jane', 'Maria', 
    'Daniel', 'Susan', 'Mark', 'Linda', 'Paul', 'Barbara', 'Steven', 'Jessica', 'Kenneth', 'Nancy',
    'Joshua', 'Betty', 'Kevin', 'Helen', 'Brian', 'Sandra', 'George', 'Donna', 'Edward', 'Carol'
  ];

  // Famous people and celebrities
  const famousPeople = [
    'Willie Nelson', 'Elvis Presley', 'Johnny Cash', 'Dolly Parton', 'Bob Dylan', 'Madonna', 'Prince',
    'Michael Jackson', 'Beatles', 'Rolling Stones', 'Taylor Swift', 'Beyonce', 'Jay-Z', 'Kanye West',
    'Lady Gaga', 'Adele', 'Ed Sheeran', 'Bruno Mars', 'Justin Bieber', 'Ariana Grande',
    'Tom Hanks', 'Brad Pitt', 'Leonardo DiCaprio', 'Meryl Streep', 'Jennifer Lawrence', 'Will Smith',
    'Denzel Washington', 'Morgan Freeman', 'Robert De Niro', 'Al Pacino', 'Scarlett Johansson',
    'Barack Obama', 'Donald Trump', 'Joe Biden', 'Hillary Clinton', 'Bill Gates', 'Elon Musk',
    'Steve Jobs', 'Mark Zuckerberg', 'Jeff Bezos', 'Warren Buffett', 'Oprah Winfrey',
    'Albert Einstein', 'Isaac Newton', 'Marie Curie', 'Charles Darwin', 'Stephen Hawking',
    'Martin Luther King', 'Gandhi', 'Nelson Mandela', 'John F Kennedy', 'Abraham Lincoln'
  ];
  
  // Brand names and entities
  const entityPatterns = [
    /\bTikTok\b/gi,
    /\bFacebook\b/gi,
    /\bInstagram\b/gi,
    /\bTwitter\b/gi,
    /\bYouTube\b/gi,
    /\bGoogle\b/gi,
    /\bApple\b/gi,
    /\bMicrosoft\b/gi,
    /\bAmazon\b/gi,
    /\bNetflix\b/gi,
    /\bDisney\b/gi,
    /\bStarbucks\b/gi,
    /\bMcDonald's\b/gi,
    /\bWalmart\b/gi,
    /\bTarget\b/gi
  ];
  
  // Find places
  placePatterns.forEach(pattern => {
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(text)) !== null) {
      terms.push({
        term: match[0],
        start: match.index,
        end: match.index + match[0].length,
        type: 'place'
      });
    }
  });
  
  // Find archetypes first (highest priority)
  archetypes.forEach(archetype => {
    const regex = new RegExp(`\\b${archetype}\\b`, 'gi');
    let match: RegExpExecArray | null;
    while ((match = regex.exec(text)) !== null) {
      terms.push({
        term: match[0],
        start: match.index,
        end: match.index + match[0].length,
        type: 'archetype'
      });
    }
  });

  // Find famous people second (priority over common names)
  famousPeople.forEach(name => {
    const regex = new RegExp(`\\b${name}\\b`, 'gi');
    let match: RegExpExecArray | null;
    while ((match = regex.exec(text)) !== null) {
      // Check if this overlaps with existing terms
      const overlaps = terms.some(term => 
        match!.index < term.end && match!.index + match![0].length > term.start
      );
      if (!overlaps) {
        terms.push({
          term: match[0],
          start: match.index,
          end: match.index + match[0].length,
          type: 'person'
        });
      }
    }
  });

  // Find common names specifically
  commonNames.forEach(name => {
    const regex = new RegExp(`\\b${name}\\b`, 'gi');
    let match: RegExpExecArray | null;
    while ((match = regex.exec(text)) !== null) {
      // Check if this overlaps with existing terms
      const overlaps = terms.some(term => 
        match!.index < term.end && match!.index + match![0].length > term.start
      );
      if (!overlaps) {
        terms.push({
          term: match[0],
          start: match.index,
          end: match.index + match[0].length,
          type: 'person'
        });
      }
    }
  });
  
  // Find other capitalized names (but filter out common words and overlaps)
  const excludeWords = new Set([
    'I', 'The', 'A', 'An', 'And', 'Or', 'But', 'So', 'For', 'Yet', 'Nor', 'To', 'Of', 'In', 'On', 'At', 'By', 'With', 'From',
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday',
    'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December',
    'Spring', 'Summer', 'Fall', 'Winter', 'Christmas', 'Easter', 'Halloween', 'Thanksgiving',
    'God', 'Jesus', 'Buddha', 'Allah', 'Heaven', 'Hell'
  ]);
  
  namePatterns.forEach(pattern => {
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(text)) !== null) {
      const word = match[0].trim();
      
      // Skip if it's an excluded word or overlaps with existing terms
      if (excludeWords.has(word) || word.length < 3) continue;
      
      const overlaps = terms.some(term => 
        match!.index < term.end && match!.index + match![0].length > term.start
      );
      
      if (!overlaps) {
        terms.push({
          term: word,
          start: match.index,
          end: match.index + match[0].length,
          type: 'person'
        });
      }
    }
  });
  
  // Find entities
  entityPatterns.forEach(pattern => {
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(text)) !== null) {
      const overlaps = terms.some(term => 
        match!.index < term.end && match!.index + match![0].length > term.start
      );
      if (!overlaps) {
        terms.push({
          term: match[0],
          start: match.index,
          end: match.index + match[0].length,
          type: 'entity'
        });
      }
    }
  });
  
  // Sort by position and remove overlaps (keep the longer match)
  terms.sort((a, b) => a.start - b.start);
  
  const filteredTerms: HighlightableTerm[] = [];
  for (let i = 0; i < terms.length; i++) {
    const current = terms[i];
    const hasOverlap = filteredTerms.some(existing => 
      current.start < existing.end && current.end > existing.start
    );
    
    if (!hasOverlap) {
      filteredTerms.push(current);
    }
  }
  
  return filteredTerms;
}

export function HighlightedDreamText({ text, className = "" }: HighlightedDreamTextProps) {
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<'archetype' | 'symbol'>('symbol');
  const [modalOpen, setModalOpen] = useState(false);
  
  const highlightableTerms = detectHighlightableTerms(text);
  
  const handleTermClick = (term: string, type: HighlightableTerm['type']) => {
    setSelectedSymbol(term);
    setSelectedType(type === 'archetype' ? 'archetype' : 'symbol');
    setModalOpen(true);
  };
  
  const renderHighlightedText = () => {
    if (highlightableTerms.length === 0) {
      return <span>{text}</span>;
    }
    
    const elements = [];
    let lastIndex = 0;
    
    highlightableTerms.forEach((term, index) => {
      // Add text before the term
      if (term.start > lastIndex) {
        elements.push(
          <span key={`text-${index}`}>
            {text.slice(lastIndex, term.start)}
          </span>
        );
      }
      
      // Add the highlighted term with archetype-specific styling
      const colorClass = term.type === 'archetype'
        ? 'text-red-800 bg-gradient-to-r from-red-100 to-orange-100 border-red-400 hover:bg-red-200 font-bold shadow-md'
        : term.type === 'place' 
        ? 'text-green-700 bg-green-100 border-green-300 hover:bg-green-200' 
        : term.type === 'person'
        ? 'text-blue-700 bg-blue-100 border-blue-300 hover:bg-blue-200'
        : 'text-purple-700 bg-purple-100 border-purple-300 hover:bg-purple-200';
      
      elements.push(
        <span
          key={`term-${index}`}
          className={`${colorClass} px-1 py-0.5 rounded cursor-pointer border transition-all duration-200 hover:shadow-sm font-medium`}
          onClick={() => handleTermClick(term.term, term.type)}
          title={`Click to learn about ${term.term}${term.type === 'archetype' ? ' (Jungian Archetype)' : ''}`}
        >
          {term.term}
        </span>
      );
      
      lastIndex = term.end;
    });
    
    // Add remaining text
    if (lastIndex < text.length) {
      elements.push(
        <span key="text-final">
          {text.slice(lastIndex)}
        </span>
      );
    }
    
    return elements;
  };
  
  return (
    <>
      <div className={className}>
        {renderHighlightedText()}
      </div>
      
      {selectedSymbol && (
        <SymbolDefinitionModal
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setSelectedSymbol(null);
          }}
          symbol={selectedSymbol}
          type={selectedType}
        />
      )}
    </>
  );
}