module.exports = class Scraper {
  /* eslint class-methods-use-this: 0 */
  /* eslint-disable no-unused-vars */
  scrape(content, emitter) {
    throw new Error('You have to implement the method "scrape"!');
    /**
     * item = parseX(content);
     * emitter.emitItem(item);
     * ...
     * url = parseY(content);
     * emitter.emitRunner(url, new ZzzSraper());
     */
  }
};
