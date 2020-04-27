import React, { FunctionComponent, useMemo } from 'react'

import Star from './Star'
import styles from '../styles.css'

const Stars: FunctionComponent<StarsProps> = ({ rating }) => {
  const stars = useMemo(
    () =>
      [null, null, null, null, null].map(
        (_, index) => index < Math.floor(rating)
      ),
    [rating]
  )

  return (
    <span className={`${styles.stars} c-action-primary`}>
      {stars.map((value, index) => (
        <Star key={index} filled={value} />
      ))}
    </span>
  )
}

interface StarsProps {
  rating: number
}

export default Stars
