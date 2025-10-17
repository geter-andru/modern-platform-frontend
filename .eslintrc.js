module.exports = {
  extends: [
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  plugins: ['@typescript-eslint', 'import'],
  root: true,
  rules: {
    // MANDATORY: No .jsx files allowed
    'react/jsx-filename-extension': ['error', { extensions: ['.tsx'] }],
    
    // MANDATORY: TypeScript strict mode
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-unused-vars': ['error', { 
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_'
    }],
    '@typescript-eslint/explicit-function-return-type': ['error', {
      allowExpressions: true,
      allowTypedFunctionExpressions: true,
      allowHigherOrderFunctions: true,
      allowDirectConstAssertionInArrowFunctions: true,
    }],
    '@typescript-eslint/no-non-null-assertion': 'error',
    '@typescript-eslint/strict-boolean-expressions': 'error',
    '@typescript-eslint/no-floating-promises': 'error',
    '@typescript-eslint/no-misused-promises': 'error',
    '@typescript-eslint/await-thenable': 'error',
    '@typescript-eslint/no-unnecessary-type-assertion': 'error',
    '@typescript-eslint/prefer-nullish-coalescing': 'error',
    '@typescript-eslint/prefer-optional-chain': 'error',
    
    // PREVENT MOCK DATA
    'no-restricted-syntax': [
      'error',
      {
        selector: "Identifier[name=/^(mock|fake|dummy|test)(Data|Values|Items|Results)?$/i]",
        message: "Mock/fake/dummy/test data not allowed in production code. Use real data from services."
      },
      {
        selector: "CallExpression[callee.name='console'][arguments.0.value=/mock|fake|dummy|test/i]",
        message: "Console statements with test/mock references not allowed."
      }
    ],
    
    // FORCE PROPER IMPORTS
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['../../../*', '../../../../*'],
            message: 'Deep relative imports not allowed. Use absolute imports from @/ or refactor structure.'
          }
        ]
      }
    ],
    'import/no-relative-parent-imports': 'error',
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true
        }
      }
    ],
    
    // MANDATORY COMPONENT STRUCTURE
    'react/function-component-definition': [
      'error',
      {
        namedComponents: 'arrow-function',
        unnamedComponents: 'arrow-function'
      }
    ],
    'react/prop-types': 'off', // TypeScript handles this
    'react/require-default-props': 'off', // TypeScript handles this
    
    // ADDITIONAL QUALITY RULES
    'no-console': ['error', { allow: ['warn', 'error'] }],
    'no-debugger': 'error',
    'no-alert': 'error',
    'no-var': 'error',
    'prefer-const': 'error',
    'eqeqeq': ['error', 'always'],
    'curly': ['error', 'all'],
    
    // ASYNC/PROMISE HANDLING
    'require-await': 'error',
    'no-return-await': 'error',
    'prefer-promise-reject-errors': 'error',
    
    // SECURITY
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-new-func': 'error',
    'no-script-url': 'error',
    
    // NEXT.JS SPECIFIC
    '@next/next/no-html-link-for-pages': 'error',
    '@next/next/no-img-element': 'error',
  },
  overrides: [
    {
      // Allow console in server-side code
      files: ['**/api/**/*.ts', '**/server/**/*.ts', '**/scripts/**/*.ts'],
      rules: {
        'no-console': 'off'
      }
    },
    {
      // Test files can use test data
      files: ['**/__tests__/**/*', '**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', '**/*.spec.tsx'],
      rules: {
        'no-restricted-syntax': 'off',
        '@typescript-eslint/no-explicit-any': 'off'
      }
    }
  ],
  ignorePatterns: [
    'node_modules/',
    '.next/',
    'out/',
    'public/',
    '*.config.js',
    '*.config.mjs',
    'coverage/',
    'dist/',
    'build/'
  ]
}