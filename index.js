const async = require('async');
const Scraper = require('./src/Scraper');
const ScraperRunner = require('./src/ScraperRunner');

module.exports = {
  Scraper,
  crawl: (url, scraper, onItem, onDone, concurrency = 1) => {
    const q = async.queue(async runner => runner.run(), concurrency);
    q.drain = onDone;

    const start = (runner) => {
      runner.on('item', item => onItem(item, runner));
      runner.on('runner', child => start(child));
      q.push(runner);
    };

    const runner = new ScraperRunner(url, scraper);
    start(runner);
  },
};
