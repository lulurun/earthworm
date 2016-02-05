var async = require('async');
var cheerio = require('cheerio');
var log4js = require('log4js');
var request = require('request');
var EventEmitter = require('events');
var util = require('util');

var logger = log4js.getLogger("earthworm");

var Scraper = exports.Scraper = (function(){
  var Class = function (url){
    this.url = url;
    EventEmitter.call(this);
  };
  util.inherits(Class, EventEmitter);

  var proto = Class.prototype;

  proto.run = function(cb) {
    this.get(function($){
      this.scrape($, cb);
    }.bind(this));
  };

  proto.emitItem = function(item) {
    this.emit("item", item, this);
  };

  proto.emitScraper = function(scraper) {
    this.emit("scraper", scraper);
  };

  proto.scrape = function($, cb) {
    logger.error("scrape method is to be implemented in sub classes");
    cb();
  };

  proto.get = function(cb){
    logger.debug("getting", this.url);
    request(this.url, function (err, res, body) {
      if (!err && res.statusCode == 200) {
        cb(cheerio.load(body));
      } else {
        var code = (res && res.statusCode) || "-"
        logger.error("getting", this.url, code, err);
      }
    }.bind(this));
  };

  return Class;
})();

exports.crawl = function(scraper, concurrency, onItem, onDone) {
  var q = async.queue(function(scraper, cb) {
    scraper.run(cb);
  }, concurrency);

  q.drain = onDone;

  var emit = function(scraper) {
    scraper.on("item", onItem);
    scraper.on("scraper", function(scraper){
      emit(scraper);
    });
    q.push(scraper);
  };

  emit(scraper);
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

