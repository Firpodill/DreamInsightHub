export interface ArchetypeFrequency {
  archetype: string;
  count: number;
  frequency: number;
}

export interface SymbolFrequency {
  symbol: string;
  count: number;
  frequency: number;
}

export interface RecentPattern {
  title: string;
  description: string;
  icon: string;
}

export interface DreamInsights {
  totalDreams: number;
  archetypeFrequencies: ArchetypeFrequency[];
  symbolFrequencies: SymbolFrequency[];
  individuationProgress: number;
  recentPatterns: RecentPattern[];
  dreamStreak: number;
}

export interface DreamAnalysisResponse {
  summary: string;
  archetypes: string[];
  symbols: string[];
  jungianInterpretation: string;
  shadowWork: string;
  individuationStage: string;
  emotionalTone: string;
  recommendations: string[];
}
