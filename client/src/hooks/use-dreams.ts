import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import type { Dream, ChatMessage } from '@shared/schema';
import type { DreamInsights, DreamAnalysisResponse } from '@/types/dream';

const DEFAULT_USER_ID = 1; // For MVP, using a default user

export function useDreams() {
  return useQuery<Dream[]>({
    queryKey: ['/api/dreams', DEFAULT_USER_ID],
    queryFn: async () => {
      const response = await fetch(`/api/dreams?userId=${DEFAULT_USER_ID}`, {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch dreams');
      return response.json();
    }
  });
}

export function useDream(dreamId: number) {
  return useQuery<Dream>({
    queryKey: ['/api/dreams', dreamId],
    enabled: !!dreamId
  });
}

export function useSearchDreams(query: string) {
  return useQuery<Dream[]>({
    queryKey: ['/api/dreams/search', DEFAULT_USER_ID, query],
    queryFn: async () => {
      if (!query.trim()) return [];
      const response = await fetch(
        `/api/dreams/search?userId=${DEFAULT_USER_ID}&q=${encodeURIComponent(query)}`,
        { credentials: 'include' }
      );
      if (!response.ok) throw new Error('Failed to search dreams');
      return response.json();
    },
    enabled: !!query.trim()
  });
}

export function useChatMessages(dreamId?: number) {
  return useQuery<ChatMessage[]>({
    queryKey: ['/api/chat/messages', dreamId],
    queryFn: async () => {
      const url = dreamId 
        ? `/api/chat/messages?dreamId=${dreamId}`
        : '/api/chat/recent';
      const response = await fetch(url, { credentials: 'include' });
      if (!response.ok) throw new Error('Failed to fetch chat messages');
      return response.json();
    }
  });
}

export function useAnalyzeDream() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dreamContent: string) => {
      const response = await apiRequest('POST', '/api/dreams/analyze', {
        dreamContent,
        userId: DEFAULT_USER_ID
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/dreams'] });
      queryClient.invalidateQueries({ queryKey: ['/api/chat/messages'] });
      queryClient.invalidateQueries({ queryKey: ['/api/insights'] });
    }
  });
}

export function useUpdateDream() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (params: { dreamId: number; updates: Partial<Dream> }) => {
      const response = await apiRequest('PATCH', `/api/dreams/${params.dreamId}`, params.updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/dreams'] });
    }
  });
}

export function useDeleteDream() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (dreamId: number) => {
      const response = await apiRequest('DELETE', `/api/dreams/${dreamId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/dreams'] });
    }
  });
}

export function useGenerateImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { prompt: string; dreamId?: number }) => {
      if (params.dreamId) {
        const response = await apiRequest('POST', `/api/dreams/${params.dreamId}/generate-image`);
        return response.json();
      } else {
        const response = await apiRequest('POST', '/api/generate-image', { prompt: params.prompt });
        return response.json();
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/dreams'] });
      queryClient.invalidateQueries({ queryKey: ['/api/chat/messages'] });
    }
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (message: {
      dreamId?: number;
      role: 'user' | 'assistant';
      content: string;
      messageType?: string;
      metadata?: any;
    }) => {
      const response = await apiRequest('POST', '/api/chat/message', message);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/chat/messages'] });
    }
  });
}

export function useDreamInsights() {
  return useQuery<DreamInsights>({
    queryKey: ['/api/insights', DEFAULT_USER_ID],
    queryFn: async () => {
      const response = await fetch(`/api/insights/${DEFAULT_USER_ID}`, {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch insights');
      return response.json();
    }
  });
}
