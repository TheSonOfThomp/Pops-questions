import Head from 'next/head'
import { useEffect, useState } from 'react'
import styles from '../styles/Home.module.css'

const title = "Thanks Pop!"

export default function Thanks() {

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

      <h3>Here's what we got</h3>
      <p className={styles.question}>{params?.get('question')}</p>
      <p>{params?.get('answer')}</p>
      <br/>
      <a href="/" className={`${styles.button}`}>Answer another?</a>
    </main>
  )
}