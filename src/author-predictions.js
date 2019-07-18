'use strict';

const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1.js');
const ibmCredentials = require('./ibm-credentials.js');
const RssParser = require('rss-parser');
const fs = require('fs');
const path = require('path');


module.exports = class AuthorPredictions {
  async getPredictions(articleDataSource, dataLocation) {
    try {
      let predictions;

      switch (articleDataSource) {
        case DataSource.SEEKING_ALPHA_RSS_FEED :
          predictions = await this._getAuthorRSSPredictions(dataLocation);
        case DataSource.SEEKING_ALPHA_RSS_XML_FILE :
          predictions = await this._getAuthorRSSPredictions(dataLocation, true);
        default:
          predictions = null;
      }
      predictions = await this._getArticleWillGoUpPredictions(predictions);

      return predictions;
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

  async _getArticleWillGoUpPredictions(predictions) {
    const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
      version: '2019-07-12',
      iam_apikey: ibmCredentials.NATURAL_LANGUAGE_UNDERSTANDING_IAM_APIKEY,
      url: ibmCredentials.NATURAL_LANGUAGE_UNDERSTANDING_URL
    });

    const analyzeParams = {
      'url': 'https://seekingalpha.com/article/4275421-american-eagle-outfitters-thriving-retail-apocalypse',
      'features': {
        'sentiment': {}
      }
    };

    let analysisResults = await naturalLanguageUnderstanding.analyze(analyzeParams);
    console.log(JSON.stringify(analysisResults, null, 2));
  }
};

let DataSource = {
 SEEKING_ALPHA_RSS_FEED : 1,
  SEEKING_ALPHA_RSS_XML_FILE : 2
};

module.exports.DataSource = DataSource;