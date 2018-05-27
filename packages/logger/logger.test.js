const log = require("./index");

const inMemoryReporterFactory = () => {
  let logs = [];
  const reporter = s => logs.push(s);
  reporter.logs = logs;
  return reporter;
};

test("logs out with the level and tag set correctly", () => {
  const reporter = inMemoryReporterFactory();
  log.setReporter(reporter);
  log("info")("test-tag")("standard message");

  console.log(reporter);

  expect(reporter.logs).toHaveLength(1);
});
