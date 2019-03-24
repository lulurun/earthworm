/* eslint-disable class-methods-use-this */
/*
 * This script can help finding data list from given url
 * usage:
 * $ node suggest.js ${URL}
 *
 * try below urls:
 * 'https://github.com/topics'
 * 'https://www.google.com/search?q=earthworm+github'
 * 'https://www.amazon.co.jp/b/?node=2386870051'
 */

const { Scraper, crawl } = require('../index');
const { Analysis } = require('../src/Analysis');


class SimpleScraper extends Scraper {
  scrape($ /* , emitter */) {
    const analysis = new Analysis($('body').get(0));
    // const results = analysis.suggest(5);
    // results.forEach((x) => {
    //   console.log(x.score, x.path, x.els.length);
    // });

    analysis.scrape();
  }
}

const url = process.argv[2];
if (!url) {
  throw new Error('Usage: node suggest.js $URL');
}

crawl(url, new SimpleScraper());
