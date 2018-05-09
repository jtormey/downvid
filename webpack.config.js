const path = require('path')
const webpack = require('webpack')
const env = require('node-env-file')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const configureRoutes = require('./src/server/configure-routes')

let resolve = (f) => path.resolve(__dirname, f)

if (process.env.NODE_ENV == null) {
  env('.env')
}

module.exports = {
  mode: process.env.NODE_ENV,
  devtool: false,
  entry: resolve('src/app/menu.js'),
  output: {
    path: resolve('build'),
    publicPath: process.env.PUBLIC_PATH || '/',
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
      },
      {
        test: /\.static\./,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]'
        }
      },
      {
        test: /\.css$/,
        loaders: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new webpack.EnvironmentPlugin([
      'NODE_ENV',
      'ROOT_PATH'
    ]),
    new HtmlWebpackPlugin({
      template: resolve('src/app/menu.html')
    })
  ],
  devServer: {
    port: process.env.PORT,
    before (app) {
      configureRoutes(app)
    }
  }
}
