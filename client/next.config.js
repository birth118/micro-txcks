// To enforce Next to detect source change along in Skaffold 

module.exports = {
  webpackDevMiddleware: config => {
    config.watchOptions.poll = 300
    return config
  }
}