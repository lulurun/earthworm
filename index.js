const async = require('async');
const Scraper = require('./src/Scraper');
const RequestRunner = require('./src/RequestRunner');
const HeadlessRunner = require('./src/HeadlessRunner');

module.exports = {
  Scraper,
  crawl: async (url, scraper, onItem, onDone, opt = {}) => {
    const concurrency = opt.concurrency || 1;
    const RunnerClass = opt.headless ? HeadlessRunner : RequestRunner;

    const q = async.queue(async runner => runner.run(), concurrency);
    q.drain = () => {
      if (onDone) onDone();
      if (opt.headless) {
        HeadlessRunner.close();
      }
    };

    const start = (runner) => {
      runner.on('item', item => onItem(item, runner));
      runner.on('runner', child => start(child));
      q.push(runner);
    };

    if (opt.headless) {
      await HeadlessRunner.init();
    }
    const runner = new RunnerClass(url, scraper);
    start(runner);
  },
};
