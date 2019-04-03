Kick-off-crawling
provides simple API/structure for developers to create scrapers and connect those scrapers together to achieve complicated data mining jobs.

Kick-off-crawling is made possible by below powerful libraries
* [`request`](https://github.com/request/request), [`request-promise`](https://github.com/request/request-promise) for http request
* [`puppeteer`](https://github.com/GoogleChrome/puppeteer) for making http request getting js generated html page
* [`cheerio`](https://github.com/cheeriojs/cheerio) for translating html text to dom objects
* [`async`](https://github.com/caolan/async) for scheduling scraping tasks
* [`html-minifier`](https://github.com/kangax/html-minifier) for minifying html in order to get stable scraping result

# Overview

Kick-off-crawling exposes a `Scraper` class and a `kickoff` function.

`Scraper`s are self-managed:
* scrape data and urls from a DOM object parsed by cheerio.
* post the data to developer defined function
* pass the url to next scraper

`kickoff` takes a url and a scraper, kicks off the crawling process.
During the crawling process, new scrapers (scraping job) will be generated and scheduled by `kickoff` function. The crawling process stops when there is no more scraping job.

# Qucik start & Running the Examples

```
$ cd ${REPO_PATH}
$ npm install
$ cd examples
$ node google.js # getting top 30 search results
$ node amazon.js # getting top 5 apps from Amazon Appstore
```

# Usage

_Working example source code: [examples/amazon.js](https://github.com/lulurun/kick-off-crawling/blob/master/examples/amazon.js)_

Here is an example for getting app info from Amazon Appstore.

### 1. Define your scrapers

We need to define 2 Scrapers for completing the task
1. `BrowseNodeScraper` for getting list of app detail pages.
2. `DetailPageScraper` for getting app into (title, stars, version) from each detail page.

##### Scraping app list

```
class BrowseNodeScraper extends Scraper {
  scrape($, emitter) {
    $('#mainResults .s-item-container').slice(0, 5).each((i, x) => {
      const detailPageUrl = $(x).find('.s-access-detail-page').attr('href');
      emitter.emitJob(detailPageUrl, new DetailPageScraper()); // <-- New scraping job
    });
  }
}
```

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

### 2. Kick off

```
kickoff(
  'https://www.amazon.co.jp/b/?node=2386870051',
  new BrowseNodeScraper(),
  {
    concurrency: 2, // <-- max 2 requests at a time, default 1
    minify: true, // <-- minify html, default true
    headless: false, // <-- set true when scraping js generated page, default false
    onItem: (item) => { // <-- the item is emitted from scraper
      console.log(item);
    },
    onDone: () => { // <-- this is called when there is no more scraping task, optional
      console.log('done');
    },
  },
);
```

