import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { analyzeDream, generateDreamVisualization, generateImage } from "./openai";
import { insertDreamSchema, insertChatMessageSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Chat messages endpoints
  app.get("/api/chat/messages", async (req, res) => {
    try {
      const dreamId = req.query.dreamId ? parseInt(req.query.dreamId as string) : undefined;
      const messages = await storage.getChatMessages(dreamId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch chat messages" });
    }
  });

  app.get("/api/chat/recent", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const messages = await storage.getRecentChatMessages(limit);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch recent messages" });
    }
  });

  app.post("/api/chat/message", async (req, res) => {
    try {
      const messageData = insertChatMessageSchema.parse(req.body);
      const message = await storage.createChatMessage(messageData);
      res.json(message);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid message data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create message" });
      }
    }
  });

  // Dream analysis endpoint
  app.post("/api/dreams/analyze", async (req, res) => {
    try {
      const { dreamContent, userId } = req.body;
      
      if (!dreamContent || !userId) {
        return res.status(400).json({ error: "Dream content and user ID are required" });
      }

      // Get previous dreams for context
      const previousDreams = await storage.getDreamsByUserId(userId);
      const previousContents = previousDreams.slice(-3).map(d => d.content);

      // Analyze the dream
      const analysis = await analyzeDream(dreamContent, previousContents);

      // Create dream record
      const dream = await storage.createDream({
        userId,
        title: analysis.summary.slice(0, 100) + (analysis.summary.length > 100 ? '...' : ''),
        content: dreamContent,
        analysis: analysis.jungianInterpretation,
        archetypes: analysis.archetypes,
        symbols: analysis.symbols,
      });

      // Generate AI response message
      const aiMessage = await storage.createChatMessage({
        dreamId: dream.id,
        role: 'assistant',
        content: analysis.jungianInterpretation,
        messageType: 'analysis',
        metadata: {
          archetypes: analysis.archetypes,
          symbols: analysis.symbols,
          shadowWork: analysis.shadowWork,
          individuationStage: analysis.individuationStage,
          emotionalTone: analysis.emotionalTone,
          recommendations: analysis.recommendations
        }
      });

      res.json({
        dream,
        analysis,
        message: aiMessage
      });
    } catch (error) {
      console.error('Dream analysis error:', error);
      res.status(500).json({ error: "Failed to analyze dream", details: error.message });
    }
  });

  // Custom image generation endpoint for vision boards
  app.post("/api/generate-image", async (req, res) => {
    try {
      const { prompt } = req.body;
      
      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
      }

      const result = await generateImage(prompt);
      
      res.json({
        imageUrl: result.url,
        prompt: prompt
      });
    } catch (error) {
      console.error('Image generation error:', error);
      res.status(500).json({ error: "Failed to generate image", details: error.message });
    }
  });

  // Image generation endpoint for dreams
  app.post("/api/dreams/:dreamId/generate-image", async (req, res) => {
    try {
      const dreamId = parseInt(req.params.dreamId);
      const dream = await storage.getDream(dreamId);
      
      if (!dream) {
        return res.status(404).json({ error: "Dream not found" });
      }

      const analysis = {
        summary: dream.title,
        symbols: dream.symbols || [],
        archetypes: dream.archetypes || [],
        jungianInterpretation: dream.analysis || '',
        shadowWork: '',
        individuationStage: '',
        emotionalTone: '',
        recommendations: []
      };

      const image = await generateDreamVisualization(dream.content, analysis);
      
      // Update dream with image URL
      const updatedDream = await storage.updateDream(dreamId, { imageUrl: image.url });

      // Create image message
      const imageMessage = await storage.createChatMessage({
        dreamId: dreamId,
        role: 'assistant',
        content: 'I\'ve created a visual representation of your dream symbols and archetypes.',
        messageType: 'image',
        metadata: { imageUrl: image.url }
      });

      res.json({
        dream: updatedDream,
        image,
        message: imageMessage
      });
    } catch (error) {
      console.error('Image generation error:', error);
      res.status(500).json({ error: "Failed to generate dream image", details: error.message });
    }
  });

  // Dreams endpoints
  app.get("/api/dreams", async (req, res) => {
    try {
      const userId = req.query.userId ? parseInt(req.query.userId as string) : 1; // Default user for MVP
      const dreams = await storage.getDreamsByUserId(userId);
      res.json(dreams);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch dreams" });
    }
  });

  app.get("/api/dreams/search", async (req, res) => {
    try {
      const userId = req.query.userId ? parseInt(req.query.userId as string) : 1;
      const query = req.query.q as string;
      
      if (!query) {
        return res.status(400).json({ error: "Search query is required" });
      }

      const dreams = await storage.searchDreams(userId, query);
      res.json(dreams);
    } catch (error) {
      res.status(500).json({ error: "Failed to search dreams" });
    }
  });

  app.get("/api/dreams/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const dream = await storage.getDream(id);
      
      if (!dream) {
        return res.status(404).json({ error: "Dream not found" });
      }

      res.json(dream);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch dream" });
    }
  });

  // Insights endpoint
  app.get("/api/insights/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const dreams = await storage.getDreamsByUserId(userId);

      // Calculate archetype frequencies
      const archetypeCount = new Map<string, number>();
      const symbolCount = new Map<string, number>();
      
      dreams.forEach(dream => {
        dream.archetypes?.forEach(archetype => {
          archetypeCount.set(archetype, (archetypeCount.get(archetype) || 0) + 1);
        });
        dream.symbols?.forEach(symbol => {
          symbolCount.set(symbol, (symbolCount.get(symbol) || 0) + 1);
        });
      });

      const totalDreams = dreams.length;
      const archetypeFrequencies = Array.from(archetypeCount.entries())
        .map(([archetype, count]) => ({
          archetype,
          count,
          frequency: Math.round((count / totalDreams) * 100)
        }))
        .sort((a, b) => b.count - a.count);

      const symbolFrequencies = Array.from(symbolCount.entries())
        .map(([symbol, count]) => ({
          symbol,
          count,
          frequency: Math.round((count / totalDreams) * 100)
        }))
        .sort((a, b) => b.count - a.count);

      // Calculate individuation progress (simplified)
      const uniqueArchetypes = archetypeCount.size;
      const individuationProgress = Math.min(Math.round((uniqueArchetypes / 8) * 100), 100); // Max 8 major archetypes

      // Recent patterns (last 7 days)
      const recentDreams = dreams.filter(dream => {
        const dreamDate = new Date(dream.createdAt);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return dreamDate >= weekAgo;
      });

      const recentPatterns = [];
      if (recentDreams.length > 0) {
        const recentArchetypes = new Set();
        const recentSymbols = new Set();
        
        recentDreams.forEach(dream => {
          dream.archetypes?.forEach(archetype => recentArchetypes.add(archetype));
          dream.symbols?.forEach(symbol => recentSymbols.add(symbol));
        });

        if (recentArchetypes.has('Hero')) {
          recentPatterns.push({
            title: 'Heroic Journeys',
            description: 'Recurring themes of personal challenges and growth',
            icon: 'mountain'
          });
        }
        
        if (recentSymbols.has('door') || recentSymbols.has('key') || recentSymbols.has('lock')) {
          recentPatterns.push({
            title: 'Threshold Symbols',
            description: 'Symbols of transition and hidden potential',
            icon: 'key'
          });
        }

        if (recentArchetypes.has('Shadow')) {
          recentPatterns.push({
            title: 'Shadow Integration',
            description: 'Working with unconscious and repressed aspects',
            icon: 'eye'
          });
        }
      }

      res.json({
        totalDreams,
        archetypeFrequencies,
        symbolFrequencies,
        individuationProgress,
        recentPatterns,
        dreamStreak: Math.min(dreams.length, 30) // Simplified streak calculation
      });
    } catch (error) {
      console.error('Insights error:', error);
      res.status(500).json({ error: "Failed to generate insights" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
