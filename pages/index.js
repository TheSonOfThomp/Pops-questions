import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { allQuestionDates } from '../utils'

export default function Home() {
  return (
    <main className={styles.container}>
      <Head>
        <title>Pop's Answers</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className={styles.header}>Pop's Answers</h1>

      <form name="answers" method="POST" data-netlify="true">
        <div className={styles.formField}>
          <label className={styles.label}>
            Week of:
            <select className={styles.select}>
              {
                allQuestionDates.map(date => (
                  <option value={date}>{date}</option>
                ))
              }
            </select>
          </label>
        </div>

        <div className={styles.formField}>
          <p className={styles.question}>
            Maecenas faucibus mollis interdum. Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Maecenas faucibus mollis interdum. Maecenas faucibus mollis interdum. Aenean lacinia bibendum nulla sed consectetur. Aenean lacinia bibendum nulla sed consectetur?
          </p>
          <textarea className={styles.textarea}></textarea>
        </div>

        <div className={styles.formField}>
          <button type="submit" className={styles.submit}>Submit</button>
        </div>
      </form>

    </main>
  )
}
