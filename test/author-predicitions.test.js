'use strict';

let chai = require('chai');
const AuthorPredictions = require('../src/author-predictions.js');
const DataSource = require('../src/data-source');

describe('AuthorPredictionsTests', async function() {
  this.timeout(5000);

  it('throws when no url is passed in', async () => {
    let authorPredictions = new AuthorPredictions();
    let expectedError = null;

    try {
      await authorPredictions.getPredictions(DataSource.SOURCE_TYPES.SEEKING_ALPHA_RSS_XML_FILE, null);
    }
    catch(error) {
      expectedError = error;
    }

    await chai.expect(expectedError.message).to.equal('No data location supplied');
  });

  it('reads a RSS feed from an XML file', () => {
    let dataSource = new DataSource(DataSource.SOURCE_TYPES.SEEKING_ALPHA_RSS_XML_FILE);

    try {
      let feed = dataSource._getXMLFileAsString('../test/small-XML-example.xml');

      chai.expect(feed).to.equal('<?xml version="1.0"?>\n' +
          '<rss xmlns:dc="http://purl.org/dc/elements/1.1/" version="2.0">\n' +
          '  <channel>\n' +
          '    <title>Shraavan B Seeking Alpha</title>\n' +
          '  </channel>\n' +
          '</rss>')
    }
    catch(error) {
      chai.assert.fail(error);
    }
  });

  it('throws when trying to read file that doesnt exist', () => {
    let dataSource = new DataSource(DataSource.SOURCE_TYPES.SEEKING_ALPHA_RSS_XML_FILE);
    let expectedError = null;

    try {
      dataSource._getXMLFileAsString('fileThatDoesntExist.xml');
    }
    catch (error) {
      expectedError = error;
    }

    chai.expect(expectedError.message).to.equal('ENOENT: no such file or directory, open \'/Users/donaldbough/Documents/Source_Code/Stock-Article-Analyzer-3000/src/fileThatDoesntExist.xml\'');
  });

  it('gets symbol, article link, and published date from an author prediction', async () => {
    let dataSource = new DataSource(DataSource.SOURCE_TYPES.SEEKING_ALPHA_RSS_XML_FILE);
    let articles = await dataSource.getArticles('../test/RSS-article.xml');

    chai.expect(articles[0]).to.deep.equal({
      articleLink: 'https://seekingalpha.com/article/4274078-activision-blizzard-bad-pr-good-long-term-fundamentals?source=feed_author_value_kicker',
      date: 'Tue, 09 Jul 2019 12:06:58 -0400',
      symbol: 'ATVI'
    });
  });

  it('gets the opinion from an author prediction', async () => {
    let authorPredictions = new AuthorPredictions();
    let dataSource = new DataSource(DataSource.SOURCE_TYPES.SEEKING_ALPHA_RSS_XML_FILE);
    let articles = await dataSource.getArticles('../test/RSS-article.xml');

    let predictions = await authorPredictions.getAuthorOpinions(articles);

    chai.expect(predictions[0].opinion).to.equal('negative');
    predictions.forEach(prediction => {
      chai.expect(prediction.opinion).to.not.be.null;
      chai.expect(prediction.opinion).to.not.be.undefined;
    });
  });
});