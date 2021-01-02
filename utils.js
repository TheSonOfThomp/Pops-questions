const { format, setWeek } = require('date-fns')

const COUNT_QUESTIONS = 52;
const START_WEEK = 2

function getDateFromQuestionNumber(number) {
  const date = setWeek(new Date('2021-01-01'), number + START_WEEK - 1)
  return format(date, 'MMM d yyyy')
}

const allQuestionDates = Array(COUNT_QUESTIONS).fill(null).map((_, i) => getDateFromQuestionNumber(i + 1))

module.exports = {
  COUNT_QUESTIONS,
  START_WEEK,
  getDateFromQuestionNumber,
  allQuestionDates,
}