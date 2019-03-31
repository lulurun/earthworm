const minifyOpts = {
  collapseWhitespace: true,
  removeComments: true,
  removeEmptyElements: true,
};

const config = {
  minify: true,
};

module.exports = {
  get minifyHtml() { return config.minify; },
  set minifyHtml(val) { config.minify = val; },
  get minifyOpts() { return minifyOpts; },
};
