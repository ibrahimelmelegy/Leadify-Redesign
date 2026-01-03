module.exports = {
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module'
  },
  extends: ['plugin:prettier/recommended'],
  root: true,
  env: {
    node: true,
    jest: true
  },
  'prettier/prettier': [
    'error',
    {
      endOfLine: 'auto'
    }
  ]
};
