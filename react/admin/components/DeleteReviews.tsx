/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC, useState } from 'react'
import { ObservableQueryFields } from 'react-apollo'
import { Button, Modal, Alert } from 'vtex.styleguide'
import { FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl'

import { useMatchingError } from './applyMatchHelpers/useMatchingError'
import updateReviewsCache from './applyMatchHelpers/updateReviewsCache'
import {
  ReviewTableRowData,
  SearchReviewArgs,
  SearchReviewData,
} from '../types'
// import filterFailedReviews from './util/filterFailedReviews'
import { useModalCustomStyles } from '../utils/useModalStyles'
import { DeleteReviewsButton } from './util/ReviewActionButtons'

type DeleteReviewsPanelProps = {
  stopDeletingReviews: ({
    shouldRemoveSelection,
  }: {
    shouldRemoveSelection?: boolean
  }) => void
  selectedReviews: ReviewTableRowData[]
  searchReviewsArgs?: SearchReviewArgs
  fetchMore?: ObservableQueryFields<
    SearchReviewData,
    SearchReviewArgs
  >['fetchMore']
} & InjectedIntlProps

export const DeleteReviewsPanel: FC<DeleteReviewsPanelProps> = props => {
  const [isModalOpen, setIsModalOpen] = useState(true)
  const [displayedReviews] = useState(props.selectedReviews)

  const { hasError, errorMessage, setMainError, clearError } = useMatchingError(
    props.intl,
    'DELETE'
  )

  useModalCustomStyles()

  const { searchReviewsArgs, fetchMore } = props

  const handleCloseModal = (shouldRemoveSelection: boolean) => {
    props.stopDeletingReviews({ shouldRemoveSelection })
    setIsModalOpen(false)
  }

  const formatReviewsForDeletion = () => {
    return {
      ids: displayedReviews.map(row => {
        const { id } = row.review
        return id
      }),
    }
  }

  return (
    <Modal
      responsiveFullScreen
      isOpen={isModalOpen}
      onClose={handleCloseModal}
      container={window.top.document.getElementById('render-admin.container')}
    >
      <div className="w-100 mt7">
        {hasError && (
          <div className="pb4">
            <Alert type="error" onClose={clearError}>
              {errorMessage}
            </Alert>
          </div>
        )}
        {displayedReviews.length > 1 ? (
          <div className="t-heading-4 c-on-base">
            <FormattedMessage
              id="admin/reviews.table.modal.delete.multipleReviewsQuestion"
              values={{
                numberOfSelectedReviews: displayedReviews.length,
              }}
            />
          </div>
        ) : (
          <div className="t-heading-4 c-on-base">
            <FormattedMessage
              id="admin/reviews.table.modal.delete.singleReviewQuestion"
              values={{
                reviewTitle: displayedReviews[0].review.title,
              }}
            />
          </div>
        )}
        <div className="flex justify-end mt5">
          <div className="mh2 mr4">
            <Button
              variation="secondary"
              onClick={() => handleCloseModal(false)}
              size="regular"
            >
              <FormattedMessage id="admin/reviews.cancel" />
            </Button>
          </div>
          <DeleteReviewsButton
            label={
              <FormattedMessage id="admin/reviews.table.modal.delete.send" />
            }
            updateCache={(cache, { data }) => {
              updateReviewsCache(
                cache,
                displayedReviews,
                data,
                searchReviewsArgs,
                fetchMore
              )
            }}
            // onMixedError={(errorList: any, successList: any[]) => {
            //   setDisplayedReviews(currentDisplayed =>
            //     filterFailedReviews(currentDisplayed, successList)
            //   )
            //   setMainError(errorList)
            // }}
            onGlobalError={setMainError}
            onSuccess={() => handleCloseModal(true)}
            buildArgs={formatReviewsForDeletion}
            variation="danger"
          />
        </div>
      </div>
    </Modal>
  )
}

export default injectIntl(DeleteReviewsPanel)
