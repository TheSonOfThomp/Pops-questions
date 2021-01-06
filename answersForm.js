import { format, parseISO } from 'date-fns'
import { useEffect, useState } from 'react'
import useSWR from 'swr'
import styles from './styles/Home.module.scss'

const questionsEndpoint = "/.netlify/functions/questions/"
const answersEndpoint = "/.netlify/functions/answer/"

const fetcher = (...args) => fetch(...args).then(res => {
  if (res.ok) return res.json()
  else throw new Error(`Could not fetch questions. Status: ${res.status}. Status Text: ${res.statusText}`)
})

export function AnswersForm() {

  const { data: questions, error } = useSWR(questionsEndpoint, fetcher)

  const [selectedQuestion, setSelectedQuestion] = useState({fields:{Question: ''}})
  useEffect(() => {
    if (questions) setSelectedQuestion(questions[0])
  }, [questions])

  const formatDate = (str) => {
    return format(parseISO(str), 'MMM do yyyy')
  }

  const doQuestionsExist = questions && questions.length > 0

  function handleQuestionChange(e) {
    setSelectedQuestion(questions.find(q => q.id === e.target.value))
  }

  return (
    <>
    <form 
      name="answers" 
      method="POST" 
      action={answersEndpoint}
      className={doQuestionsExist ? '' : styles.hasQuestions}
    >
      <input type="hidden" name="form-name" value="answers" />
      <input type="text" name="email" className={styles.honeypot} value=""/>

      <div className={styles.formField}>
        <label className={styles.label}>
          Question date:
            <select name="questionID" className={styles.select} onChange={handleQuestionChange}>
            {
              doQuestionsExist && questions.map(q => (
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
        <textarea required name="answer" className={styles.textarea}></textarea>
      </div>

      {
        doQuestionsExist && (
          <div className={styles.formField}>
            <button type="submit" className={`${styles.submit} ${styles.button}`}>Submit</button>
          </div>
        )
      }
    </form>

    {
      (questions && questions.length == 0) && (
        <h2>There are no new questions to answer. Come back next week!</h2>
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

    </>
  )
}