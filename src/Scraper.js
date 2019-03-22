module.exports = class Scraper {
  /* eslint class-methods-use-this: 0 */
  /* eslint-disable no-unused-vars */
  scrape(content, emitter) {
    throw new Error('You have to implement the method "scrape"!');
    /**
     * const item = parseForItem(content);
     * emitter.emitItem(item);
     * ...
     * const url = parseForNewLink(content);
     * emitter.emitRunner(url, new SomeSraper());
     */
  }
};
