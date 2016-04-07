const config = {
  output: {
    library: 'GCAjaxPlugin',
    libraryTarget: 'umd'
  },
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel' }
    ]
  }
}

export default config;
