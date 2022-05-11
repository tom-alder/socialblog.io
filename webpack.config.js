const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");


module.exports = {
  mode: 'development',
  entry: {
    index: './src/index.js',
    firebasemin: './src/firebasemin.js',
  },
  
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js'
  },
  
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "home.html", to: "" },
        { from: "about.html", to: "" },
        { from: "contact.html", to: "" },
        { from: "index.html", to: "" },
        { from: "thanks.html", to: "" },
        { from: "src", to: "src" },
        { from: "img", to: "img" },
      ],
    }),
  ],
  watch: true,
  experiments: {
    topLevelAwait: true
  },
}
