require('dotenv').config()
const striptags = require('striptags');
const cloudinary = require('cloudinary').v2;
const Airtable = require('airtable');

// console.log(cloudinary);

Airtable.configure({
  endpointUrl: 'https://api.airtable.com',
  apiKey: process.env.AIRTABLE_API_KEY
});
const base = Airtable.base('app6xMKJyDvXBg6uV');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECTRET,
})

exports.handler = async function(data) {

  const params = new URLSearchParams(data.body)

  const honeypot = params.get('email')

  const questionID = striptags(params.get('questionID'))
  let answerID = striptags(params.get('answerID'))
  const answer = striptags(params.get('answer')).trim()
  const imageName = striptags(params.get('image-name'))
  
  const hasRequiredFields = !honeypot && questionID && answer
  
  if (hasRequiredFields) {
    console.log(questionID, answerID, answer, imageName);
    const photoBuffer = params.get('photos')
    
    let photoUrl;
    if (photoBuffer) {
      const photoUpload = await uploadPhoto(photoBuffer)
      photoUrl = photoUpload.secure_url
    }
    
    if (answerID) {
      await updateAnswer(answerID, {answer, photoUrl})
    } else {
      answerID = await handleAnswer(questionID, {answer})
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

async function updateAnswer(answerId, {answer, photoUrl}) {

  const payload = {
    "Answer": answer,
  }

  if (photoUrl) {
    const existingPhotos = await getExistingPhotos(answerId) ?? []

    payload["Photos"] = [
      ...existingPhotos,
      {
        url: photoUrl
      }
    ]
  }
 
  await base('Answers').update(answerId, payload)
}

async function handleAnswer(questionID, {answer, photoBuffer}) {
  let answerId = '';
  await base('Answers').create([
    {
      fields: {
        "Question": [questionID],
        "Answer": answer,
        "Photos": photosUrl
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

function getExistingPhotos(answerID) {
  return new Promise((resolve, reject) => {
    base('Answers').find(answerID, (err, record) => {
      if (err) reject(err)
      resolve(record.fields['Photos'])
    })
  })
}

async function uploadPhoto(photoBuffer) {
  if (photoBuffer) {
    const upload = await cloudinary.uploader.upload(photoBuffer)
    return upload
  }
}