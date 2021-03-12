import React, { Fragment, useEffect, useReducer } from 'react'
import { Helmet } from 'react-helmet'
import { ApolloQueryResult } from 'apollo-client'
import { useApolloClient } from 'react-apollo'
import { FormattedMessage, defineMessages, useIntl } from 'react-intl'
import { useProduct } from 'vtex.product-context'
import { Link, canUseDOM } from 'vtex.render-runtime'
import { useCssHandles } from 'vtex.css-handles'
import ShowMore from 'react-show-more'
import {
  IconSuccess,
  Pagination,
  Collapsible,
  Dropdown,
  // Button,
} from 'vtex.styleguide'

import Stars from './components/Stars'
import ReviewForm from './ReviewForm'
import AppSettings from '../graphql/appSettings.graphql'
import ReviewsByProductId from '../graphql/reviewsByProductId.graphql'
import AverageRatingByProductId from '../graphql/averageRatingByProductId.graphql'
import TotalReviewsByProductId5 from '../graphql/totalReviewsByProductId5.graphql'
import TotalReviewsByProductId4 from '../graphql/totalReviewsByProductId4.graphql'
import TotalReviewsByProductId3 from '../graphql/totalReviewsByProductId3.graphql'
import TotalReviewsByProductId2 from '../graphql/totalReviewsByProductId2.graphql'
import TotalReviewsByProductId1 from '../graphql/totalReviewsByProductId1.graphql'
import ReviewsGraph from './ReviewsGraph'

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

interface Totals {
  total5: number
  total4: number
  total3: number
  total2: number
  total1: number
}

interface Range {
  total: number
  from: number
  to: number
}

interface ReviewsResult {
  data: Review[]
  range: Range
  totals: Totals
}

interface ReviewsData {
  reviewsByProductId: ReviewsResult
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
  defaultOpenCount: number
  showGraph: boolean
}

interface State {
  sort: string
  from: number
  to: number
  reviews: Review[] | null
  total: number
  total5: number
  total4: number
  total3: number
  total2: number
  total1: number
  average: number
  hasTotal: boolean
  hasAverage: boolean
  showForm: boolean
  openReviews: number[]
  settings: AppSettings
  userAuthenticated: boolean
  reviewsStats: number[]
}

declare let global: {
  __hostname__: string
  __pathname__: string
}

type ReducerActions =
  | { type: 'SET_NEXT_PAGE' }
  | { type: 'SET_PREV_PAGE' }
  | { type: 'TOGGLE_REVIEW_FORM' }
  | { type: 'TOGGLE_REVIEW_ACCORDION'; args: { reviewNumber: number } }
  | { type: 'SET_OPEN_REVIEWS'; args: { reviewNumbers: number[] } }
  | { type: 'SET_SELECTED_SORT'; args: { sort: string } }
  | { type: 'SET_REVIEWS'; args: { reviews: Review[]; total: number; graphArray: number[]; total5: number; total4: number; total3: number; total2: number; total1: number } }
  | { type: 'SET_TOTAL'; args: { total: number } }
  | { type: 'SET_TOTAL_5'; args: { total5: number } }
  | { type: 'SET_TOTAL_4'; args: { total4: number } }
  | { type: 'SET_TOTAL_3'; args: { total3: number } }
  | { type: 'SET_TOTAL_2'; args: { total2: number } }
  | { type: 'SET_TOTAL_1'; args: { total1: number } }
  | { type: 'SET_AVERAGE'; args: { average: number } }
  | { type: 'SET_SETTINGS'; args: { settings: AppSettings } }
  | { type: 'SET_AUTHENTICATED'; args: { authenticated: boolean } }

const initialState = {
  sort: 'ReviewDateTime:desc',
  from: 1,
  to: 10,
  reviews: null,
  total: 0,
  total5: 0,
  total4: 0,
  total3: 0,
  total2: 0,
  total1: 0,
  average: 0,
  hasTotal: false,
  hasAverage: false,
  showForm: false,
  openReviews: [],
  settings: {
    defaultOpen: false,
    defaultOpenCount: 0,
    allowAnonymousReviews: false,
    requireApproval: true,
    useLocation: false,
    showGraph: false,
  },
  userAuthenticated: false,
  reviewsStats: [],
}

const reducer = (state: State, action: ReducerActions) => {
  switch (action.type) {
    case 'SET_NEXT_PAGE':
      return {
        ...state,
        from: state.total < 11 ? state.from : state.from + 10,
        to: state.to + 10 > state.total ? state.total : state.to + 10,
      }
    case 'SET_PREV_PAGE':
      return {
        ...state,
        from: state.from - (state.from < 11 ? 0 : 10),
        to: state.from > 10 ? state.from - 1 : state.to,
      }
    case 'TOGGLE_REVIEW_FORM':
      return {
        ...state,
        showForm: !state.showForm,
      }
    case 'TOGGLE_REVIEW_ACCORDION':
      return {
        ...state,
        openReviews: state.openReviews.includes(action.args.reviewNumber)
          ? state.openReviews.filter(i => i !== action.args.reviewNumber)
          : [...state.openReviews, action.args.reviewNumber],
      }
    case 'SET_OPEN_REVIEWS':
      return {
        ...state,
        openReviews: action.args.reviewNumbers,
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
        total: action.args.total,
        total5: action.args.total5,
        total4: action.args.total4,
        total3: action.args.total3,
        total2: action.args.total2,
        total1: action.args.total1,
        reviewsStats: action.args.graphArray || [],
        hasTotal: true,
      }
    case 'SET_TOTAL':
      return {
        ...state,
        total: action.args.total,
        hasTotal: true,
      }
    case 'SET_TOTAL_5':
      return {
        ...state,
        total5: action.args.total5,
        hasTotal: true,
      }
    case 'SET_TOTAL_4':
      return {
        ...state,
        total4: action.args.total4,
        hasTotal: true,
      }
    case 'SET_TOTAL_3':
      return {
        ...state,
        total3: action.args.total3,
        hasTotal: true,
      }
    case 'SET_TOTAL_2':
      return {
        ...state,
        total2: action.args.total2,
        hasTotal: true,
      }
    case 'SET_TOTAL_1':
      return {
        ...state,
        total1: action.args.total1,
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
    default:
      return state
  }
}

const messages = defineMessages({
  sortPlaceholder: {
    id: 'store/reviews.list.sortOptions.placeholder',
    defaultMessage: 'Sort by:',
  },
  sortMostRecent: {
    id: 'store/reviews.list.sortOptions.mostRecent',
    defaultMessage: 'Most Recent',
  },
  sortOldest: {
    id: 'store/reviews.list.sortOptions.oldest',
    defaultMessage: 'Oldest',
  },
  sortHighestRated: {
    id: 'store/reviews.list.sortOptions.highestRated',
    defaultMessage: 'Highest Rated',
  },
  sortLowestRated: {
    id: 'store/reviews.list.sortOptions.lowestRated',
    defaultMessage: 'Lowest Rated',
  },
  timeAgo: {
    id: 'store/reviews.list.timeAgo',
    defaultMessage: 'ago',
  },
  timeAgoYear: {
    id: 'store/reviews.list.timeAgo.year',
    defaultMessage: 'year',
  },
  timeAgoYears: {
    id: 'store/reviews.list.timeAgo.years',
    defaultMessage: 'years',
  },
  timeAgoMonth: {
    id: 'store/reviews.list.timeAgo.month',
    defaultMessage: 'month',
  },
  timeAgoMonths: {
    id: 'store/reviews.list.timeAgo.months',
    defaultMessage: 'months',
  },
  timeAgoWeek: {
    id: 'store/reviews.list.timeAgo.week',
    defaultMessage: 'week',
  },
  timeAgoWeeks: {
    id: 'store/reviews.list.timeAgo.weeks',
    defaultMessage: 'weeks',
  },
  timeAgoDay: {
    id: 'store/reviews.list.timeAgo.day',
    defaultMessage: 'day',
  },
  timeAgoDays: {
    id: 'store/reviews.list.timeAgo.days',
    defaultMessage: 'days',
  },
  timeAgoHour: {
    id: 'store/reviews.list.timeAgo.hour',
    defaultMessage: 'hour',
  },
  timeAgoHours: {
    id: 'store/reviews.list.timeAgo.hours',
    defaultMessage: 'hours',
  },
  timeAgoMinute: {
    id: 'store/reviews.list.timeAgo.minute',
    defaultMessage: 'minute',
  },
  timeAgoMinutes: {
    id: 'store/reviews.list.timeAgo.minutes',
    defaultMessage: 'minutes',
  },
  timeAgoJustNow: {
    id: 'store/reviews.list.timeAgo.justNow',
    defaultMessage: 'just now',
  },
  anonymous: {
    id: 'store/reviews.list.anonymous',
    defaultMessage: 'Anonymous',
  },
  textOf: {
    id: 'store/reviews.list.pagination.textOf',
    defaultMessage: 'of',
  },
})

const CSS_HANDLES = [
  'container',
  'writeReviewContainer',
  'loginLink',
  'reviewsRating',
  'starsContainer',
  'reviewsHeading',
  'reviewsRatingAverage',
  'reviewsRatingCount',
  'reviewCommentsContainer',
  'reviewComment',
  'reviewCommentRating',
  'reviewCommentUser',
  'reviewsHeader',
  'reviewUsername',
  'reviewDate',
  'reviewText',
  'reviewBar',
  'reviewBarStar',
  'reviewBarBack',
  'reviewBarFront',
  'reviewBarContainer',
  'writeReviewButton',
  'writeReviewSubheading',
  'writeReviewHeading',
  'writeReviewFlex',
  'reviewBarCount',
  'noReviews',
  'noReviewsText',
  'graphContent',
  'graphContainer',
  'graphText',
  'graphTextLabel',
  'graphBarContainer',
  'graphBar',
  'graphBarPercent',
] as const

function Reviews() {
  const client = useApolloClient()
  const intl = useIntl()
  const handles = useCssHandles(CSS_HANDLES)
  const { product }: any = useProduct() ?? {}
  const { productId, productName } = product ?? {}

  const [state, dispatch] = useReducer(reducer, initialState)

  const options = [
    {
      label: intl.formatMessage(messages.sortMostRecent),
      value: 'ReviewDateTime:desc',
    },
    {
      label: intl.formatMessage(messages.sortOldest),
      value: 'ReviewDateTime:asc',
    },
    {
      label: intl.formatMessage(messages.sortHighestRated),
      value: 'Rating:desc',
    },
    {
      label: intl.formatMessage(messages.sortLowestRated),
      value: 'Rating:asc',
    },
  ]

  const getTimeAgo = (time: string) => {
    const before = new Date(`${time} UTC`)
    const now = new Date()
    const diff = new Date(now.valueOf() - before.valueOf())

    const minutes = diff.getUTCMinutes()
    const hours = diff.getUTCHours()
    const days = diff.getUTCDate() - 1
    const months = diff.getUTCMonth()
    const years = diff.getUTCFullYear() - 1970

    if (years > 0) {
      return `${years} ${
        years > 1
          ? intl.formatMessage(messages.timeAgoYears)
          : intl.formatMessage(messages.timeAgoYear)
      } ${intl.formatMessage(messages.timeAgo)}`
    }
    if (months > 0) {
      return `${months} ${
        months > 1
          ? intl.formatMessage(messages.timeAgoMonths)
          : intl.formatMessage(messages.timeAgoMonth)
      } ${intl.formatMessage(messages.timeAgo)}`
    }
    if (days > 0) {
      return `${days} ${
        days > 1
          ? intl.formatMessage(messages.timeAgoDays)
          : intl.formatMessage(messages.timeAgoDay)
      } ${intl.formatMessage(messages.timeAgo)}`
    }
    if (hours > 0) {
      return `${hours} ${
        hours > 1
          ? intl.formatMessage(messages.timeAgoHours)
          : intl.formatMessage(messages.timeAgoHour)
      } ${intl.formatMessage(messages.timeAgo)}`
    }
    if (minutes > 0) {
      return `${minutes} ${
        minutes > 1
          ? intl.formatMessage(messages.timeAgoMinutes)
          : intl.formatMessage(messages.timeAgoMinute)
      } ${intl.formatMessage(messages.timeAgo)}`
    }
    return intl.formatMessage(messages.timeAgoJustNow)
  }
  const getLocation = () =>
    canUseDOM
      ? {
          url: window.location.pathname + window.location.hash,
          pathName: window.location.pathname,
        }
      : { url: global.__pathname__, pathName: global.__pathname__ }

  const { url } = getLocation()
  useEffect(() => {
    window.__RENDER_8_SESSION__.sessionPromise.then((data: any) => {
      const sessionRespose = data.response

      if (!sessionRespose || !sessionRespose.namespaces) {
        return
      }

      const { namespaces } = sessionRespose
      const storeUserId = namespaces?.authentication?.storeUserId?.value

      if (!storeUserId) {
        return
      }
      dispatch({
        type: 'SET_AUTHENTICATED',
        args: { authenticated: true },
      })
    })
  }, [])

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

  useEffect(() => {
    if (!productId) {
      return
    }
    client
      .query({
        query: ReviewsByProductId,
        variables: {
          productId,
          from: state.from,
          to: state.to,
          orderBy: state.sort,
          status:
            state.settings && !state.settings.requireApproval ? '' : 'true',
        },
      })
      .then((response: ApolloQueryResult<ReviewsData>) => {
        const reviews = response.data.reviewsByProductId.data
        const { total } = response.data.reviewsByProductId.range
        const { total5, total4, total3, total2, total1 } = response.data.reviewsByProductId.totals
        const graphArray = [0, 0, 0, 0, 0, 0]
        graphArray[0] = total
        if (reviews) {
          reviews.forEach((review: Review) => {
            const thisRating = review.rating
            graphArray[thisRating] += 1
          })
        }
        dispatch({
          type: 'SET_REVIEWS',
          args: { reviews, total, graphArray, total5, total4, total3, total2, total1 },
        })

        const defaultOpenCount = Math.min(
          state.settings.defaultOpenCount,
          total
        )
        dispatch({
          type: 'SET_OPEN_REVIEWS',
          args: {
            reviewNumbers: [...Array(defaultOpenCount).keys()],
          },
        })
      })
  }, [client, productId, state.from, state.to, state.sort, state.settings])

  const style5 = {
    width: (state.total5 / state.total) * 100 + "%"
  }
  const style4 = {
    width: (state.total4 / state.total) * 100 + "%"
  }
  const style3 = {
    width: (state.total3 / state.total) * 100 + "%"
  }
  const style2 = {
    width: (state.total2 / state.total) * 100 + "%"
  }
  const style1 = {
    width: (state.total1 / state.total) * 100 + "%"
  }

  return (
    <div
      className={`${handles.container} review mw8 center ph5`}
      id="reviews-main-container"
    >
      <h3
        className={`${handles.reviewsHeading} review__title t-heading-3 bb b--muted-5 mb5`}
      >
        <FormattedMessage id="store/reviews.list.title" />
      </h3>
      <div className={`${handles.reviewsRating} review__rating`}>
        {!state.hasTotal || !state.hasAverage ? (
          <FormattedMessage id="store/reviews.list.summary.loading" />
        ) : !state.total ? null : (
          <Fragment>
            <div>
              <span className={`${handles.reviewsRatingAverage} review__rating--average dib v-mid`} >
                {state.average}
              </span>
              <div className={`${handles.starsContainer} t-heading-4`}>
                <Stars rating={state.average} />
              </div>
              <span className={`${handles.reviewsRatingCount} review__rating--count dib v-mid`} >
                ({state.total} reviews)
              </span>
            </div>
            <div className={`${handles.reviewBarContainer}`} >
              <div className={`${handles.reviewBar}`}>
                <span className={`${handles.reviewBarStar}`}>5</span>
                <div className={`${handles.reviewBarBack}`}>
                  <div className={`${handles.reviewBarFront}`} style={style5} ></div>
                </div>
                <span className={`${handles.reviewBarCount}`}>{state.total5}</span>
              </div>
              <div className={`${handles.reviewBar}`}>
                <span className={`${handles.reviewBarStar}`}>4</span>
                <div className={`${handles.reviewBarBack}`}>
                  <div className={`${handles.reviewBarFront}`} style={style4} ></div>
                </div>
                <span className={`${handles.reviewBarCount}`}>{state.total4}</span>
              </div>
              <div className={`${handles.reviewBar}`}>
                <span className={`${handles.reviewBarStar}`}>3</span>
                <div className={`${handles.reviewBarBack}`}>
                  <div className={`${handles.reviewBarFront}`} style={style3} ></div>
                </div>
                <span className={`${handles.reviewBarCount}`}>{state.total3}</span>
              </div>
              <div className={`${handles.reviewBar}`}>
                <span className={`${handles.reviewBarStar}`}>2</span>
                <div className={`${handles.reviewBarBack}`}>
                  <div className={`${handles.reviewBarFront}`} style={style2} ></div>
                </div>
                <span className={`${handles.reviewBarCount}`}>{state.total2}</span>
              </div>
              <div className={`${handles.reviewBar}`}>
                <span className={`${handles.reviewBarStar}`}>1</span>
                <div className={`${handles.reviewBarBack}`}>
                  <div className={`${handles.reviewBarFront}`} style={style1} ></div>
                </div>
                <span className={`${handles.reviewBarCount}`}>{state.total1}</span>
              </div>
            </div>
            <div className={`${handles.writeReviewFlex}`} >
              <h3 className={`${handles.writeReviewHeading}`} >You have something to say about this product?</h3>
              <h5 className={`${handles.writeReviewSubheading}`} >Do not hesitate to tell us what you really think. From 1 to 5 how would you rate it?</h5>
              <div className={`${handles.writeReviewContainer}`} >
                {(state.settings && state.settings.allowAnonymousReviews) ||
                (state.settings &&
                  !state.settings.allowAnonymousReviews &&
                  state.userAuthenticated) ? (
                  <Collapsible
                    header={
                      <span className={`${handles.writeReviewButton}`} >
                        <FormattedMessage id="store/reviews.list.writeReview" />
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
                  <Link
                    page="store.login"
                    query={`returnUrl=${encodeURIComponent(url)}`}
                    className={`${handles.loginLink} h1 w2 tc flex items-center w-100-s h-100-s pa4-s`}
                  >
                    <FormattedMessage id="store/reviews.list.login" />
                  </Link>
                )}
              </div>
            </div>
          </Fragment>
        )}
      </div>
      {state.settings.showGraph ? (
        <ReviewsGraph reviewsStats={state.reviewsStats} />
      ) : null}
      <div className={`${handles.writeReviewContainer} mv5`}>
        {(state.settings && state.settings.allowAnonymousReviews) ||
        (state.settings &&
          !state.settings.allowAnonymousReviews &&
          state.userAuthenticated) ? (
          <Collapsible
            header={
              <span className="c-action-primary hover-c-action-primary">
                <FormattedMessage id="store/reviews.list.writeReview" />
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
          <Link
            page="store.login"
            query={`returnUrl=${encodeURIComponent(url)}`}
            className={`${handles.loginLink} h1 w2 tc flex items-center w-100-s h-100-s pa4-s`}
          >
            <FormattedMessage id="store/reviews.list.login" />
          </Link>
        )}
      </div>
      <div className={`${handles.reviewCommentsContainer} review__comments`}>
        {state.reviews === null ? (
          <FormattedMessage id="store/reviews.list.loading" />
        ) : state.reviews.length ? (
          <Fragment>
            <div className="flex mb7">
              <div className="mr4">
                <Dropdown
                  options={options}
                  placeholder={intl.formatMessage(messages.sortPlaceholder)}
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
                  className={`${handles.reviewComment} review__comment bw2 bb b--muted-5 mb5 pb4`}
                >
                  <Helmet>
                    <script type="application/ld+json">
                      {JSON.stringify({
                        '@context': 'http://schema.org',
                        '@type': 'Product',
                        review: {
                          '@type': 'Review',
                          reviewRating: {
                            ratingValue: review.rating.toString(),
                            bestRating: '5',
                          },
                          author: {
                            '@type': 'Person',
                            name:
                              review.reviewerName ||
                              intl.formatMessage(messages.anonymous),
                          },
                          datePublished: review.reviewDateTime,
                          reviewBody: review.text,
                        },
                        name: productName,
                      })}
                    </script>
                  </Helmet>
                  {state.settings.defaultOpen ? (
                    <div>
                      <div
                        className={`${handles.reviewCommentRating} review__comment--rating t-heading-5`}
                      >
                        <Stars rating={review.rating} /> {` `}
                        <span
                          className={`${handles.reviewCommentUser} review__comment--user lh-copy mw9 t-heading-5 mt0 mb2`}
                        >
                          {review.title}
                        </span>
                      </div>
                      <ul className="pa0 mv2 t-small">
                        {review.verifiedPurchaser ? (
                          <li className="dib mr5">
                            <IconSuccess />{' '}
                            <FormattedMessage id="store/reviews.list.verifiedPurchaser" />
                          </li>
                        ) : null}
                        <li className="dib mr2">
                          <FormattedMessage id="store/reviews.list.submitted" />{' '}
                          <strong>{getTimeAgo(review.reviewDateTime)}</strong>
                        </li>
                        <li className="dib mr5">
                          <FormattedMessage id="store/reviews.list.by" />{' '}
                          <strong>
                            {review.reviewerName ||
                              intl.formatMessage(messages.anonymous)}
                          </strong>
                          {state.settings &&
                            state.settings.useLocation &&
                            review.location && <span>, {review.location}</span>}
                        </li>
                      </ul>
                      <div className="t-body lh-copy mw9">
                        <ShowMore
                          lines={3}
                          more="Show more"
                          less="Show less"
                          anchorClass=""
                        >
                          {review.text}
                        </ShowMore>
                      </div>
                    </div>
                  ) : (
                    <Collapsible
                      header={
                        <div
                          className={`${handles.reviewCommentRating} review__comment--rating t-heading-5`}
                        >
                          <Stars rating={review.rating} /> {` `}
                          <span
                            className={`${handles.reviewCommentUser} review__comment--user lh-copy mw9 t-heading-5 mt0 mb2`}
                          >
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
                      isOpen={state.openReviews.includes(i)}
                    >
                      <ul className="pa0 mv2 t-small">
                        {review.verifiedPurchaser ? (
                          <li className="dib mr5">
                            <IconSuccess />{' '}
                            <FormattedMessage id="store/reviews.list.verifiedPurchaser" />
                          </li>
                        ) : null}
                        <li className="dib mr2">
                          <FormattedMessage id="store/reviews.list.submitted" />{' '}
                          <strong>{getTimeAgo(review.reviewDateTime)}</strong>
                        </li>
                        <li className="dib mr5">
                          <FormattedMessage id="store/reviews.list.by" />{' '}
                          <strong>
                            {review.reviewerName ||
                              intl.formatMessage(messages.anonymous)}
                          </strong>
                          {state.settings &&
                            state.settings.useLocation &&
                            review.location && <span>, {review.location}</span>}
                        </li>
                      </ul>
                      <p className="t-body lh-copy mw9">{review.text}</p>
                    </Collapsible>
                  )}
                </div>
              )
            })}
            <div className="review__paging">
              <Pagination
                textShowRows=""
                currentItemFrom={state.from}
                currentItemTo={state.to}
                textOf={intl.formatMessage(messages.textOf)}
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
              <FormattedMessage id="store/reviews.list.emptyState" />
            </h5>
          </div>
        )}
      </div>
    </div>
  )
}

export default Reviews
