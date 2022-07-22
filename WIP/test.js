global.configuration = {
  logBufferThreshold: "10",
  logSamplingRate: "0.3",
  enableLogSampling: "true"
}

const rules = [
  require("./rule-bootstrap-loggerFactory"),
  require("./rule-sample1"),
  // require("./rule-sample2")
]

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
  context3: {
    user: {
      email: "db3@test.com"
    },
    context: {},
    callback: () => { console.log("TEST: context3 callback"); }
  },
  context4: {
    user: {
      email: "db4@test.com"
    },
    context: {},
    callback: () => { console.log("TEST: context4 callback"); }
  },
}

const describe = (msg, fn) => {
  console.log("=== " + msg + " ===")
  fn();
  console.log("")
}

console.log("TEST: Starting.")

describe("Flow 1", () => {
  for (let rule of rules) { rule(mockObj.context1.user, mockObj.context1.context, mockObj.context1.callback) }
})
describe("Flow 2", () => {
  for (let rule of rules) { rule(mockObj.context2.user, mockObj.context2.context, mockObj.context2.callback) }
})
describe("Flow 3", () => {
  for (let rule of rules) { rule(mockObj.context3.user, mockObj.context3.context, mockObj.context3.callback) }
})
describe("Flow 4", () => {
  for (let rule of rules) { rule(mockObj.context4.user, mockObj.context4.context, mockObj.context4.callback) }
})

console.log("TEST: Finished.")
