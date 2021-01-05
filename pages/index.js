import { format, parseISO } from 'date-fns'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import useSWR from 'swr'
import styles from '../styles/Home.module.css'

const questionsEndpoint = "/.netlify/functions/questions/"
const answersEndpoint = "/.netlify/functions/submission-created/"

const fetcher = (...args) => fetch(...args).then(res => res.json())

const title = "Pop's Questions"

export default function Home() {
  const { data: questions, error } = useSWR(questionsEndpoint, fetcher)

  // console.log(data);

  // const [questions, setQuestions] = useState(null)
  // useEffect(() => {
  //   setQuestions(data)
  // })

  const [selectedQuestion, setSelectedQuestion] = useState(null)
  useEffect(() => {
    if (questions) setSelectedQuestion(questions[0])
  }, [questions])

  const formatDate = (str) => {
    return format(parseISO(str), 'MMM do yyyy')
  }

  function handleQuestionChange (e) {
    setSelectedQuestion(questions.find(q => q.id === e.target.value))
  }

  return (
    <main className={styles.container}>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/pop.jpeg" />
      </Head>

      <h1 className={styles.header}>{title}</h1>

      <form name="answers" method="POST" action="/thanks" encType="application/x-www-form-urlencoded" className={questions ? '': styles.hasQuestions}>
        <input type="hidden" name="form-name" value="answers" />
        <div className={styles.formField}>
          <label className={styles.label}>
            Question date:
            <select name="questionID" className={styles.select} onChange={handleQuestionChange}>
              {
                (questions && questions.length > 0) && questions.map(q => (
                  <option value={q.id} key={q.id}>{formatDate(q.fields["Question Date"])}</option>
                ))
              }
              {
                (!questions || questions.length === 0) && <option value="—">No questions available</option>
              }
            </select>
          </label>
        </div>
        <div className={styles.formField}>
          <p className={styles.question}>
            {selectedQuestion && selectedQuestion.fields.Question}
          </p>
          {(selectedQuestion && selectedQuestion.fields["Asked By"]) && (
            <p>Asked by: {selectedQuestion.fields["Asked By"]}</p>
          )}
          <textarea name="answer" className={styles.textarea}></textarea>
        </div>

        <div className={styles.formField}>
          <button type="submit" className={`${styles.submit} ${styles.button}`}>Submit</button>
        </div>
      </form>

      {
        (!questions || questions.length == 0) && (
          <h2>There are no new questions to answer. Come back next week!</h2>
        )
      }

    </main>
  )
}
