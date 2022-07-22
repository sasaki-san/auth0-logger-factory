function rule(user, context, callback) {

  console.log("DEBUG: rule1");

  const { log, commitLogs, showLogs, hasBufferThresholdReached } = global.loggerFactory();

  try {
    // do business logic
    log("step 1 for user: " + user.email);
    // more logic
    log("step 2 for user: " + user.email);

    log("finished success");

    if (hasBufferThresholdReached()) {
      commitLogs();
    }

  } catch (e) {
    log("facing exception", e);

    // pass ignoreSampling = true to commit all log entries
    commitLogs(false);

  } finally {
    // debug
    showLogs();
  }

  return callback(null, user, context);
}

// For testing
module.exports = rule 