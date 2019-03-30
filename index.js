const async = require('async');
const Scraper = require('./src/Scraper');
const RequestRunner = require('./src/RequestRunner');
const HeadlessRunner = require('./src/HeadlessRunner');

module.exports = {
  Scraper,
  /*
   * opt = {
   *   concurrency: [Num]
   *   headless: [Boolean] if use headless chrome to get the URL
   *   onItem: [Func] callback function when an data item is emitted by a scraper
   *   onDone: [Func] callback function when there is no more scraping job running
   * }
   */
  kickoff: async (url, scraper, opt = {}) => {
    const concurrency = opt.concurrency || 1;
    const RunnerClass = opt.headless ? HeadlessRunner : RequestRunner;
    const onItem = opt.onItem || (() => {});

    const q = async.queue(async runner => runner.run(), concurrency);
    q.drain = () => {
      if (opt.onDone) opt.onDone();
      if (opt.headless) HeadlessRunner.close();
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
