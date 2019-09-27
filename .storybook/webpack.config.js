const { resolve } = require('path');
const autoprefixer = require('autoprefixer');

const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;

module.exports = async ({ config, mode }) => ({
  ...config,
  module: {
    ...config.module,
    rules: [
      ...config.module.rules,
      {
        test: /\.(ts|tsx|mdx|js|jsx)$/,
        include: [
          resolve(__dirname, '../src'),
          resolve(__dirname, '../demo')
        ],
        use: [
          require.resolve('babel-loader'),
          ...(mode === 'PRODUCTION' ? [require.resolve('react-docgen-typescript-loader')] : [])
        ]
      },
      {
        test: /\.story\.(ts|tsx|mdx|js|jsx)$/,
        loaders: [
          {
            loader: require.resolve('@storybook/source-loader'),
            options: {
              parser: 'typescript',
              injectParameters: true
            }
          }
        ],
        enforce: 'pre'
      },
      {
        test: sassRegex,
        exclude: sassModuleRegex,
        loaders: ['style-loader', 'css-loader', 'sass-loader'],
        include: resolve(__dirname, '../')
      },
      {
        test: sassModuleRegex,
        include: resolve(__dirname, '../'),
        loaders: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
               importLoaders: 1,
               modules: true
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: () => [
                autoprefixer({
                  flexbox: 'no-2009'
                })
              ]
            }
          },
          'sass-loader'
        ]
      }
    ]
  },
  plugins: config.plugins,
  resolve: {
    ...config.resolve,
    modules: [
      ...config.resolve.modules,
      resolve(__dirname, '../src'),
      resolve(__dirname, '../demo')
    ],
    extensions: [
      ...config.resolve.extensions,
      '.ts',
      '.tsx',
      '.js',
      '.mdx'
    ]
  }
});
