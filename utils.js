import { format, getWeek, setWeek } from 'date-fns'

export const COUNT_QUESTIONS = 52;
const START_WEEK = 2

export function getDateFromQuestionNumber(number) {

  const date = setWeek(new Date('2021-01-01'), number + START_WEEK - 1)

  return format(date, 'MMM d yyyy')
}

export const allQuestionDates = Array(COUNT_QUESTIONS).fill(null).map((_, i) => getDateFromQuestionNumber(i + 1))