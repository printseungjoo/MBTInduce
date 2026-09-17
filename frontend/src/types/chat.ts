import type { MbtiRange } from './mbti'

export type ChatSession = {
    id: string;
    userId: string;
    title: string | null;
    isArchived: boolean;
    createdAt: string;
    updatedAt: string;
    _count?: {
        messages: number;
    }
}

export type ChatMessage = {
    id: string;
    role: 'user' | 'ai';
    content: string;
    mbtiRange: MbtiRange;
    createdAt: string;
    rate?: number;
    isStreaming?: boolean;
}
