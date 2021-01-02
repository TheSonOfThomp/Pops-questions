import Head from 'next/head'
import styles from '../styles/Home.module.css'

const title = "Thanks Pop!"

export default function Thanks() {
  return (
    <main className={styles.container}>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className={styles.header}>{title}</h1>
      <a href="/" className={`${styles.button}`}>Answer another?</a>
    </main>
  )
}