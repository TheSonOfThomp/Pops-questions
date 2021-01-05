require('dotenv').config()

var Airtable = require('airtable');
Airtable.configure({
  endpointUrl: 'https://api.airtable.com',
  apiKey: process.env.AIRTABLE_API_KEY
});
var base = Airtable.base('app6xMKJyDvXBg6uV');

exports.handler = async function(data) {

  const params = new URLSearchParams(data.body)

  console.log(params.get('questionID'), params.get('answer'));

  if (params.get('questionID') && params.get('answer')) {
    await handleAnswer(params.get('questionID'), params.get('answer'))
  } else {
    console.error('Cannot get parameters');
  }


  return {
    statusCode: 302,
    headers: {
      Location: '/thanks'
    },
    body: "Hello World"
  };
}

async function handleAnswer(questionID, answer) {
  await base('Answers').create([
    {
      fields: {
        "Question": [questionID],
        "Answer": answer
      }
    }
  ])
}
