// Comprehensive definitions for archetypes and symbols used in dream analysis
// Based on Carl Jung's analytical psychology and Joseph Campbell's comparative mythology

export interface Definition {
  definition: string;
  jungianMeaning: string;
  campbellMeaning?: string;
}

export const archetypeDefinitions: Record<string, Definition> = {
  'Hero': {
    definition: 'The protagonist who embarks on a transformative journey, facing challenges and overcoming obstacles.',
    jungianMeaning: 'Represents the ego\'s journey toward individuation and self-realization through trials and growth.',
    campbellMeaning: 'The universal figure who follows the monomyth pattern: departure from ordinary world, initiation through trials, and return with wisdom to benefit others.'
  },
  'Shadow': {
    definition: 'The hidden, repressed, or denied aspects of the personality that the conscious mind rejects.',
    jungianMeaning: 'Contains both negative traits and undeveloped positive potential that must be integrated for wholeness.',
    campbellMeaning: 'The dark force or antagonist that represents the hero\'s fears, inner demons, and the trials that must be faced to achieve transformation.'
  },
  'Anima': {
    definition: 'The feminine aspect within the male psyche, representing emotion, intuition, and the unconscious.',
    jungianMeaning: 'The bridge between conscious and unconscious, guiding men toward psychological completeness.'
  },
  'Animus': {
    definition: 'The masculine aspect within the female psyche, representing logic, reason, and spiritual guidance.',
    jungianMeaning: 'Provides women with access to rational thinking and spiritual wisdom for psychological integration.'
  },
  'Self': {
    definition: 'The unified totality of the psyche, encompassing both conscious and unconscious elements.',
    jungianMeaning: 'The ultimate goal of individuation - achieving harmony between all aspects of personality.'
  },
  'Wise Old Man': {
    definition: 'The archetype of wisdom, knowledge, and spiritual guidance, often appearing as a mentor figure.',
    jungianMeaning: 'Represents the accumulated wisdom of humanity and guidance toward higher understanding.',
    campbellMeaning: 'The supernatural aid or mentor who provides the hero with magical gifts, wisdom, or guidance necessary for the quest.'
  },
  'Great Mother': {
    definition: 'The archetypal mother figure representing nurturing, protection, fertility, and unconditional love.',
    jungianMeaning: 'Embodies both the nourishing and devouring aspects of the maternal principle.',
    campbellMeaning: 'The goddess figure who represents the source of life, the womb of creation, and the protective force that both nurtures and potentially devours her children.'
  },
  'Trickster': {
    definition: 'The playful, chaotic force that disrupts order and brings about transformation through humor and cunning.',
    jungianMeaning: 'Facilitates psychological change by breaking down rigid patterns and introducing new perspectives.',
    campbellMeaning: 'The shapeshifter who breaks rules and boundaries, often serving as catalyst for change and bringing sacred knowledge through transgression.'
  },
  'The Lover': {
    definition: 'The archetype of passion, connection, and emotional bonding that seeks unity and harmony through relationships.',
    jungianMeaning: 'Represents the drive for intimate connection, beauty, and the integration of feeling values into consciousness. Governs romantic love, aesthetic appreciation, and the soul\'s yearning for union.',
    campbellMeaning: 'The divine feminine or masculine that calls the hero into deeper relationship with life, often serving as both inspiration and test of devotion.'
  },
  'The Sage': {
    definition: 'The eternal seeker of truth and wisdom who illuminates the path through knowledge, understanding, and philosophical insight.',
    jungianMeaning: 'Embodies the transcendent function that bridges conscious and unconscious knowledge. Represents the drive toward enlightenment and the integration of universal wisdom.',
    campbellMeaning: 'The wise counselor who possesses secret knowledge and guides others toward higher understanding through teaching and revelation of hidden truths.'
  },
  'The Ruler': {
    definition: 'The sovereign archetype that establishes order, takes responsibility, and creates stable foundations for growth and prosperity.',
    jungianMeaning: 'Represents the mature ego that has learned to wield power responsibly. Embodies leadership, authority, and the capacity to create beneficial structures for collective good.',
    campbellMeaning: 'The rightful king or queen who restores order to the realm through wisdom, justice, and the divine right to govern with cosmic harmony.'
  },
  'The Father': {
    definition: 'The paternal principle that provides structure, guidance, and moral authority while protecting and teaching the young.',
    jungianMeaning: 'Represents the masculine principle of logos - rational order, discipline, and spiritual law. Embodies the protective and educative functions that initiate growth through challenge.',
    campbellMeaning: 'The sky father or divine patriarch who establishes cosmic law and provides the framework within which heroic development can occur.'
  }
};

export const symbolDefinitions: Record<string, Definition> = {
  'water': {
    definition: 'The universal symbol of life, purification, renewal, and the flow of emotions.',
    jungianMeaning: 'Represents the unconscious mind, emotional depths, and the cleansing process of psychological transformation.'
  },
  'ocean': {
    definition: 'Vast body of water representing the infinite, the unknown, and emotional depths.',
    jungianMeaning: 'Symbolizes the collective unconscious and the vast reservoir of human experience and wisdom.'
  },
  'forest': {
    definition: 'Dense woodland representing mystery, the unknown, and the journey into the unconscious.',
    jungianMeaning: 'The threshold between conscious and unconscious realms where shadow work and self-discovery occur.'
  },
  'key': {
    definition: 'An instrument that unlocks doors, representing access, secrets, and solutions.',
    jungianMeaning: 'Symbolizes the potential for unlocking unconscious wisdom and accessing deeper levels of self-understanding.'
  },
  'fire': {
    definition: 'The element of transformation, passion, destruction, and renewal through burning away the old.',
    jungianMeaning: 'Symbolizes the transformative power of consciousness and the purifying process of individuation.'
  },
  'bridge': {
    definition: 'A structure that connects two separate places, representing transition and connection.',
    jungianMeaning: 'Symbolizes the path between conscious and unconscious realms, or the transition between life phases.'
  },
  'house': {
    definition: 'A dwelling representing the self, personal identity, and different aspects of the psyche.',
    jungianMeaning: 'Each room represents different aspects of consciousness, with the basement as the unconscious.'
  },
  'door': {
    definition: 'An opening that allows passage between spaces, representing opportunities and thresholds.',
    jungianMeaning: 'Symbolizes transitions between different states of consciousness or phases of psychological development.'
  },
  'mountain': {
    definition: 'A large natural elevation representing challenges, spiritual ascent, and higher consciousness.',
    jungianMeaning: 'Symbolizes the journey toward self-realization and the obstacles that must be overcome for growth.'
  },
  'tree': {
    definition: 'A living symbol of growth, connection between earth and sky, and the cycle of life.',
    jungianMeaning: 'Represents the Self, with roots in the unconscious and branches reaching toward consciousness.'
  },
  'snake': {
    definition: 'A serpent representing transformation, healing, wisdom, and the cyclical nature of life.',
    jungianMeaning: 'Symbolizes the life force, transformation through shedding old patterns, and access to ancient wisdom.'
  },
  'bird': {
    definition: 'A flying creature representing freedom, spirituality, messages, and transcendence.',
    jungianMeaning: 'Symbolizes the soul, thoughts, and the ability to rise above earthly concerns toward higher understanding.'
  },
  'wolf': {
    definition: 'Wild canine representing instinct, wildness, loyalty, and pack consciousness.',
    jungianMeaning: 'Symbolizes the wild, untamed aspects of the psyche and the need for both independence and community.'
  },
  'eagle': {
    definition: 'Powerful bird of prey representing vision, freedom, strength, and connection to the divine.',
    jungianMeaning: 'Symbolizes soaring consciousness, spiritual vision, and the capacity to see from great heights of understanding.'
  },
  'lion': {
    definition: 'King of beasts representing courage, strength, pride, and royal power.',
    jungianMeaning: 'Symbolizes the sovereign aspect of the Self and the courage needed for psychological transformation.'
  },
  'butterfly': {
    definition: 'Transformed insect representing metamorphosis, beauty, rebirth, and the soul.',
    jungianMeaning: 'Symbolizes psychological transformation and the emergence of the beautiful Self from difficult circumstances.'
  },
  'spider': {
    definition: 'Web-spinning arachnid representing creativity, fate, feminine power, and interconnection.',
    jungianMeaning: 'Symbolizes the weaving of destiny, creative power, and the interconnected nature of all experience.'
  },
  'owl': {
    definition: 'Nocturnal bird representing wisdom, mystery, intuition, and hidden knowledge.',
    jungianMeaning: 'Symbolizes wisdom that comes from the darkness of the unconscious and the ability to see what others cannot.'
  },
  'deer': {
    definition: 'Gentle forest animal representing grace, gentleness, spiritual authority, and sensitivity.',
    jungianMeaning: 'Symbolizes the gentle, receptive aspects of consciousness and spiritual sensitivity.'
  },
  'horse': {
    definition: 'Noble animal representing freedom, power, nobility, and the life force.',
    jungianMeaning: 'Symbolizes libido, life energy, and the powerful forces of the unconscious that can carry consciousness forward.'
  },
  'elephant': {
    definition: 'Large mammal representing memory, wisdom, strength, and good fortune.',
    jungianMeaning: 'Symbolizes the vast memory of the unconscious and the wisdom that comes from long experience.'
  },
  'dragon': {
    definition: 'Mythical creature representing power, wisdom, protection, and primal forces.',
    jungianMeaning: 'Symbolizes the powerful, potentially destructive forces of the unconscious that must be integrated.'
  },
  'phoenix': {
    definition: 'Mythical bird representing rebirth, renewal, resurrection, and triumph over adversity.',
    jungianMeaning: 'Symbolizes psychological death and rebirth, the capacity for renewal after destruction.'
  },
  'mirror': {
    definition: 'A reflective surface showing truth, self-examination, and hidden aspects of reality.',
    jungianMeaning: 'Represents self-reflection, the confrontation with shadow aspects, and the search for authentic self.'
  },
  'journey': {
    definition: 'A travel experience representing life path, personal growth, and spiritual development.',
    jungianMeaning: 'Symbolizes the individuation process and the soul\'s quest for wholeness and meaning.',
    campbellMeaning: 'The monomyth structure of departure, initiation, and return that forms the universal pattern of heroic transformation across all cultures.'
  },
  'death': {
    definition: 'The end of life representing transformation, rebirth, and the conclusion of one phase.',
    jungianMeaning: 'Symbolizes psychological transformation, the death of old patterns, and spiritual renewal.'
  },
  'moon': {
    definition: 'The celestial body representing cycles, femininity, mystery, and the unconscious mind.',
    jungianMeaning: 'Symbolizes the feminine principle, cyclical nature of psychological development, and unconscious wisdom.'
  },
  'sun': {
    definition: 'The celestial body representing consciousness, enlightenment, vitality, and masculine energy.',
    jungianMeaning: 'Symbolizes consciousness, the ego, spiritual illumination, and the masculine principle.'
  },
  'star': {
    definition: 'Celestial body representing guidance, hope, destiny, and divine light.',
    jungianMeaning: 'Symbolizes the guiding light of the Self and the destiny toward which the psyche moves.'
  },
  'rainbow': {
    definition: 'Arc of colors representing hope, promise, bridge between worlds, and divine covenant.',
    jungianMeaning: 'Symbolizes the bridge between conscious and unconscious, the integration of all aspects of personality.'
  },
  'lightning': {
    definition: 'Electrical discharge representing sudden illumination, divine power, and transformative energy.',
    jungianMeaning: 'Symbolizes sudden insights, enlightenment, and the powerful force of unconscious content breaking into consciousness.'
  },
  'storm': {
    definition: 'Turbulent weather representing emotional turmoil, conflict, and powerful transformation.',
    jungianMeaning: 'Symbolizes psychological upheaval, the destructive-creative force of change, and emotional catharsis.'
  },
  'earth': {
    definition: 'Solid element representing stability, grounding, materialism, and fertility.',
    jungianMeaning: 'Symbolizes the sensation function, groundedness, and the material foundation of existence.'
  },
  'air': {
    definition: 'Gaseous element representing thought, communication, freedom, and mental activity.',
    jungianMeaning: 'Symbolizes the thinking function, ideas, and the realm of mental and spiritual activity.'
  },
  'cross': {
    definition: 'Religious symbol representing sacrifice, redemption, intersection of opposites, and spiritual transformation.',
    jungianMeaning: 'Symbolizes the intersection of conscious and unconscious, and the sacrifice necessary for individuation.'
  },
  'circle': {
    definition: 'Geometric shape representing wholeness, eternity, cycles, and completion.',
    jungianMeaning: 'Symbolizes the Self, psychological wholeness, and the eternal aspects of consciousness.'
  },
  'spiral': {
    definition: 'Curved line representing growth, evolution, life cycles, and the journey inward.',
    jungianMeaning: 'Symbolizes the cyclical nature of psychological development and the spiral path of individuation.'
  },
  'triangle': {
    definition: 'Three-sided shape representing trinity, balance, and ascending energy.',
    jungianMeaning: 'Symbolizes the resolution of opposites through a third element and ascending consciousness.'
  },
  'square': {
    definition: 'Four-sided shape representing stability, earth, material reality, and structure.',
    jungianMeaning: 'Symbolizes psychological stability, grounding, and the material foundation of consciousness.'
  },
  'red': {
    definition: 'Color representing passion, anger, energy, life force, and intense emotion.',
    jungianMeaning: 'Symbolizes libido, life energy, passion, and the active principle of consciousness.'
  },
  'blue': {
    definition: 'Color representing calm, spirituality, truth, depth, and infinite space.',
    jungianMeaning: 'Symbolizes the spiritual dimension, calm reflection, and the vast depths of the unconscious.'
  },
  'green': {
    definition: 'Color representing nature, growth, healing, fertility, and renewal.',
    jungianMeaning: 'Symbolizes psychological growth, healing, and the life-giving aspects of the unconscious.'
  },
  'yellow': {
    definition: 'Color representing intellect, clarity, enlightenment, and solar consciousness.',
    jungianMeaning: 'Symbolizes intellectual illumination, clarity of thought, and conscious awareness.'
  },
  'purple': {
    definition: 'Color representing royalty, spirituality, mystery, and transformation.',
    jungianMeaning: 'Symbolizes the integration of opposites, spiritual nobility, and psychological transformation.'
  },
  'black': {
    definition: 'Color representing mystery, death, the unknown, and hidden potential.',
    jungianMeaning: 'Symbolizes the shadow, the unknown aspects of psyche, and the fertile darkness of the unconscious.'
  },
  'white': {
    definition: 'Color representing purity, innocence, clarity, and spiritual illumination.',
    jungianMeaning: 'Symbolizes consciousness, purity of intention, and the integration of all psychological elements.'
  },
  'gold': {
    definition: 'Precious metal representing value, immortality, wisdom, and spiritual achievement.',
    jungianMeaning: 'Symbolizes the Self, the goal of individuation, and the transformation of base consciousness into wisdom.'
  },
  'silver': {
    definition: 'Precious metal representing moon energy, intuition, reflection, and feminine wisdom.',
    jungianMeaning: 'Symbolizes the feminine principle, intuitive wisdom, and the reflective aspects of consciousness.'
  },
  'one': {
    definition: 'Number representing unity, beginning, singularity, and the source.',
    jungianMeaning: 'Symbolizes the Self, unity of consciousness, and the beginning of psychological development.'
  },
  'two': {
    definition: 'Number representing duality, opposition, choice, and relationship.',
    jungianMeaning: 'Symbolizes the fundamental opposites in the psyche that must be balanced and integrated.'
  },
  'three': {
    definition: 'Number representing synthesis, creativity, trinity, and resolution of opposites.',
    jungianMeaning: 'Symbolizes the transcendent function that resolves opposites and creates new possibilities.'
  },
  'four': {
    definition: 'Number representing stability, completeness, earth elements, and material manifestation.',
    jungianMeaning: 'Symbolizes psychological wholeness, the four functions of consciousness, and stable integration.'
  },
  'seven': {
    definition: 'Number representing completion, spiritual perfection, cycles, and mystical knowledge.',
    jungianMeaning: 'Symbolizes the completion of psychological development and spiritual attainment.'
  },
  'eye': {
    definition: 'Organ of sight representing vision, awareness, knowledge, and perception.',
    jungianMeaning: 'Symbolizes consciousness, the capacity for insight, and the window to the soul.'
  },
  'hand': {
    definition: 'Body part representing action, creation, skill, and manifestation.',
    jungianMeaning: 'Symbolizes the capacity to act in the world and manifest psychological insights into reality.'
  },
  'heart': {
    definition: 'Organ representing love, emotion, center of being, and life force.',
    jungianMeaning: 'Symbolizes the feeling function, love, and the center of psychological and spiritual life.'
  },
  'head': {
    definition: 'Body part representing thought, consciousness, leadership, and rational mind.',
    jungianMeaning: 'Symbolizes the seat of consciousness, rational thinking, and ego awareness.'
  },
  'crown': {
    definition: 'Royal headwear representing authority, achievement, spiritual attainment, and recognition.',
    jungianMeaning: 'Symbolizes the achievement of psychological sovereignty and the integration of the royal or divine aspect of Self.'
  },
  'sword': {
    definition: 'A blade weapon representing power, truth, discrimination, and the cutting away of illusion.',
    jungianMeaning: 'Symbolizes the discriminating function of consciousness and the power to cut through psychological confusion.'
  },
  'flower': {
    definition: 'Plant bloom representing beauty, growth, potential, and the flowering of consciousness.',
    jungianMeaning: 'Symbolizes the flowering of psychological development and the beauty of integrated consciousness.'
  },
  'rose': {
    definition: 'Thorned flower representing love, beauty, passion, and the balance of pleasure and pain.',
    jungianMeaning: 'Symbolizes the complete experience of love, including both its joys and sufferings.'
  },
  'light': {
    definition: 'Illumination representing consciousness, knowledge, truth, and divine presence.',
    jungianMeaning: 'Symbolizes consciousness, enlightenment, and the illuminating power of awareness.'
  },
  'darkness': {
    definition: 'Absence of light representing the unknown, fear, mystery, and hidden potential.',
    jungianMeaning: 'Symbolizes the unconscious, the unknown aspects of psyche, and the fertile darkness from which new consciousness emerges.'
  },
  'shadow': {
    definition: 'Dark area representing the hidden, unknown aspects, and the parts we deny.',
    jungianMeaning: 'Symbolizes the shadow archetype, repressed aspects of personality that must be integrated for wholeness.'
  },
  'cave': {
    definition: 'An underground hollow representing the womb, the unconscious, and places of retreat and transformation.',
    jungianMeaning: 'Symbolizes the depths of the unconscious mind and the place where profound psychological transformation occurs.'
  },
  'labyrinth': {
    definition: 'A complex maze representing the spiritual journey, confusion, and the path to the center of self.',
    jungianMeaning: 'Symbolizes the individuation process and the winding path toward self-discovery and wholeness.'
  },
  'staircase': {
    definition: 'Steps leading upward representing ascension, progress, and spiritual advancement.',
    jungianMeaning: 'Symbolizes the stages of psychological development and the ascent toward higher consciousness.'
  },
  'tower': {
    definition: 'Tall structure representing isolation, pride, spiritual aspiration, and reaching for the divine.',
    jungianMeaning: 'Symbolizes the ego\'s aspiration toward transcendence and the danger of spiritual inflation.'
  },
  'book': {
    definition: 'Written knowledge representing wisdom, learning, sacred teachings, and hidden secrets.',
    jungianMeaning: 'Symbolizes the accumulated wisdom of the collective unconscious and the search for meaning.'
  },
  'clock': {
    definition: 'Time-measuring device representing mortality, urgency, cycles, and the passage of time.',
    jungianMeaning: 'Symbolizes consciousness of time, the pressure of development, and awareness of life\'s limitations.'
  },
  'mask': {
    definition: 'Face covering representing disguise, hidden identity, and false personas.',
    jungianMeaning: 'Symbolizes the persona, the false self, or the need to hide authentic aspects of personality.'
  },
  'angel': {
    definition: 'Divine messenger representing guidance, protection, and connection to the spiritual realm.',
    jungianMeaning: 'Symbolizes the Self in its transcendent aspect and messages from the deeper layers of the unconscious.'
  },
  'child': {
    definition: 'Young person representing innocence, potential, new beginnings, and the future self.',
    jungianMeaning: 'Symbolizes the divine child archetype, renewal, and the emerging possibilities within the psyche.'
  }
};

// Function to get definition for any term, searching both archetypes and symbols
export function getDefinition(term: string): Definition | null {
  const normalizedTerm = term.toLowerCase().trim();
  
  // Check exact matches first
  let definition = archetypeDefinitions[term] || symbolDefinitions[term];
  if (definition) return definition;
  
  // Check case-insensitive matches
  for (const [key, value] of Object.entries(archetypeDefinitions)) {
    if (key.toLowerCase() === normalizedTerm) return value;
  }
  
  for (const [key, value] of Object.entries(symbolDefinitions)) {
    if (key.toLowerCase() === normalizedTerm) return value;
  }
  
  // Check partial matches for compound terms
  for (const [key, value] of Object.entries(symbolDefinitions)) {
    if (normalizedTerm.includes(key.toLowerCase()) || key.toLowerCase().includes(normalizedTerm)) {
      return value;
    }
  }
  
  for (const [key, value] of Object.entries(archetypeDefinitions)) {
    if (normalizedTerm.includes(key.toLowerCase()) || key.toLowerCase().includes(normalizedTerm)) {
      return value;
    }
  }
  
  // Generate contextual definition for any unrecognized symbol
  return generateContextualDefinition(normalizedTerm);
}

function generateContextualDefinition(term: string): Definition {
  // Comprehensive fallback definitions for common dream elements
  const commonSymbols: Record<string, Definition> = {
    'test': {
      definition: 'An examination or trial representing evaluation, challenge, and proving one\'s abilities.',
      jungianMeaning: 'Symbolizes life challenges that test psychological development and spiritual growth.'
    },
    'testing': {
      definition: 'The process of evaluation or trial representing assessment, challenge, and proving capabilities.',
      jungianMeaning: 'Symbolizes ongoing psychological trials and the process of self-evaluation.'
    },
    'repetition': {
      definition: 'The action of doing or saying something again, representing patterns and emphasis.',
      jungianMeaning: 'Symbolizes recurring psychological patterns that need attention and integration.'
    },
    'examination': {
      definition: 'A detailed investigation or assessment representing scrutiny, evaluation, and self-reflection.',
      jungianMeaning: 'Symbolizes the need for self-examination and psychological evaluation of one\'s progress.'
    },
    'school': {
      definition: 'An educational institution representing learning, growth, and knowledge acquisition.',
      jungianMeaning: 'Symbolizes the ongoing process of self-education and psychological development.'
    },
    'phone': {
      definition: 'A communication device representing connection, messages, and the need to reach others.',
      jungianMeaning: 'Symbolizes the desire for communication with the unconscious or aspects of the Self.'
    },
    'car': {
      definition: 'A vehicle representing personal direction, control over life path, and mobility.',
      jungianMeaning: 'Symbolizes the ego\'s ability to navigate through life and control over destiny.'
    },
    'tiktok': {
      definition: 'TikTok is a social media platform owned by ByteDance, known for short-form videos and viral content.',
      jungianMeaning: 'May represent modern communication, social validation, or creative expression in contemporary life.'
    },
    'facebook': {
      definition: 'Facebook is a social networking platform owned by Meta, used for connecting with friends and sharing content.',
      jungianMeaning: 'May symbolize social connections, communication, or the desire for community and belonging.'
    },
    'instagram': {
      definition: 'Instagram is a photo and video sharing social networking service owned by Meta.',
      jungianMeaning: 'May represent visual self-expression, social image, or the curation of personal identity.'
    },
    'youtube': {
      definition: 'YouTube is a video sharing platform owned by Google, where users upload, share, and watch videos.',
      jungianMeaning: 'May symbolize learning, entertainment, or the sharing of knowledge and experiences.'
    },
    'google': {
      definition: 'Google is a multinational technology company known for its search engine and various internet services.',
      jungianMeaning: 'May represent the search for knowledge, information gathering, or problem-solving abilities.'
    },
    'apple': {
      definition: 'Apple Inc. is a technology company known for consumer electronics, software, and online services like iPhone and Mac.',
      jungianMeaning: 'May symbolize innovation, technology integration, or modern lifestyle and connectivity.'
    },
    'starbucks': {
      definition: 'Starbucks is an American multinational chain of coffeehouses and roastery reserves.',
      jungianMeaning: 'May represent social gathering places, routine, or modern consumer culture.'
    },
    'mount shasta': {
      definition: 'Mount Shasta is a potentially active volcano at the southern end of the Cascade Range in Northern California. It rises to 14,179 feet and is considered one of the most spiritually significant peaks in North America.',
      jungianMeaning: 'Mountains often represent spiritual ascension, challenges to overcome, or higher consciousness in dreams.'
    },
    'california': {
      definition: 'California is a state on the West Coast of the United States, known for its diverse geography from beaches to mountains, and major cities like Los Angeles and San Francisco.',
      jungianMeaning: 'Geographic locations may represent life experiences, journeys, or aspects of personal identity connected to place.'
    },
    'los angeles': {
      definition: 'Los Angeles is the largest city in California and the second-most populous city in the United States, known for entertainment, beaches, and diverse culture.',
      jungianMeaning: 'Cities in dreams may represent social aspects of life, opportunities, or complex life situations.'
    },
    'san francisco': {
      definition: 'San Francisco is a major city in Northern California known for the Golden Gate Bridge, steep hills, and technological innovation.',
      jungianMeaning: 'Urban environments may symbolize social connections, professional life, or navigating complex situations.'
    },
    'new york': {
      definition: 'New York is a state in the northeastern United States, home to New York City, the most populous city in the country.',
      jungianMeaning: 'Major cities may represent ambition, opportunity, or the complexity of modern life.'
    }
  };
  
  if (commonSymbols[term]) {
    return commonSymbols[term];
  }
  
  // Check if it's a potential place name (contains geographic indicators)
  if (isLikelyPlace(term)) {
    return {
      definition: `${term} is a geographic location. Click the map button below to view its exact location and explore the area.`,
      jungianMeaning: `Geographic locations in dreams often represent life journeys, destinations, or significant places from your experiences.`
    };
  }
  
  // Check if it's a potential person's name (capitalized, common name patterns)
  if (isLikelyPersonName(term)) {
    return {
      definition: `${term} is a person's name. This individual may represent someone significant in your life or personal relationships.`,
      jungianMeaning: `People in dreams often embody qualities, emotions, or relationships that are meaningful to the dreamer.`
    };
  }
  
  // Generate contextual definition based on symbol patterns
  return {
    definition: `A significant element appearing in dreams, representing personal meaning and symbolic importance. This symbol carries emotional resonance and appears as part of the unconscious mind's processing of experiences.`,
    jungianMeaning: `Represents an aspect of the psyche seeking integration and understanding. The appearance of this symbol suggests it holds particular significance for psychological development and the individuation process.`
  };
}

function isLikelyPlace(term: string): boolean {
  const placeIndicators = [
    'mount', 'mountain', 'lake', 'river', 'city', 'town', 'street', 'avenue', 'road',
    'park', 'beach', 'forest', 'desert', 'valley', 'hill', 'island', 'bridge',
    'building', 'house', 'home', 'office', 'store', 'mall', 'restaurant', 'cafe',
    'shasta', 'francisco', 'angeles', 'york', 'chicago', 'boston', 'seattle',
    'california', 'texas', 'florida', 'nevada', 'oregon', 'washington'
  ];
  
  const lowerTerm = term.toLowerCase();
  return placeIndicators.some(indicator => 
    lowerTerm.includes(indicator) || indicator.includes(lowerTerm)
  );
}

function isLikelyPersonName(term: string): boolean {
  // Common name patterns and indicators
  const namePatterns = [
    /^[A-Z][a-z]+$/,  // Capitalized single word
    /^[A-Z][a-z]+ [A-Z][a-z]+$/,  // First Last name pattern
  ];
  
  const commonNames = [
    'john', 'jane', 'michael', 'sarah', 'david', 'lisa', 'chris', 'emily',
    'james', 'mary', 'robert', 'patricia', 'william', 'jennifer', 'richard',
    'elizabeth', 'angie', 'angela', 'christopher', 'maria', 'daniel', 'susan'
  ];
  
  const lowerTerm = term.toLowerCase();
  
  return namePatterns.some(pattern => pattern.test(term)) || 
         commonNames.includes(lowerTerm);
}

// Function to get all available terms
export function getAllTerms(): string[] {
  return [
    ...Object.keys(archetypeDefinitions),
    ...Object.keys(symbolDefinitions)
  ].sort();
}