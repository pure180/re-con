module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: { '@exmpl/(.*)': '<rootDir>/src/$1' },
  testPathIgnorePatterns: [
    '<rootDir>/src/__tests__/fixtures/',
    '<rootDir>/build',
  ],
};
