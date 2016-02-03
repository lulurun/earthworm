var async = require('async');
var cheerio = require('cheerio');
var log4js = require('log4js');
var request = require('request');
var EventEmitter = require('events');
var util = require('util');

var emitter = new EventEmitter();
exports.emitItem = function(item, scraper) {
  emitter.emit("item", item, scraper);
};

exports.emitScraper = function(scraper) {
  emitter.emit("scraper", scraper);
};

exports.onItem = function(cb) {
  emitter.on("item", cb);
};

var Scraper = exports.Scraper = (function(){
  var logger = log4js.getLogger("scraper");

  var Class = function (url){
    this.url = url;
  };

  var proto = Class.prototype;

  proto.run = function(cb) {
    var self = this;
    var scrapers = [];
    self.get(function($){
      self.scrape($, cb);
    });
  };

  proto.scrape = function($, cb) {
    worm.emitItem("default scraper called");
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
    scraper.run(function(){
      cb();
    });
  }, concurrency);

  q.drain = cb;
  emitter.on("scraper", function(scraper){
    q.push(scraper);
  });

  q.push(scraper);
};

exports.defineScraper = function(object, base) {
  if (!base) base = Scraper;
  var Class = function(){
    var url = arguments[0];
    var args = [];
    for(var i=0; i<arguments.length; i++) {
      args.push(arguments[i]);
    }
    if (object.init) {
      object.init.apply(this, args);
    }
    base.call(this, url);
  };
  util.inherits(Class, base);

  for (var k in object) {
    if (k !== "init" && typeof(object[k]) === "function") {
      Class.prototype[k] = object[k];
    }
  }

  return Class;
}

