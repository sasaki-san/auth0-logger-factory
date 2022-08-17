# Logger with Sampling 

A rule logger that comes with the following enhancements and extention points:
- Add your own logic to set a specific transport target (e.g. Cloud Watch)
- Apply sampling rate so as not to overwhelm the transport target. e.g. set the sampling rate = 20% to randomly send only the portion (20%) of the entire logs
- A logger is created as a `global` object and shared across multiple webstask instances

## Create a rule
Create a dedicated rule that creates and registeres a global logger object
- Bootstrap Logger (use `rule-bootstrap-loggerFactory.js`)

## Set configuration variables
Set the following configuration variables to control the logger
- `logBufferThreshold` - Optional. An integer value that determines how many log entries to keep in memory before it flushes. Default to `10` 
- `enableLogSampling` - Optional. A boolean value that drives if sampling is enabled or not. Defualt to `false`
- `logSamplingRate`- Optional. A rate value between 0.0 to 1.0 that determines the log sampling rate. Default to `0.2`

## Create your own appender (transport)
In the Bootstrap Logger Rule, you can implement your custom transport logic in the `appenders` object. Make sure the returned object follows `flush: (logs) => {}` signature.
```
    const appenders = {
      /**
       * Provide a console log appender that sends the logs to console output
       * @returns an instance of log appender
       */
      console: () => {
        return {
          flush: (logs) => {
            // find duplicates
            const unique = [...new Set(logs)];
            if(unique.length < logs.length) {
              console.log("DEBUG: Duplicates found. ");
            }

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

```


## Running Tests
There is a sample test program that you can run to see how it works
```
node test.js
```

