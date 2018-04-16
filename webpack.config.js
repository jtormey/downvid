const path = require('path')
const webpack = require('webpack')
const env = require('node-env-file')
const HtmlWebpackPlugin = require('html-webpack-plugin')

let resolve = (f) => path.resolve(__dirname, f)

if (process.env.NODE_ENV == null) {
  env('.env')
}

module.exports = {
  mode: process.env.NODE_ENV,
  devtool: false,
  entry: {
    menu: resolve('src/menu.js')
  },
  output: {
    path: resolve('build'),
    filename: '[name].build.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        options: {
          presets: ['react', 'stage-2']
        }
      },
      {
        type: 'javascript/auto',
        test: /\.json$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]'
        }
      }
    ]
  },
  plugins: [
    new webpack.EnvironmentPlugin([
      'NODE_ENV'
    ]),
    new HtmlWebpackPlugin({
      filename: 'menu.html',
      template: resolve('src/menu.html')
    })
  ]
}
