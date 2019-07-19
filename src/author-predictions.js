'use strict';

const DataSource = require('./data-source');
const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1.js');
const ibmCredentials = require('./ibm-credentials.js');

module.exports = class AuthorPredictions {
  async getPredictions(dataSourceType, dataLocation) {
    try {
      let dataSource = new DataSource(dataSourceType);
      let articles = await dataSource.getArticles(dataLocation);
      return this.getAuthorOpinions(articles);
    }
    catch(error) {
      throw error;
    }
  }

  async getAuthorOpinions(predictions) {
    const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
      version: '2019-07-12',
      iam_apikey: ibmCredentials.NATURAL_LANGUAGE_UNDERSTANDING_IAM_APIKEY,
      url: ibmCredentials.NATURAL_LANGUAGE_UNDERSTANDING_URL
    });

    const analyzeParams = {
      'url': predictions[0].articleLink,
      'features': {
        'sentiment': {}
      }
    };
    let analysisResults = await naturalLanguageUnderstanding.analyze(analyzeParams);
    let opinion = analysisResults.sentiment.document.label;
    if (opinion)
      predictions[0].opinion = opinion;
    else
      predictions[0].opinion = 'unknown';
    return predictions;
  }
};