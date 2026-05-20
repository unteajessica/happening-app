module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    roots: ["<rootDir>"],
    testMatch: ["**/tests/**/*.test.ts"],
    collectCoverageFrom: [
        "src/controllers/**/*.ts",
        "src/routes/**/*.ts",
        "src/validators/**/*.ts",
        "src/app.ts",
        "!src/server.ts"
    ],
    coverageDirectory: "coverage",
    setupFilesAfterEnv: ["<rootDir>/tests/setupDatabase.ts"]
};