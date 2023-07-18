/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { Fragment, useEffect, useReducer } from 'react'
import { Helmet } from 'react-helmet'
import type { ApolloQueryResult } from 'apollo-client'
import { useApolloClient, useQuery } from 'react-apollo'
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

import type { Review } from './typings'
import Stars from './components/Stars'
import ReviewForm from './ReviewForm'
import AppSettings from '../graphql/appSettings.graphql'
import ReviewsByProductId from '../graphql/reviewsByProductId.graphql'
import AverageRatingByProductId from '../graphql/averageRatingByProductId.graphql'
import ReviewsGraph from './ReviewsGraph'
import { getBaseUrl } from './utils/baseUrl'
import getBindings from './queries/bindings.graphql'

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

interface AverageData {
  averageRatingByProductId: AverageDetail
}

interface AverageDetail {
  average: number
  starsFive: number
  starsFour: number
  starsThree: number
  starsTwo: number
  starsOne: number
  total: number
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
  ratingFilter: number
  localeFilter: string
  localeOptions: string[]
  pastReviews: boolean
  from: number
  to: number
  reviews: Review[] | null
  total: number
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
  | { type: 'SET_RATING_FILTER'; args: { ratingFilter: number } }
  | { type: 'SET_LOCALE_FILTER'; args: { localeFilter: string } }
  | { type: 'SET_LOCALE_OPTIONS'; args: { localeOptions: string[] } }
  | { type: 'SET_PASTREVIEWS'; args: { pastReviews: boolean } }
  | {
      type: 'SET_REVIEWS'
      args: { reviews: Review[]; total: number }
    }
  | { type: 'SET_REVIEW_STATE'; args: { graphArray: number[] } }
  | { type: 'SET_TOTAL'; args: { total: number } }
  | { type: 'SET_AVERAGE'; args: { average: number } }
  | { type: 'SET_SETTINGS'; args: { settings: AppSettings } }
  | { type: 'SET_AUTHENTICATED'; args: { authenticated: boolean } }

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

    case 'SET_RATING_FILTER':
      return {
        ...state,
        ratingFilter: action.args.ratingFilter,
      }

    case 'SET_LOCALE_FILTER':
      return {
        ...state,
        localeFilter: action.args.localeFilter,
      }

    case 'SET_LOCALE_OPTIONS':
      return {
        ...state,
        localeOptions: action.args.localeOptions,
      }

    case 'SET_PASTREVIEWS':
      return {
        ...state,
        pastReviews: action.args.pastReviews,
      }

    case 'SET_REVIEWS':
      return {
        ...state,
        reviews: action.args.reviews || [],
        total: action.args.total,
        hasTotal: true,
      }

    case 'SET_REVIEW_STATE':
      return {
        ...state,
        reviewsStats: action.args.graphArray || [],
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

    default:
      return state
  }
}

const messages = defineMessages({
  sortPlaceholder: {
    id: 'store/reviews.list.sortOptions.placeholder',
  },
  filterPlaceholder: {
    id: 'store/reviews.list.filterOptions.placeholder',
  },
  sortMostRecent: {
    id: 'store/reviews.list.sortOptions.mostRecent',
  },
  sortOldest: {
    id: 'store/reviews.list.sortOptions.oldest',
  },
  sortHighestRated: {
    id: 'store/reviews.list.sortOptions.highestRated',
  },
  sortLowestRated: {
    id: 'store/reviews.list.sortOptions.lowestRated',
  },
  all: {
    id: 'store/reviews.list.filterOptions.all',
  },
  oneStar: {
    id: 'store/reviews.list.filterOptions.one-star',
  },
  twoStars: {
    id: 'store/reviews.list.filterOptions.two-stars',
  },
  threeStars: {
    id: 'store/reviews.list.filterOptions.three-stars',
  },
  fourStars: {
    id: 'store/reviews.list.filterOptions.four-stars',
  },
  fiveStars: {
    id: 'store/reviews.list.filterOptions.five-stars',
  },
  timeAgoYears: {
    id: 'store/reviews.list.timeAgo.years',
  },
  timeAgoMonths: {
    id: 'store/reviews.list.timeAgo.months',
  },
  timeAgoDays: {
    id: 'store/reviews.list.timeAgo.days',
  },
  timeAgoHours: {
    id: 'store/reviews.list.timeAgo.hours',
  },
  timeAgoMinutes: {
    id: 'store/reviews.list.timeAgo.minutes',
  },
  timeAgoJustNow: {
    id: 'store/reviews.list.timeAgo.justNow',
  },
  anonymous: {
    id: 'store/reviews.list.anonymous',
  },
  textOf: {
    id: 'store/reviews.list.pagination.textOf',
  },
  showMore: {
    id: 'store/reviews.list.showMore',
  },
  showLess: {
    id: 'store/reviews.list.showLess',
  },
})

const CSS_HANDLES = [
  'container',
  'writeReviewContainer',
  'writeReviewButton',
  'loginLink',
  'reviewsRating',
  'starsContainer',
  'reviewsHeading',
  'reviewsRatingAverage',
  'reviewsRatingCount',
  'reviewCommentsContainer',
  'reviewsOrderBy',
  'reviewsPaging',
  'reviewComment',
  'reviewCommentMessage',
  'reviewCommentRating',
  'reviewCommentUser',
  'reviewInfo',
  'reviewVerifiedPurchase',
  'reviewDate',
  'reviewDateSubmitted',
  'reviewDateValue',
  'reviewAuthor',
  'reviewAuthorBy',
  'reviewAuthorName',
  'graphContent',
  'graphContainer',
  'graphText',
  'graphTextLabel',
  'graphBarContainer',
  'graphBar',
  'graphBarPercent',
  'showMoreButton',
] as const

const getTimeAgo = (time: string, intl: any) => {
  const newTime = new Date(`${time} UTC`)

  const before =
    newTime.toString() === 'Invalid Date' ? new Date(time) : newTime

  const now = new Date()
  const diff = new Date(now.valueOf() - before.valueOf())

  const minutes = diff.getUTCMinutes()
  const hours = diff.getUTCHours()
  const days = diff.getUTCDate() - 1
  const months = diff.getUTCMonth()
  const years = diff.getUTCFullYear() - 1970

  if (years > 0) {
    return intl.formatMessage(messages.timeAgoYears, {
      timeUnits: years,
    })
  }

  if (months > 0) {
    return intl.formatMessage(messages.timeAgoMonths, {
      timeUnits: months,
    })
  }

  if (days > 0) {
    return intl.formatMessage(messages.timeAgoDays, {
      timeUnits: days,
    })
  }

  if (hours > 0) {
    return intl.formatMessage(messages.timeAgoHours, {
      timeUnits: hours,
    })
  }

  if (minutes > 0) {
    return intl.formatMessage(messages.timeAgoMinutes, {
      timeUnits: minutes,
    })
  }

  return intl.formatMessage(messages.timeAgoJustNow)
}

function Reviews() {
  const client = useApolloClient()
  const intl = useIntl()
  const handles = useCssHandles(CSS_HANDLES)
  const { product }: any = useProduct() ?? {}
  const { productId, productName, linkText } = product ?? {}

  const initialState = {
    sort: 'SearchDate:desc',
    ratingFilter: 0,
    localeFilter: intl.locale.slice(0, 2),
    localeOptions: [],
    pastReviews: true,
    from: 1,
    to: 10,
    reviews: null,
    total: 0,
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

  const [state, dispatch] = useReducer(reducer, initialState)

  const {
    data: dataReviews,
    loading: loadingReviews,
    refetch: refetchReviews,
  } = useQuery<ReviewsData>(ReviewsByProductId, {
    variables: {
      productId,
      rating: state.ratingFilter,
      locale: state.localeFilter,
      pastReviews: state.pastReviews,
      from: state.from - 1,
      to: state.to - 1,
      orderBy: state.sort,
      status: !state.settings?.requireApproval ? '' : 'true',
    },
    skip: !productId,
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
    ssr: false,
  })

  const {
    data: dataAverage,
    loading: loadingAverage,
    refetch: refetchAverage,
  } = useQuery<AverageData>(AverageRatingByProductId, {
    variables: {
      productId,
    },
    skip: !productId,
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
    ssr: false,
  })

  const options = [
    {
      label: intl.formatMessage(messages.sortMostRecent),
      value: 'SearchDate:desc',
    },
    {
      label: intl.formatMessage(messages.sortOldest),
      value: 'SearchDate:asc',
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

  const ratingFilters = [
    {
      label: intl.formatMessage(messages.all),
      value: 0,
    },
    {
      label: intl.formatMessage(messages.oneStar),
      value: 1,
    },
    {
      label: intl.formatMessage(messages.twoStars),
      value: 2,
    },
    {
      label: intl.formatMessage(messages.threeStars),
      value: 3,
    },
    {
      label: intl.formatMessage(messages.fourStars),
      value: 4,
    },
    {
      label: intl.formatMessage(messages.fiveStars),
      value: 5,
    },
  ]

  useEffect(() => {
    client
      .query({
        query: getBindings,
      })
      .then((res: any) => {
        const list = res.data.tenantInfo.bindings.map((item: any) => {
          return item.defaultLocale.slice(0, 2)
        })

        const localeOptions = [...new Set(list as string)]

        dispatch({
          type: 'SET_LOCALE_OPTIONS',
          args: { localeOptions },
        })
      })
  }, [client])

  const localeFilters = state.localeOptions.map((str: any) => ({
    label: str.toUpperCase(),
    value: str,
  }))

  const getLocation = () =>
    canUseDOM
      ? {
          url: window.location.pathname + window.location.hash,
          pathName: window.location.pathname,
        }
      : { url: global.__pathname__, pathName: global.__pathname__ }

  const { url } = getLocation()

  useEffect(() => {
    window.__RENDER_8_SESSION__.sessionPromise.then((sessionData: any) => {
      const sessionRespose = sessionData.response

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
    if (loadingAverage || !dataAverage) return

    let { average } = dataAverage.averageRatingByProductId

    if (state.total <= 10) {
      const summedRating = state.reviews?.reduce(
        (partialSum, a) => partialSum + a.rating,
        0
      )

      average = summedRating ? summedRating / state.total : average
      average = Math.round((average + Number.EPSILON) * 100) / 100 // limit to 2 decimal places
    }

    dispatch({
      type: 'SET_AVERAGE',
      args: { average },
    })
  }, [dataAverage, loadingAverage, state.total, state.reviews])

  useEffect(() => {
    if (loadingAverage || !dataAverage) return

    const graphArray = [0, 0, 0, 0, 0, 0]

    graphArray[0] = dataAverage.averageRatingByProductId.total
    graphArray[1] = dataAverage.averageRatingByProductId.starsOne
    graphArray[2] = dataAverage.averageRatingByProductId.starsTwo
    graphArray[3] = dataAverage.averageRatingByProductId.starsThree
    graphArray[4] = dataAverage.averageRatingByProductId.starsFour
    graphArray[5] = dataAverage.averageRatingByProductId.starsFive

    dispatch({
      type: 'SET_REVIEW_STATE',
      args: { graphArray },
    })
  }, [dataAverage, loadingAverage, state.total, state.reviews])

  useEffect(() => {
    if (loadingReviews || !dataReviews) return
    const reviews = dataReviews.reviewsByProductId.data
    const { total } = dataReviews.reviewsByProductId.range

    dispatch({
      type: 'SET_REVIEWS',
      args: { reviews, total },
    })

    const defaultOpenCount = Math.min(state.settings.defaultOpenCount, total)

    dispatch({
      type: 'SET_OPEN_REVIEWS',
      args: {
        reviewNumbers: [...Array(defaultOpenCount).keys()],
      },
    })
  }, [dataReviews, loadingReviews, state.settings.defaultOpenCount])

  const handleRefetch = () => {
    refetchAverage()
    refetchReviews()
  }

  const baseUrl = getBaseUrl()

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
        ) : (
          <Fragment>
            <div className={`${handles.starsContainer} t-heading-4`}>
              <Stars rating={state.average} />
            </div>
            <span
              className={`${handles.reviewsRatingAverage} review__rating--average dib v-mid`}
            >
              <FormattedMessage
                id="store/reviews.list.summary.averageRating"
                values={{
                  average: state.average,
                }}
              />
            </span>{' '}
            <span
              className={`${handles.reviewsRatingCount} review__rating--count dib v-mid`}
            >
              <FormattedMessage
                id="store/reviews.list.summary.totalReviews"
                values={{
                  total: state.total,
                }}
              />
            </span>
          </Fragment>
        )}
      </div>
      {state.settings.showGraph ? (
        <ReviewsGraph reviewsStats={state.reviewsStats} />
      ) : null}
      <div className={`${handles.writeReviewContainer} mv5`}>
        {state.settings?.allowAnonymousReviews ||
        (state.settings &&
          !state.settings.allowAnonymousReviews &&
          state.userAuthenticated) ? (
          <Collapsible
            header={
              <span
                className={`${handles.writeReviewButton} c-action-primary hover-c-action-primary`}
              >
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
            <ReviewForm
              settings={state.settings}
              refetchReviews={handleRefetch}
            />
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
      <div className={`${handles.reviewsOrderBy} flex mb7`}>
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
        <Dropdown
          options={ratingFilters}
          placeholder={intl.formatMessage(messages.filterPlaceholder)}
          onChange={(event: React.FormEvent<HTMLSelectElement>) => {
            dispatch({
              type: 'SET_RATING_FILTER',
              args: { ratingFilter: +event.currentTarget.value },
            })
          }}
          value={state.ratingFilter}
        />
        {state.localeOptions.length === 1 ||
        state.localeOptions.length === 0 ? null : (
          <Dropdown
            options={localeFilters}
            placeholder={intl.formatMessage(messages.filterPlaceholder)}
            onChange={(event: React.FormEvent<HTMLSelectElement>) => {
              dispatch({
                type: 'SET_LOCALE_FILTER',
                args: { localeFilter: event.currentTarget.value },
              })
              dispatch({
                type: 'SET_PASTREVIEWS',
                args: {
                  pastReviews:
                    event.currentTarget.value === intl.locale.slice(0, 2),
                },
              })
            }}
            value={state.localeFilter}
          />
        )}
      </div>
      <div className={`${handles.reviewCommentsContainer} review__comments`}>
        {state.reviews === null ? (
          <FormattedMessage id="store/reviews.list.loading" />
        ) : state.reviews.length ? (
          <Fragment>
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
                        '@id': `${baseUrl}/${linkText}/p`,
                        review: {
                          '@type': 'Review',
                          reviewRating: {
                            ratingValue: review?.rating?.toString() || '5',
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
                      <div className={`${handles.reviewInfo} pa0 mv2 t-small`}>
                        {review.verifiedPurchaser ? (
                          <span
                            className={`${handles.reviewVerifiedPurchase} dib mr5`}
                          >
                            <IconSuccess />{' '}
                            <FormattedMessage id="store/reviews.list.verifiedPurchaser" />
                          </span>
                        ) : null}
                        <span className={`${handles.reviewDate} dib mr2`}>
                          <span
                            className={`${handles.reviewDateSubmitted} dib mr2`}
                          >
                            <FormattedMessage id="store/reviews.list.submitted" />
                          </span>
                          <strong className={handles.reviewDateValue}>
                            {getTimeAgo(review.reviewDateTime, intl)}
                          </strong>
                        </span>
                        <span className={`${handles.reviewAuthor} dib mr5`}>
                          <span className={`${handles.reviewAuthorBy} dib mr2`}>
                            <FormattedMessage id="store/reviews.list.by" />
                          </span>
                          <strong className={handles.reviewAuthorName}>
                            {review.reviewerName ||
                              intl.formatMessage(messages.anonymous)}
                          </strong>
                          {state.settings?.useLocation && review.location && (
                            <span>, {review.location}</span>
                          )}
                        </span>
                      </div>
                      <div
                        className={`${handles.reviewCommentMessage} t-body lh-copy mw9`}
                      >
                        <ShowMore
                          lines={3}
                          more={intl.formatMessage(messages.showMore)}
                          less={intl.formatMessage(messages.showLess)}
                          anchorClass={`${handles.showMoreButton}`}
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
                          <strong>
                            {getTimeAgo(review.reviewDateTime, intl)}
                          </strong>
                        </li>
                        <li className="dib mr5">
                          <FormattedMessage id="store/reviews.list.by" />{' '}
                          <strong>
                            {review.reviewerName ||
                              intl.formatMessage(messages.anonymous)}
                          </strong>
                          {state.settings?.useLocation && review.location && (
                            <span>, {review.location}</span>
                          )}
                        </li>
                      </ul>
                      <p className="t-body lh-copy mw9">{review.text}</p>
                    </Collapsible>
                  )}
                </div>
              )
            })}
            <div className={`${handles.reviewsPaging} review__paging`}>
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
