export const logger = {
  info: (message: string, context?: Record<string, unknown>) => {
    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      level: 'INFO',
      message,
      ...(context ? sanitizeContext(context) : {}),
    }));
  },
  warn: (message: string, context?: Record<string, unknown>) => {
    console.warn(JSON.stringify({
      timestamp: new Date().toISOString(),
      level: 'WARN',
      message,
      ...(context ? sanitizeContext(context) : {}),
    }));
  },
  error: (message: string, error?: unknown, context?: Record<string, unknown>) => {
    console.error(JSON.stringify({
      timestamp: new Date().toISOString(),
      level: 'ERROR',
      message,
      error: error instanceof Error ? { name: error.name, message: error.message, stack: error.stack } : error,
      ...(context ? sanitizeContext(context) : {}),
    }));
  },
};

function sanitizeContext(context: Record<string, unknown>): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(context)) {
    const lowerKey = key.toLowerCase();
    if (
      lowerKey.includes('password') ||
      lowerKey.includes('token') ||
      lowerKey.includes('secret') ||
      lowerKey.includes('key') ||
      lowerKey.includes('card') ||
      lowerKey.includes('cvv') ||
      lowerKey.includes('pin')
    ) {
      sanitized[key] = '[REDACTED]';
    } else if (lowerKey.includes('pan') && typeof value === 'string') {
      sanitized[key] = maskPAN(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}

export function maskPAN(pan: string): string {
  if (!pan || pan.length !== 10) return 'XXXXXXXXXX';
  return `${pan.substring(0, 2)}******${pan.substring(8)}`;
}
