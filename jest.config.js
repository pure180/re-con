module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: { '@exmpl/(.*)': '<rootDir>/src/$1' },
  modulePathIgnorePatterns: ['<rootDir>/src/__tests__/fixtures'],
};
