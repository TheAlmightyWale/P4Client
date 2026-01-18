module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/test"],
  testMatch: ["**/*.test.ts"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  collectCoverageFrom: [
    "src/Main/Features/P4/**/*.ts",
    "src/Main/Features/Server/**/*.ts",
    "!src/Main/Features/P4/types.ts",
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "html"],
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        useESM: false,
        tsconfig: {
          module: "CommonJS",
          moduleResolution: "node",
          verbatimModuleSyntax: false,
          skipLibCheck: true,
        },
      },
    ],
  },
  // Ignore type checking for tests - we just want to run them
  globals: {
    "ts-jest": {
      diagnostics: {
        ignoreCodes: [2339, 7006],
      },
    },
  },
};
