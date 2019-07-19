'use strict';

const RssParser = require('rss-parser');
const fs = require('fs');
const path = require('path');

const SOURCE_TYPES = {
  SEEKING_ALPHA_RSS_FEED : 1,
  SEEKING_ALPHA_RSS_XML_FILE : 2
};

module.exports = class DataSource {
  //region getter/setter
  get dataSourceType() {
    return this._dataSourceType;
  }

  set dataSourceType(value) {
    this._dataSourceType = value;
  }

  static get SOURCE_TYPES() {
    return SOURCE_TYPES;
  }
  //endregion

  constructor(dataSourceType) {
    this.dataSourceType = dataSourceType;
  }

  async getArticles(dataLocation) {
    switch (this.dataSourceType) {
      case SOURCE_TYPES.SEEKING_ALPHA_RSS_FEED :
        return await this._getRSSArticles(dataLocation);
      case SOURCE_TYPES.SEEKING_ALPHA_RSS_XML_FILE :
        return await this._getRSSArticles(dataLocation, true);
      default:
        return null;
    }
  }

  async _getRSSArticles(url, isFile = false) {
    let articles = [];
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
      articles.push({
        articleLink: item.link,
        date : item.pubDate,
        symbol : item.categories[0]._,
      });
    });
    return articles;
  }

  _getXMLFileAsString(filePath) {
    return fs.readFileSync(path.join(__dirname, filePath), 'utf8');
  }

};