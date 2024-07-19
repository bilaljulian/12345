// postcss.config.js

module.exports = {
  plugins: [
    // Autoprefixer adds vendor prefixes to CSS rules for better browser compatibility
    require('autoprefixer'),

    // CSSnano is used for minifying CSS
    require('cssnano')({
      preset: 'default',
    }),

    // PostCSS Import allows you to use @import statements in your CSS
    require('postcss-import'),

    // PostCSS Nested allows you to use nested rules
    require('postcss-nested'),

    // PostCSS Preset Env allows you to use future CSS features
    require('postcss-preset-env')({
      stage: 1, // Adjust the stage according to your needs
    }),
  ],
};
npm install postcss-import postcss-nested postcss-preset-env autoprefixer cssnano
