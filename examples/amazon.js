/* eslint-disable class-methods-use-this */
/* eslint-disable no-console */
const { Scraper, crawl } = require('../index');
const { Dumper } = require('../src/Analysis');

const baseUrl = 'https://www.amazon.co.jp';
const startUrl = `${baseUrl}/b/?node=2386870051`;

class BrowseNodeScraper extends Scraper {
  scrape($, emitter) {
    new Dumper().dump($('body').get(0));
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
