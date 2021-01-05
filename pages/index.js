import Head from 'next/head'
import { AnswersForm } from '../answersForm'
import styles from '../styles/Home.module.css'

const title = "Pop's Questions"

export default function Home() {

  return (
    <main className={styles.container}>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/pop.jpeg" />
      </Head>

      <h1 className={styles.header}>{title}</h1>

      <form name="answers" netlify hidden>
        <input type="hidden" name="form-name" value="answers" />
        <select name="questionID"></select>
        <textarea name="answer"></textarea>
      </form>

      <AnswersForm />

    </main>
  )
}
