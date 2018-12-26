const TEST_REGEX = '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|js?|tsx?|ts?)$';

module.exports = {
  testRegex: TEST_REGEX,
  transform: {
    '^.+\\.tsx?$': 'babel-jest'
  },
  testPathIgnorePatterns: [
    '<rootDir>/.next/',
    '<rootDir>/node_modules/',
    '<rootDir>/src/__test__/.*',
    '<rootDir>/coverage/.*'
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  collectCoverageFrom: [
    '<rootDir>/src/**/*',
    '!**/__tests__/**/*',
    '!**/.next/**/*'
  ],
  /*
   * Turn coverage off by default to speed up test runs. Test coverage reports can be
   * triggered with `npm run test:coverage`
   */
  collectCoverage: false
};
