/* eslint-disable no-unused-vars */
/* eslint-disable comma-dangle */
const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const src = './src';
const dest = '../..';

module.exports = (env, { mode }) => {
  return {
    mode: mode ? mode : 'development',
    entry: './src/main.tsx',
    output: {
      path: path.join(__dirname, '../dist'),
      filename: 'bundle.js'
    },
    devtool: 'source-map',
    resolve: {
      extensions: ['.tsx', '.js', '.ts']
    },
    module: {
      rules: [
        {
          test: /\.t(s|sx)$/,
          use: [{ loader: 'ts-loader' }]
        },
        {
          test: /\.j(s|sx)$/,
          use: [
            {
              loader: 'babel-loader',
              query: {
                plugins: ['transform-runtime'],
                presets: ['es2015']
              }
            }
          ],
          exclude: /node_modules/
        },
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader']
        },
        {
          test: /\.(mp4|webm)$/,
          use: {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]'
            }
          }
        }
      ]
    },
    plugins: [
      new HTMLWebpackPlugin({
        filename: path.join(dest, 'index.html'),
        template: path.join(__dirname, 'src/index.html')
      }),
      new MiniCssExtractPlugin()
    ]
  };
};
