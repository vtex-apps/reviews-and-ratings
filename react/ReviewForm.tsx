import React, { FC, Fragment, useContext, useEffect, useReducer } from 'react'
import { ProductContext, Product } from 'vtex.product-context'
// import Stars from './components/Stars'
import ApolloClient, { ApolloQueryResult } from 'apollo-client'
import { NormalizedCacheObject } from 'apollo-cache-inmemory'
import { withApollo } from 'react-apollo'
// eslint-disable-next-line lodash/import-scope
import flowRight from 'lodash.flowright'
import { path } from 'ramda'
import { generateBlockClass, BlockClass } from '@vtex/css-handles'
import styles from './styles.css'
import NewReview from '../graphql/newReview.graphql'
import HasShopperReviewed from '../graphql/hasShopperReviewed.graphql'
import { Card, Input, Button, Textarea, NumericStepper } from 'vtex.styleguide'

interface AppSettings {
  allowAnonymousReviews: boolean
  requireApproval: boolean
  useLocation: boolean
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
  | { type: 'SET_ALREADY_SUBMITTED' }
  | { type: 'SET_SUBMITTED' }
  | { type: 'SHOW_VALIDATION' }

const initialState = {
  rating: 5,
  title: '',
  text: '',
  location: null,
  reviewerName: '',
  shopperId: null,
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
}

// const convertToBool = (str: string | undefined) =>
//   !!str && str.toLowerCase() === 'true'

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
          hasTitle: action.args.title != '',
        },
      }
    case 'SET_TEXT':
      return {
        ...state,
        text: action.args.text,
        validation: {
          ...state.validation,
          hasText: action.args.text != '',
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
          hasName: action.args.name != '',
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
  }
}

export const ReviewForm: FC<BlockClass & Props> = ({
  blockClass,
  client,
  settings,
}) => {
  const baseClassNames = generateBlockClass(styles.formContainer, blockClass)

  const { product }: ProductContext = useContext(ProductContext)
  const { productId }: Product = product || {}

  const [state, dispatch] = useReducer(reducer, initialState)

  async function checkAlreadySubmitted() {
    client
      .query({
        query: HasShopperReviewed,
        variables: { shopperId: state.shopperId, productId: productId },
      })
      .then((result: ApolloQueryResult<HasShopperReviewedData>) => {
        if (result.data.hasShopperReviewed) {
          dispatch({
            type: 'SET_ALREADY_SUBMITTED',
          })
          return
        }
      })
  }

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
        //document: path(['document', 'value'], namespaces.profile),
        email:
          path(['email', 'value'], namespaces.profile) ||
          path(['storeUserEmail', 'value'], namespaces.authentication),
        // firstName: path(['firstName', 'value'], namespaces.profile),
        // id: path(['id', 'value'], namespaces.profile),
        // isAuthenticatedAsCustomer: convertToBool(
        //   path(['isAuthenticated', 'value'], namespaces.profile)
        // ),
        // lastName: path(['lastName', 'value'], namespaces.profile),
        // phone: path(['phone', 'value'], namespaces.profile),
      }

      if (typeof profile.email == 'string') {
        dispatch({
          type: 'SET_ID',
          args: {
            id: profile.email,
          },
        })

        checkAlreadySubmitted()
      }
    })
  })

  async function submitReview() {
    if (state.validation.hasValidEmail) {
      await checkAlreadySubmitted()
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
              productId: productId,
              rating: state.rating,
              title: state.title,
              text: state.text,
              reviewerName: state.reviewerName,
              shopperId: state.shopperId,
              verifiedPurchaser: false,
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
    <div className={`${baseClassNames} bg-muted-5 pa5 mt2`}>
      <Card>
        <h3>Add review</h3>
        <form>
          <div className="mv3">
            <Input
              label="The bottom line"
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
                  ? 'This field is required'
                  : ''
              }
            />
          </div>
          <div className="mv3">
            <Input
              label="Your name"
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
                  ? 'This field is required'
                  : ''
              }
            />
          </div>
          {settings && settings.useLocation && (
            <div className="mv3">
              <Input
                label="Your location"
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
          {settings &&
            settings.allowAnonymousReviews &&
            !state.userAuthenticated && (
              <div className="mv3">
                <Input
                  label="Email address"
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
                      ? 'Please enter a valid email address'
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
              label="Write a review"
              errorMessage={
                state.showValidationErrors && !state.validation.hasText
                  ? 'This field is required'
                  : ''
              }
            />
          </div>
          <div className="mv3">
            <NumericStepper
              label="Rate the product from 1 to 5 stars"
              minValue={1}
              maxValue={5}
              value={state.rating}
              onChange={(e: any) => {
                dispatch({
                  type: 'SET_RATING',
                  args: {
                    rating: parseInt(e.value),
                  },
                })
              }}
            />
          </div>
          <div className="mv3">
            {state.reviewSubmitted ? (
              <h5>Your review has been submitted.</h5>
            ) : state.alreadySubmitted ? (
              <div className="c-danger t-small mt3 lh-title">
                You have already submitted a review for this product.
              </div>
            ) : (
              <Fragment>
                {state.showValidationErrors &&
                  (!state.validation.hasName ||
                    !state.validation.hasTitle ||
                    !state.validation.hasText ||
                    !state.validation.hasValidEmail) && (
                    <div className="c-danger t-small mt3 lh-title">
                      Your review is not valid. Please see above.
                    </div>
                  )}
                <Button variation="primary" onClick={() => submitReview()}>
                  Submit Review
                </Button>
              </Fragment>
            )}
          </div>
        </form>
      </Card>
    </div>
  )
}

export default flowRight(withApollo)(ReviewForm)
