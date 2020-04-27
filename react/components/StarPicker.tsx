import React, { FunctionComponent, useMemo } from 'react'

import Star from './Star'
import styles from '../styles.css'

const StarPicker: FunctionComponent<StarPickerProps> = ({
  onStarClick,
  rating,
  label,
}) => {
  // const [rating, setRating] = useState(3)
  const stars = useMemo(
    () =>
      [null, null, null, null, null].map(
        (_, index) => index < Math.floor(rating)
      ),
    [rating]
  )

  // const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   onChange(event)
  // }

  const handleStarClick = (
    event:
      | React.KeyboardEvent<HTMLSpanElement>
      | React.MouseEvent<HTMLSpanElement>,
    index: number
  ) => {
    onStarClick(event, index)
  }

  // const inputStyles = {
  //   display: 'none',
  //   position: 'absolute' as 'absolute',
  //   marginLeft: -9999,
  // }

  const labelClasses = 'vtex-input__label db mb3 w-100 c-on-base '

  return (
    <label className={`${styles.starpicker} c-action-primary`}>
      {label && <span className={labelClasses}>{label}</span>}
      <span className="t-heading-4 pointer">
        {stars.map((value, index) => (
          <Star
            key={index}
            filled={value}
            index={index}
            onClick={handleStarClick}
          />
        ))}
      </span>
      {/* <input
        type="number"
        value={rating}
        style={inputStyles}
        onChange={handleChange}
      ></input> */}
    </label>
  )
}

interface StarPickerProps {
  label?: string
  // onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  rating: number
  onStarClick: (
    event:
      | React.KeyboardEvent<HTMLSpanElement>
      | React.MouseEvent<HTMLSpanElement>,
    index: number
  ) => void
}

export default StarPicker
