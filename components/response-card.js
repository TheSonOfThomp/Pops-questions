import { formatDate } from '../utils'
import styles from '../styles/Home.module.scss'
import cardStyles from './response-card.module.scss'
import { useState } from 'react'
import Link from 'next/link'


const collapsedCharLimit = 128;

export const ResponseCard = ({
  date,
  question,
  questionId,
  answer,
  answerId,
}) => {

  const [isExpanded, setExpanded] = useState(false)

  const content = isExpanded
    ? answer.split('\n').map(line => <p key={line}>{line}</p>)
    : (answer.slice(0, collapsedCharLimit) + '...').split('\n').map(line => <p key={line}>{line}</p>)

  return (
    <div className={styles.response}>
      <span>{formatDate(date)}</span>
      <h2>{question[0]}</h2>
      <div className={cardStyles.content}>
        {content}
      </div>
      <div className={cardStyles.button_wrapper}>
        <button
          className={`${styles.button} ${styles.button_light} ${styles.button_small}`}
          onClick={() => setExpanded(!isExpanded)}
        >Show {isExpanded ? 'less' : 'full answer'}</button>
        
        <Link href={`/edit/${answerId}`}>
          <span className={`${styles.button} ${styles.button_small}`}>
            Edit response
          </span>
        </Link>
      </div>
    </div>
  )
}