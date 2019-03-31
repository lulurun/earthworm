const EventEmitter = require('events');
const cheerio = require('cheerio');
const { minify } = require('html-minifier');
const Config = require('./Config');

module.exports = class ScraperRunner extends EventEmitter {
  constructor(url, scraper) {
    super();
    this.url = url;
    this.scraper = scraper;
  }

  // eslint-disable-next-line class-methods-use-this
  async getHtml() {
    throw new Error('You have to implement the method "run"!');
  }

  async run() {
    let html = await this.getHtml();
    if (Config.minifyHtml) {
      html = minify(html);
    }
    const $ = cheerio.load(html);
    return this.scraper.scrape($, this);
  }

  emitItem(item) {
    this.emit('item', item, this);
  }

  emitScraper(url, scraper) {
    const runner = new this.constructor(url, scraper, this);
    this.emit('runner', runner);
  }
};
