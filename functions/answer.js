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

  const honeypot = params.get('email')

  const questionID = striptags(params.get('questionID'))
  let answerID = striptags(params.get('answerID'))
  const answer = striptags(params.get('answer')).trim()

  if (!honeypot && questionID && answer) {
    console.log(questionID, answerID, answer);
    
    if (answerID) {
      await updateAnswer(answerID, answer)
    } else {
      answerID = await handleAnswer(questionID, answer)
    }

    const questionText = await getQuestionText(questionID)

    const responseParams = {
      question: new URLSearchParams(questionText).toString().replace(/=$/, ''),
      answer: new URLSearchParams(answer
        .replace(/=/g, '%3D')
        .replace(/\?/g, '%3F')
        .replace(/&/g, '%26')
      ).toString()
      .replace(/=$/g, '')
    }

    return {
      statusCode: 301,
      headers: {
        Location: `/thanks?answerID=${answerID}&question=${responseParams.question}&answer=${responseParams.answer}`
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

async function updateAnswer(answerId, answer) {
  await base('Answers').update(answerId, {
    "Answer": answer
  })
}

async function handleAnswer(questionID, answer) {
  let answerId = '';
  await base('Answers').create([
    {
      fields: {
        "Question": [questionID],
        "Answer": answer
      }
    }
  ], (err, records) => {
    if (err) return
    records.forEach(record => answerId = record.getId())
  })
  return answerId
}

function getQuestionText(questionID) {
  return new Promise((resolve, reject) => {
    base('Questions').find(questionID, (err, record) => {
      if (err) reject(err)
      resolve(record.fields['Question'])
    })
  })
}
