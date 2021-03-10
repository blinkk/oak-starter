const path = require('path');

module.exports = {
  context: __dirname,
  entry: {
    main: './source/js/main.ts',
  },
  resolve: {
    extensions: ['.ts'],
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          configFile: path.resolve(__dirname, './tsconfig.json'),
        },
        include: [path.resolve(__dirname, './source/js/')],
        exclude: /node_modules/,
      },
    ],
  },
  output: {
    path: path.resolve(__dirname, 'dist/js'),
    filename: '[name].min.js',
  },
  stats: 'verbose',
};
