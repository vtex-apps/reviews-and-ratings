/* eslint-disable @typescript-eslint/no-explicit-any */
import { MutationUpdaterFn } from 'apollo-client'
import { Mutation } from 'react-apollo'
import React, { useState } from 'react'
import { Button } from 'vtex.styleguide'

import reviews from '../../../../graphql/reviews.graphql'
import {
  ApplyMatchData,
  // SingleActionResponse,
  ApplyMatchVariables,
} from '../../types'

export interface SKUActionButtonProps {
  label: string | JSX.Element
  buildArgs: () => ApplyMatchVariables
  updateCache?: MutationUpdaterFn<ApplyMatchData>
  onMixedError?: () => void
  onGlobalError?: (err: any) => void
  onSuccess?: () => void
  isInputValid?: () => boolean
  onWrongInput?: () => void
  variation?: string
}
interface ApplyMatchProps extends SKUActionButtonProps {
  mutation: any
}

const ApplyMatchButton = (props: ApplyMatchProps) => {
  const [isLoading, setIsLoading] = useState(false)

  const {
    buildArgs,
    onGlobalError = () => {},
    onMixedError = () => {},
    onSuccess = () => {},
    updateCache = () => {},
    isInputValid = () => true,
    onWrongInput = () => {},
    variation = 'primary',
    mutation,
    label,
  } = props

  // const parseErrors = (errorResponses: SingleActionResponse[]) => {
  //   return errorResponses.length !== 0
  //     ? errorResponses.map(response => ({
  //         ...JSON.parse(response.error || '{}'),
  //         reviewId: response.reviewId,
  //       }))
  //     : errorResponses
  // }

  return (
    <Mutation<ApplyMatchData, ApplyMatchVariables>
      mutation={mutation}
      update={updateCache}
    >
      {applyMatch => {
        return (
          <Button
            variation={variation}
            isLoading={isLoading}
            onClick={() => {
              setIsLoading(true)
              if (!isInputValid()) {
                setIsLoading(false)
                onWrongInput()
              } else {
                const args = buildArgs()
                applyMatch({
                  refetchQueries: [
                    {
                      query: reviews,
                      variables: {
                        status: 'false',
                      },
                    },
                  ],
                  awaitRefetchQueries: true,
                  variables: { ...args },
                })
                  .then(result => {
                    if (!result || !result.data) {
                      throw new Error()
                    }
                    // const {
                    //   errors: allErrors,
                    //   successes: allSuccesses,
                    //   totalTries,
                    // } = result.data.actionResult

                    setIsLoading(false)
                    if (
                      result.data.moderateReview ||
                      result.data.deleteReview
                    ) {
                      onSuccess()
                    } else {
                      // const parsedErrors = parseErrors(allErrors)
                      onMixedError()
                    }
                  })
                  .catch(err => {
                    setIsLoading(false)
                    onGlobalError(err)
                  })
              }
            }}
          >
            {label}
          </Button>
        )
      }}
    </Mutation>
  )
}

export default ApplyMatchButton
