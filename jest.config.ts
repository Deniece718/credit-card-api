import { createDefaultPreset } from 'ts-jest';

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
export default {
  rootDir: 'src',
  moduleDirectories: ['node_modules', 'src'],
  testEnvironment: 'node',
  transform: {
    ...tsJestTransformCfg,
  },
};
