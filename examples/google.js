/* eslint-disable class-methods-use-this */
/* eslint-disable no-console */
const url = require('url');
const { Scraper, crawl } = require('../index');

const baseUrl = 'https://www.google.com';
const startUrl = `${baseUrl}/search?q=earthworm+github`;

function getUrl(urlStr) {
  const parsedUrl = url.parse(urlStr, true);
  if (parsedUrl.pathname === '/url') {
    return parsedUrl.query.q;
  }
  return null;
}

class SearchResultScraper extends Scraper {
  scrape($, emitter) {
    $('#search .g').each((i, x) => {
      const $url = $(x).find('h3 a');
      const item = {
        title: $url.text(),
        url: getUrl($url.attr('href')),
        desc: $(x).find('.st').text(),
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
  });
