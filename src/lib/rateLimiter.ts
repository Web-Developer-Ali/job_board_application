const requestCount: Record<string, { count: number; timestamp: number }> = {};
const RATE_LIMIT = 20; // Max 20 requests per minute
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute in milliseconds

// Rate Limiting function
export const isRateLimited = (ip: string): boolean => {
  const currentTime = Date.now();
  const userData = requestCount[ip] || { count: 0, timestamp: currentTime };

  // Reset count if the window has passed
  if (currentTime - userData.timestamp > RATE_LIMIT_WINDOW) {
    userData.count = 0;
    userData.timestamp = currentTime;
  }

  // Update request count
  userData.count++;

  // Save the data
  requestCount[ip] = userData;

  // Check if rate limit is exceeded
  return userData.count > RATE_LIMIT;
};
