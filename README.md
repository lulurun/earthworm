Kick-off is trying to make web scraping easy.

Kick-off is made possible by below powerful libraries
* [`request`](https://github.com/request/request), [`request-promise`](https://github.com/request/request-promise) for http request
* [`puppeteer`](https://github.com/GoogleChrome/puppeteer) for making http request getting js generated html page
* [`cheerio`](https://github.com/cheeriojs/cheerio) for translating html text to dom objects
* [`async`](https://github.com/caolan/async) for scheduling scraping tasks

# Philosophy

* Decentralized, flat structure is beautiful and flexible.
* All components in the system should be self-managed, it can do its own job and collaborate with other components.
* Get things done just by `kickoff`

# Overview

Kick-off exposes a `Scraper` class and a `kickoff` function.

`Scraper`s are self-managed:
* scrape data and urls from a given url
* post the data to developer defined function
* pass the url to next scraper

`kickoff` takes start url and scraper, kickoff the crawling process and wait until the work is done.

# Usage

Please also have a look at the examples folder

### define your scrapers

##### Scraping the detail page

```

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
    emitter.emitItem(item); // <-- the emitted item is recieved by *onItem* callback set with the `kickoff` function
  }
}
```

##### Scraping app list

```
class BrowseNodeScraper extends Scraper {
  scrape($, emitter) {
    $('#mainResults .s-item-container').slice(0, 5).each((i, x) => {
      const detailPageUrl = $(x).find('.s-access-detail-page').attr('href');
      emitter.emitRunner(detailPageUrl, new DetailPageScraper()); // <-- pass scraping job of DetailPage to DetailPageScraper
    });
  }
}
```

### Kick off

```
kickoff(startUrl, new BrowseNodeScraper(), {
  concurrency: 2, // <-- max 2 requests at a time, default 1
  headless: false, // <-- set true when scraping js generated page, default false
  onItem: (item) => { // <-- the item is emitted from scraper
    console.log(item);
  },
  onDone: () => { // <-- this is called when there is no more scraping task, optional
    console.log('done');
  }
}
```

