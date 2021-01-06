require('dotenv').config()
const striptags = require('striptags');

var Airtable = require('airtable');
Airtable.configure({
  endpointUrl: 'https://api.airtable.com',
  apiKey: process.env.AIRTABLE_API_KEY
});
var base = Airtable.base('app6xMKJyDvXBg6uV');

exports.handler = async function(data) {

  const params = new URLSearchParams(data.body)

  const questionID = striptags(params.get('questionID'))
  const answer = striptags(params.get('answer')).trim()

  if (questionID && answer) {
    console.log(questionID, answer);
    // await handleAnswer(questionID, answer)
    const questionText = await getQuestionText(questionID)

    const responseParams = {
      question: new URLSearchParams(questionText).toString().replace(/=$/, ''),
      answer: new URLSearchParams(answer).toString().replace(/=$/, '')
    }

    console.log(responseParams);

    return {
      statusCode: 301,
      headers: {
        Location: `/thanks?question=${responseParams.question}&answer=${responseParams.answer}`
      }
    }
  } else {
    console.error(`Cannot get parameters, ${data.body}`);
    return {
      statusCode: 302,
      headers: {
        Location: `/error?${data.body}`
      }
    }
  }
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

function getQuestionText(questionID) {
  return new Promise((resolve, reject) => {
    base('Questions').find(questionID, (err, record) => {
      if (err) reject(err)
      resolve(record.fields['Question'])
    })
  })
}
