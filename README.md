# Rule Logger Factory

A global logger for rules with the following features:
- Add your own logic to set a specific transport target (e.g. Cloud Watch)
- "Sampling" feature which allows you to randomly select only the portion of the entire logs to be sent. (e.g. set the sampling rate = 20% to probabilistically send only the 20% of the entire logs). This is useful if you don't want to send overwhelming amount of logs to the transport target.
- A logger is created as a `global` object and shared across multiple webstask instances

## Create a rule
Create a dedicated rule that creates and registeres a global logger object
- Bootstrap Logger Rule (use `rule-bootstrap-loggerFactory.js`)

## Set configuration variables
Set the following configuration variables to control the logger
- `logBufferThreshold` 
  - Optional. An integer value that determines how many log entries to keep in memory before it flushes. Default to `10` 
- `enableLogSampling` 
  - Optional. A boolean value that drives if sampling is enabled or not. Defualt to `false`
- `logSamplingRate`
  - Optional. A rate value between 0.0 to 1.0 that determines the log sampling rate. Default to `0.2`

## Implement your own log transport
In the Bootstrap Logger Rule, implement your custom transport logic in the `appenders` object. Ensure that the returned object follows `flush: (logs) => {}` signature.
```javascript
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

    // Set the appender to use
    const appender = appenders.cloudwatch();
```

## Use in rules
```javascript
function rule(user, context, callback) {

  const { log } = global.loggerFactory();

  log("Hello world");

  return callback(null, user, context);
}
```

## Running a test
There is a simple test that you can run to see how it works
```
node test.js
```

