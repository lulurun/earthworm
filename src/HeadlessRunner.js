const puppeteer = require('puppeteer');
const ScraperRunner = require('./ScraperRunner');

module.exports = class HeadlessRunner extends ScraperRunner {
  static async init() {
    HeadlessRunner.browser = await puppeteer.launch();
  }

  static async close() {
    await HeadlessRunner.browser.close();
  }

  async getHtml() {
    const page = await HeadlessRunner.browser.newPage();
    await page.goto(this.url);
    const html = await page.content();
    return html;
  }
};
