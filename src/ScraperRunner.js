const EventEmitter = require('events');
const rp = require('request-promise');
const cheerio = require('cheerio');

const UA = {
  CHROME: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36',
  FIREFOX: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.13; rv:62.0) Gecko/20100101 Firefox/62.0',
  SAFARI: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0 Safari/605.1.15',
};

module.exports = class ScraperRunner extends EventEmitter {
  constructor(url, scraper, parent = null) {
    super();
    this.url = url;
    this.scraper = scraper;
    this.parent = parent;
  }

  async run() {
    const $ = await rp.get(this.url, {
      headers: {
        'User-Agent': UA.CHROME,
      },
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
