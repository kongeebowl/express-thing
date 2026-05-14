module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>"],
  testMatch: ["**/__tests__/**/*.test.ts"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  collectCoverageFrom: [
    "controllers/**/*.ts",
    "routes/**/*.ts",
    "middleware/**/*.ts",
    "models/**/*.ts",
    "!**/*.d.ts",
    "!**/node_modules/**",
  ],
  coveragePathIgnorePatterns: ["/node_modules/", "dist/"],
  testPathIgnorePatterns: ["/node_modules/", "dist/"],
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },
  globals: {
    "ts-jest": {
      tsconfig: {
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
      },
    },
  },
};
