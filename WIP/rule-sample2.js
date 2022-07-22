function rule(user, context, callback) {

  console.log("DEBUG: rule2");

  const { log, commitLogs, showLogs } = global.loggerFactory();

  try {

    commitLogs();

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