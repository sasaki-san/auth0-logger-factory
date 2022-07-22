function boostrapRule(user, context, callback) {

  console.log("DEBUG: bootstrap logger factory");

  const config = {
    bufferThreshold: parseInt(configuration.logBufferThreshold || 10),
    sampleLogs: (configuration.sampleLogs.toLocaleLowerCase() === "true") || false,
    samplingRate: parseFloat(configuration.logSamplingRate || 0.2)
  };

  /**
   * Create a new Logger instance
   *
   * @returns {{log: (function(*=): number), commitLogs: (function(): void)}}
   */
  global.loggerFactory = global.loggerFactory || function () {

    // if a logger instance alrady exists, use it.
    if (global.logger) {
      console.log("global.logger exists. Reusing it");
      return global.logger;
    }

    console.log("global.logger does not exist. Creating one");
    console.log("configuration: " + JSON.stringify(config));

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
              console.log("SENT: " + log);
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
      return logs.length >= config.bufferThreshold;
    };

    /**
     * Roll a dice to determine if we need to flush the logs in the current context
     * @returns a boolean value indicating if flushing is required
     */
    const isFlushingRequired = () => {
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
      const min = 0;
      const max = 100;
      const randomNum = Math.floor(Math.random() * (max - min + 1) + min);
      const result = randomNum <= config.samplingRate * 100;
      console.log("DEBUG: isFlushingRequired result: " + result + ", RandomNum: " + randomNum);
      return result;
    };

    const commitLogs = (withSampling = true) => {
      if (logs.length === 0)
        return;

      // determine if flushing the logs is required for the current context
      if (withSampling && config.sampleLogs && !isFlushingRequired()) {
        // do not perform flushing this time.
        console.log("DEBUG: Skipping sending log entries this time");

        // reset logs
        resetLogs();

        return;
      }

      // create a copy of the array
      let targetLogs = logs.slice();

      // reset logs
      resetLogs();

      // transport logs to a target
      appender.flush(targetLogs);
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
       * Determine if the current log entries needs to be flushed
       * 
       * @return a boolean value indicating whether the buffer threshold has reached and need to flush
       */
      hasBufferThresholdReached,

      /**
       * log a single message to the cache
       *
       * @param message - mesage to send to sumo
       * @returns {number}
       */
      log: (message) => {
        logs.push(message);
      },

      showLogs: () => {
        for (let log of logs) {
          console.log(`DEBUG: In buffer => ${log}`);
        }
      }
    };

    return global.logger;
  };

  return callback(null, user, context);
}

// For testing
module.exports = boostrapRule 