import React from 'react'

import type { SKUActionButtonProps } from './ApplyMatchButton'
import ApplyMatchButton from './ApplyMatchButton'
import moderateReview from '../../../../graphql/moderateReview.graphql'
import deleteReview from '../../../../graphql/deleteReview.graphql'

interface ApproveReviewsButtonProps extends SKUActionButtonProps {
  buildArgs: () => {
    ids: string[]
    approved: boolean
  }
}

interface DeleteReviewsButtonProps extends SKUActionButtonProps {
  buildArgs: () => {
    ids: string[]
  }
}

export const ApproveReviewsButton = (props: ApproveReviewsButtonProps) => (
  <ApplyMatchButton mutation={moderateReview} {...props} />
)

export const DeleteReviewsButton = (props: DeleteReviewsButtonProps) => (
  <ApplyMatchButton mutation={deleteReview} {...props} />
)
