module.exports = {
  extends: ['../../../.eslintrc.js'],
  overrides: [
    {
      files: ['*.ts'],
      rules: {
        'no-restricted-imports': ['error', '@offers/commons'],
      },
    },
  ],
};