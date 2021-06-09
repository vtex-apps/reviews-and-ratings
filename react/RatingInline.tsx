import React, { Fragment, useEffect, useReducer } from 'react'
import { ApolloQueryResult } from 'apollo-client'
import { useApolloClient } from 'react-apollo'
import { useCssHandles } from 'vtex.css-handles'
import { useProduct } from 'vtex.product-context'

import Stars from './components/Stars'
import TotalReviewsByProductId from '../graphql/totalReviewsByProductId.graphql'
import TotalReviewsByProductId5 from '../graphql/totalReviewsByProductId5.graphql'
import TotalReviewsByProductId4 from '../graphql/totalReviewsByProductId4.graphql'
import TotalReviewsByProductId3 from '../graphql/totalReviewsByProductId3.graphql'
import TotalReviewsByProductId2 from '../graphql/totalReviewsByProductId2.graphql'
import TotalReviewsByProductId1 from '../graphql/totalReviewsByProductId1.graphql'
import AverageRatingByProductId from '../graphql/averageRatingByProductId.graphql'

interface TotalData {
  totalReviewsByProductId: number
}

interface TotalData5 {
  totalReviewsByProductId5: number
}

interface TotalData4 {
  totalReviewsByProductId4: number
}

interface TotalData3 {
  totalReviewsByProductId3: number
}

interface TotalData2 {
  totalReviewsByProductId2: number
}

interface TotalData1 {
  totalReviewsByProductId1: number
}

interface AverageData {
  averageRatingByProductId: number
}

interface State {
  total: number
  total5: number
  total4: number
  total3: number
  total2: number
  total1: number
  average: number
  hasTotal: boolean
  hasAverage: boolean
}

type ReducerActions =
  | { type: 'SET_TOTAL'; args: { total: number } }
  | { type: 'SET_TOTAL_5'; args: { total5: number } }
  | { type: 'SET_TOTAL_4'; args: { total4: number } }
  | { type: 'SET_TOTAL_3'; args: { total3: number } }
  | { type: 'SET_TOTAL_2'; args: { total2: number } }
  | { type: 'SET_TOTAL_1'; args: { total1: number } }
  | { type: 'SET_AVERAGE'; args: { average: number } }

const initialState = {
  total: 0,
  total5: 0,
  total4: 0,
  total3: 0,
  total2: 0,
  total1: 0,
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
      case 'SET_TOTAL_5':
        return {
          ...state,
          total5: action.args.total5
        }
      case 'SET_TOTAL_4':
        return {
          ...state,
          total4: action.args.total4
        }
      case 'SET_TOTAL_3':
        return {
          ...state,
          total3: action.args.total3
        }
      case 'SET_TOTAL_2':
        return {
          ...state,
          total2: action.args.total2
        }
      case 'SET_TOTAL_1':
        return {
          ...state,
          total1: action.args.total1
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

const CSS_HANDLES = ['inlineContainer'] as const

function RatingInline() {
  const client = useApolloClient()
  const handles = useCssHandles(CSS_HANDLES)
  const { product } = useProduct() ?? {}
  const { productId } = product ?? {}

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
        query: TotalReviewsByProductId5,
        variables: {
          productId,
        },
      })
      .then((response: ApolloQueryResult<TotalData5>) => {
        const total5 = response.data.totalReviewsByProductId5
        dispatch({
          type: 'SET_TOTAL_5',
          args: { total5 },
        })
      })

    client
      .query({
        query: TotalReviewsByProductId4,
        variables: {
          productId,
        },
      })
      .then((response: ApolloQueryResult<TotalData4>) => {
        const total4 = response.data.totalReviewsByProductId4
        dispatch({
          type: 'SET_TOTAL_4',
          args: { total4 },
        })
      })

    client
      .query({
        query: TotalReviewsByProductId3,
        variables: {
          productId,
        },
      })
      .then((response: ApolloQueryResult<TotalData3>) => {
        const total3 = response.data.totalReviewsByProductId3
        dispatch({
          type: 'SET_TOTAL_3',
          args: { total3},
        })
      })

    client
      .query({
        query: TotalReviewsByProductId2,
        variables: {
          productId,
        },
      })
      .then((response: ApolloQueryResult<TotalData2>) => {
        const total2 = response.data.totalReviewsByProductId2
        dispatch({
          type: 'SET_TOTAL_2',
          args: { total2 },
        })
      })

    client
      .query({
        query: TotalReviewsByProductId1,
        variables: {
          productId,
        },
      })
      .then((response: ApolloQueryResult<TotalData1>) => {
        const total1 = response.data.totalReviewsByProductId1
        dispatch({
          type: 'SET_TOTAL_1',
          args: { total1 },
        })
      })

    client
      .query({
        query: TotalReviewsByProductId3,
        variables: {
          productId,
        },
      })
      .then((response: ApolloQueryResult<TotalData5>) => {
        const total5 = response.data.totalReviewsByProductId5
        dispatch({
          type: 'SET_TOTAL_5',
          args: { total5 },
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
    <div className={`${handles.inlineContainer} review-summary mw8 center`}>
      {!state.hasTotal || !state.hasAverage ? null : state.total ===
        0 ? null : (
        <Fragment>
          <span className="t-heading-5 v-mid">
            <Stars rating={state.average} />
          </span>
        </Fragment>
      )}
    </div>
  )
}

export default RatingInline
