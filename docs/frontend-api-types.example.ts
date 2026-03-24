/**
 * Frontend handoff sample types for MBTInduce.
 * This file is an example for frontend developers (TV requirements aligned).
 * Copy to frontend project as needed.
 */

// ---------- Common ----------
export type UserRole = "USER" | "ADMIN";
export type UserStatus = "ACTIVE" | "SUSPENDED" | "DELETED";
export type MessageRole = "USER" | "ASSISTANT" | "SYSTEM";

export interface ApiError {
  message: string;
}

// ---------- Auth / Me ----------
export interface MeUser {
  id: string;
  email: string;
  nickname: string | null;
  profileImage: string | null;
  role: UserRole;
  status: UserStatus;
  lastLoginAt?: string | null;
  createdAt?: string;
}

export interface GetMeResponse {
  user: MeUser;
}

export interface PatchMeRequest {
  nickname?: string;
  profileImage?: string;
}

export interface PatchMeResponse {
  user: MeUser;
}

// ---------- MBTI ----------
export interface MbtiPreference {
  id: string;
  userId: string;
  energy: "E" | "I";
  information: "S" | "N";
  decision: "F" | "T";
  lifestyle: "P" | "J";
  createdAt: string;
  updatedAt: string;
}

export interface GetMbtiResponse {
  mbti: MbtiPreference | null;
}

export interface PutMbtiRequest {
  energy: "E" | "I";
  information: "S" | "N";
  decision: "F" | "T";
  lifestyle: "P" | "J";
}

export interface PutMbtiResponse {
  mbti: MbtiPreference;
}

// ---------- Chat ----------
export interface ChatSessionSummary {
  id: string;
  userId: string;
  title: string | null;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    messages: number;
  };
}

export interface ChatMessage {
  id: string;
  chatSessionId: string;
  role: MessageRole;
  content: string;
  promptTemplateId?: string | null;
  createdAt: string;
}

export interface GetChatSessionsResponse {
  sessions: ChatSessionSummary[];
}

export interface CreateChatSessionRequest {
  title?: string;
}

export interface CreateChatSessionResponse {
  session: ChatSessionSummary;
}

export interface GetChatSessionDetailResponse {
  session: ChatSessionSummary;
  messages: ChatMessage[];
}

export interface PostChatMessageRequest {
  content: string;
}

export interface PostChatMessageResponse {
  userMessage: ChatMessage;
  assistantMessage: ChatMessage;
}

// ---------- Rating / Feedback ----------
export interface CreateRatingRequest {
  chatSessionId: string;
  messageId?: string;
  score: number; // 1..5
  comment?: string;
}

export interface ResponseRating {
  id: string;
  userId: string;
  chatSessionId: string;
  messageId?: string | null;
  score: number;
  comment?: string | null;
  createdAt: string;
}

export interface CreateRatingResponse {
  rating: ResponseRating;
}

export interface CreateFeedbackRequest {
  category?: string;
  content: string;
}

export interface FeedbackItem {
  id: string;
  userId: string;
  category?: string | null;
  content: string;
  createdAt: string;
}

export interface CreateFeedbackResponse {
  feedback: FeedbackItem;
}

// ---------- Templates ----------
export interface PromptTemplateItem {
  id: string;
  title: string;
  content: string;
  category?: string | null;
  isActive: boolean;
  createdById?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface GetTemplatesResponse {
  templates: PromptTemplateItem[];
}

// ---------- Admin ----------
export interface AdminDashboardResponse {
  totalUsers: number;
  totalQueries: number;
  averageRating: number;
  ratingDistribution: Array<{ score: number; _count: { score: number } }>;
  feedbacks: FeedbackItem[];
}

export interface CreateTemplateRequest {
  title: string;
  content: string;
  category?: string;
}

export interface CreateTemplateResponse {
  template: PromptTemplateItem;
}

export interface UpdateTemplateRequest {
  title?: string;
  content?: string;
  category?: string;
  isActive?: boolean;
}

export interface UpdateTemplateResponse {
  template: PromptTemplateItem;
}

export interface DeleteTemplateResponse {
  message: string;
}

// ---------- Frontend helper ----------
const API_BASE_URL = "http://localhost:4000";

export async function apiFetch<TResponse>(
  path: string,
  init?: RequestInit
): Promise<TResponse> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw data as ApiError;
  }

  return data as TResponse;
}
