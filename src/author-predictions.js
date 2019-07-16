'use strict';

let RssParser = require('rss-parser');
let fs = require('fs');
let path = require('path');


module.exports = class AuthorPredictions {
  getPredictions(dataSource, dataLocation) {
    try {
      switch (dataSource) {
        case DataSource.SEEKING_ALPHA_RSS_FEED :
          return this._getAuthorRSSPredictions(dataLocation);
        case DataSource.SEEKING_ALPHA_RSS_XML_FILE :
          return this._getAuthorRSSPredictions(dataLocation, true);
        default:
          return;
      }
    }
    catch(error) {
      throw error;
    }
  }

  async _getAuthorRSSPredictions(url, isFile = false) {
    let predictions = [];
    let feed;

    if (!url)
      throw new Error('No data location supplied');
    if (isFile) {
      let fileContentsAsString = await this._getXMLFileAsString(url);
      feed = await new RssParser().parseString(fileContentsAsString);
    }
    else
      feed = await new RssParser().parseURL(url);

    feed.items.forEach(item => {
      predictions.push({
        articleLink: item.link,
        date : item.pubDate,
        symbol : item.categories[0]._,
      });
    });
    return predictions;
  }

  _getXMLFileAsString(filePath) {
    return fs.readFileSync(path.join(__dirname, filePath), 'utf8');
  }
};

let DataSource = {
 SEEKING_ALPHA_RSS_FEED : 1,
  SEEKING_ALPHA_RSS_XML_FILE : 2
};

module.exports.DataSource = DataSource;