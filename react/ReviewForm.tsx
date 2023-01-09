import React, { Fragment, useEffect, useReducer } from 'react'
import { useProduct } from 'vtex.product-context'
import type { ApolloQueryResult } from 'apollo-client'
import { useApolloClient } from 'react-apollo'
import { FormattedMessage, defineMessages, useIntl } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'
import { Card, Input, Button, Textarea } from 'vtex.styleguide'

import NewReview from '../graphql/newReview.graphql'
import HasShopperReviewed from '../graphql/hasShopperReviewed.graphql'
import StarPicker from './components/StarPicker'
import { eventBus } from './utils/eventBus'
import push from './utils/gtmPush'

interface AppSettings {
  allowAnonymousReviews: boolean
  requireApproval: boolean
  useLocation: boolean
  defaultOpen: boolean
  defaultStarsRating: number
}

interface HasShopperReviewedData {
  hasShopperReviewed: boolean
}

interface State {
  rating: number
  title: string
  text: string
  location: string | null
  locale: string | null
  reviewerName: string
  shopperId: string | null
  reviewSubmitted: boolean
  userAuthenticated: boolean
  alreadySubmitted: boolean
  isSubmitting: boolean
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
  | { type: 'SET_LOCALE'; args: { locale: string } }
  | { type: 'SET_NAME'; args: { name: string } }
  | { type: 'SET_ID'; args: { id: string } }
  | { type: 'SET_AUTHENTICATED'; args: { authenticated: boolean } }
  | { type: 'SET_ALREADY_SUBMITTED'; args: { alreadySubmitted: boolean } }
  | { type: 'SET_SUBMITTED' }
  | { type: 'SET_SUBMITTING'; args: { isSubmitting: boolean } }
  | { type: 'SHOW_VALIDATION' }

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

    case 'SET_LOCALE':
      return {
        ...state,
        locale: action.args.locale,
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

    case 'SET_SUBMITTING':
      return {
        ...state,
        isSubmitting: action.args.isSubmitting,
      }

    case 'SET_AUTHENTICATED':
      return {
        ...state,
        userAuthenticated: true,
      }

    case 'SET_ALREADY_SUBMITTED':
      return {
        ...state,
        alreadySubmitted: action.args.alreadySubmitted,
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

const CSS_HANDLES = [
  'formContainer',
  'formSection',
  'formBottomLine',
  'formRating',
  'formName',
  'formLocation',
  'formEmail',
  'formReview',
  'formSubmit',
  'formInvalidMessage',
] as const

export function ReviewForm({
  settings,
  refetchReviews,
}: {
  settings?: Partial<AppSettings>
  refetchReviews: () => void
}) {
  const client = useApolloClient()
  const intl = useIntl()

  const handles = useCssHandles(CSS_HANDLES)

  const { product } = useProduct() ?? {}
  const { productId } = product ?? {}

  const initialState = {
    rating: 5,
    title: '',
    text: '',
    location: '',
    locale: null,
    reviewerName: '',
    shopperId: '',
    reviewSubmitted: false,
    alreadySubmitted: false,
    userAuthenticated: false,
    validation: {
      hasTitle: false,
      hasText: false,
      hasName: false,
      hasValidEmail: false,
    },
    showValidationErrors: false,
    isSubmitting: false,
  }

  const [state, dispatch] = useReducer(reducer, initialState)

  const reviewSavedEvent = () => eventBus.dispatch('reviewSaved')

  useEffect(() => {
    if (settings?.defaultStarsRating) {
      dispatch({
        type: 'SET_RATING',
        args: {
          rating: settings.defaultStarsRating,
        },
      })
    }
  }, [settings])

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
      const storeUserId = namespaces?.authentication?.storeUserId?.value

      if (!storeUserId) {
        return
      }

      dispatch({
        type: 'SET_AUTHENTICATED',
        args: { authenticated: true },
      })

      dispatch({
        type: 'SET_LOCALE',
        args: {
          locale: intl.locale,
        },
      })

      const profile = {
        email:
          namespaces.profile?.email?.value ??
          namespaces.authentication?.storeUserEmail?.value,
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
          if (result.data) {
            dispatch({
              type: 'SET_ALREADY_SUBMITTED',
              args: { alreadySubmitted: result.data.hasShopperReviewed },
            })
          }
        })
    })
  }, [client, intl, productId])

  async function submitReview() {
    dispatch({
      type: 'SET_SUBMITTING',
      args: { isSubmitting: true },
    })
    if (state.validation.hasValidEmail) {
      client
        .query({
          query: HasShopperReviewed,
          variables: { shopperId: state.shopperId, productId },
        })
        .then((result: ApolloQueryResult<HasShopperReviewedData>) => {
          if (result.data) {
            dispatch({
              type: 'SET_ALREADY_SUBMITTED',
              args: { alreadySubmitted: result.data.hasShopperReviewed },
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
              locale: state.locale ?? null,
              approved: !settings?.requireApproval,
            },
          },
        })
        .then(res => {
          if (res.data.newReview.id) {
            // send review submitted event to GTM
            push({
              event: 'reviewSubmitted',
              productId,
              rating: state.rating,
            })
            setTimeout(() => {
              if (
                !settings?.requireApproval &&
                settings?.allowAnonymousReviews
              ) {
                refetchReviews()
                reviewSavedEvent()
              }

              dispatch({
                type: 'SET_SUBMITTED',
              })
              dispatch({
                type: 'SET_SUBMITTING',
                args: { isSubmitting: false },
              })
            }, 2000)
          }
        })
    } else {
      dispatch({
        type: 'SHOW_VALIDATION',
      })
      dispatch({
        type: 'SET_SUBMITTING',
        args: { isSubmitting: false },
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
            <div
              className={`${handles.formSection} ${handles.formBottomLine} mv3`}
            >
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
            <div className={`${handles.formSection} ${handles.formRating} mv3`}>
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
            <div className={`${handles.formSection} ${handles.formName} mv3`}>
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
              <div
                className={`${handles.formSection} ${handles.formLocation} mv3`}
              >
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
              <div
                className={`${handles.formSection} ${handles.formEmail} mv3`}
              >
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
            <div className={`${handles.formSection} ${handles.formReview} mv3`}>
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
            <div className={`${handles.formSection} ${handles.formSubmit} mv3`}>
              <Fragment>
                {state.showValidationErrors &&
                  (!state.validation.hasName ||
                    !state.validation.hasTitle ||
                    !state.validation.hasText ||
                    !state.validation.hasValidEmail) && (
                    <div
                      className={`${handles.formInvalidMessage} c-danger t-small mt3 lh-title`}
                    >
                      <FormattedMessage id="store/reviews.form.invalid" />
                    </div>
                  )}
                <Button
                  variation="primary"
                  onClick={() => submitReview()}
                  isLoading={state.isSubmitting}
                >
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

export default ReviewForm
