import Redis from 'ioredis';

let redis: Redis | null = null;
let redisAvailable = false;

// Only try to connect if REDIS_URL is provided
if (process.env.REDIS_URL) {
  try {
    redis = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: 3,
      enableReadyCheck: false,
      lazyConnect: true,
      retryStrategy: (times: number) => {
        if (times > 3) {
          console.warn('Redis connection failed - running without cache');
          return null;
        }
        return Math.min(times * 200, 2000);
      }
    });

    redis.on('connect', () => {
      console.log('Redis connected successfully');
      redisAvailable = true;
    });

    redis.on('error', (err) => {
      console.warn('Redis not available:', err.message);
      redisAvailable = false;
    });
  } catch (error) {
    console.warn('Redis initialization failed - running without cache');
    redis = null;
  }
} else {
  console.log('Redis URL not configured - running without cache (development mode)');
}

// Create mock Redis client for development
const mockRedis = {
  get: async () => null,
  set: async () => 'OK',
  setex: async () => 'OK',
  del: async () => 1,
  keys: async () => [],
  ping: async () => 'PONG',
  quit: async () => 'OK',
} as any;

export default redis || mockRedis;
export { redisAvailable };

// Redis key patterns
export const RedisKeys = {
  seatLock: (showtimeId: string, userId: string) => `lock:showtime:${showtimeId}:user:${userId}`,
  seatLockPattern: (showtimeId: string) => `lock:showtime:${showtimeId}:*`,
  tmdbMovies: (page: number) => `tmdb:movies:page:${page}`,
  showtimeSeats: (showtimeId: string) => `showtime:${showtimeId}:seats`,
};
