import { users, dreams, chatMessages, type User, type InsertUser, type Dream, type InsertDream, type ChatMessage, type InsertChatMessage } from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Dream methods
  getDream(id: number): Promise<Dream | undefined>;
  getDreamsByUserId(userId: number): Promise<Dream[]>;
  createDream(dream: InsertDream): Promise<Dream>;
  updateDream(id: number, updates: Partial<Dream>): Promise<Dream | undefined>;
  searchDreams(userId: number, query: string): Promise<Dream[]>;

  // Chat message methods
  getChatMessages(dreamId?: number): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  getRecentChatMessages(limit?: number): Promise<ChatMessage[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private dreams: Map<number, Dream>;
  private chatMessages: Map<number, ChatMessage>;
  private currentUserId: number;
  private currentDreamId: number;
  private currentMessageId: number;

  constructor() {
    this.users = new Map();
    this.dreams = new Map();
    this.chatMessages = new Map();
    this.currentUserId = 1;
    this.currentDreamId = 1;
    this.currentMessageId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getDream(id: number): Promise<Dream | undefined> {
    return this.dreams.get(id);
  }

  async getDreamsByUserId(userId: number): Promise<Dream[]> {
    return Array.from(this.dreams.values())
      .filter(dream => dream.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createDream(insertDream: InsertDream): Promise<Dream> {
    const id = this.currentDreamId++;
    const dream: Dream = { 
      id, 
      createdAt: new Date(),
      title: insertDream.title,
      content: insertDream.content,
      userId: insertDream.userId,
      analysis: insertDream.analysis ?? null,
      archetypes: insertDream.archetypes ?? null,
      symbols: insertDream.symbols ?? null,
      imageUrl: insertDream.imageUrl ?? null
    };
    this.dreams.set(id, dream);
    return dream;
  }

  async updateDream(id: number, updates: Partial<Dream>): Promise<Dream | undefined> {
    const existingDream = this.dreams.get(id);
    if (!existingDream) return undefined;
    
    const updatedDream = { ...existingDream, ...updates };
    this.dreams.set(id, updatedDream);
    return updatedDream;
  }

  async searchDreams(userId: number, query: string): Promise<Dream[]> {
    const userDreams = await this.getDreamsByUserId(userId);
    const lowerQuery = query.toLowerCase();
    
    return userDreams.filter(dream => 
      dream.title.toLowerCase().includes(lowerQuery) ||
      dream.content.toLowerCase().includes(lowerQuery) ||
      (dream.analysis && dream.analysis.toLowerCase().includes(lowerQuery)) ||
      (dream.archetypes && dream.archetypes.some(archetype => 
        archetype.toLowerCase().includes(lowerQuery)
      )) ||
      (dream.symbols && dream.symbols.some(symbol => 
        symbol.toLowerCase().includes(lowerQuery)
      ))
    );
  }

  async getChatMessages(dreamId?: number): Promise<ChatMessage[]> {
    const messages = Array.from(this.chatMessages.values());
    if (dreamId) {
      return messages
        .filter(msg => msg.dreamId === dreamId)
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }
    return messages
      .filter(msg => !msg.dreamId) // Global chat messages
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const id = this.currentMessageId++;
    const message: ChatMessage = { 
      id, 
      createdAt: new Date(),
      role: insertMessage.role,
      content: insertMessage.content,
      dreamId: insertMessage.dreamId !== undefined ? insertMessage.dreamId : null,
      messageType: insertMessage.messageType !== undefined ? insertMessage.messageType : null,
      metadata: insertMessage.metadata !== undefined ? insertMessage.metadata : null
    };
    this.chatMessages.set(id, message);
    return message;
  }

  async getRecentChatMessages(limit: number = 50): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit)
      .reverse();
  }
}

export const storage = new MemStorage();
