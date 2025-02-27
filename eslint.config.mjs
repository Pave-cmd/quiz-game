// eslint.config.mjs
import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import eslintConfigPrettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import jest from 'eslint-plugin-jest';
import a11y from 'eslint-plugin-jsx-a11y';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import security from 'eslint-plugin-security';
import sonarjs from 'eslint-plugin-sonarjs';
import tailwindcss from 'eslint-plugin-tailwindcss';
import testingLibrary from 'eslint-plugin-testing-library';
import unusedImports from 'eslint-plugin-unused-imports';

export default [
  {
    ignores: ['dist/*', 'build/*', 'node_modules/*']
  },
  {
    files: ['**/*.{js,jsx,ts,tsx,mjs}'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true
        },
        project: './tsconfig.json',  // Přidáno
        tsconfigRootDir: '.',        // Přidáno
      }
    },
    settings: {
      react: {
        version: 'detect'
      },
      'import/resolver': {
        typescript: {
          project: './tsconfig.json'
        },
        node: true
      }
    },
    plugins: {
      '@typescript-eslint': typescript,
      'react': react,
      'react-hooks': reactHooks,
      'import': importPlugin,
      'unused-imports': unusedImports,
      'sonarjs': sonarjs,
      'security': security,
      'tailwindcss': tailwindcss,
      'jsx-a11y': a11y,
      'testing-library': testingLibrary,
      'jest': jest
    },
    rules: {
      // Code Cleanup & Optimalizace
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        { 
          vars: 'all', 
          varsIgnorePattern: '^_', 
          args: 'after-used', 
          argsIgnorePattern: '^_' 
        }
      ],
      'no-duplicate-imports': 'error',
      'import/no-cycle': 'error',
      'import/no-self-import': 'error',
      'sonarjs/no-duplicate-string': 'error',
      'sonarjs/cognitive-complexity': ['error', 15],
      'sonarjs/no-identical-functions': 'error',

      // TypeScript pravidla - zjednodušeno
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-module-boundary-types': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_'
      }],
      '@typescript-eslint/no-non-null-assertion': 'warn',

      // React pravidla
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react/jsx-no-leaked-render': 'error',
      'react/jsx-max-depth': ['error', { max: 4 }],
      'react/function-component-definition': [
        'error',
        { namedComponents: 'arrow-function' }
      ],
      'react/jsx-no-useless-fragment': 'error',
      'react/jsx-curly-brace-presence': 'error',
      'react/no-array-index-key': 'warn',

      // Performance
      'react/jsx-no-constructed-context-values': 'warn',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'react/jsx-no-bind': ['warn', {
        allowArrowFunctions: true,
        allowFunctions: false,
        allowBind: false,
      }],

      // Security
      'security/detect-object-injection': 'warn',
      'security/detect-non-literal-regexp': 'warn',
      'security/detect-unsafe-regex': 'error',
      'react/jsx-no-script-url': 'error',
      'react/jsx-no-target-blank': 'error',

      // Testing
      'testing-library/await-async-queries': 'error',
      'testing-library/no-await-sync-queries': 'error',
      'testing-library/prefer-screen-queries': 'error',
      'jest/valid-expect': 'error',
      'jest/prefer-to-be': 'error',

      // Styling a Tailwind
      'tailwindcss/classnames-order': 'error',
      'tailwindcss/enforces-negative-arbitrary-values': 'error',
      'tailwindcss/enforces-shorthand': 'error',
      'tailwindcss/migration-from-tailwind-2': 'error',
      'tailwindcss/no-custom-classname': 'warn',

      // Accessibility
      'jsx-a11y/alt-text': 'error',
      'jsx-a11y/aria-props': 'error',
      'jsx-a11y/aria-role': 'error',
      'jsx-a11y/role-has-required-aria-props': 'error',
      'jsx-a11y/click-events-have-key-events': 'warn',
      'jsx-a11y/no-static-element-interactions': 'warn',

      // Import organizace
      'import/order': ['error', {
        'groups': [
          'builtin',
          'external',
          'internal',
          ['parent', 'sibling'],
          'index',
          'object',
          'type'
        ],
        'pathGroups': [
          {
            'pattern': 'react',
            'group': 'builtin',
            'position': 'before'
          },
          {
            'pattern': '@/**',
            'group': 'internal',
            'position': 'after'
          }
        ],
        'pathGroupsExcludedImportTypes': ['react'],
        'newlines-between': 'always',
        'alphabetize': {
          'order': 'asc',
          'caseInsensitive': true
        }
      }],

      // Obecná pravidla
      'no-var': 'error',
      'prefer-const': 'error',
      'eqeqeq': 'error',
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'prefer-template': 'error',
      'no-param-reassign': 'error',
      'max-params': ['error', 3],
    }
  },
  eslintConfigPrettier
];