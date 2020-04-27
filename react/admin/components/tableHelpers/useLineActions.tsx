/* eslint-disable react/display-name */
import React from 'react'
import { FormattedMessage } from 'react-intl'

import { ReviewTableRowData } from '../../types'
import { tuple } from '.'
import { tableActionsMessages } from '../../utils/messages'

const useLineActions = (
  setSelected: (rowData: [ReviewTableRowData]) => void,
  setIsApprovingReviews: (is: boolean) => void,
  // setIsViewingReviews: (is: boolean) => void,
  setIsDeletingReviews: (is: boolean) => void
) => {
  const approveReviewLineAction = {
    label: () => <FormattedMessage {...tableActionsMessages.approveReview} />,
    onClick: ({ rowData }: { rowData: ReviewTableRowData }) => {
      setSelected([{ ...rowData }])
      setIsApprovingReviews(true)
    },
  }

  //   const viewLineAction = {
  //     label: () => <FormattedMessage {...tableActionsMessages.viewReview} />,
  //     onClick: ({ rowData }: { rowData: ReviewTableRowData }) => {
  //       setSelected([{ ...rowData }])
  //       setIsViewingReviews(true)
  //     },
  //   }

  const deleteLineAction = {
    label: () => <FormattedMessage {...tableActionsMessages.deleteReview} />,
    isDangerous: true,
    onClick: ({ rowData }: { rowData: ReviewTableRowData }) => {
      setSelected([{ ...rowData }])
      setIsDeletingReviews(true)
    },
  }

  return tuple([
    {
      approveReviewLineAction,
      // viewLineAction,
      deleteLineAction,
    },
    {},
  ])
}

export default useLineActions
