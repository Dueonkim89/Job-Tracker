/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
    testEnvironment: "node",
    extensionsToTreatAsEsm: [".ts"],
    preset: "ts-jest/presets/default-esm",
    globals: {
        "ts-jest": {
            useESM: true,
        },
    },
    moduleNameMapper: {
        "^(\\.{1,2}/.*)\\.js$": "$1",
    },
    projects: [
        {
            displayName: "backend",
            testMatch: ["<rootDir>/src/server/**/__tests__/*"],
            preset: "ts-jest/presets/default-esm",
            globalSetup: "<rootDir>/src/server/config/jestGlobalSetup.js",
            globalTeardown: "<rootDir>/src/server/config/jestGlobalTeardown.js",
        },
    ],
};
