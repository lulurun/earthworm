/* eslint-disable class-methods-use-this */
/* eslint-disable no-console */
const { Scraper, kickoff } = require('../index');

class DetailPageScraper extends Scraper {
  getVersion($) {
    let version = '';
    $('#mas-technical-details .masrw-content-row .a-section').each((ii, xx) => {
      const text = $(xx).text();
      const re = /バージョン:\s+(.+)/;
      const matched = re.exec(text);
      if (matched) {
        [, version] = matched;
      }
    });
    return version;
  }

  scrape($, emitter) {
    const item = {
      title: $('#btAsinTitle').text(),
      star: $('.a-icon-star .a-icon-alt').eq(0).text().replace('5つ星のうち ', ''),
      version: this.getVersion($),
    };
    emitter.emitItem(item);
  }
}

class BrowseNodeScraper extends Scraper {
  scrape($, emitter) {
    $('#mainResults .s-item-container').slice(0, 5).each((i, x) => {
      const detailPageUrl = $(x).find('.s-access-detail-page').attr('href');
      emitter.emitScraper(detailPageUrl, new DetailPageScraper());
    });
  }
}

kickoff(
  'https://www.amazon.co.jp/b/?node=2386870051',
  new BrowseNodeScraper(),
  {
    onItem: (item) => {
      console.log(item);
    },
  },
);
