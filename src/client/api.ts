/**
 * HTTP Client for YearAtAGlance API
 */

import {
  Category,
  Event,
  CreateEventInput,
  UpdateEventInput,
  CreateCategoryInput,
  UpdateCategoryInput,
  HeatmapData,
  ApiError,
} from "./types.js";

export class YearAtAGlanceClient {
  private apiUrl: string;
  private apiKey: string;

  constructor(apiUrl: string, apiKey: string) {
    this.apiUrl = apiUrl.replace(/\/$/, ""); // Remove trailing slash
    this.apiKey = apiKey;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.apiUrl}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": this.apiKey,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: `HTTP error ${response.status}`,
        status: response.status,
      })) as ApiError;
      throw new Error(errorData.message || `Request failed: ${response.status}`);
    }

    return response.json() as Promise<T>;
  }

  // ==================== Events ====================

  async listEvents(year?: number, categoryId?: string): Promise<Event[]> {
    const params = new URLSearchParams();
    if (year) params.append("year", year.toString());
    if (categoryId) params.append("categoryId", categoryId);

    const query = params.toString() ? `?${params.toString()}` : "";
    return this.request<Event[]>(`/events${query}`);
  }

  async getEvent(eventId: string): Promise<Event> {
    const events = await this.listEvents();
    const event = events.find((e) => e._id === eventId);
    if (!event) {
      throw new Error(`Event not found: ${eventId}`);
    }
    return event;
  }

  async createEvent(input: CreateEventInput): Promise<Event> {
    return this.request<Event>("/events", {
      method: "POST",
      body: JSON.stringify(input),
    });
  }

  async updateEvent(eventId: string, input: UpdateEventInput): Promise<Event> {
    return this.request<Event>(`/events/${eventId}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    });
  }

  async deleteEvent(eventId: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/events/${eventId}`, {
      method: "DELETE",
    });
  }

  async getHeatmap(year: number): Promise<HeatmapData[]> {
    return this.request<HeatmapData[]>(`/events/heatmap?year=${year}`);
  }

  // ==================== Categories ====================

  async listCategories(): Promise<Category[]> {
    return this.request<Category[]>("/categories");
  }

  async getCategory(categoryId: string): Promise<Category> {
    const categories = await this.listCategories();
    const category = categories.find((c) => c._id === categoryId);
    if (!category) {
      throw new Error(`Category not found: ${categoryId}`);
    }
    return category;
  }

  async createCategory(input: CreateCategoryInput): Promise<Category> {
    return this.request<Category>("/categories", {
      method: "POST",
      body: JSON.stringify(input),
    });
  }

  async updateCategory(
    categoryId: string,
    input: UpdateCategoryInput
  ): Promise<Category> {
    return this.request<Category>(`/categories/${categoryId}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    });
  }

  async deleteCategory(categoryId: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/categories/${categoryId}`, {
      method: "DELETE",
    });
  }

  // ==================== AI ====================

  async getAIStatus(): Promise<{ status: string; model: string }> {
    return this.request<{ status: string; model: string }>("/ai/status");
  }

  async createMilestone(input: string, year?: number): Promise<Event> {
    return this.request<Event>("/ai/create-milestone", {
      method: "POST",
      body: JSON.stringify({ input, year }),
    });
  }

  async analyzeYear(year: number): Promise<unknown> {
    return this.request<unknown>(`/ai/analyze?year=${year}`);
  }

  async chat(message: string, conversationId?: string): Promise<unknown> {
    return this.request<unknown>("/ai/chat", {
      method: "POST",
      body: JSON.stringify({ message, conversationId }),
    });
  }
}
