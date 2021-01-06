import Head from 'next/head'
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import styles from '../styles/Home.module.css'

const title = "Something went wrong"

export default function Error() {

  const [params, setParams] = useState()
  useEffect(() => {
    setParams(new URLSearchParams(document.location.search))
  }, [])

  return (
    <main className={styles.container}>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/pop.jpeg" />
      </Head>

      <h1 className={styles.header}>{title}</h1>
      <p>
        <h3>Here's what we got:</h3>
        <div>
          <strong>questionID: </strong><span>{params?.get('questionID')}</span>
        </div>
        <div>
          <strong>Answer: </strong><span>{params?.get('answer')}</span>
        </div>
      </p>
      <br/>

      <a href="/" className={`${styles.button}`}>Try again?</a>
    </main>
  )
}