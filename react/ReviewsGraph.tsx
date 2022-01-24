import type { FunctionComponent } from 'react'
import React from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { FormattedMessage } from 'react-intl'

interface Props {
  reviewsStats: any
}

const CSS_HANDLES = [
  'graphContent',
  'graphContainer',
  'graphText',
  'graphTextLabel',
  'graphBarContainer',
  'graphBar',
  'graphBarPercent',
] as const

const ReviewsGraph: FunctionComponent<Props> = props => {
  const handles = useCssHandles(CSS_HANDLES)

  return (
    <div className={`${handles.graphContent} mv5`}>
      <div className={`${handles.graphContainer} mv5 flex`}>
        <div className={`${handles.graphText} mr5`}>
          <span className={`${handles.graphTextLabel}`}>
            <FormattedMessage
              id="store/reviews.list.graph.stars"
              values={{
                value: 5,
              }}
            />
          </span>
        </div>
        <div className={`${handles.graphBarContainer}`}>
          <span className={`${handles.graphBarPercent}`}>
            {props.reviewsStats[0]
              ? `${((props.reviewsStats[5] / props.reviewsStats[0]) * 100)
                  .toFixed(0)
                  .toString()}%`
              : '0%'}
          </span>
          <div
            className={`${handles.graphBar} h-100`}
            style={{
              width: props.reviewsStats[0]
                ? `${(
                    (props.reviewsStats[5] / props.reviewsStats[0]) *
                    100
                  ).toString()}%`
                : '0%',
            }}
          />
        </div>
      </div>
      <div className={`${handles.graphContainer} mv5 flex`}>
        <div className={`${handles.graphText} mr5`}>
          <span className={`${handles.graphTextLabel}`}>
            <FormattedMessage
              id="store/reviews.list.graph.stars"
              values={{
                value: 4,
              }}
            />
          </span>
        </div>
        <div className={`${handles.graphBarContainer}`}>
          <span className={`${handles.graphBarPercent}`}>
            {props.reviewsStats[0]
              ? `${((props.reviewsStats[4] / props.reviewsStats[0]) * 100)
                  .toFixed(0)
                  .toString()}%`
              : '0%'}
          </span>
          <div
            className={`${handles.graphBar} h-100`}
            style={{
              width: props.reviewsStats[0]
                ? `${(
                    (props.reviewsStats[4] / props.reviewsStats[0]) *
                    100
                  ).toString()}%`
                : '0%',
            }}
          />
        </div>
      </div>
      <div className={`${handles.graphContainer} mv5 flex`}>
        <div className={`${handles.graphText} mr5`}>
          <span className={`${handles.graphTextLabel}`}>
            <FormattedMessage
              id="store/reviews.list.graph.stars"
              values={{
                value: 3,
              }}
            />
          </span>
        </div>
        <div className={`${handles.graphBarContainer}`}>
          <span className={`${handles.graphBarPercent}`}>
            {props.reviewsStats[0]
              ? `${((props.reviewsStats[3] / props.reviewsStats[0]) * 100)
                  .toFixed(0)
                  .toString()}%`
              : '0%'}
          </span>
          <div
            className={`${handles.graphBar} h-100`}
            style={{
              width: props.reviewsStats[0]
                ? `${(
                    (props.reviewsStats[3] / props.reviewsStats[0]) *
                    100
                  ).toString()}%`
                : '0%',
            }}
          />
        </div>
      </div>
      <div className={`${handles.graphContainer} mv5 flex`}>
        <div className={`${handles.graphText} mr5`}>
          <span className={`${handles.graphTextLabel}`}>
            <FormattedMessage
              id="store/reviews.list.graph.stars"
              values={{
                value: 2,
              }}
            />
          </span>
        </div>
        <div className={`${handles.graphBarContainer}`}>
          <span className={`${handles.graphBarPercent}`}>
            {props.reviewsStats[0]
              ? `${((props.reviewsStats[2] / props.reviewsStats[0]) * 100)
                  .toFixed(0)
                  .toString()}%`
              : '0%'}
          </span>
          <div
            className={`${handles.graphBar} h-100`}
            style={{
              width: props.reviewsStats[0]
                ? `${(
                    (props.reviewsStats[2] / props.reviewsStats[0]) *
                    100
                  ).toString()}%`
                : '0%',
            }}
          />
        </div>
      </div>
      <div className={`${handles.graphContainer} mv5 flex`}>
        <div className={`${handles.graphText} mr5`}>
          <span className={`${handles.graphTextLabel}`}>
            <FormattedMessage
              id="store/reviews.list.graph.stars"
              values={{
                value: 1,
              }}
            />
          </span>
        </div>
        <div className={`${handles.graphBarContainer}`}>
          <span className={`${handles.graphBarPercent}`}>
            {props.reviewsStats[0]
              ? `${((props.reviewsStats[1] / props.reviewsStats[0]) * 100)
                  .toFixed(0)
                  .toString()}%`
              : '0%'}
          </span>
          <div
            className={`${handles.graphBar} h-100`}
            style={{
              width: props.reviewsStats[0]
                ? `${(
                    (props.reviewsStats[1] / props.reviewsStats[0]) *
                    100
                  ).toString()}%`
                : '0%',
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default ReviewsGraph
