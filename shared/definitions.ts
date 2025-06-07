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
  'Wise Old Woman': {
    definition: 'The feminine embodiment of wisdom, intuitive knowledge, and nurturing guidance.',
    jungianMeaning: 'Offers deep intuitive wisdom and connection to the collective feminine unconscious.',
    campbellMeaning: 'The wise woman or crone who represents ancient wisdom, often appearing as the goddess in her wisdom aspect to guide the hero.'
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
  'Child': {
    definition: 'The archetype representing innocence, spontaneity, new beginnings, and untapped potential.',
    jungianMeaning: 'Symbolizes the emerging self, creativity, and the capacity for renewal and psychological rebirth.',
    campbellMeaning: 'The divine child or wonder child who represents new potential, often born under miraculous circumstances to fulfill a prophetic destiny.'
  },
  'Persona': {
    definition: 'The social mask or facade we present to the world, adapting to social expectations and roles.',
    jungianMeaning: 'The adaptive layer of personality that interfaces with society but must not be confused with the true Self.'
  },
  'Father': {
    definition: 'The paternal archetype representing authority, protection, guidance, and traditional masculine values.',
    jungianMeaning: 'Embodies the principle of order, discipline, and the transmission of cultural values and wisdom.'
  },
  'Mother': {
    definition: 'The maternal archetype symbolizing nurturing, unconditional love, protection, and emotional support.',
    jungianMeaning: 'Represents the life-giving principle, emotional containment, and the foundation of psychological security.'
  },
  'Lover': {
    definition: 'The archetype of passion, romance, intimacy, and the pursuit of emotional and physical connection.',
    jungianMeaning: 'Represents the drive toward union, both with others and with the inner aspects of the psyche.'
  },
  'Magician': {
    definition: 'The archetype of transformation, knowledge, and the ability to bridge different realms of reality.',
    jungianMeaning: 'Symbolizes the capacity for psychological transformation and access to unconscious wisdom.',
    campbellMeaning: 'The shaman or wise figure who possesses supernatural knowledge and the power to transform reality through ritual and sacred practice.'
  },
  'Warrior': {
    definition: 'The archetype of courage, discipline, strength, and the willingness to fight for important causes.',
    jungianMeaning: 'Represents the focused will and determination necessary for individuation and self-defense.',
    campbellMeaning: 'The champion who faces trials through physical and spiritual combat, embodying the warrior code and protective instincts of the tribe.'
  },
  'Ruler': {
    definition: 'The archetype of leadership, responsibility, control, and the maintenance of order and stability.',
    jungianMeaning: 'Embodies the organizing principle of the psyche and the capacity for self-governance.'
  },
  'Sage': {
    definition: 'The archetype of wisdom, knowledge, contemplation, and the search for truth and understanding.',
    jungianMeaning: 'Represents the drive toward understanding, meaning-making, and the integration of experience into wisdom.'
  },
  'Innocent': {
    definition: 'The archetype of purity, optimism, faith, and the desire for happiness and harmony.',
    jungianMeaning: 'Symbolizes the untainted aspect of the psyche that maintains hope and connection to the divine.'
  },
  'Explorer': {
    definition: 'The archetype of adventure, independence, and the drive to discover new territories and experiences.',
    jungianMeaning: 'Represents the individuating impulse that seeks authentic experience and personal freedom.'
  },
  'Creator': {
    definition: 'The archetype of imagination, artistic expression, and the drive to bring something new into existence.',
    jungianMeaning: 'Embodies the creative principle of the psyche and the capacity for self-expression and renewal.'
  },
  'Caregiver': {
    definition: 'The archetype of service, compassion, generosity, and the desire to help and protect others.',
    jungianMeaning: 'Represents the nurturing aspect of the psyche and the drive toward connection and service.'
  },
  'Jester': {
    definition: 'The archetype of humor, joy, spontaneity, and the ability to find lightness in difficult situations.',
    jungianMeaning: 'Facilitates psychological flexibility and the integration of opposites through humor and play.'
  },
  'Rebel': {
    definition: 'The archetype of revolution, change, and the desire to overturn established order and conventions.',
    jungianMeaning: 'Represents the transformative force that challenges outdated patterns and facilitates renewal.'
  },
  'Orphan': {
    definition: 'The archetype of abandonment, survival, and the search for belonging and identity.',
    jungianMeaning: 'Represents the wounded aspect of the psyche that must find its own way to healing and integration.'
  },
  'Destroyer': {
    definition: 'The archetype of dissolution, endings, and the necessary destruction that precedes renewal.',
    jungianMeaning: 'Embodies the transformative power that breaks down outworn structures to allow new growth.'
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
  'golden key': {
    definition: 'A precious key representing valuable wisdom, spiritual insight, and transformative power.',
    jungianMeaning: 'The sacred tool for unlocking the mysteries of the Self and achieving individuation.'
  },
  'wise woman': {
    definition: 'An elderly female figure embodying wisdom, guidance, and intuitive knowledge.',
    jungianMeaning: 'Represents the anima in its wise aspect, offering guidance toward psychological wholeness.'
  },
  'library': {
    definition: 'A repository of knowledge, books, and accumulated human wisdom.',
    jungianMeaning: 'Symbolizes the collective knowledge of the unconscious and the search for meaning and understanding.'
  },
  'books': {
    definition: 'Containers of knowledge, stories, and wisdom passed down through generations.',
    jungianMeaning: 'Represent the accumulated wisdom of the collective unconscious and potential for learning.'
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
  'cat': {
    definition: 'A feline representing independence, mystery, intuition, and feminine energy.',
    jungianMeaning: 'Symbolizes the anima, independence, and the mysterious aspects of the feminine unconscious.'
  },
  'dog': {
    definition: 'A canine representing loyalty, companionship, protection, and instinctual wisdom.',
    jungianMeaning: 'Symbolizes faithful aspects of the psyche, instinctual guidance, and protective functions.'
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
  'birth': {
    definition: 'The beginning of life representing new beginnings, creativity, and potential.',
    jungianMeaning: 'Symbolizes the emergence of new consciousness, creative potential, and psychological rebirth.'
  },
  'river': {
    definition: 'Flowing water representing the passage of time, emotion, and life\'s journey.',
    jungianMeaning: 'Symbolizes the flow of life force, emotional currents, and the stream of consciousness.'
  },
  'moon': {
    definition: 'The celestial body representing cycles, femininity, mystery, and the unconscious mind.',
    jungianMeaning: 'Symbolizes the feminine principle, cyclical nature of psychological development, and unconscious wisdom.'
  },
  'sun': {
    definition: 'The celestial body representing consciousness, enlightenment, vitality, and masculine energy.',
    jungianMeaning: 'Symbolizes consciousness, the ego, spiritual illumination, and the masculine principle.'
  },
  'storm': {
    definition: 'Turbulent weather representing emotional turmoil, conflict, and powerful transformation.',
    jungianMeaning: 'Symbolizes psychological upheaval, the destructive-creative force of change, and emotional catharsis.'
  },
  'garden': {
    definition: 'A cultivated space representing growth, beauty, harmony, and the tended aspects of life.',
    jungianMeaning: 'Symbolizes the cultivated consciousness, personal development, and the integration of natural and civilized aspects.'
  },
  'treasure': {
    definition: 'Valuable objects representing hidden worth, spiritual riches, and hard-won wisdom.',
    jungianMeaning: 'Symbolizes the Self, the goal of individuation, and the precious insights gained through psychological work.'
  },
  'sword': {
    definition: 'A blade weapon representing power, truth, discrimination, and the cutting away of illusion.',
    jungianMeaning: 'Symbolizes the discriminating function of consciousness and the power to cut through psychological confusion.'
  },
  'crown': {
    definition: 'Royal headwear representing authority, achievement, spiritual attainment, and recognition.',
    jungianMeaning: 'Symbolizes the achievement of psychological sovereignty and the integration of the royal or divine aspect of Self.'
  },
  'cave': {
    definition: 'An underground hollow representing the womb, the unconscious, and places of retreat and transformation.',
    jungianMeaning: 'Symbolizes the depths of the unconscious mind and the place where profound psychological transformation occurs.'
  },
  'flight': {
    definition: 'The act of flying representing freedom, transcendence, escape, and rising above limitations.',
    jungianMeaning: 'Symbolizes liberation from earthbound consciousness and the capacity for spiritual or psychological transcendence.'
  },
  'falling': {
    definition: 'The act of dropping down representing loss of control, fear, and descent into the unconscious.',
    jungianMeaning: 'Symbolizes the ego\'s fear of losing control or the descent into unconscious material that requires integration.'
  },
  'mask': {
    definition: 'A face covering representing disguise, hidden identity, and the personas we wear.',
    jungianMeaning: 'Symbolizes the persona, the false self, or the need to hide authentic aspects of personality.'
  },
  'clock': {
    definition: 'A timepiece representing time awareness, deadlines, and the passage of life.',
    jungianMeaning: 'Symbolizes consciousness of mortality, the pressure of time, and the need for timely psychological development.'
  },
  'labyrinth': {
    definition: 'A complex maze representing the spiritual journey, confusion, and the path to the center of self.',
    jungianMeaning: 'Symbolizes the individuation process and the winding path toward self-discovery and wholeness.'
  },
  'angel': {
    definition: 'A divine messenger representing guidance, protection, and connection to the spiritual realm.',
    jungianMeaning: 'Symbolizes the Self in its transcendent aspect and messages from the deeper layers of the unconscious.'
  },
  'child': {
    definition: 'A young person representing innocence, potential, new beginnings, and the future self.',
    jungianMeaning: 'Symbolizes the divine child archetype, renewal, and the emerging possibilities within the psyche.'
  },
  'blood': {
    definition: 'Life force fluid representing vitality, sacrifice, kinship, and the essence of life.',
    jungianMeaning: 'Symbolizes life energy, emotional intensity, and the connection between physical and spiritual existence.'
  },
  
  // Animals
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
  'bear': {
    definition: 'Large mammal representing strength, protection, introspection, and healing.',
    jungianMeaning: 'Symbolizes the protective mother archetype and the power that comes from deep inner reflection.'
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
  'rabbit': {
    definition: 'Small mammal representing fertility, luck, speed, and fearfulness.',
    jungianMeaning: 'Symbolizes fertility of ideas, quick thinking, and sometimes the anxious aspects of consciousness.'
  },
  'horse': {
    definition: 'Noble animal representing freedom, power, nobility, and the life force.',
    jungianMeaning: 'Symbolizes libido, life energy, and the powerful forces of the unconscious that can carry consciousness forward.'
  },
  'elephant': {
    definition: 'Large mammal representing memory, wisdom, strength, and good fortune.',
    jungianMeaning: 'Symbolizes the vast memory of the unconscious and the wisdom that comes from long experience.'
  },
  'fox': {
    definition: 'Clever canine representing cunning, adaptability, intelligence, and trickery.',
    jungianMeaning: 'Symbolizes the clever, adaptive aspects of consciousness and sometimes the trickster energy within.'
  },
  'turtle': {
    definition: 'Shelled reptile representing longevity, wisdom, protection, and steady progress.',
    jungianMeaning: 'Symbolizes the protective shell of the ego and the slow, steady progress of individuation.'
  },
  'whale': {
    definition: 'Large sea mammal representing depth, ancient wisdom, emotional power, and the unconscious.',
    jungianMeaning: 'Symbolizes the vast depths of the unconscious mind and the ancient wisdom contained within.'
  },
  'dragon': {
    definition: 'Mythical creature representing power, wisdom, protection, and primal forces.',
    jungianMeaning: 'Symbolizes the powerful, potentially destructive forces of the unconscious that must be integrated.'
  },
  'phoenix': {
    definition: 'Mythical bird representing rebirth, renewal, resurrection, and triumph over adversity.',
    jungianMeaning: 'Symbolizes psychological death and rebirth, the capacity for renewal after destruction.'
  },
  'unicorn': {
    definition: 'Mythical horse representing purity, magic, healing, and the impossible made possible.',
    jungianMeaning: 'Symbolizes the rare, magical aspects of the psyche and the integration of opposites into something unique.'
  },
  
  // Natural Phenomena
  'rainbow': {
    definition: 'Arc of colors representing hope, promise, bridge between worlds, and divine covenant.',
    jungianMeaning: 'Symbolizes the bridge between conscious and unconscious, the integration of all aspects of personality.'
  },
  'lightning': {
    definition: 'Electrical discharge representing sudden illumination, divine power, and transformative energy.',
    jungianMeaning: 'Symbolizes sudden insights, enlightenment, and the powerful force of unconscious content breaking into consciousness.'
  },
  'earthquake': {
    definition: 'Ground shaking representing upheaval, fundamental change, and shaking of foundations.',
    jungianMeaning: 'Symbolizes profound psychological upheaval and the shaking of fundamental beliefs or structures.'
  },
  'volcano': {
    definition: 'Mountain that erupts representing suppressed emotions, creative force, and explosive transformation.',
    jungianMeaning: 'Symbolizes repressed emotional content erupting into consciousness with transformative power.'
  },
  'avalanche': {
    definition: 'Snow mass sliding down representing overwhelming force, loss of control, and buried emotions surfacing.',
    jungianMeaning: 'Symbolizes unconscious content overwhelming consciousness or the release of long-buried emotions.'
  },
  'desert': {
    definition: 'Arid landscape representing spiritual testing, purification, emptiness, and inner journey.',
    jungianMeaning: 'Symbolizes the spiritual desert of individuation where old patterns must be abandoned for growth.'
  },
  'island': {
    definition: 'Land surrounded by water representing isolation, self-sufficiency, and unique perspective.',
    jungianMeaning: 'Symbolizes the individual consciousness surrounded by the unconscious, or the need for solitude.'
  },
  'valley': {
    definition: 'Low land between hills representing fertility, shelter, depth, and hidden treasures.',
    jungianMeaning: 'Symbolizes the depths of experience, the feminine receptive principle, and protected spaces for growth.'
  },
  'cliff': {
    definition: 'Steep rock face representing danger, challenge, edge of consciousness, and leap of faith.',
    jungianMeaning: 'Symbolizes the edge between known and unknown, or the precipice of major psychological change.'
  },
  'waterfall': {
    definition: 'Falling water representing cleansing, power, flow of life, and emotional release.',
    jungianMeaning: 'Symbolizes the flow of life energy, emotional catharsis, and the purifying power of feeling.'
  },
  
  // Objects and Tools
  'hammer': {
    definition: 'Tool for building and breaking representing creation, destruction, and the power to shape reality.',
    jungianMeaning: 'Symbolizes the power of will to shape consciousness and break down old patterns.'
  },
  'anchor': {
    definition: 'Ship\'s weight representing stability, grounding, hope, and connection to foundation.',
    jungianMeaning: 'Symbolizes the need for psychological grounding and stability during turbulent times.'
  },
  'compass': {
    definition: 'Navigation tool representing direction, guidance, purpose, and finding one\'s way.',
    jungianMeaning: 'Symbolizes inner guidance, moral direction, and the capacity to navigate through confusion.'
  },
  'ladder': {
    definition: 'Climbing tool representing ascension, progress, levels of consciousness, and spiritual advancement.',
    jungianMeaning: 'Symbolizes the stages of psychological development and the ascent toward higher consciousness.'
  },
  'rope': {
    definition: 'Binding tool representing connection, salvation, bondage, and lifeline.',
    jungianMeaning: 'Symbolizes connections between different aspects of psyche or the lifeline to consciousness.'
  },
  'chain': {
    definition: 'Linked metal representing bondage, connection, strength through unity, and restriction.',
    jungianMeaning: 'Symbolizes psychological bondage, karmic connections, or the strength that comes from integration.'
  },
  'wheel': {
    definition: 'Circular tool representing cycles, progress, fate, and the wheel of life.',
    jungianMeaning: 'Symbolizes the cyclical nature of psychological development and the eternal return.'
  },
  'scale': {
    definition: 'Weighing device representing balance, justice, judgment, and moral evaluation.',
    jungianMeaning: 'Symbolizes the weighing of conscious and unconscious elements and the search for psychological balance.'
  },
  'hourglass': {
    definition: 'Time measuring device representing mortality, patience, and the passage of time.',
    jungianMeaning: 'Symbolizes awareness of life\'s limitations and the need for timely psychological development.'
  },
  'telescope': {
    definition: 'Viewing instrument representing vision, exploration, seeking distant truths, and expanded perspective.',
    jungianMeaning: 'Symbolizes the capacity to see beyond immediate circumstances and gain broader perspective.'
  },
  'microscope': {
    definition: 'Magnifying instrument representing detailed examination, hidden truths, and analytical focus.',
    jungianMeaning: 'Symbolizes the need to examine psychological material closely and discover hidden patterns.'
  },
  'bottle': {
    definition: 'Container representing containment, preservation, hidden messages, and stored potential.',
    jungianMeaning: 'Symbolizes the container function of consciousness and the preservation of important insights.'
  },
  'candle': {
    definition: 'Light source representing illumination, hope, spiritual guidance, and the flame of consciousness.',
    jungianMeaning: 'Symbolizes the light of consciousness in the darkness of the unconscious.'
  },
  'bell': {
    definition: 'Sound maker representing awakening, calling, announcement, and sacred communication.',
    jungianMeaning: 'Symbolizes the call to consciousness, awakening from psychological sleep, or spiritual summons.'
  },
  'drum': {
    definition: 'Percussion instrument representing rhythm, heartbeat, communication, and primal connection.',
    jungianMeaning: 'Symbolizes the primal rhythms of the psyche and connection to unconscious patterns.'
  },
  
  // Colors
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
  
  // Numbers
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
  'twelve': {
    definition: 'Number representing cosmic order, completion, cycles, and universal patterns.',
    jungianMeaning: 'Symbolizes the complete integration of all psychological functions and cosmic consciousness.'
  },
  
  // Body Parts
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
  'feet': {
    definition: 'Body parts representing grounding, foundation, journey, and connection to earth.',
    jungianMeaning: 'Symbolizes groundedness, the foundation of personality, and the capacity to move forward.'
  },
  'wings': {
    definition: 'Appendages for flight representing freedom, transcendence, and spiritual elevation.',
    jungianMeaning: 'Symbolizes the capacity for transcendence and liberation from earthbound consciousness.'
  },
  
  // Spiritual and Religious Symbols
  'cross': {
    definition: 'Religious symbol representing sacrifice, redemption, intersection of opposites, and spiritual transformation.',
    jungianMeaning: 'Symbolizes the intersection of conscious and unconscious, and the sacrifice necessary for individuation.'
  },
  'mandala': {
    definition: 'Sacred circular design representing wholeness, unity, cosmic order, and the Self.',
    jungianMeaning: 'Symbolizes the Self, psychological wholeness, and the natural tendency toward integration.'
  },
  'spiral': {
    definition: 'Curved line representing growth, evolution, life cycles, and the journey inward.',
    jungianMeaning: 'Symbolizes the cyclical nature of psychological development and the spiral path of individuation.'
  },
  'star': {
    definition: 'Celestial body representing guidance, hope, destiny, and divine light.',
    jungianMeaning: 'Symbolizes the guiding light of the Self and the destiny toward which the psyche moves.'
  },
  'circle': {
    definition: 'Geometric shape representing wholeness, eternity, cycles, and completion.',
    jungianMeaning: 'Symbolizes the Self, psychological wholeness, and the eternal aspects of consciousness.'
  },
  'triangle': {
    definition: 'Three-sided shape representing trinity, balance, and ascending energy.',
    jungianMeaning: 'Symbolizes the resolution of opposites through a third element and ascending consciousness.'
  },
  'square': {
    definition: 'Four-sided shape representing stability, earth, material reality, and structure.',
    jungianMeaning: 'Symbolizes psychological stability, grounding, and the material foundation of consciousness.'
  },
  'flower': {
    definition: 'Plant bloom representing beauty, growth, potential, and the flowering of consciousness.',
    jungianMeaning: 'Symbolizes the flowering of psychological development and the beauty of integrated consciousness.'
  },
  'lotus': {
    definition: 'Sacred flower representing enlightenment, purity, rebirth, and spiritual awakening.',
    jungianMeaning: 'Symbolizes the pure consciousness that emerges from the muddy depths of unconscious experience.'
  },
  'rose': {
    definition: 'Thorned flower representing love, beauty, passion, and the balance of pleasure and pain.',
    jungianMeaning: 'Symbolizes the complete experience of love, including both its joys and sufferings.'
  },
  
  // Elements and Natural Forces
  'earth': {
    definition: 'Solid element representing stability, grounding, materialism, and fertility.',
    jungianMeaning: 'Symbolizes the sensation function, groundedness, and the material foundation of existence.'
  },
  'air': {
    definition: 'Gaseous element representing thought, communication, freedom, and mental activity.',
    jungianMeaning: 'Symbolizes the thinking function, ideas, and the realm of mental and spiritual activity.'
  },
  'wind': {
    definition: 'Moving air representing change, spirit, freedom, and the breath of life.',
    jungianMeaning: 'Symbolizes the spirit, change, and the animating force that moves through consciousness.'
  },
  'ice': {
    definition: 'Frozen water representing preservation, stillness, emotional coldness, and suspended time.',
    jungianMeaning: 'Symbolizes frozen emotions, suspended development, or the preservation of important psychological content.'
  },
  'shadow': {
    definition: 'Dark area representing the hidden, unknown aspects, and the parts we deny.',
    jungianMeaning: 'Symbolizes the shadow archetype, repressed aspects of personality that must be integrated for wholeness.'
  },
  'light': {
    definition: 'Illumination representing consciousness, knowledge, truth, and divine presence.',
    jungianMeaning: 'Symbolizes consciousness, enlightenment, and the illuminating power of awareness.'
  },
  'darkness': {
    definition: 'Absence of light representing the unknown, fear, mystery, and hidden potential.',
    jungianMeaning: 'Symbolizes the unconscious, the unknown aspects of psyche, and the fertile darkness from which new consciousness emerges.'
  },
  
  // Geometric and Abstract Concepts
  'infinity': {
    definition: 'Mathematical concept representing endlessness, eternal cycles, and limitless potential.',
    jungianMeaning: 'Symbolizes the eternal aspects of the psyche and the endless nature of psychological development.'
  },
  'void': {
    definition: 'Empty space representing nothingness, potential, the space between thoughts.',
    jungianMeaning: 'Symbolizes the creative emptiness from which new consciousness emerges and the space for transformation.'
  },
  'maze': {
    definition: 'Complex path representing confusion, the search for answers, and the journey to the center.',
    jungianMeaning: 'Symbolizes the confusing path of individuation and the challenge of finding one\'s true center.'
  },
  'knot': {
    definition: 'Tied rope representing problems, complexity, binding, and the need for resolution.',
    jungianMeaning: 'Symbolizes psychological complexes, problems that need untangling, and the binding patterns of unconscious content.'
  },
  
  // Modern and Cultural Symbols
  'computer': {
    definition: 'Electronic device representing information processing, artificial intelligence, and modern communication.',
    jungianMeaning: 'Symbolizes the thinking function, information processing capabilities of consciousness, and sometimes artificial or disconnected thinking.'
  },
  'telephone': {
    definition: 'Communication device representing connection, messages, and long-distance relationships.',
    jungianMeaning: 'Symbolizes communication between different aspects of psyche or messages from the unconscious.'
  },
  'car': {
    definition: 'Vehicle representing movement, control, personal power, and the direction of life.',
    jungianMeaning: 'Symbolizes the ego\'s capacity to direct life course and the vehicle for psychological movement.'
  },
  'train': {
    definition: 'Rail vehicle representing predetermined path, collective journey, and powerful forward movement.',
    jungianMeaning: 'Symbolizes the collective aspects of psychological development and movement along predetermined patterns.'
  },
  'airplane': {
    definition: 'Flying vehicle representing transcendence, escape, speed, and rising above earthly concerns.',
    jungianMeaning: 'Symbolizes the capacity for transcendence and rapid movement between different levels of consciousness.'
  },
  'ship': {
    definition: 'Water vessel representing journey through emotions, exploration, and navigation of the unconscious.',
    jungianMeaning: 'Symbolizes the ego\'s capacity to navigate the emotional waters of the unconscious.'
  },
  'bicycle': {
    definition: 'Two-wheeled vehicle representing balance, personal effort, and simple forward movement.',
    jungianMeaning: 'Symbolizes the need for psychological balance and the effort required for personal development.'
  },
  
  // Additional Symbols
  'stairs': {
    definition: 'Steps leading up or down, representing ascent, descent, and transitions between levels.',
    jungianMeaning: 'Symbolizes movement between conscious and unconscious levels, or progress in psychological development.'
  },
  'road': {
    definition: 'A path for travel representing life\'s journey, choices, and the direction of personal development.',
    jungianMeaning: 'Symbolizes the life path, destiny, and the conscious choices that shape psychological development.'
  },
  'circle': {
    definition: 'A round shape representing wholeness, completion, cycles, and the eternal.',
    jungianMeaning: 'Symbolizes the Self, psychological wholeness, and the mandala pattern of individuation.'
  },
  'cross': {
    definition: 'An intersection of vertical and horizontal lines representing sacrifice, suffering, and spiritual transformation.',
    jungianMeaning: 'Symbolizes the tension of opposites and the suffering necessary for psychological transformation.'
  },
  'diamond': {
    definition: 'A precious crystal representing perfection, clarity, indestructibility, and spiritual illumination.',
    jungianMeaning: 'Symbolizes the perfected Self, the incorruptible essence, and the goal of psychological refinement.'
  },
  'school': {
    definition: 'An educational institution representing learning, growth, testing, and social development.',
    jungianMeaning: 'Symbolizes life lessons, personal development challenges, and the process of psychological maturation.'
  },
  'teacher': {
    definition: 'An educator figure representing guidance, knowledge transmission, and authority.',
    jungianMeaning: 'Represents the wise aspect of the psyche that guides learning and psychological development.'
  },
  'mama sutra': {
    definition: 'Michele, everybody\'s Mama Sutra is here with you and I see you...and you always LOVED to hear about my dreams....(laughs like Mae West and does a little shimmy sham)',
    jungianMeaning: 'A nurturing archetypal figure representing maternal wisdom, comfort, and the eternal feminine principle that provides guidance and unconditional love.',
    campbellMeaning: 'The Great Mother archetype who offers protection, wisdom, and spiritual nourishment on the hero\'s journey.'
  },
  'classroom': {
    definition: 'A learning space representing structured education, social interaction, and skill development.',
    jungianMeaning: 'Symbolizes the controlled environment where conscious learning and social integration occur.'
  },
  'exam': {
    definition: 'A test or evaluation representing judgment, assessment, and proving one\'s abilities.',
    jungianMeaning: 'Symbolizes life trials, self-evaluation, and the testing of psychological readiness for growth.'
  },
  'test': {
    definition: 'A trial or examination representing challenges, evaluation, and proving worthiness.',
    jungianMeaning: 'Represents psychological trials that must be passed for individuation and personal development.'
  },
  'car': {
    definition: 'A vehicle representing personal control, direction in life, and the ability to navigate circumstances.',
    jungianMeaning: 'Symbolizes the ego\'s capacity to direct life course and control personal destiny.'
  },
  'driving': {
    definition: 'The act of controlling a vehicle representing personal agency, direction, and life management.',
    jungianMeaning: 'Symbolizes conscious control over life direction and the ability to navigate psychological terrain.'
  },
  'accident': {
    definition: 'An unexpected harmful event representing loss of control, trauma, and unintended consequences.',
    jungianMeaning: 'Symbolizes psychological collision, loss of ego control, and unexpected disruption to life path.'
  },
  'hospital': {
    definition: 'A medical facility representing healing, recovery, vulnerability, and professional care.',
    jungianMeaning: 'Symbolizes the need for psychological healing and the therapeutic process of recovery.'
  },
  'doctor': {
    definition: 'A medical professional representing healing, diagnosis, authority, and expert care.',
    jungianMeaning: 'Represents the healing aspect of the psyche and the wise diagnostician of psychological ailments.'
  },
  'medicine': {
    definition: 'Therapeutic substances representing healing, cure, transformation, and restoration of health.',
    jungianMeaning: 'Symbolizes the healing power within the psyche and the medicine needed for psychological wholeness.'
  },
  'family': {
    definition: 'Related individuals representing belonging, origins, support, and foundational relationships.',
    jungianMeaning: 'Symbolizes the personal unconscious, inherited patterns, and the foundation of psychological development.'
  },
  'parents': {
    definition: 'Mother and father figures representing authority, origins, protection, and primary relationships.',
    jungianMeaning: 'Represent the internalized parental complexes and the foundational psychological structures.'
  },
  'sibling': {
    definition: 'Brothers or sisters representing rivalry, comparison, shared origins, and peer relationships.',
    jungianMeaning: 'Symbolizes different aspects of the self and the integration of various personality facets.'
  },
  'baby': {
    definition: 'A newborn representing new beginnings, innocence, potential, and vulnerability.',
    jungianMeaning: 'Symbolizes the emerging self, new psychological potential, and the need for nurturing growth.',
    campbellMeaning: 'The divine child representing new hope, potential, and the promise of renewal.'
  },
  'pregnancy': {
    definition: 'The state of carrying new life representing creativity, potential, and forthcoming transformation.',
    jungianMeaning: 'Symbolizes the gestation of new psychological content and the creative potential within the psyche.'
  },
  'wedding': {
    definition: 'A marriage ceremony representing union, commitment, celebration, and new life phase.',
    jungianMeaning: 'Symbolizes the sacred marriage of opposites within the psyche and psychological integration.'
  },
  'funeral': {
    definition: 'A death ceremony representing endings, mourning, transition, and honoring what was.',
    jungianMeaning: 'Symbolizes the death of old psychological patterns and the ritual of letting go for transformation.'
  },
  'ghost': {
    definition: 'A spirit of the dead representing the past, unfinished business, and memories that linger.',
    jungianMeaning: 'Symbolizes unintegrated aspects of the psyche and psychological content that needs resolution.'
  },
  'monster': {
    definition: 'A frightening creature representing fears, threats, and overwhelming negative forces.',
    jungianMeaning: 'Symbolizes the shadow in its most threatening form and the fears that must be faced for growth.'
  },
  'alien': {
    definition: 'A foreign being representing the unknown, otherness, and unfamiliar aspects of existence.',
    jungianMeaning: 'Symbolizes aspects of the psyche that are foreign to consciousness and need integration.'
  },
  'robot': {
    definition: 'A mechanical being representing automation, lack of emotion, and programmed behavior.',
    jungianMeaning: 'Symbolizes mechanized aspects of personality and the loss of human spontaneity.'
  },
  'computer': {
    definition: 'An electronic device representing logic, information processing, and technological capability.',
    jungianMeaning: 'Symbolizes the rational mind, data processing, and the technological aspects of modern consciousness.'
  },
  'phone': {
    definition: 'A communication device representing connection, messages, and distant contact.',
    jungianMeaning: 'Symbolizes communication between conscious and unconscious, or connection with distant aspects of self.'
  },
  'airplane': {
    definition: 'A flying vehicle representing elevation, escape, rapid movement, and transcendence of limitations.',
    jungianMeaning: 'Symbolizes spiritual ascent, the desire to rise above earthly concerns, and rapid psychological movement.'
  },
  'train': {
    definition: 'A rail vehicle representing predetermined path, collective journey, and structured progress.',
    jungianMeaning: 'Symbolizes life\'s predetermined course, collective unconscious movement, and structured development.'
  },
  'ship': {
    definition: 'A water vessel representing journey across emotional waters, exploration, and navigation of the unconscious.',
    jungianMeaning: 'Symbolizes the ego\'s vessel for navigating the unconscious waters and emotional depths.'
  },
  'island': {
    definition: 'Land surrounded by water representing isolation, self-sufficiency, and separation from the collective.',
    jungianMeaning: 'Symbolizes psychological isolation, the individuated self, and separation from collective consciousness.'
  },
  'desert': {
    definition: 'An arid landscape representing barrenness, isolation, spiritual testing, and purification.',
    jungianMeaning: 'Symbolizes spiritual aridity, the testing of faith, and the purification process of individuation.'
  },
  'volcano': {
    definition: 'An explosive mountain representing suppressed energy, sudden eruption, and transformative destruction.',
    jungianMeaning: 'Symbolizes repressed psychological energy that threatens to erupt and transform the conscious landscape.'
  },
  'earthquake': {
    definition: 'Ground shaking representing fundamental instability, upheaval, and structural collapse.',
    jungianMeaning: 'Symbolizes fundamental psychological upheaval and the shaking of basic assumptions about reality.'
  },
  'tornado': {
    definition: 'A rotating windstorm representing chaos, destruction, and uncontrollable natural forces.',
    jungianMeaning: 'Symbolizes psychological chaos, emotional turmoil, and the destructive power of uncontrolled feelings.'
  },
  'lightning': {
    definition: 'Electrical discharge representing sudden illumination, divine power, and instantaneous change.',
    jungianMeaning: 'Symbolizes sudden psychological insight, divine inspiration, and the flash of consciousness.'
  },
  'rainbow': {
    definition: 'A colorful arc representing hope, promise, beauty, and the bridge between earth and sky.',
    jungianMeaning: 'Symbolizes the bridge between conscious and unconscious, hope after psychological storms.'
  },
  'star': {
    definition: 'A celestial light representing guidance, wishes, destiny, and distant illumination.',
    jungianMeaning: 'Symbolizes the guiding light of the Self and the distant goal of psychological wholeness.'
  },
  'planet': {
    definition: 'A celestial body representing vastness, cosmic perspective, and otherworldly dimensions.',
    jungianMeaning: 'Symbolizes expanded consciousness, cosmic awareness, and the larger perspective on existence.'
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
  
  // Check archetype partial matches
  for (const [key, value] of Object.entries(archetypeDefinitions)) {
    if (normalizedTerm.includes(key.toLowerCase()) || key.toLowerCase().includes(normalizedTerm)) {
      return value;
    }
  }
  
  // Fuzzy matching for common variations and synonyms
  const synonymMap: Record<string, string> = {
    'cars': 'car',
    'automobile': 'car',
    'vehicle': 'car',
    'driving': 'car',
    'animals': 'animal',
    'pets': 'animal',
    'creature': 'animal',
    'creatures': 'animal',
    'hospitals': 'hospital',
    'medical': 'doctor',
    'physician': 'doctor',
    'nurse': 'doctor',
    'schools': 'school',
    'education': 'school',
    'learning': 'school',
    'studying': 'school',
    'tests': 'test',
    'testing': 'test',
    'examination': 'exam',
    'examinations': 'exam',
    'families': 'family',
    'relatives': 'family',
    'parent': 'parents',
    'siblings': 'sibling',
    'brother': 'sibling',
    'sister': 'sibling',
    'babies': 'baby',
    'infant': 'baby',
    'newborn': 'baby',
    'weddings': 'wedding',
    'marriage': 'wedding',
    'funerals': 'funeral',
    'burial': 'funeral',
    'ghosts': 'ghost',
    'spirit': 'ghost',
    'spirits': 'ghost',
    'monsters': 'monster',
    'beast': 'monster',
    'demon': 'monster',
    'aliens': 'alien',
    'extraterrestrial': 'alien',
    'robots': 'robot',
    'machine': 'robot',
    'computers': 'computer',
    'technology': 'computer',
    'phones': 'phone',
    'telephone': 'phone',
    'airplanes': 'airplane',
    'aircraft': 'airplane',
    'plane': 'airplane',
    'trains': 'train',
    'railway': 'train',
    'ships': 'ship',
    'boat': 'ship',
    'vessel': 'ship',
    'islands': 'island',
    'deserts': 'desert',
    'volcanoes': 'volcano',
    'earthquakes': 'earthquake',
    'tornadoes': 'tornado',
    'storms': 'storm',
    'tempest': 'storm',
    'stars': 'star',
    'planets': 'planet',
    'celestial': 'star',
    'home': 'house',
    'dwelling': 'house',
    'building': 'house',
    'doors': 'door',
    'entrance': 'door',
    'exit': 'door',
    'keys': 'key',
    'mountains': 'mountain',
    'hills': 'mountain',
    'peak': 'mountain',
    'trees': 'tree',
    'forest': 'tree',
    'woods': 'forest',
    'snakes': 'snake',
    'serpent': 'snake',
    'birds': 'bird',
    'flying': 'flight',
    'cats': 'cat',
    'feline': 'cat',
    'dogs': 'dog',
    'canine': 'dog',
    'mirrors': 'mirror',
    'reflection': 'mirror',
    'journeys': 'journey',
    'travel': 'journey',
    'trip': 'journey',
    'rivers': 'river',
    'stream': 'river',
    'oceans': 'ocean',
    'sea': 'ocean',
    'gardens': 'garden',
    'park': 'garden',
    'treasures': 'treasure',
    'gold': 'treasure',
    'wealth': 'treasure',
    'swords': 'sword',
    'blade': 'sword',
    'weapon': 'sword',
    'crowns': 'crown',
    'throne': 'crown',
    'caves': 'cave',
    'cavern': 'cave',
    'masks': 'mask',
    'disguise': 'mask',
    'clocks': 'clock',
    'time': 'clock',
    'watch': 'clock'
  };
  
  // Check synonym map
  if (synonymMap[normalizedTerm]) {
    return getDefinition(synonymMap[normalizedTerm]);
  }
  
  return null;
}

// Function to get all available terms for search
export function getAllTerms(): string[] {
  return [
    ...Object.keys(archetypeDefinitions),
    ...Object.keys(symbolDefinitions)
  ].sort();
}