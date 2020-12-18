import React, { Fragment, useEffect, useReducer } from 'react'
import { Helmet } from 'react-helmet'
import { ApolloQueryResult } from 'apollo-client'
import { useApolloClient } from 'react-apollo'
import { useProduct } from 'vtex.product-context'
import { useCssHandles } from 'vtex.css-handles'

import Stars from './components/Stars'
import TotalReviewsByProductId from '../graphql/totalReviewsByProductId.graphql'
import AverageRatingByProductId from '../graphql/averageRatingByProductId.graphql'

interface TotalData {
  totalReviewsByProductId: number
}

interface AverageData {
  averageRatingByProductId: number
}

interface State {
  total: number
  average: number
  hasTotal: boolean
  hasAverage: boolean
}

type ReducerActions =
  | { type: 'SET_TOTAL'; args: { total: number } }
  | { type: 'SET_AVERAGE'; args: { average: number } }

const initialState = {
  total: 0,
  average: 0,
  hasTotal: false,
  hasAverage: false,
}

const reducer = (state: State, action: ReducerActions) => {
  switch (action.type) {
    case 'SET_TOTAL':
      return {
        ...state,
        total: action.args.total,
        hasTotal: true,
      }
    case 'SET_AVERAGE':
      return {
        ...state,
        average: action.args.average,
        hasAverage: true,
      }
    default:
      return state
  }
}

const CSS_HANDLES = ['summaryContainer'] as const

function RatingSummary() {
  const client = useApolloClient()
  const handles = useCssHandles(CSS_HANDLES)
  const { product } = useProduct() ?? {}
  const { productId, productName } = product ?? {}

  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    if (!productId) {
      return
    }

    client
      .query({
        query: TotalReviewsByProductId,
        variables: {
          productId,
        },
      })
      .then((response: ApolloQueryResult<TotalData>) => {
        const total = response.data.totalReviewsByProductId
        dispatch({
          type: 'SET_TOTAL',
          args: { total },
        })
      })

    client
      .query({
        query: AverageRatingByProductId,
        variables: {
          productId,
        },
      })
      .then((response: ApolloQueryResult<AverageData>) => {
        const average = response.data.averageRatingByProductId
        dispatch({
          type: 'SET_AVERAGE',
          args: { average },
        })
      })
  }, [client, productId])

  return (
    <div className={`${handles.summaryContainer} review-summary mw8 center`}>
      {!state.hasTotal || !state.hasAverage ? (
        <Fragment>Loading reviews...</Fragment>
      ) : state.total === 0 ? null : (
        <Fragment>
          <Helmet>
            <script type="application/ld+json">
              {JSON.stringify({
                '@context': 'http://schema.org',
                '@type': 'Product',
                aggregateRating: {
                  '@type': 'AggregateRating',
                  ratingValue: state.average.toString(),
                  reviewCount: state.total.toString(),
                },
                name: productName,
              })}
            </script>
          </Helmet>
          <span className="t-heading-4 v-mid">
            <Stars rating={state.average} />
          </span>{' '}
          <span className="review__rating--count dib v-mid">
            ({state.total})
          </span>
        </Fragment>
      )}
    </div>
  )
}

export default RatingSummary
