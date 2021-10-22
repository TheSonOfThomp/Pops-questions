import Head from 'next/head'
import Link from 'next/link'
import { fetcher, formatDate } from '../utils'
import styles from '../styles/Home.module.scss'
import useSWR from 'swr'

const title = "Pop's Responses"
const responsesEndpoint = "/.netlify/functions/responses/"

export default function Home() {

  const { data: responses, error } = useSWR(responsesEndpoint, fetcher)
  const doResponsesExist = () => responses && responses.length > 0

  return (
    <main className={styles.container}>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/pop.jpeg" />
      </Head>

      <h1 className={styles.header}>{title}</h1>

      <Link href="/">
        <span className={`${styles.button} ${styles.button_light}`}>Answer latest question</span>
      </Link>

      {
        responses && responses.map(response => {
          const {
            fields: {
              Answer: answer,
              'Answered on': date,
              'Question Text': question
            }
          } = response
          
          return question && (
            <div className={styles.response}>
              <span>{formatDate(date)}</span>
              <h2>{question[0]}</h2>
              <div>
                {answer.split('\n').map(line => <p>{line}</p>)}
              </div>
            </div>
          )
        })
      }

      { error && (
        <div className={styles.errorNotification}>
          <h2>Couldn't get responses</h2>
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
