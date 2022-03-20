import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { fetcher, formatDate } from '../../utils'
import styles from '../../styles/Home.module.scss'
import useSWR from 'swr'
import { useEffect, useRef, useState } from 'react'

const title = "Edit response"
const answersEndpoint = "/.netlify/functions/answer/"
const responsesEndpoint = "/.netlify/functions/getResponse"

export default function Home() {

  const router = useRouter()
  const { responseId } = router.query
  const { data: response, error } = useSWR(`${responsesEndpoint}/?id=${responseId ?? ''}`, fetcher)
  const doesResponseExist = () => response && response.length > 0
  if (!doesResponseExist) return (
    <div>No response available for {responseId}</div>
  )
  
  const answerElement = useRef()

  let questionId, questionText, answer, answerDate

  if (doesResponseExist) {
    questionId = response?.fields['Question'][0]
    questionText = response?.fields['Question Text'][0]
    answer = response?.fields['Answer']
    answerDate = response?.fields['Answer Date']
  }

  useEffect(() => {
    answerElement.current.value = answer ?? ''
  }, [answer])

  useEffect(() => {
    if (answer) {
      const charLength = answer.length
      const elementWidth = answerElement.current.clientWidth
      const pxPerChar = 8;
      const pxLength = charLength * pxPerChar
      const lines = Math.ceil(pxLength / elementWidth)
      answerElement.current.style.height = `${(lines) * 1.5}em`
    }
  }, [answer])

  const readFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }; 

  const [file, setFile] = useState(null)

  const handleImageSelection = ({target}) => {
    setFile('pending')
    if (target.files.length > 0) {
      readFile(target.files[0]).then(file => {
        setFile(file)
      })
    }
  }
  
  return (
    <main className={styles.container}>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/pop.jpeg" />
      </Head>

      <h1 className={styles.header}>{title}</h1>
      {
        doesResponseExist && (
          <div>
            <h2>{questionText}</h2>
            <form
              name="answers"
              method="POST"
              action={answersEndpoint}
              className={styles.form}
            >
              <input type="hidden" name="form-name" value="answers" />
              <input type="hidden" name="answerID" value={responseId} />
              <input type="hidden" name="questionID" value={questionId} />
              <input type="text" name="email" className={styles.honeypot} />

              <div className={styles.formField}>
                <textarea 
                  required 
                  ref={answerElement} 
                  id={responseId} 
                  name="answer" 
                  className={`${styles.textarea}`} 
                />
              </div>

              <label htmlFor='photos'> Add a photo: </label>
              <br/>
              <input
                className={`${styles.upload}`}
                // multiple
                type="file" 
                id="photo-upload"
                name="image-name"
                accept="image/*"
                onChange={handleImageSelection}
              />

              <input type="hidden" name="photos" value={file} />

              <div className={`${styles.formField} ${styles.buttonGroup}`}>
                <Link href="/responses">
                  <span className={`${styles.button} ${styles.button_light}`}>See past responses</span>
                </Link>
                <button 
                  type="submit"
                  disabled={file === 'pending'}
                  className={`${styles.submit} ${styles.button}`}
                >Save Changes</button>
              </div>
            </form>
          </div>
        )
      }
      
    </main>
  )
}