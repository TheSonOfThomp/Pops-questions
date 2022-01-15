import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import styles from '../styles/Home.module.scss'

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

      <h3>Here's what we got:</h3>
      <p className={styles.question}>{params?.get('question')}</p>
      <div>{
        params?.get('answer').split('\n').map(line => <p>{line}</p>)
      }</div>
      <br/>
      <div className={`${styles.formField} ${styles.buttonGroup}`}>
        <Link href={`/edit/${params?.get('answerID')}`}>
          <span className={`${styles.button}`}>Edit response</span>
        </Link>
        <Link href="/">
          <span className={`${styles.button}`}>Answer another</span>
        </Link>
        <Link href="/responses">
          <span className={`${styles.button} ${styles.button_light}`}>See past responses</span>
        </Link>
      </div>
    </main>
  )
}