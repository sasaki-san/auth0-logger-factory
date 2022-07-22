function boostrapRule(user, context, callback) {

  console.log("DEBUG: bootstrap logger factory");

  const config = {
    bufferThreshold: 10,
    sampleLogs: true,
    samplingRate: 0.2
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

    const generateRandomIndexWithinArray = (arry) => {
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
      const min = Math.ceil(0);
      const max = Math.floor(arry.length - 1);
      return Math.floor(Math.random() * (max - min + 1) + min);
    };

    const sampleLogs = (targetLogs) => {
      const sampleCount = Math.round(targetLogs.length * config.samplingRate);
      if (sampleCount === targetLogs.length) {
        return targetLogs;
      }

      let sampleIndexes = [];

      // generate a set of sample indexes
      for (let i = 0; i < sampleCount; i++) {
        sampleIndexes.push(generateRandomIndexWithinArray(targetLogs));
      }
      // remove duplicate indexes
      sampleIndexes = [...new Set(sampleIndexes)];
      // sort
      sampleIndexes.sort();

      console.log("DEBUG: Sampling the logs in these indexes: " + sampleIndexes);

      const sampledLogs = [];
      for (let i = 0; i < sampleIndexes.length; i++) {
        sampledLogs.push(targetLogs[sampleIndexes[i]]);
      }

      return sampledLogs;
    };

    const commitLogs = (ignoreSampling) => {
      if (logs.length === 0)
        return;

      // create a copy of the array
      let targetLogs = logs.slice();

      // reset logs
      resetLogs();

      // take samples if necessary
      if (!ignoreSampling && config.sampleLogs) {
        targetLogs = sampleLogs(targetLogs);
      }

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
       * log a single message to the cache
       *
       * @param message - mesage to send to sumo
       * @returns {number}
       */
      log: (message) => {

        logs.push(message);

        if (hasBufferThresholdReached()) {
          commitLogs();
        }
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