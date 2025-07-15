class LoggerService {
  info(message) {
    console.log(`INFO: ${message}`);
  }

  warn(message) {
    console.warn(`WARN: ${message}`);
  }

  error(message) {
    console.error(`ERROR: ${message}`);
  }
}

export default LoggerService;
