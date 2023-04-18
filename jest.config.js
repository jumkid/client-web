module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'css'],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    '^axios$': require.resolve('axios')
  },
  transform: {
    '^.+\\.(js|jsx|ts|tsx)?$': 'ts-jest'
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/public'],
  collectCoverage: true,
  coverageReporters: ["text"]
};
