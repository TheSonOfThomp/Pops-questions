import Head from 'next/head'
import Link from 'next/link'
import { fetcher, formatDate } from '../utils'
import styles from '../styles/Home.module.scss'
import useSWR from 'swr'

const title = "Edit response"
const responsesEndpoint = "/.netlify/functions/getResponse/"

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

      
    </main>
  )
}