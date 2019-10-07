import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useReducer,
} from 'react'
import { ProductContext, Product } from 'vtex.product-context'
// import Stars from './components/Stars'
import ApolloClient from 'apollo-client'
import { NormalizedCacheObject } from 'apollo-cache-inmemory'
import { withApollo } from 'react-apollo'
import { path } from 'ramda'
import { generateBlockClass, BlockClass } from '@vtex/css-handles'
import styles from './styles.css'
import NewReview from '../graphql/newReview.graphql'
import { Card, Input, Button, Textarea, NumericStepper } from 'vtex.styleguide'

interface Props {
  client: ApolloClient<NormalizedCacheObject>
}

interface State {
  rating: number
  title: string
  text: string
  reviewerName: string
  shopperId: string
  reviewSubmitted: boolean
}

type ReducerActions =
  | { type: 'SET_RATING'; args: { rating: number } }
  | { type: 'SET_TITLE'; args: { title: string } }
  | { type: 'SET_TEXT'; args: { text: string } }
  | { type: 'SET_NAME'; args: { name: string } }
  | { type: 'SET_ID'; args: { id: string } }
  | { type: 'SET_SUBMITTED' }

const initialState = {
  rating: 5,
  title: '',
  text: '',
  reviewerName: '',
  shopperId: '',
  reviewSubmitted: false,
}

const convertToBool = (str: string | undefined) =>
  !!str && str.toLowerCase() === 'true'

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
      }
    case 'SET_TEXT':
      return {
        ...state,
        text: action.args.text,
      }
    case 'SET_NAME':
      return {
        ...state,
        reviewerName: action.args.name,
      }
    case 'SET_ID':
      return {
        ...state,
        shopperId: action.args.id,
      }
    case 'SET_SUBMITTED':
      return {
        ...state,
        reviewSubmitted: true,
      }
  }
}

const ReviewForm: FunctionComponent<BlockClass & Props> = props => {
  const { blockClass, client } = props

  const baseClassNames = generateBlockClass(styles.formContainer, blockClass)

  const { product }: ProductContext = useContext(ProductContext)
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

      const profile = {
        document: path(['document', 'value'], namespaces.profile),
        email:
          path(['email', 'value'], namespaces.profile) ||
          path(['storeUserEmail', 'value'], namespaces.authentication),
        firstName: path(['firstName', 'value'], namespaces.profile),
        id: path(['id', 'value'], namespaces.profile),
        isAuthenticatedAsCustomer: convertToBool(
          path(['isAuthenticated', 'value'], namespaces.profile)
        ),
        lastName: path(['lastName', 'value'], namespaces.profile),
        phone: path(['phone', 'value'], namespaces.profile),
      }

      if (typeof profile.email == 'string') {
        dispatch({
          type: 'SET_ID',
          args: {
            id: profile.email,
          },
        })
      }
    })
  })

  async function submitReview() {
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
            shopperId: '',
            verifiedPurchaser: false,
          },
        },
      })
      .then(() => {
        dispatch({
          type: 'SET_SUBMITTED',
        })
      })
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
            />
          </div>
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
            />
          </div>
          <div className="mv3">
            <NumericStepper
              label="Rate the product from 1 to 5"
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
            ) : (
              <Button variation="primary" onClick={() => submitReview()}>
                Submit Review
              </Button>
            )}
          </div>
        </form>
      </Card>
    </div>
  )
}

//const withReviewSubmit = graphql<
// ChildMutateProps<BlockClass, DataProps<Review>, InputProps>
//>(NewReview, { name: 'SubmitReview' })

export default withApollo(ReviewForm)
