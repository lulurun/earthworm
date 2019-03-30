/* eslint-disable class-methods-use-this */
/* eslint-disable no-console */
const { Scraper, kickoff } = require('../index');

const keyword = (process.argv.length > 2) ? process.argv[2] : 'github';

const baseUrl = 'https://www.google.com';
const startUrl = `${baseUrl}/search?q=${keyword}`;

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
    emitter.emitScraper(nextPageUrl, new SearchResultScraper());
  }
}

let seq = 1;

kickoff(
  startUrl,
  new SearchResultScraper(),
  {
    onItem: (item) => {
      console.log(seq, item.title, item.url);
      seq += 1;
    },
  },
);
