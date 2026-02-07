const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string = API_URL) {
    this.baseURL = baseURL;

    // Load token from localStorage if available (client-side only)
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("accessToken");
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "API request failed");
      }

      return data;
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  // Public endpoints
  async getTeamMembers() {
    return this.request<any[]>("/api/public/team");
  }

  async getTestimonials() {
    return this.request<any[]>("/api/public/testimonials");
  }

  async getInvestmentOptions() {
    return this.request<any[]>("/api/public/investments");
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request<{ user: any; accessToken: string; refreshToken: string }>(
      "/api/auth/login",
      {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }
    );
  }

  async register(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) {
    return this.request<{ user: any }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async logout() {
    const response = await this.request<void>("/api/auth/logout", {
      method: "POST",
    });
    this.clearToken();
    return response;
  }

  async refreshToken(refreshToken: string) {
    return this.request<{ accessToken: string; refreshToken: string }>(
      "/api/auth/refresh-token",
      {
        method: "POST",
        body: JSON.stringify({ refreshToken }),
      }
    );
  }

  // User endpoints
  async getProfile() {
    return this.request<any>("/api/profile");
  }

  async updateProfile(data: any) {
    return this.request<any>("/api/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async getTransactions() {
    return this.request<any[]>("/api/transactions");
  }

  async getInvestments() {
    return this.request<any[]>("/api/investments");
  }

  async getNotifications() {
    return this.request<any[]>("/api/notifications");
  }

  async markNotificationAsRead(id: string) {
    return this.request<void>(`/api/notifications/${id}/read`, {
      method: "PATCH",
    });
  }

  async getSupportTickets() {
    return this.request<any[]>("/api/support");
  }

  async createSupportTicket(data: {
    subject: string;
    category: string;
    priority: string;
    message: string;
  }) {
    return this.request<any>("/api/support", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getProperties() {
    return this.request<any[]>("/api/properties");
  }

  async getFeaturedProperties() {
    return this.request<any[]>("/api/properties/featured");
  }

  async getReferralStats() {
    return this.request<any>("/api/referral");
  }

  async getSettings() {
    return this.request<any>("/api/settings");
  }

  async updateSettings(data: any) {
    return this.request<any>("/api/settings", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async getSessions() {
    return this.request<any[]>("/api/sessions");
  }

  async terminateSession(id: string) {
    return this.request<void>(`/api/sessions/${id}`, {
      method: "DELETE",
    });
  }
}

// Export singleton instance
export const api = new ApiClient();
