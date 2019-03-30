const EventEmitter = require('events');

module.exports = class ScraperRunner extends EventEmitter {
  constructor(url, scraper, parent = null) {
    super();
    this.url = url;
    this.scraper = scraper;
    this.parent = parent;
  }

  // eslint-disable-next-line class-methods-use-this
  async run() {
    throw new Error('You have to implement the method "run"!');
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

  emitScraper(url, scraper) {
    const runner = new this.constructor(url, scraper, this);
    this.emit('runner', runner);
  }
};
