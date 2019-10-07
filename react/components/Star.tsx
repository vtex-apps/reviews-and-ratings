import React, { FunctionComponent } from 'react'
import styles from '../styles.css'

const Star: FunctionComponent<StarProps> = ({ filled }) => {
  const style = filled ? styles['star--filled'] : styles['star--empty']
  const content = filled ? '★' : '☆'

  return <span className={`${styles.star} ${style}`}>{content}</span>
}

interface StarProps {
  filled: boolean
}

export default Star
