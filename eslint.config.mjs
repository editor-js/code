import Codex from "eslint-config-codex";
import { plugin as TsPlugin, parser as TsParser } from 'typescript-eslint';

export default [
  ...Codex,
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parser: TsParser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: './',
        sourceType: 'module',
      },
    },
    rules: {
      'n/no-missing-import': ['off'],
      'n/no-unsupported-features/node-builtins': ['off'],
      'jsdoc/require-returns-description': ['off'],
      '@typescript-eslint/naming-convention': [
        'error',
        {
          'selector': 'variable',
          'format': ['camelCase'],
          'leadingUnderscore': 'allow'
        },
      ],
      '@typescript-eslint/no-unsafe-member-access': ['off'],
      '@typescript-eslint/no-restricted-types': ['error',
        {
          'types': {
            'String': "Use 'string' instead.",
            'Boolean': "Use 'boolean' instead.",
            'Number': "Use 'number' instead.",
            'Symbol': "Use 'symbol' instead.",
            'Object': "Use 'object' instead, or define a more specific type.",
            'Function': "Use a specific function type instead, like '(arg: type) => returnType'."
          }
        }
      ]
    }
  },
  {
    ignores: ['dev/**', 'eslint.config.mjs', 'vite.config.js', 'postcss.config.js']
  }
];