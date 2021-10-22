import Head from 'next/head'
import Link from 'next/link'
import { AnswersForm } from '../answersForm'
import styles from '../styles/Home.module.scss'

const title = "Pop's Questions"

export default function Home() {

  return (
    <main className={styles.container}>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/pop.jpeg" />
      </Head>

      <h1 className={styles.header}>{title}</h1>

      <AnswersForm />

      <Link href="responses"><span className={`${styles.button} ${styles.button_light}`}>See past responses</span></Link>
    </main>
  )
}
