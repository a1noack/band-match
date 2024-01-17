// // webpack.config.js
// module.exports = {
//   // ...
//   resolve: {
//     fallback: {
//       "util": require.resolve("util/"),
//       "buffer": require.resolve("buffer/"),
//       "stream": require.resolve("stream-browserify")
//     }
//   },
//   // ...
// };
module.exports = {
  resolve: {
    // ...
    // add the fallback setting below
    fallback: {
      fs: false,
      os: false,
      path: false,
      crypto: false,
    },
    // ...
  },
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
    ],
  },
};
