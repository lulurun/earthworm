/* eslint-disable class-methods-use-this */
/* eslint-disable no-console */
const { Scraper, crawl } = require('../index');
const { Analysis } = require('../src/Analysis');

const baseUrl = 'https://www.amazon.co.jp';
const startUrl = `${baseUrl}/b/?node=2386870051`;

class BrowseNodeScraper extends Scraper {
  scrape($, emitter) {
    const analysis = new Analysis($('body').get(0));
    analysis.suggest();
  }
}

let idx = 1;

crawl(startUrl, new BrowseNodeScraper(),
  (item /* , scraperRunner */) => {
    console.log(idx, item.title);
    idx += 1;
  },
  () => {
    console.log('done');
  });
