/* eslint-disable class-methods-use-this */
/* eslint-disable no-console */
const url = require('url');
const { Scraper, crawl } = require('../index');

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
  }
}

crawl('https://www.google.com/search?q=earthworm+github', new SearchResultScraper(),
  (item, scraperRunner) => {
    console.log(item, scraperRunner.url, scraperRunner.getDepth());
  },
  () => {
    console.log('done');
  });
