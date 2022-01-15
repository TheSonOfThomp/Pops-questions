import Head from 'next/head'
import Link from 'next/link'
import { fetcher, formatDate } from '../utils'
import styles from '../styles/Home.module.scss'
import useSWR from 'swr'
import { ResponseCard } from '../components/response-card'

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
        doResponsesExist && responses.map(response => {

          const {
            id: answerId,
            fields: {
              Answer: answer,
              'Answered on': date,
              'Question Text': question,
              'Question': questionId,
            }
          } = response
          
          return question && (
            <ResponseCard
              key={questionId}
              date={date}
              question={question}
              questionId={questionId}
              answer={answer}
              answerId={answerId}
            />
          )
        })
      }

      {
        (!responses && !error) && <h3>Loading responses...</h3>
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
