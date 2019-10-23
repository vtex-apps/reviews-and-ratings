/* eslint-disable react/display-name */
import React from 'react'
import { FormattedMessage } from 'react-intl'

import { ReviewTableRowData } from '../../types'
import { tuple } from '.'
import { tableActionsMessages } from '../../utils/messages'

const useLineActionsApproved = (
  setSelected: (rowData: [ReviewTableRowData]) => void,
  setIsDeletingReviews: (is: boolean) => void
) => {
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
      deleteLineAction,
    },
    {},
  ])
}

export default useLineActionsApproved
