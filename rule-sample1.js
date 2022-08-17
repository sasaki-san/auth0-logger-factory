function rule(user, context, callback) {

  const d = `trx ${Date.now()}`;
 
  console.log(d + ": DEBUG: rule1");

  const { log, commitLogs, showLogs, hasBufferThresholdReached } = global.loggerFactory();

  try {
    // do business logic
    log(d + ": step 1 for user: " + user.email);
    // more logic
    log(d + ": step 2 for user: " + user.email);

    log(d + ": finished success");

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