module.exports = {
    plugins: [
      require('tailwindcss'),
      require('postcss-preset-env')({
        stage: 0,
      }),
      require('autoprefixer'),
    ]
  }
  