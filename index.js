const async = require('async');
const Scraper = require('./src/Scraper');
const RequestRunner = require('./src/RequestRunner');
const HeadlessRunner = require('./src/HeadlessRunner');
const Config = require('./src/Config');

module.exports = {
  Scraper,
  /*
   * opt = {
   *   concurrency: [Num]
   *   minify: [Boolean] if minify the html before translating to DOM objects
   *   headless: [Boolean] if use headless chrome to get the URL
   *   onItem: [Func] callback function when an data item is emitted by a scraper
   *   onDone: [Func] callback function when there is no more scraping job running
   * }
   */
  kickoff: async (url, scraper, opt = {}) => {
    const concurrency = opt.concurrency || 1;
    Config.minifyHtml = !!opt.minify;
    const JobRunnerClass = opt.headless ? HeadlessRunner : RequestRunner;
    const onItem = opt.onItem || (() => {});

    const q = async.queue(async runner => runner.run(), concurrency);
    q.drain = () => {
      if (opt.onDone) opt.onDone();
      if (opt.headless) HeadlessRunner.close();
    };

    const kick = (jobRunner) => {
      jobRunner.on('item', newItem => onItem(newItem, jobRunner));
      jobRunner.on('job', newJobRunner => kick(newJobRunner));
      q.push(jobRunner);
    };

    if (opt.headless) {
      await HeadlessRunner.init();
    }
    const firstJobRunner = new JobRunnerClass(url, scraper);
    kick(firstJobRunner);
  },
};
