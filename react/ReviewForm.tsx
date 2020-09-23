/* eslint-disable no-console */
import React, { FC, Fragment, useContext, useEffect, useReducer } from 'react'
import { ProductContext } from 'vtex.product-context'
import ApolloClient, { ApolloQueryResult } from 'apollo-client'
import { NormalizedCacheObject } from 'apollo-cache-inmemory'
import { withApollo } from 'react-apollo'
import {
  FormattedMessage,
  InjectedIntlProps,
  injectIntl,
  defineMessages,
} from 'react-intl'
import flowRight from 'lodash.flowright'
import path from 'ramda/es/path'
import { useCssHandles } from 'vtex.css-handles'
import { Card, Input, Button, Textarea } from 'vtex.styleguide'

import getOrders from './queries/orders.graphql'
import NewReview from '../graphql/newReview.graphql'
import HasShopperReviewed from '../graphql/hasShopperReviewed.graphql'
import StarPicker from './components/StarPicker'

interface Product {
  productId: string
  productName: string
}

interface AppSettings {
  allowAnonymousReviews: boolean
  requireApproval: boolean
  useLocation: boolean
  defaultOpen: boolean
}

interface Props {
  client: ApolloClient<NormalizedCacheObject>
  settings?: AppSettings
}

interface HasShopperReviewedData {
  hasShopperReviewed: boolean
}

interface State {
  rating: number
  title: string
  text: string
  location: string | null
  reviewerName: string
  shopperId: string | null
  reviewSubmitted: boolean
  userAuthenticated: boolean
  alreadySubmitted: boolean
  verifiedPurchaser: boolean
  validation: Validation
  showValidationErrors: boolean
}

interface Validation {
  hasTitle: boolean
  hasText: boolean
  hasName: boolean
  hasValidEmail: boolean
}

type ReducerActions =
  | { type: 'SET_RATING'; args: { rating: number } }
  | { type: 'SET_TITLE'; args: { title: string } }
  | { type: 'SET_TEXT'; args: { text: string } }
  | { type: 'SET_LOCATION'; args: { location: string } }
  | { type: 'SET_NAME'; args: { name: string } }
  | { type: 'SET_ID'; args: { id: string } }
  | { type: 'SET_AUTHENTICATED'; args: { authenticated: boolean } }
  | { type: 'SET_VERIFIED' }
  | { type: 'SET_ALREADY_SUBMITTED' }
  | { type: 'SET_SUBMITTED' }
  | { type: 'SHOW_VALIDATION' }

const initialState = {
  rating: 3,
  title: '',
  text: '',
  location: '',
  reviewerName: '',
  shopperId: '',
  reviewSubmitted: false,
  alreadySubmitted: false,
  verifiedPurchaser: false,
  userAuthenticated: false,
  validation: {
    hasTitle: false,
    hasText: false,
    hasName: false,
    hasValidEmail: false,
  },
  showValidationErrors: false,
}

const reducer = (state: State, action: ReducerActions) => {
  switch (action.type) {
    case 'SET_RATING':
      return {
        ...state,
        rating: action.args.rating,
      }
    case 'SET_TITLE':
      return {
        ...state,
        title: action.args.title,
        validation: {
          ...state.validation,
          hasTitle: action.args.title !== '',
        },
      }
    case 'SET_TEXT':
      return {
        ...state,
        text: action.args.text,
        validation: {
          ...state.validation,
          hasText: action.args.text !== '',
        },
      }
    case 'SET_LOCATION':
      return {
        ...state,
        location: action.args.location,
      }
    case 'SET_NAME':
      return {
        ...state,
        reviewerName: action.args.name,
        validation: {
          ...state.validation,
          hasName: action.args.name !== '',
        },
      }
    case 'SET_ID':
      return {
        ...state,
        shopperId: action.args.id,
        validation: {
          ...state.validation,
          hasValidEmail:
            action.args.id.includes('@') && action.args.id.includes('.'),
        },
      }
    case 'SET_SUBMITTED':
      return {
        ...state,
        reviewSubmitted: true,
      }
    case 'SET_AUTHENTICATED':
      return {
        ...state,
        userAuthenticated: true,
      }
    case 'SET_VERIFIED':
      return {
        ...state,
        verifiedPurchaser: true,
      }
    case 'SET_ALREADY_SUBMITTED':
      return {
        ...state,
        alreadySubmitted: true,
      }
    case 'SHOW_VALIDATION':
      return {
        ...state,
        showValidationErrors: true,
      }
    default:
      return state
  }
}

const messages = defineMessages({
  reviewTitleLabel: {
    id: 'store/reviews.form.label.reviewTitle',
    defaultMessage: 'The bottom line',
  },
  requiredField: {
    id: 'store/reviews.form.requiredField',
    defaultMessage: 'This field is required',
  },
  requiredFieldEmail: {
    id: 'store/reviews.form.requiredFieldEmail',
    defaultMessage: 'Please enter a valid email address',
  },
  ratingLabel: {
    id: 'store/reviews.form.label.rating',
    defaultMessage: 'Rate the product from 1 to 5 stars',
  },
  nameLabel: {
    id: 'store/reviews.form.label.name',
    defaultMessage: 'Your name',
  },
  locationLabel: {
    id: 'store/reviews.form.label.location',
    defaultMessage: 'Your location',
  },
  emailLabel: {
    id: 'store/reviews.form.label.email',
    defaultMessage: 'Email address',
  },
  reviewLabel: {
    id: 'store/reviews.form.label.review',
    defaultMessage: 'Write a review',
  },
})

const CSS_HANDLES = ['formContainer'] as const

export const ReviewForm: FC<InjectedIntlProps & Props> = ({
  intl,
  client,
  settings,
}) => {
  const handles = useCssHandles(CSS_HANDLES)

  const { product } = useContext(ProductContext) as any
  const { productId }: Product = product || {}

  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    if (!productId) {
      return
    }

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

      const profile = {
        email:
          path(['email', 'value'], namespaces.profile) ||
          path(['storeUserEmail', 'value'], namespaces.authentication),
      }

      if (typeof profile.email !== 'string') {
        return
      }

      dispatch({
        type: 'SET_ID',
        args: {
          id: profile.email,
        },
      })

      client
        .query({
          query: HasShopperReviewed,
          variables: { shopperId: profile.email, productId },
        })
        .then((result: ApolloQueryResult<HasShopperReviewedData>) => {
          if (result.data.hasShopperReviewed) {
            dispatch({
              type: 'SET_ALREADY_SUBMITTED',
            })
          }
        })

      client
        .query({
          query: getOrders,
          variables: null,
        })
        .then((res: any) => {
          // eslint-disable-next-line vtex/prefer-early-return
          if (res?.data?.orders && res.data.orders.length) {
            const hasItem = !!res.data.orders.find((order: any) => {
              return (
                !!order.isCompleted &&
                !!order.items.find((item: any) => {
                  return item.productId === productId
                })
              )
            })
            if (hasItem) {
              dispatch({
                type: 'SET_VERIFIED',
              })
            }
          }
        })
    })
  }, [client, productId])

  async function submitReview() {
    if (state.validation.hasValidEmail) {
      client
        .query({
          query: HasShopperReviewed,
          variables: { shopperId: state.shopperId, productId },
        })
        .then((result: ApolloQueryResult<HasShopperReviewedData>) => {
          if (result.data.hasShopperReviewed) {
            dispatch({
              type: 'SET_ALREADY_SUBMITTED',
            })
          }
        })
    }
    if (
      state.validation.hasName &&
      state.validation.hasTitle &&
      state.validation.hasText &&
      state.validation.hasValidEmail
    ) {
      client
        .mutate({
          mutation: NewReview,
          variables: {
            review: {
              productId,
              rating: state.rating,
              title: state.title,
              text: state.text,
              reviewerName: state.reviewerName,
              shopperId: state.shopperId,
              location: state.location,
              verifiedPurchaser: state.verifiedPurchaser,
            },
          },
        })
        .then(() => {
          dispatch({
            type: 'SET_SUBMITTED',
          })
        })
    } else {
      dispatch({
        type: 'SHOW_VALIDATION',
      })
    }
  }

  return (
    <div className={`${handles.formContainer} bg-muted-5 pa5 mt2`}>
      <Card>
        <h3>
          <FormattedMessage id="store/reviews.form.title" />
        </h3>
        {state.reviewSubmitted ? (
          <h5>
            <FormattedMessage id="store/reviews.form.reviewSubmitted" />
          </h5>
        ) : state.alreadySubmitted ? (
          <div className="c-danger t-small mt3 lh-title">
            <FormattedMessage id="store/reviews.form.alreadySubmitted" />
          </div>
        ) : (
          <form>
            <div className="mv3">
              <Input
                label={intl.formatMessage(messages.reviewTitleLabel)}
                size="large"
                value={state.title}
                required
                onChange={(event: React.FormEvent<HTMLInputElement>) =>
                  dispatch({
                    type: 'SET_TITLE',
                    args: {
                      title: event.currentTarget.value,
                    },
                  })
                }
                errorMessage={
                  state.showValidationErrors && !state.validation.hasTitle
                    ? intl.formatMessage(messages.requiredField)
                    : ''
                }
              />
            </div>
            <div className="mv3">
              <StarPicker
                label={intl.formatMessage(messages.ratingLabel)}
                rating={state.rating}
                onStarClick={(_, index: number) => {
                  dispatch({
                    type: 'SET_RATING',
                    args: {
                      rating: index + 1,
                    },
                  })
                }}
              />
            </div>
            <div className="mv3">
              <Input
                label={intl.formatMessage(messages.nameLabel)}
                size="large"
                value={state.reviewerName}
                onChange={(event: React.FormEvent<HTMLInputElement>) =>
                  dispatch({
                    type: 'SET_NAME',
                    args: {
                      name: event.currentTarget.value,
                    },
                  })
                }
                errorMessage={
                  state.showValidationErrors && !state.validation.hasName
                    ? intl.formatMessage(messages.requiredField)
                    : ''
                }
              />
            </div>
            {settings?.useLocation && (
              <div className="mv3">
                <Input
                  label={intl.formatMessage(messages.locationLabel)}
                  size="large"
                  value={state.location}
                  onChange={(event: React.FormEvent<HTMLInputElement>) =>
                    dispatch({
                      type: 'SET_LOCATION',
                      args: {
                        location: event.currentTarget.value,
                      },
                    })
                  }
                />
              </div>
            )}
            {settings?.allowAnonymousReviews && !state.userAuthenticated && (
              <div className="mv3">
                <Input
                  label={intl.formatMessage(messages.emailLabel)}
                  size="large"
                  value={state.shopperId}
                  onChange={(event: React.FormEvent<HTMLInputElement>) =>
                    dispatch({
                      type: 'SET_ID',
                      args: {
                        id: event.currentTarget.value,
                      },
                    })
                  }
                  errorMessage={
                    state.showValidationErrors &&
                    !state.validation.hasValidEmail
                      ? intl.formatMessage(messages.requiredFieldEmail)
                      : ''
                  }
                />
              </div>
            )}
            <div className="mv3">
              <Textarea
                value={state.text}
                onChange={(event: React.FormEvent<HTMLTextAreaElement>) =>
                  dispatch({
                    type: 'SET_TEXT',
                    args: {
                      text: event.currentTarget.value,
                    },
                  })
                }
                label={intl.formatMessage(messages.reviewLabel)}
                errorMessage={
                  state.showValidationErrors && !state.validation.hasText
                    ? intl.formatMessage(messages.requiredField)
                    : ''
                }
              />
            </div>
            <div className="mv3">
              <Fragment>
                {state.showValidationErrors &&
                  (!state.validation.hasName ||
                    !state.validation.hasTitle ||
                    !state.validation.hasText ||
                    !state.validation.hasValidEmail) && (
                    <div className="c-danger t-small mt3 lh-title">
                      <FormattedMessage id="store/reviews.form.invalid" />
                    </div>
                  )}
                <Button variation="primary" onClick={() => submitReview()}>
                  <FormattedMessage id="store/reviews.form.submit" />
                </Button>
              </Fragment>
            </div>
          </form>
        )}
      </Card>
    </div>
  )
}

export default flowRight([withApollo, injectIntl])(ReviewForm)
