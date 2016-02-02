var async = require('async');
var cheerio = require('cheerio');
var log4js = require('log4js');
var request = require('request');
var EventEmitter = require('events');
var util = require('util');

exports.Scraper = (function(){
  var logger = log4js.getLogger("scraper");

  var Class = function (url){
    this.url = url;
    EventEmitter.call(this);
    this.on("item", this.pipe.bind(this));
  };
  util.inherits(Class, EventEmitter);
  var proto = Class.prototype;

  proto.run = function(cb) {
    var self = this;
    self.get(function($){
      self.scrape($, cb);
    });
  };

  proto.scrape = function($, cb) {
    this.emit("item", "default scraper called");
  };

  proto.pipe = function(item) {
    console.log("got item:", item);
  };

  proto.get = function(cb){
    var url = this.url;
    logger.debug("getting", url);
    request(url, function (err, res, body) {
      if (!err && res.statusCode == 200) {
        cb(cheerio.load(body));
      } else {
        var code = (res && res.statusCode) || "-"
        logger.error("getting", url, code, err);
      }
    });
  };

  return Class;
})();

exports.crawl = function(scraper, concurrency, cb) {
  var q = async.queue(function(scraper, cb) {
    scraper.run(function(scrapers){
      if (scrapers && scrapers.length) {
        scrapers.forEach(function(s){
          q.push(s);
        });
        cb();
      } else {
        cb();
      }
    });
  }, concurrency);

  q.drain = cb;
  q.push(scraper);
};

