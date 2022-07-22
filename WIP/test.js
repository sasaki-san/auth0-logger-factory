this.global = {}

const bootstrap = require("./rule-bootstrap-loggerFactory")
const rule1 = require("./rule-sample1")

const mockObj = {
  context1: {
    user: {
      email: "db1@test.com"
    },
    context: {},
    callback: () => { console.log("TEST: context1 callback"); }
  },
  context2: {
    user: {
      email: "db2@test.com"
    },
    context: {},
    callback: () => { console.log("TEST: context2 callback"); }
  },
}

console.log("TEST: Starting.")

bootstrap(mockObj.context1.user, mockObj.context1.context, mockObj.context1.callback);
rule1(mockObj.context1.user, mockObj.context1.context, mockObj.context1.callback)
bootstrap(mockObj.context2.user, mockObj.context2.context, mockObj.context2.callback);
rule1(mockObj.context2.user, mockObj.context2.context, mockObj.context2.callback)

console.log("TEST: Finished.")
