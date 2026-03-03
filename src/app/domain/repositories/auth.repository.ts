export interface AuthRepository {
  login(email: string, password: string): Promise<void>;
  logout(): Promise<void>;
  getCurrentUserId(): Promise<string | null>;
}