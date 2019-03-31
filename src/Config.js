const minifyOpts = {
  collapseWhitepsace: true,
  removeComments: true,
  removeTagWhitespace: true,
};

const config = {
  minify: true,
};

module.exports = {
  get minifyHtml() { return config.minify; },
  set minifyHtml(val) { config.minify = val; },
  get minifyOpts() { return minifyOpts; },
};
