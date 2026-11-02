import pluginVitest from '@vitest/eslint-plugin'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import { globalIgnores } from 'eslint/config'
import pluginPlaywright from 'eslint-plugin-playwright'
import pluginVue from 'eslint-plugin-vue'
import pluginVueA11y from 'eslint-plugin-vuejs-accessibility'

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{js,mjs,ts,mts,tsx,vue}'],
  },

  globalIgnores([
    '**/dist/**',
    '**/dev-dist/**',
    '**/coverage/**',
    'playwright-report/**',
    'test-results/**',
  ]),

  pluginVue.configs['flat/recommended'],
  vueTsConfigs.recommended,
  ...pluginVueA11y.configs['flat/recommended'],

  {
    ...pluginVitest.configs.recommended,
    files: ['src/**/__tests__/*'],
  },

  {
    ...pluginPlaywright.configs['flat/recommended'],
    files: ['e2e/**/*.{test,spec}.{js,ts}'],
    rules: {
      ...pluginPlaywright.configs['flat/recommended'].rules,
      // Tests may skip themselves when the content they need doesn't exist yet
      // (e.g. no video has captions), but not unconditionally.
      'playwright/no-skipped-test': ['warn', { allowConditional: true }],
    },
  },

  // Turns off rules that conflict with Prettier — keep last.
  skipFormatting,
)
