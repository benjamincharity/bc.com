type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: unknown;
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: LogContext;
  environment?: string;
}

/**
 * Structured logger with sensitive data protection
 */
class Logger {
  private readonly isDevelopment: boolean;
  private readonly environment: string;

  constructor() {
    this.isDevelopment = import.meta.env.DEV;
    this.environment = import.meta.env.MODE || 'production';
  }

  debug(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      this.log('debug', message, context);
    }
  }

  info(message: string, context?: LogContext): void {
    this.log('info', message, context);
  }

  warn(message: string, context?: LogContext): void {
    this.log('warn', message, context);
  }

  error(message: string, context?: LogContext): void {
    this.log('error', message, context);
  }

  private log(level: LogLevel, message: string, context?: LogContext): void {
    const sanitizedContext = this.isDevelopment
      ? context
      : this.sanitizeContext(context);

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...(sanitizedContext && Object.keys(sanitizedContext).length > 0 && {
        context: sanitizedContext
      }),
      ...(this.isDevelopment && { environment: this.environment }),
    };

    // Structured JSON in production, pretty in development
    if (this.isDevelopment) {
      console[level === 'debug' ? 'log' : level](
        `[${entry.timestamp}] ${level.toUpperCase()}: ${message}`,
        context || ''
      );
    } else {
      console[level === 'debug' ? 'log' : level](JSON.stringify(entry));
    }
  }

  /**
   * Sanitize sensitive data from context
   */
  private sanitizeContext(context?: LogContext): LogContext | undefined {
    if (!context) return undefined;

    const sanitized: LogContext = {};
    const sensitiveKeys = [
      'password',
      'token',
      'secret',
      'key',
      'apikey',
      'api_key',
      'authorization',
      'cookie',
      'session',
    ];

    for (const [key, value] of Object.entries(context)) {
      const lowerKey = key.toLowerCase();

      // Redact sensitive keys
      if (sensitiveKeys.some(sk => lowerKey.includes(sk))) {
        sanitized[key] = '[REDACTED]';
        continue;
      }

      // Sanitize nested objects
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        sanitized[key] = this.sanitizeContext(value as LogContext);
      } else if (value instanceof Error) {
        // Log error properties but not full stack in production
        sanitized[key] = {
          message: value.message,
          name: value.name,
        };
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }
}

export const logger = new Logger();
