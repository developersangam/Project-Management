const isProd = process.env.NODE_ENV === "production";

const logger = {
  info(message, meta = {}) {
    console.log(`ℹ️  ${message}`, meta);
  },

  warn(message, meta = {}) {
    console.warn(`⚠️  ${message}`, meta);
  },

  error(message, meta = {}) {
    console.error(`❌ ${message}`, meta);
  },

  debug(message, meta = {}) {
    if (!isProd) {
      console.debug(`🐛 ${message}`, meta);
    }
  },
};

export default logger;
