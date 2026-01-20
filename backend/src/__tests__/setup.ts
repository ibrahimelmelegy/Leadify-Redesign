// Simple test setup - no database required (using mocks instead)

// Global test timeout
jest.setTimeout(30000);

// Suppress console logs during tests
if (process.env.SUPPRESS_LOGS !== 'false') {
    global.console = {
        ...console,
        log: jest.fn(),
        debug: jest.fn(),
        info: jest.fn(),
        warn: jest.fn()
    };
}
