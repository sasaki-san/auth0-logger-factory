function boostrapRule(user, context, callback) {

  /**
   * Create a new Logger instance
   *
   * @returns {{log: (function(*=): number), commitLogs: (function(): void)}}
   */
  global.loggerFactory = global.loggerFactory || function (bufferThreshold) {

    // if a logger instance alrady exists, use it.
    if (global.logger) {
      console.log("global.logger exists. Reusing it");
      return global.logger;
    }

    console.log("global.logger does not exist. Creating one");

    const appenders = {
      /**
       * Provide a console log appender that sends the logs to console output
       * @returns an instance of log appender
       */
      console: () => {
        return {
          flush: (logs) => {
            console.log("Sending logs");
            for (const log of logs) {
              console.log(log);
            }
            console.log("Done sending logs");
          }
        };
      },
      /**
       * Provide a cloudwatch log appender that sends the logs to cloudwatch
       * @returns an instance of log appender
       */
      cloudwatch: () => {
        return {
          flush: (logs) => {
            // ... send logs to cloudwatch
            console.log("logs have been successfully sent to cloudwatch");
          }
        };
      }
    };

    let logs = [];

    const appender = appenders.console();

    const hasBufferThresholdReached = () => {
      return logs.length >= bufferThreshold;
    };

    const commitLogs = () => {
      if (logs.length === 0)
        return;
      appender.flush(logs);
    };

    const resetLogs = () => {
      logs = [];
    };

    global.logger = {
      /**
       * Submit the log cache to sumo
       *
       * @return {(function(): void)}
       */
      commitLogs,

      /**
       * Clear logs
       *
       * @return {(function(): void)}
       */
      resetLogs,

      /**
       * log a single message to the cache
       *
       * @param message - mesage to send to sumo
       * @returns {number}
       */
      log: (message) => {

        logs.push(message);

        if (hasBufferThresholdReached()) {
          commitLogs();
          resetLogs();
        }
      },

      showLogs: () => {
        for (let log of logs) {
          console.log(`DEBUG: ${log}`);
        }
      }
    };

    return global.logger;
  };

  return callback(null, user, context);
}