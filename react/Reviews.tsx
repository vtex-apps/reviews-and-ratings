import React, {
  FunctionComponent,
  Fragment,
  useContext,
  useEffect,
  useReducer,
} from 'react'
import ApolloClient, { ApolloQueryResult } from 'apollo-client'
import { NormalizedCacheObject } from 'apollo-cache-inmemory'
import { withApollo } from 'react-apollo'
import { path } from 'ramda'
import { ProductContext, Product } from 'vtex.product-context'
import Stars from './components/Stars'
import ReviewForm from './ReviewForm'
import { generateBlockClass, BlockClass } from '@vtex/css-handles'
import styles from './styles.css'
import AppSettings from '../graphql/appSettings.graphql'
import ReviewsByProductId from '../graphql/reviewsByProductId.graphql'
import TotalReviewsByProductId from '../graphql/totalReviewsByProductId.graphql'
import AverageRatingByProductId from '../graphql/averageRatingByProductId.graphql'

import {
  IconSuccess,
  Pagination,
  Collapsible,
  Dropdown,
  //Button,
} from 'vtex.styleguide'

interface Props {
  client: ApolloClient<NormalizedCacheObject>
}

interface Review {
  id: number
  cacheId: number
  productId: string
  rating: number
  title: string
  text: string
  location: string | null
  reviewerName: string
  shopperId: string
  reviewDateTime: string
  verifiedPurchaser: boolean
}

interface Range {
  total: number
  from: number
  to: number
}

interface ReviewsResult {
  data: Review[]
  range: Range
}

interface ReviewsData {
  reviewsByProductId: ReviewsResult
}

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
}

interface State {
  sort: string
  from: number
  to: number
  reviews: Review[] | null
  total: number
  average: number
  hasTotal: boolean
  hasAverage: boolean
  showForm: boolean
  openReview: number | null
  settings: AppSettings
  userAuthenticated: boolean
}

type ReducerActions =
  | { type: 'SET_NEXT_PAGE' }
  | { type: 'SET_PREV_PAGE' }
  | { type: 'TOGGLE_REVIEW_FORM' }
  | { type: 'TOGGLE_REVIEW_ACCORDION'; args: { reviewNumber: number } }
  | { type: 'SET_SELECTED_SORT'; args: { sort: string } }
  | { type: 'SET_REVIEWS'; args: { reviews: Review[] } }
  | { type: 'SET_TOTAL'; args: { total: number } }
  | { type: 'SET_AVERAGE'; args: { average: number } }
  | { type: 'SET_SETTINGS'; args: { settings: AppSettings } }
  | { type: 'SET_AUTHENTICATED'; args: { authenticated: boolean } }

const options = [
  {
    label: 'Most Recent',
    value: 'ReviewDateTime:desc',
  },
  {
    label: 'Oldest',
    value: 'ReviewDateTime:asc',
  },
  {
    label: 'Highest Rated',
    value: 'Rating:desc',
  },
  {
    label: 'Lowest Rated',
    value: 'Rating:asc',
  },
]

const getTimeAgo = (time: string) => {
  let before = new Date(time + ' UTC')
  let now = new Date()
  let diff = new Date(now.valueOf() - before.valueOf())

  let minutes = diff.getUTCMinutes()
  let hours = diff.getUTCHours()
  let days = diff.getUTCDate() - 1
  let months = diff.getUTCMonth()
  let years = diff.getUTCFullYear() - 1970

  if (years > 0) {
    return `${years} ${years > 1 ? 'years' : 'year'} ago`
  } else if (months > 0) {
    return `${months} ${months > 1 ? 'months' : 'month'} ago`
  } else if (days > 0) {
    return `${days} ${days > 1 ? 'days' : 'day'} ago`
  } else if (hours > 0) {
    return `${hours} ${hours > 1 ? 'hours' : 'hour'} ago`
  } else if (minutes > 0) {
    return `${minutes} ${minutes > 1 ? 'minutes' : 'minute'} ago`
  } else {
    return `just now`
  }
}

const initialState = {
  sort: 'ReviewDateTime:desc',
  from: 0,
  to: 9,
  reviews: null,
  total: 0,
  average: 0,
  hasTotal: false,
  hasAverage: false,
  showForm: false,
  openReview: null,
  settings: {
    allowAnonymousReviews: false,
    requireApproval: true,
    useLocation: false,
  },
  userAuthenticated: false,
}

const reducer = (state: State, action: ReducerActions) => {
  switch (action.type) {
    case 'SET_NEXT_PAGE':
      return {
        ...state,
        from: state.from + 10,
        to: state.to + 10,
      }
    case 'SET_PREV_PAGE':
      return {
        ...state,
        from: state.from - state.from < 11 ? 0 : 10,
        to: state.to - state.to < 21 ? 0 : 10,
      }
    case 'TOGGLE_REVIEW_FORM':
      return {
        ...state,
        showForm: !state.showForm,
      }
    case 'TOGGLE_REVIEW_ACCORDION':
      return {
        ...state,
        openReview:
          action.args.reviewNumber == state.openReview
            ? null
            : action.args.reviewNumber,
      }
    case 'SET_SELECTED_SORT':
      return {
        ...state,
        sort: action.args.sort,
      }
    case 'SET_REVIEWS':
      return {
        ...state,
        reviews: action.args.reviews || [],
      }
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
    case 'SET_AUTHENTICATED':
      return {
        ...state,
        userAuthenticated: action.args.authenticated,
      }
  }
}

const Reviews: FunctionComponent<BlockClass & Props> = props => {
  const { blockClass, client } = props

  const baseClassNames = generateBlockClass(styles.container, blockClass)
  const { product }: ProductContext = useContext(ProductContext)
  const { productId }: Product = product || {}

  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    window.__RENDER_8_SESSION__.sessionPromise.then((data: any) => {
      const sessionRespose = data.response

      if (!sessionRespose || !sessionRespose.namespaces) {
        return
      }

      const { namespaces } = sessionRespose
      const storeUserId = path(
        ['authentication', 'storeUserId', 'value'],
        namespaces
      )
      if (!storeUserId) {
        return
      }
      dispatch({
        type: 'SET_AUTHENTICATED',
        args: { authenticated: true },
      })
    })
  })

  useEffect(() => {
    client
      .query({
        query: AppSettings,
      })
      .then((response: ApolloQueryResult<SettingsData>) => {
        const settings = response.data.appSettings
        dispatch({
          type: 'SET_SETTINGS',
          args: { settings },
        })
      })
  }, [client])

  useEffect(() => {
    if (!productId) {
      return
    }

    client
      .query({
        query: TotalReviewsByProductId,
        variables: {
          productId: productId,
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
          productId: productId,
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

  useEffect(() => {
    if (!productId) {
      return
    }
    client
      .query({
        query: ReviewsByProductId,
        variables: {
          productId: productId,
          from: state.from,
          to: state.to,
          orderBy: state.sort,
          status:
            state.settings && !state.settings.requireApproval ? '' : 'true',
        },
        fetchPolicy: 'no-cache',
      })
      .then((response: ApolloQueryResult<ReviewsData>) => {
        const reviews = response.data.reviewsByProductId.data
        dispatch({
          type: 'SET_REVIEWS',
          args: { reviews },
        })
      })
  }, [client, productId, state.from, state.to, state.sort, state.settings])

  return (
    <div className={`${baseClassNames} review mw8 center ph5`}>
      <h3 className="review__title t-heading-3 bb b--muted-5 mb5">Reviews</h3>
      <div className="review__rating">
        {!state.hasTotal || !state.hasAverage ? (
          <Fragment>Loading summary...</Fragment>
        ) : state.total == 0 ? null : (
          <Fragment>
            <div className="t-heading-4">
              <Stars rating={state.average} />
            </div>
            <span className="review__rating--average dib v-mid">
              {state.average} Average Rating
            </span>{' '}
            <span className="review__rating--count dib v-mid">
              ({state.total} Reviews)
            </span>
          </Fragment>
        )}
      </div>
      <div className="mv5">
        {(state.settings && state.settings.allowAnonymousReviews) ||
        (state.settings &&
          !state.settings.allowAnonymousReviews &&
          state.userAuthenticated) ? (
          <Collapsible
            header={
              <span className="c-action-primary hover-c-action-primary">
                Write a review
              </span>
            }
            onClick={() => {
              dispatch({
                type: 'TOGGLE_REVIEW_FORM',
              })
            }}
            isOpen={state.showForm}
          >
            <ReviewForm settings={state.settings} />
          </Collapsible>
        ) : (
          <span>Please log in to write a review.</span>
        )}
      </div>
      <div className="review__comments">
        {state.reviews === null ? (
          <Fragment>Loading reviews...</Fragment>
        ) : state.reviews.length ? (
          <Fragment>
            <div className="flex mb7">
              <div className="mr4">
                <Dropdown
                  options={options}
                  onChange={(event: React.FormEvent<HTMLSelectElement>) => {
                    dispatch({
                      type: 'SET_SELECTED_SORT',
                      args: { sort: event.currentTarget.value },
                    })
                  }}
                  value={state.sort}
                />
              </div>
            </div>
            {state.reviews.map((review: Review, i: number) => {
              return (
                <div
                  key={i}
                  className="review__comment bw2 bb b--muted-5 mb5 pb4"
                >
                  <Collapsible
                    header={
                      <div className="review__comment--rating t-heading-5">
                        <Stars rating={review.rating} /> {` `}
                        <span className="review__comment--user lh-copy mw9 t-heading-5 mt0 mb2">
                          {review.title}
                        </span>
                      </div>
                    }
                    onClick={() => {
                      dispatch({
                        type: 'TOGGLE_REVIEW_ACCORDION',
                        args: {
                          reviewNumber: i,
                        },
                      })
                    }}
                    isOpen={state.openReview === i}
                  >
                    <ul className="pa0 mv2">
                      {review.verifiedPurchaser ? (
                        <li className="dib mr5">
                          <IconSuccess /> Verified Purchaser
                        </li>
                      ) : null}
                      <li className="dib mr2">
                        <strong>Submitted</strong>{' '}
                        {getTimeAgo(review.reviewDateTime)}
                      </li>
                      <li className="dib mr5">
                        <strong>by</strong> {review.reviewerName}
                        {state.settings &&
                          state.settings.useLocation &&
                          review.location &&
                          review.location != '' && (
                            <span>, {review.location}</span>
                          )}
                      </li>
                    </ul>
                    <p className="t-body lh-copy mw9">{review.text}</p>
                  </Collapsible>
                </div>
              )
            })}
            <div className="review__paging">
              <Pagination
                textShowRows=""
                currentItemFrom={state.from}
                currentItemTo={state.to}
                textOf="of"
                totalItems={state.total}
                onNextClick={() => {
                  dispatch({
                    type: 'SET_NEXT_PAGE',
                  })
                }}
                onPrevClick={() => {
                  dispatch({
                    type: 'SET_PREV_PAGE',
                  })
                }}
              />
            </div>
          </Fragment>
        ) : (
          <div className="review__comment bw2 bb b--muted-5 mb5 pb4">
            <h5 className="review__comment--user lh-copy mw9 t-heading-5 mv5">
              No reviews.
            </h5>
          </div>
        )}
      </div>
    </div>
  )
}

export default withApollo(Reviews)
