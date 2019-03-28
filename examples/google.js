/* eslint-disable class-methods-use-this */
/* eslint-disable no-console */
const { Scraper, crawl } = require('../index');

const baseUrl = 'https://www.google.com';
const startUrl = `${baseUrl}/search?q=login`;

class SearchResultScraper extends Scraper {
  scrape($, emitter) {
    $('#search .g').each((i, x) => {
      const item = {
        title: $(x).find('h3').text(),
        url: $(x).find('cite').text(),
      };
      emitter.emitItem(item);
    });

    if (emitter.getDepth() >= 2) return;

    const nextPage = $('#foot table a').last();
    const nextPageUrl = baseUrl + nextPage.attr('href');
    emitter.emitRunner(nextPageUrl, new SearchResultScraper());
  }
}

let idx = 1;

crawl(startUrl, new SearchResultScraper(),
  (item /* , scraperRunner */) => {
    console.log(idx, item.title);
    idx += 1;
  },
  () => {
    console.log('done');
  }, { headless: true });
