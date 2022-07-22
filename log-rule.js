function mybusinesslogic(user, context, callback) {
  const bufferTheshold = 10;
  const { log, commitLogs, resetLogs, showLogs } = global.loggerFactory(bufferTheshold);

  try {
    // do business logic
    log("step 1 for user: " + user.email);
    // more logic
    log("step 2 for user: " + user.email);

    log("finished success");

  } catch (e) {
    log("facing exception", e);
    commitLogs();
  } finally {
    // resetLogs();

    // debug
    showLogs();
  }

  return callback(null, user, context);
}