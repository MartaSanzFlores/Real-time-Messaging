// jest.config.js
export default {
    moduleFileExtensions: ['js', 'jsx', 'json', 'node'], 
    testEnvironment: 'jest-environment-jsdom',
    transform: {
        '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
      },
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/src/$1',
      '^.+\\.(css|less|scss|sass)$': 'identity-obj-proxy', // Pour les fichiers CSS
      '^.+\\.(svg|png|jpg|jpeg|gif|webp|ico)$': '<rootDir>/__mocks__/fileMock.js', // Pour les fichiers média
    },
    setupFilesAfterEnv: ['<rootDir>/node_modules/@testing-library/jest-dom'],

  };

  