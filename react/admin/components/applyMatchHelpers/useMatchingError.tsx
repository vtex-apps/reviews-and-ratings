import { useState } from 'react'
import { InjectedIntl } from 'react-intl'
import { ApolloError } from 'apollo-client'

import { getGraphQLErrorCode } from './index'

interface GenericError extends ApolloError {
  code: number
}

export const useMatchingError = (intl: InjectedIntl, operation?: string) => {
  const [hasError, setHasError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  let partialErrorMessageId: string

  if (operation === 'APPROVE') {
    partialErrorMessageId = 'approve'
  } else if (operation === 'DELETE') {
    partialErrorMessageId = 'delete'
  } else {
    partialErrorMessageId = 'generic'
  }

  const translateMessage = (
    message: ReactIntl.FormattedMessage.MessageDescriptor
  ) => {
    return intl.formatMessage(message)
  }

  const setSingleError = (err: GenericError) => {
    const graphQLError = err.graphQLErrors && err.graphQLErrors[0]
    const applyMatchErrorCode =
      (getGraphQLErrorCode(graphQLError) ?? err.code) || 0
    setHasError(true)
    setErrorMessage(
      translateMessage({
        id: `admin/reviews.table.applyMatch.error.${applyMatchErrorCode}`,
      })
    )
  }

  const setMultipleError = (err: GenericError[]) => {
    setHasError(true)
    const pluralCode = err.length > 1 ? 'plural' : 'singular'
    setErrorMessage(
      translateMessage({
        id: `admin/reviews.table.applyMatch.error.partial.${partialErrorMessageId}.${pluralCode}`,
      })
    )
  }

  const setMainError = (err: GenericError | GenericError[]) => {
    if (err instanceof Array) {
      setMultipleError(err)
    } else {
      setSingleError(err)
    }
  }

  const clearError = () => {
    setHasError(false)
  }

  return {
    hasError,
    errorMessage,
    setMainError,
    clearError,
  }
}
