const log = require('./index');

const spy = jest.spyOn(console, 'log');
spy.mockImplementation(_ => null);

describe('logger', () => {
  beforeEach(() => {
    spy.mockReset();
  });

  test('default logging level is NOTICE or more serious', () => {
    log('fatal')('test-tag')('message');
    log('error')('test-tag')('message');
    log('warn')('test-tag')('message');
    log('notice')('test-tag')('message');
    log('info')('test-tag')('message');
    log('debug')('test-tag')('message');
    log('trace')('test-tag')('message');

    expect(spy).toHaveBeenCalledTimes(4);
  });

  test('Logging level can be changed dynamically', () => {
    log('info')('test-tag')('message');
    expect(spy).not.toHaveBeenCalled();

    log.setLevel('info');
    log('info')('test-tag')('message');
    expect(spy).toHaveBeenCalled();

    log.setLevel('notice'); // reset to expected level
  });

  test('Logs out expected data for tag, level and message', () => {
    log('warn')('test-tag')('standard message');

    const logLine = spy.mock.calls[0];
    const payload = JSON.parse(logLine);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(payload).toHaveProperty('tag', 'test-tag');
    expect(payload).toHaveProperty('message', 'standard message');
    expect(payload).toHaveProperty('level', 'WARN');
  });

  test('Adds environment data to logged output', () => {
    log('warn')('test-tag')('standard message');

    const logLine = spy.mock.calls[0];
    const payload = JSON.parse(logLine);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(payload).toHaveProperty('environment', 'test');
    expect(payload).toHaveProperty('pid');
    expect(payload).toHaveProperty('ppid');
    expect(payload).toHaveProperty('timestamp');
    expect(payload).toHaveProperty('dateTime');
    expect(payload).toHaveProperty('platform');
  });

  test('Provides utility function to build a logger with all levels as partially applied functions', () => {
    const logger = log.createLoggers('test');
    expect(logger).toHaveProperty('fatal');
    expect(logger).toHaveProperty('error');
    expect(logger).toHaveProperty('warn');
    expect(logger).toHaveProperty('notice');
    expect(logger).toHaveProperty('info');
    expect(logger).toHaveProperty('debug');
    expect(logger).toHaveProperty('trace');

    logger.notice('testing');

    expect(spy).toHaveBeenCalled();

    const logLine = spy.mock.calls[0];
    const payload = JSON.parse(logLine);

    expect(payload).toHaveProperty('tag', 'test');
    expect(payload).toHaveProperty('message', 'testing');
  });

  test('Merges logged objects into output as "body" property', () => {
    log('fatal')('test-object')({ message: 'this failed', status: 500 });
    expect(spy).toHaveBeenCalledTimes(1);

    const logLine = spy.mock.calls[0];
    const payload = JSON.parse(logLine);
    expect(payload).toHaveProperty('body', {
      message: 'this failed',
      status: 500,
    });
  });

  test('Merges logged numbers into output as "value" property', () => {
    log('fatal')('status-code')(400);
    expect(spy).toHaveBeenCalledTimes(1);

    const logLine = spy.mock.calls[0];
    const payload = JSON.parse(logLine);
    expect(payload).toHaveProperty('value', 400);
  });

  test('Ignores values without a merge strategy', () => {
    log('fatal')('status-code')(new Date());
    log('fatal')('status-code')(null);
    log('fatal')('status-code')(undefined);
    expect(spy).toHaveBeenCalledTimes(3);

    const logLine = spy.mock.calls[0];
    spy.mock.calls.forEach(logLine => {
      const payload = JSON.parse(logLine);
      expect(payload).not.toHaveProperty('value');
      expect(payload).not.toHaveProperty('message');
      expect(payload).not.toHaveProperty('body');
    });
  });
});
