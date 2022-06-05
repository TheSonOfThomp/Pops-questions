import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import useSWR from 'swr'
import { fetcher, formatDate } from '../utils'
import styles from '../styles/Home.module.scss'

const title = "Pop's Questions"
const questionsEndpoint = "/.netlify/functions/questions/"
const answersEndpoint = "/.netlify/functions/answer/"

export default function Home() {

  const answerElement = useRef()

  // Get a list of questions
  const { data: questions, error } = useSWR(questionsEndpoint, fetcher)
  const doQuestionsExist = () => questions && questions.length > 0

  // update the selected question
  const [selectedQuestion, setSelectedQuestion] = useState({fields:{Question: ''}})
  useEffect(() => {
    if (doQuestionsExist()) setSelectedQuestion(questions[0])
  }, [questions])

  // Update the textarea value when toggling questions
  useEffect(() => {
    const currentAnswer = localStorage.getItem(selectedQuestion.id)
    answerElement.current.value = currentAnswer
  }, [selectedQuestion])

  function handleQuestionChange(e) {
    setSelectedQuestion(questions.find(q => q.id === e.target.value))
  }

  function handleTyping(e) {
    localStorage.setItem(selectedQuestion.id, e.target.value)
  }

  return (
    <main className={styles.container}>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/pop.jpeg" />
      </Head>

      <h1 className={styles.header}>{title}</h1>

      <form 
        name="answers" 
        method="POST" 
        action={answersEndpoint}
        className={doQuestionsExist() ? '' : styles.hasQuestions}
      >
        <input type="hidden" name="form-name" value="answers" />
        <input type="text" name="email" className={styles.honeypot} />

        <div className={styles.formField}>
          <label className={styles.label}>
            Question date:
              <select name="questionID" className={styles.select} onChange={handleQuestionChange}>
              {
                doQuestionsExist() && questions.map(q => (
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
          <textarea ref={answerElement} id={selectedQuestion.id} required name="answer" className={styles.textarea} onChange={handleTyping}></textarea>
        </div>

        {
          doQuestionsExist() && (
            <div className={`${styles.formField} ${styles.buttonGroup}`}>
              <Link href="responses"><span className={`${styles.button} ${styles.button_light}`}>See past responses</span></Link>
              <button type="submit" className={`${styles.submit} ${styles.button}`}>Submit</button>
            </div>
          )
        }
      </form>

      {
        (questions && questions.length == 0) && (
          <div>
            <h2>There are no new questions to answer. Come back next week!</h2>
            <Link href="responses"><span className={`${styles.button} ${styles.button_light}`}>See past responses</span></Link>
          </div>
        )
      }

      { error && (
          <div className={styles.errorNotification}>
            <h2>Couldn't get the questions</h2>
            <p>Copy this and send it to Adam</p>
            <pre className={styles.codeSnippet}>
              <code>{JSON.stringify(error, Object.getOwnPropertyNames(error), 2)}</code>
            </pre>
          </div>
        )
      }

    </main>
  )
}
