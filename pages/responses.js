import Head from 'next/head'
import Link from 'next/link'
import { format, parseISO } from 'date-fns'
import { fetcher, formatDate } from '../utils'
import styles from '../styles/Home.module.scss'
import useSWR from 'swr'
import { ResponseCard } from '../components/response-card'
import { useEffect, useState } from 'react'

const title = "Pop's Responses"
const responsesEndpoint = "/.netlify/functions/responses/"

export default function Home() {

  const { data: responses, error } = useSWR(responsesEndpoint, fetcher)
  const doResponsesExist = () => responses && responses.length > 0

  const [filteredResponses, setFilteredResponses] = useState(responses)
  useEffect(() => {
    setFilteredResponses(responses)
  }, [responses])

  const handleSearch = ({target: {value}}) => {
    if (doResponsesExist) {
      if (value) {
        setFilteredResponses(responses.filter(resp => {
          const [text] = resp.fields['Question Text']
          const date = resp.fields['Answered on']
          const fullMonthFormat = (date) => format(parseISO(date), 'MMMM do yyyy')
          const isValueInText = text.toLowerCase().includes(value.toLowerCase())
          const isValueInDate = formatDate(date).toLowerCase().includes(value.toLowerCase()) 
            || fullMonthFormat(date).toLowerCase().includes(value.toLowerCase())
          return isValueInText || isValueInDate
        }))
      } else {
        setFilteredResponses(responses)
      }
    }
  }

  return (
    <main className={styles.container}>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/pop.jpeg" />
      </Head>

      <h1 className={styles.header}>{title}</h1>
      
      <div className={styles.space_between}>
        <Link href="/">
          <span className={`${styles.button} ${styles.button_light}`}>Answer latest question</span>
        </Link>

        <input
          type="search"
          placeholder='Search question or date...'
          onChange={handleSearch}
          className={styles.search_bar}
        />
      </div>


      {
        doResponsesExist && filteredResponses && filteredResponses.map(response => {

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
        (doResponsesExist && filteredResponses && filteredResponses.length == 0) && <h3>No results found. Try a different search.</h3>
      }

      {
        (!doResponsesExist && !error) && <h3>Loading responses...</h3>
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
