'use strict';

let RssParser = require('rss-parser');

module.exports = class AuthorPredictions {
  getPredictions(dataSource, dataLocation) {
    try {
      switch (dataSource) {
        case DataSource.SEEKING_ALPHA_RSS_FEED :
          return this._getAuthorRSSPredictions(dataLocation);
        default:
          return;
      }
    }
    catch(error) {
      throw error;
    }
  }

  async _getAuthorRSSPredictions(url) {
    if (!url)
      throw new Error('No data location supplied');

    let parser = new RssParser();
    let feed = await parser.parseURL(url);
    console.log(feed.title);

    feed.items.forEach(item => {
      console.log(item.title + ':' + item.link)
    });

    return null;
  }
};

let DataSource = {
 SEEKING_ALPHA_RSS_FEED : 1
};

module.exports.DataSource = DataSource;