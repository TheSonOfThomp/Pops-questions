require('dotenv').config()
var Airtable = require('airtable');
Airtable.configure({
  endpointUrl: 'https://api.airtable.com',
  apiKey: process.env.AIRTABLE_API_KEY
});
var base = Airtable.base('app6xMKJyDvXBg6uV');

exports.handler = async function (data) {

  const query = data.queryStringParameters

  if (query && query.id) {
    const record = await new Promise((resolve, reject) => {
      base('Answers').find(query.id ?? '', function(err, record) {
        if (err) { reject(record) }
        resolve(record)
      })
    })
  
    return {
      statusCode: record.error ? record.statusCode : 200,
      body: JSON.stringify(record)
    }
  } else {
    return {
      statusCode: 400,
      body: 'No id found'
    }
  }

}