/**
 * TypeScript types for YearAtAGlance API
 */

export interface Category {
  _id: string;
  name: string;
  color: string;
  description?: string;
  user: string;
  createdAt: string;
  updatedAt: string;
}

export interface Event {
  _id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  allDay: boolean;
  category?: Category | string;
  user: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventInput {
  title: string;
  startDate: string;
  endDate: string;
  description?: string;
  categoryId?: string;
  allDay?: boolean;
}

export interface UpdateEventInput {
  title?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  categoryId?: string;
  allDay?: boolean;
}

export interface CreateCategoryInput {
  name: string;
  color: string;
  description?: string;
}

export interface UpdateCategoryInput {
  name?: string;
  color?: string;
  description?: string;
}

export interface HeatmapData {
  date: string;
  count: number;
}

export interface AIResponse {
  success: boolean;
  data?: unknown;
  error?: string;
}

export interface MilestoneInput {
  input: string;
  year?: number;
}

export interface MilestoneSuggestion {
  title: string;
  startDate: string;
  endDate: string;
  description?: string;
  suggestedCategory?: string;
}

export interface YearAnalysis {
  totalEvents: number;
  categorySummary: Record<string, number>;
  busiestMonth: string;
  insights: string[];
}

export interface ApiError {
  message: string;
  status?: number;
}
