function mybusinesslogic(user, context, callback) {

  console.log("DEBUG: rule1")

  const { log, commitLogs, showLogs } = global.loggerFactory();

  try {
    // do business logic
    log("step 1 for user: " + user.email);
    // more logic
    log("step 2 for user: " + user.email);

    log("finished success");

  } catch (e) {
    log("facing exception", e);

    // pass ignoreSampling = true to commit all log entries
    commitLogs(true);

  } finally {
    // resetLogs();

    // debug
    showLogs();
  }

  return callback(null, user, context);
}

// For testing
module.exports = mybusinesslogic