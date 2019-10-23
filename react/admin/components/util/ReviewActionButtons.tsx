import React from 'react'
import ApplyMatchButton, { SKUActionButtonProps } from './ApplyMatchButton'

import moderateReview from '../../../../graphql/moderateReview.graphql'
import deleteReview from '../../../../graphql/deleteReview.graphql'

interface ApproveReviewsButtonProps extends SKUActionButtonProps {
  buildArgs: () => {
    id: string[]
    approved: boolean
  }
}

interface DeleteReviewsButtonProps extends SKUActionButtonProps {
  buildArgs: () => {
    id: string[]
  }
}

export const ApproveReviewsButton = (props: ApproveReviewsButtonProps) => (
  <ApplyMatchButton mutation={moderateReview} {...props} />
)

export const DeleteReviewsButton = (props: DeleteReviewsButtonProps) => (
  <ApplyMatchButton mutation={deleteReview} {...props} />
)
