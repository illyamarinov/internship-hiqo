const path = require('path');
const argv = require('yargs').argv;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

const isDevelopment = argv.mode === 'development';
const isProduction = !isDevelopment;
const distPath = path.resolve(__dirname, './dist');

const config = {
  entry: './src/index.js',
  output: {
    path: distPath,
    filename: 'main.js'
  },
  devServer: {
    contentBase: path.join(__dirname, './'),
    watchContentBase: true,
    compress: true,
    hot: true,
    port: 9000,
    open: true,
    historyApiFallback: true,
    overlay: {
      warnings: true,
      errors: true
    }
  },
  serve: {
    hotClient: {
      allEntries: true
    }
  },
  module: {
    rules: [{
      test: /\.html$/,
      use: 'html-loader'
    }, {
      test: /\.hbs$/,
      loader: "handlebars-loader",
      options: {
        helperDirs: path.join(__dirname, 'src/utils/hbs-helpers'),
        precompileOptions: {
          knownHelpersOnly: false,
        }
      }
    }, {
      test: /\.js$/,
      exclude: '/node-modules/',
      use: [{
        loader: 'babel-loader',
        options: {
          presets: ['env', 'es2015']
        }
      }]
    }, {
      test: /\.s?css$/,
      exclude: '/node_modules/',
      use: [
        'style-loader',
        'css-hot-loader',
        MiniCssExtractPlugin.loader,
        {
          loader: 'css-loader',
          options: {
            sourceMap: true
          }
        },
        {
          loader: 'sass-loader',
          options: {
            sourceMap: true
          }
        }
      ]
    }, {
      test: /\.(png|jpe?g|gif)$/i,
      use: [{
        loader: 'file-loader',
        options: {
          name: 'images/[name][hash].[ext]'
        }
      }, {
        loader: 'image-webpack-loader',
        options: {
          mozjpeg: {
            progressive: true,
            quality: 70
          }
        }
      }]
    }, {
      test: /\.(svg|woff|woff2|eot|ttf)$/,
      use: {
        loader: 'file-loader',
        options: {
          name: 'fonts/[name][hash].[ext]'
        }
      }
    }]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new MiniCssExtractPlugin({
      filename: 'style.css'
    }),
    new HtmlWebpackPlugin({
      template: './index.html'
    }),
  ],
  optimization: isProduction ? {
    minimizer: [
      new UglifyJsPlugin({
        sourceMap: true,
        uglifyOptions: {
          compress: {
            inline: false,
            warnings: false,
            drop_console: true,
            unsafe: true
          }
        }
      })
    ]
  } : {},
  devtool: isDevelopment ? 'eval-sourcemap' : false
};

module.exports = config;
