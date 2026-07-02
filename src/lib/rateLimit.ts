export class RateLimiter {
  private store = new Map<string, { count: number; expiresAt: number }>();
  private windowMs: number;
  private maxLimit: number;

  constructor(windowMs: number, maxLimit: number) {
    this.windowMs = windowMs;
    this.maxLimit = maxLimit;
    
    // Automatically clean up expired entries every 5 minutes
    if (typeof setInterval !== 'undefined') {
      setInterval(() => this.cleanup(), 5 * 60 * 1000);
    }
  }

  /**
   * Check if the identifier is rate limited
   * @param identifier Can be IP address or User PIN
   * @returns { success: boolean }
   */
  public limit(identifier: string): { success: boolean } {
    const now = Date.now();
    const record = this.store.get(identifier);

    if (!record) {
      this.store.set(identifier, { count: 1, expiresAt: now + this.windowMs });
      return { success: true };
    }

    if (now > record.expiresAt) {
      this.store.set(identifier, { count: 1, expiresAt: now + this.windowMs });
      return { success: true };
    }

    if (record.count >= this.maxLimit) {
      return { success: false };
    }

    record.count += 1;
    this.store.set(identifier, record);
    return { success: true };
  }

  /**
   * Periodically clean up expired entries to prevent memory leaks
   */
  public cleanup() {
    const now = Date.now();
    for (const [key, record] of this.store.entries()) {
      if (now > record.expiresAt) {
        this.store.delete(key);
      }
    }
  }
}
