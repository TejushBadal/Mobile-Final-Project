import { LogBox } from 'react-native';

const COLORS = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
  bold: '\x1b[1m',
};

class DevLogger {
  constructor(customConfig = {}) {
    this.config = {
      showLogBox: true,
      enableColors: true,
      showTimestamp: true,
      showLogLevel: true,
      prefix: '🏪 STORE',
      ...customConfig
    };

    LogBox.ignoreLogs([
      'Non-serializable values were found in the navigation state',
      'Warning: Cannot update a component',
    ]);
  }

  formatMessage(level, message, data) {
    const { enableColors, showTimestamp, showLogLevel, prefix } = this.config;

    const timestamp = showTimestamp
      ? `${enableColors ? COLORS.gray : ''}[${new Date().toLocaleTimeString()}]${enableColors ? COLORS.reset : ''} `
      : '';

    const levelBadges = {
      debug: `${enableColors ? COLORS.gray : ''}🔍 DEBUG${enableColors ? COLORS.reset : ''}`,
      info: `${enableColors ? COLORS.blue : ''}ℹ️  INFO${enableColors ? COLORS.reset : ''}`,
      warn: `${enableColors ? COLORS.yellow : ''}⚠️  WARN${enableColors ? COLORS.reset : ''}`,
      error: `${enableColors ? COLORS.red : ''}❌ ERROR${enableColors ? COLORS.reset : ''}`,
      success: `${enableColors ? COLORS.green : ''}✅ SUCCESS${enableColors ? COLORS.reset : ''}`
    };

    const levelBadge = showLogLevel ? `${levelBadges[level]} ` : '';
    const coloredPrefix = enableColors
      ? `${COLORS.cyan}${COLORS.bold}${prefix}${COLORS.reset} `
      : `${prefix} `;
    const formattedData = data ? `\n${JSON.stringify(data, null, 2)}` : '';

    return `${timestamp}${coloredPrefix}${levelBadge}${message}${formattedData}`;
  }

  debug(message, data) {
    if (__DEV__) {
      console.log(this.formatMessage('debug', message, data));
    }
  }

  info(message, data) {
    console.log(this.formatMessage('info', message, data));
  }

  warn(message, data) {
    const formatted = this.formatMessage('warn', message, data);
    console.warn(formatted);
    if (this.config.showLogBox && __DEV__) {
      console.warn(`${this.config.prefix}: ${message}`, data);
    }
  }

  error(message, error) {
    const formatted = this.formatMessage('error', message, error);
    console.error(formatted);
    if (this.config.showLogBox && __DEV__) {
      console.error(`${this.config.prefix}: ${message}`, error);
    }
  }

  success(message, data) {
    console.log(this.formatMessage('success', message, data));
  }

  action(actionType, payload) {
    this.debug(`🎬 Action Dispatched: ${actionType}`, payload);
  }

  asyncStart(operation, params) {
    this.info(`⏳ Starting async operation: ${operation}`, params);
  }

  asyncSuccess(operation, result) {
    this.success(`✨ Async operation completed: ${operation}`, result);
  }

  asyncError(operation, error) {
    this.error(`💥 Async operation failed: ${operation}`, error);
  }
}

export const logger = new DevLogger();
export const authLogger = new DevLogger({ prefix: '🔐 AUTH' });
export const storeLogger = new DevLogger({ prefix: '🏪 REDUX' });
export const apiLogger = new DevLogger({ prefix: '🌐 API' });

export const log = {
  debug: (msg, data) => logger.debug(msg, data),
  info: (msg, data) => logger.info(msg, data),
  warn: (msg, data) => logger.warn(msg, data),
  error: (msg, error) => logger.error(msg, error),
  success: (msg, data) => logger.success(msg, data),

  auth: {
    login: (email) => authLogger.asyncStart('User Login', { email }),
    loginSuccess: (user) => authLogger.asyncSuccess('User Login', { user: user.name }),
    loginError: (error) => authLogger.asyncError('User Login', error),
    logout: () => authLogger.info('User Logout'),
    tokenVerify: (token) => authLogger.asyncStart('Token Verification', { tokenLength: token.length })
  },

  redux: {
    action: (type, payload) => storeLogger.action(type, payload),
  },

  api: {
    request: (url, method, data) => apiLogger.asyncStart(`${method} ${url}`, data),
    response: (url, status, data) => apiLogger.asyncSuccess(`API Response ${status}`, { url, data }),
    error: (url, error) => apiLogger.asyncError(`API Error`, { url, error })
  }
};

export default logger;