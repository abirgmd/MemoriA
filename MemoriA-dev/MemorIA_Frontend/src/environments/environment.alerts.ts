/**
 * Configuration des environnements - MemoriA Alerts
 * À placer dans src/environments/
 */

// ===== DEVELOPMENT ENVIRONMENT =====
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8089',
  apiTimeout: 30000,

  // Configuration des alertes
  alerts: {
    pollingInterval: 30000,  // 30 secondes
    pageSize: 20,
    archiveAfterDays: 30,
    cleanupSchedule: '0 0 2 * * *' // 2h du matin chaque jour
  },

  // Logging
  logging: {
    level: 'DEBUG',
    enableConsole: true,
    enableFile: false
  }
};

// ===== PRODUCTION ENVIRONMENT =====
export const environmentProd = {
  production: true,
  apiUrl: 'https://api.memoria.com',
  apiTimeout: 30000,

  alerts: {
    pollingInterval: 60000,  // 1 minute
    pageSize: 20,
    archiveAfterDays: 30,
    cleanupSchedule: '0 0 2 * * *'
  },

  logging: {
    level: 'ERROR',
    enableConsole: false,
    enableFile: true
  }
};

// ===== STAGING ENVIRONMENT =====
export const environmentStaging = {
  production: false,
  apiUrl: 'https://staging-api.memoria.com',
  apiTimeout: 30000,

  alerts: {
    pollingInterval: 30000,
    pageSize: 20,
    archiveAfterDays: 30,
    cleanupSchedule: '0 0 2 * * *'
  },

  logging: {
    level: 'INFO',
    enableConsole: true,
    enableFile: true
  }
};

