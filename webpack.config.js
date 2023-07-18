// @ts-check
/// <reference types="./types/global.d.ts" />

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = /** @type { import('webpack').Configuration } */ ({
  entry: {
    main: process.env.SCENE?.replace('\\', '/') || './src/index.ts',
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        phaser: {
          test: /[\\/]node_modules[\\/]phaser[\\/]/,
          name: 'phaser',
          chunks: 'all',
        },
      },
    },
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name]-[contenthash].bundle.js',
    assetModuleFilename: 'asset-packs/[name]-[hash][ext][query]',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.json/,
        type: 'asset/resource',
        exclude: /node_modules/,
      },
      process.env.NODE_ENV === 'production'
        ? {
            test: /\.js$/,
            loader: 'string-replace-loader',
            options: {
              multiple: [
                {
                  search: 'typeof CANVAS_RENDERER',
                  replace: JSON.stringify(false),
                },
                {
                  search: 'typeof WEBGL_RENDERER',
                  replace: JSON.stringify(true),
                },
                {
                  search: 'typeof WEBGL_DEBUG',
                  replace: JSON.stringify(false),
                },
                {
                  search: 'typeof EXPERIMENTAL',
                  replace: JSON.stringify(true),
                },
                {
                  search: 'typeof PLUGIN_CAMERA3D',
                  replace: JSON.stringify(false),
                },
                {
                  search: 'typeof PLUGIN_FBINSTANT',
                  replace: JSON.stringify(false),
                },
                {
                  search: 'typeof FEATURE_SOUND',
                  replace: JSON.stringify(true),
                },
              ],
            },
          }
        : undefined,
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  devServer: {
    historyApiFallback: true,
    allowedHosts: 'all',
    static: {
      directory: path.resolve(__dirname, './dist'),
    },
    open: true,
    port: 8080,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src/index.html'),
      minify: false,
    }),
    new CleanWebpackPlugin(),
    new CopyPlugin({
      patterns: [
        {
          from: 'static',
        },
      ],
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
});
