require('dotenv').config()

var Airtable = require('airtable');
Airtable.configure({
  endpointUrl: 'https://api.airtable.com',
  apiKey: process.env.AIRTABLE_API_KEY
});
var base = Airtable.base('app6xMKJyDvXBg6uV');

exports.handler = async function(data) {

  const payload = JSON.parse(data.body).payload.data

  if (payload['form-name'] === 'answers') {
    await handleAnswer(payload.questionID, payload.answer)
  }

  return {
    statusCode: 302,
    headers: {
      Location: data.path
    },
    body: "Hello World"
  };
}

async function handleAnswer(questionID, answer) {
  base('Answers').create([
    {
      fields: {
        "Answer": answer,
        "Question": [questionID]
      }
    }
  ])
}
