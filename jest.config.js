module.exports = {
  roots: ['<rootDir>/src/classes', '<rootDir>/src/decorators'],
  transform: {
    '^.+\\.(j|t)sx?$': 'ts-jest'
  },
  testRegex: '(.*(\\.|/)(test|spec))\\.tsx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transformIgnorePatterns: [],
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: 'reports'
      }
    ]
  ]
};
