import Head from 'next/head'
import styles from '../styles/Home.module.scss'

const title = "Thanks Pop!"

export default function Thanks() {
  return (
    <main className={styles.container}>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/pop.jpeg" />
      </Head>

      <h1 className={styles.header}>{title}</h1>
      <a href="/" className={`${styles.button}`}>Answer another?</a>
    </main>
  )
}