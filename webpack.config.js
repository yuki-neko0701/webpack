const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const AutoPrefixer = require('autoprefixer');
const HtmlWebPackPlugin = require('html-webpack-plugin');

const MODE = 'production';
const enabledSourceMap = MODE === 'development';

module.exports = {
  mode: 'development',

  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 8080,
    open: true,
  },

  entry: './src/js/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: './js/bundle.js',
  },

  module: {
    rules: [
      // image loader
      {
        test: /\.(gif|png|jpg|eot|wof|woff|ttf|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 100 * 1024, // 100KB以上だったら埋め込まずファイルとして分離する
              name: './img/[name].[ext]',
            },
          },
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              // プリセットを指定することで、ES2019 を ES5 に変換
              '@babel/preset-env',
            ],
          },
        },
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: { minimize: true },
          },
        ],
      },
      // Sassファイルの読み込みとコンパイル
      {
        test: /\.scss/, // 対象となるファイルの拡張子
        use: [
          // CSSファイルを書き出すオプションを有効にする
          {
            loader: MiniCssExtractPlugin.loader,
          },
          // CSSをバンドルするための機能
          {
            loader: 'css-loader',
            options: {
              // オプションでCSS内のurl()メソッドの取り込みを禁止する
              url: false,
              // ソースマップの利用有無
              sourceMap: enabledSourceMap,

              // 0 => no loaders (default);
              // 1 => postcss-loader;
              // 2 => postcss-loader, sass-loader
              importLoaders: 2,
            },
          },
          // PostCss
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: enabledSourceMap,
              plugins: [AutoPrefixer()],
            },
          },
          {
            loader: 'sass-loader',
            options: {
              // ソースマップの利用有無
              sourceMap: enabledSourceMap,
            },
          },
        ],
      },
    ],
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: '/css/main.css',
    }),
    new HtmlWebPackPlugin({
      template: './src/index.html',
      filename: './index.html',
    }),
  ],
};
