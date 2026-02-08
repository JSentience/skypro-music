import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|scss|sass)$': 'identity-obj-proxy',
  },
};

export default createJestConfig(customJestConfig);

// module.exports = {
//   preset: 'ts-jest',
//   testEnvironment: 'jsdom',
//   globals: {
//     'ts-jest': {
//       tsconfig: 'tsconfig.jest.json',
//     },
//   },
//   setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
//   moduleNameMapper: {
//     '^@/(.*)$': '<rootDir>/src/$1',
//     '\\.(css|scss|sass)$': 'identity-obj-proxy',
//   },
//   transform: {
//     '^.+\\.(ts|tsx)$': 'ts-jest',
//   },
// };
