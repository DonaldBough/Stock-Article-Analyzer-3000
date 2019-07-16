'use strict';

let chai = require('chai');
const AuthorPredictions = require('../src/author-predictions.js');
const DataSource = AuthorPredictions.DataSource;


describe('AnalyzeAuthorPredictions', async () => {
  it('throws when no url is passed in', async () => {
    let authorPredictions = new AuthorPredictions();
    let expectedError = null;

    try {
      await authorPredictions.getPredictions(DataSource.SEEKING_ALPHA_RSS_FEED, null);
    }
    catch(error) {
      expectedError = error;
    }

    await chai.expect(expectedError.message).to.equal('No data location supplied');
  });

  it('gets symbol and published date from an author prediction', async () => {
    let authorPredictions = new AuthorPredictions();
    let authorRSSUrl = 'https://seekingalpha.com/author/value-kicker.xml';

    let predictions = await authorPredictions.getPredictions(DataSource.SEEKING_ALPHA_RSS_FEED, authorRSSUrl);

    chai.expect(predictions[0]).to.deep.equal({
      symbol: 'ATVI',
      date: 'Tue, 09 Jul 2019 12:06:58 -0400'
    });
  });
});