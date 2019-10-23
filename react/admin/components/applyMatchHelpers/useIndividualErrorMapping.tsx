/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { InjectedIntl } from 'react-intl'
import { getGraphQLErrorCode } from './index'
import { ApolloError } from 'apollo-client'

interface GenericError extends ApolloError {
  code: number
  reviewId: string
}

export const useIndividualErrorMapping = (intl: InjectedIntl) => {
  const [shouldShowIndividualErrors, setShouldShowIndividualErrors] = useState(
    false
  )
  // eslint-disable-next-line @typescript-eslint/no-object-literal-type-assertion
  const [allErrorsMap, setAllErrorsMap] = useState({} as Record<string, any>)

  const setAllErrors = (errors: [GenericError]) => {
    if (errors.length > 0) {
      setShouldShowIndividualErrors(true)
    }
    setAllErrorsMap(
      errors.reduce((acc, error) => {
        const graphQLError = error.graphQLErrors && error.graphQLErrors[0]
        const applyMatchErrorCode =
          getGraphQLErrorCode(graphQLError) || error.code || 0

        const message = intl.formatMessage({
          id: `admin/reviews.table.applyMatch.error.${applyMatchErrorCode}`,
        })

        return {
          ...acc,
          [`${error.reviewId}`]: message,
        }
      }, {})
    )
  }

  const getReviewError = (review: { id: string }) => {
    return allErrorsMap[`${review.id}`]
  }

  return {
    getReviewError,
    setAllErrors,
    shouldShowIndividualErrors,
    clearIndividualErrors: () => setShouldShowIndividualErrors(false),
  }
}

export default useIndividualErrorMapping
