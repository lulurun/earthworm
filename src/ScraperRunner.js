const EventEmitter = require('events');
const rp = require('request-promise');
const cheerio = require('cheerio');

module.exports = class ScraperRunner extends EventEmitter {
  constructor(url, scraper, parent = null) {
    super();
    this.url = url;
    this.scraper = scraper;
    this.parent = parent;
  }

  async run() {
    const $ = await rp.get(this.url, {
      transform: body => cheerio.load(body),
    });
    return this.scraper.scrape($, this);
  }

  getDepth() {
    let depth = 0;
    let p = this.parent;
    while (p) {
      p = p.parent;
      depth += 1;
    }
    return depth;
  }

  emitItem(item) {
    this.emit('item', item, this);
  }

  emitRunner(url, scraper) {
    const runner = new ScraperRunner(url, scraper, this);
    this.emit('runner', runner);
  }
};
