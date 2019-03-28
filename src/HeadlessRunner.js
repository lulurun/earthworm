const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const ScraperRunner = require('./ScraperRunner');

module.exports = class HeadlessRunner extends ScraperRunner {
  static async init() {
    HeadlessRunner.browser = await puppeteer.launch();
  }

  static async close() {
    await HeadlessRunner.browser.close();
  }

  async run() {
    const page = await HeadlessRunner.browser.newPage();
    await page.goto(this.url);
    const html = await page.content();
    const $ = cheerio.load(html);
    return this.scraper.scrape($, this);
  }
};
