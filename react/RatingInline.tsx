import React, { Fragment, useEffect, useReducer } from 'react'
import type { ApolloQueryResult } from 'apollo-client'
import { useApolloClient } from 'react-apollo'
import { useCssHandles } from 'vtex.css-handles'
import { useProduct } from 'vtex.product-context'

import Stars from './components/Stars'
import TotalReviewsByProductId from '../graphql/totalReviewsByProductId.graphql'
import AverageRatingByProductId from '../graphql/averageRatingByProductId.graphql'
import AppSettings from '../graphql/appSettings.graphql'

interface TotalData {
  totalReviewsByProductId: number
}

interface AverageData {
  averageRatingByProductId: number
}

interface SettingsData {
  appSettings: AppSettings
}

interface AppSettings {
  allowAnonymousReviews: boolean
  requireApproval: boolean
  useLocation: boolean
  defaultOpen: boolean
  defaultStarsRating: number
  defaultOpenCount: number
  showGraph: boolean
  displaySummaryIfNone: boolean
  displayInlineIfNone: boolean
  displaySummaryTotalReviews: boolean
  displaySummaryAddButton: boolean
}

interface State {
  total: number
  average: number
  hasTotal: boolean
  hasAverage: boolean
  settings: AppSettings
}

type ReducerActions =
  | { type: 'SET_TOTAL'; args: { total: number } }
  | { type: 'SET_AVERAGE'; args: { average: number } }
  | { type: 'SET_SETTINGS'; args: { settings: AppSettings } }

const initialState = {
  total: 0,
  average: 0,
  hasTotal: false,
  hasAverage: false,
  settings: {
    defaultOpen: false,
    defaultStarsRating: 5,
    defaultOpenCount: 0,
    allowAnonymousReviews: false,
    requireApproval: true,
    useLocation: false,
    showGraph: false,
    displaySummaryIfNone: false,
    displayInlineIfNone: false,
    displaySummaryTotalReviews: true,
    displaySummaryAddButton: false,
  },
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

    case 'SET_SETTINGS':
      return {
        ...state,
        settings: action.args.settings,
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

    client
      .query({
        query: AppSettings,
        fetchPolicy: 'network-only',
      })
      .then((response: ApolloQueryResult<SettingsData>) => {
        const settings = response.data.appSettings

        dispatch({
          type: 'SET_SETTINGS',
          args: { settings },
        })
      })
  }, [client, productId])

  return (
    <div className={`${handles.inlineContainer} review-summary mw8 center`}>
      {!state.hasTotal || !state.hasAverage ? null : state.total === 0 &&
        !state.settings.displayInlineIfNone ? null : (
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
