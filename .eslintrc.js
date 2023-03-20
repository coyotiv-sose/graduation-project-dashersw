module.exports = {
  root: true,
  globals: {
    process: true,
  },
  env: {
    node: true,
    browser: true,
    commonjs: true,
    es2021: true,
  },
  parserOptions: {
    ecmaVersion: 'latest',
  },
  extends: ['airbnb-base', 'plugin:prettier/recommended', 'prettier'],
  plugins: ['import', 'prettier'],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'import/newline-after-import': ['error', { count: 1 }],
    'no-unused-vars': ['warn'],
    'prefer-template': ['warn'],
    'class-methods-use-this': ['warn', { exceptMethods: ['profile'], enforceForClassFields: true }],
    'func-names': ['warn', 'as-needed'],
    'prefer-const': ['warn'],
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        arrowParens: 'avoid',
        printWidth: 120,
        semi: false,
        trailingComma: 'es5',
        tabWidth: 2,
        useTabs: false,
      },
    ],
  },
}
