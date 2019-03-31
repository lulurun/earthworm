/* eslint-disable class-methods-use-this */
/* eslint-disable no-console */
const { Scraper, kickoff } = require('../index');

const keyword = (process.argv.length > 2) ? process.argv[2] : 'github';

const baseUrl = 'https://www.google.com';
const startUrl = `${baseUrl}/search?q=${keyword}`;

class SearchResultScraper extends Scraper {
  constructor(pageNum = 0) {
    super();
    this.pageNum = pageNum;
  }

  scrape($, emitter) {
    $('#search .g').each((i, x) => {
      const item = {
        title: $(x).find('h3').text(),
        url: $(x).find('cite').text(),
      };
      emitter.emitItem(item);
    });

    if (this.pageNum >= 2) return;

    const nextPage = $('#foot table a').last();
    const nextPageUrl = baseUrl + nextPage.attr('href');
    emitter.emitScraper(nextPageUrl, new SearchResultScraper(this.pageNum + 1));
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
