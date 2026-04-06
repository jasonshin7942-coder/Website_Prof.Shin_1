// ============================================
// Auth utilities - placeholder for future implementation
// Will be replaced with proper auth (NextAuth, etc.)
// ============================================

const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123', // placeholder - must be replaced
};

export function validateCredentials(username: string, password: string): boolean {
  return username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password;
}

export function createSession(): string {
  // Placeholder - return a mock token
  return `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
}

export function validateSession(token: string | undefined): boolean {
  // Placeholder - in production, validate against DB/JWT
  return !!token && token.startsWith('session_');
}
