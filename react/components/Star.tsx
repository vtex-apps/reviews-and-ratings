import React, { FunctionComponent } from 'react'

import styles from '../styles.css'

const Star: FunctionComponent<StarProps> = ({ filled, onClick, index = 0 }) => {
  const style = filled ? styles['star--filled'] : styles['star--empty']
  const content = filled ? '★' : '☆'

  const handleClick = (
    event:
      | React.KeyboardEvent<HTMLSpanElement>
      | React.MouseEvent<HTMLSpanElement>,
    idx: number
  ) => {
    onClick?.(event, idx)
  }

  return (
    <span
      className={`${styles.star} ${style}`}
      role={onClick && 'button'}
      onClick={(event: React.MouseEvent<HTMLSpanElement>) =>
        handleClick(event, index)
      }
      onKeyDown={(event: React.KeyboardEvent<HTMLSpanElement>) =>
        handleClick(event, index)
      }
    >
      {content}
    </span>
  )
}

interface StarProps {
  filled: boolean
  index?: number
  onClick?: (
    event:
      | React.KeyboardEvent<HTMLSpanElement>
      | React.MouseEvent<HTMLSpanElement>,
    index: number
  ) => void
}

export default Star
