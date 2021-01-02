import Head from 'next/head'
import styles from '../styles/Home.module.css'

const title = "Ask Pop a Question"

export default function Ask() {
  return (
    <main className={styles.container}>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className={styles.header}>{title}</h1>

      <form name="ask" method="POST" action="/ask" data-netlify="true">
        <input type="hidden" name="form-name" value="ask" />

        <div className={styles.formField}>
          <label className={styles.label}>
            For week of:
            <select name="weekOf" className={styles.select}>
              <option>Jan 10</option>
            </select>
          </label>
        </div>

        <div className={styles.formField}>
          <label className={styles.label}>
            Question:
          </label>
          <textarea name="question" className={styles.textarea}></textarea>
        </div>

        <div className={styles.formField}>
          <button type="submit" className={`${styles.submit} ${styles.button}`}>Submit</button>
        </div>
      </form>

    </main>
  )
}