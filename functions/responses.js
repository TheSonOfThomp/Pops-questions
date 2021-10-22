require('dotenv').config()
var Airtable = require('airtable');
Airtable.configure({
  endpointUrl: 'https://api.airtable.com',
  apiKey: process.env.AIRTABLE_API_KEY
});
var base = Airtable.base('app6xMKJyDvXBg6uV');

exports.handler = async function () {

  const records = await new Promise((resolve, reject) => {
    base('Answers').select({
      view: 'Grid view',
    }).all((err, records) => {
      if (err) {reject(err)}
      resolve(records)
    })
  })

  if (records.error) {
    return {
      statusCode: records.statusCode,
      body: JSON.stringify(records)
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify(records)
  }
}