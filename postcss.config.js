module.exports = {
  plugins: {
    autoprefixer: {
      flexbox: 'no-2009',
      // Add specific options to suppress the warning
      ignoreWarnings: [
        {
          rule: 'start value has mixed support',
        }
      ]
    }
  }
};