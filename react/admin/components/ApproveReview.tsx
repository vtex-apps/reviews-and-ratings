/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/display-name */
import React, { useState } from 'react'
import { ObservableQueryFields } from 'react-apollo'
import { FormattedMessage, InjectedIntlProps, injectIntl } from 'react-intl'
import { Alert, Button, Modal, Table, ToastProvider } from 'vtex.styleguide'

import {
  ReviewTableRowData,
  SearchReviewData,
  SearchReviewArgs,
} from '../types'
import { reviewSchema, reviewWithErrorSchema, productSchema } from '../schemas'
import './global.css'
import { useMatchingError } from './applyMatchHelpers/useMatchingError'
import updateReviewsCache from './applyMatchHelpers/updateReviewsCache'
// import filterFailedReviews from './util/filterFailedReviews'
import useIndividualErrorMapping from './applyMatchHelpers/useIndividualErrorMapping'
import { useModalCustomStyles } from '../utils/useModalStyles'
import { ApproveReviewsButton } from './util/ReviewActionButtons'

interface ApproveReviewProps {
  stopApprovingReviews: (success: boolean) => void
  selectedReviews: ReviewTableRowData[]
  searchReviewsArgs?: SearchReviewArgs
  fetchMore?: ObservableQueryFields<
    SearchReviewData,
    SearchReviewArgs
  >['fetchMore']
}

const schema = () => ({
  properties: {
    ...reviewSchema.properties,
    ...reviewWithErrorSchema,
    ...productSchema.properties,
  },
})

const ApproveReview = (props: ApproveReviewProps & InjectedIntlProps) => {
  const { hasError, errorMessage, setMainError, clearError } = useMatchingError(
    props.intl,
    'APPROVE'
  )

  const [isModalOpen, setIsModalOpen] = useState(true)
  const [displayedReviews] = useState(props.selectedReviews)
  const {
    getReviewError,
    // setAllErrors,
    shouldShowIndividualErrors,
  } = useIndividualErrorMapping(props.intl)

  const { isLoaded } = useModalCustomStyles()

  const handleCloseModal = (success: boolean) => {
    props.stopApprovingReviews(success)
    setIsModalOpen(false)
  }

  const formatReviewsToApprove = () => {
    return {
      ids: displayedReviews.map(row => {
        const { id } = row.review
        return id
      }),
      approved: true,
    }
  }

  const { searchReviewsArgs, fetchMore } = props
  return (
    <Modal
      responsiveFullScreen
      centered
      title={
        <div className="nl5 pt3">
          {hasError && (
            <div className="pb4">
              <Alert type="error" onClose={clearError}>
                {errorMessage}
              </Alert>
            </div>
          )}
          <div className="mb3 t-heading-4 lh-copy">
            <FormattedMessage id="admin/reviews.table.modal.approveReviews.title" />
          </div>
          <div className="t-body c-muted-1 lh-copy flex items-center">
            <FormattedMessage id="admin/reviews.table.modal.approveReviews.subTitle" />
          </div>
        </div>
      }
      isOpen={isModalOpen}
      onClose={() => handleCloseModal(false)}
      container={window.top.document.body}
    >
      <ToastProvider positioning="window">
        <div className="nh5">
          <div className="b f5 pt5 pb5">
            <FormattedMessage
              id="admin/reviews.table.modal.approveReviews.total"
              values={{
                total: displayedReviews.length,
              }}
            />
          </div>
          <Table
            density="low"
            fullWidth
            items={displayedReviews.map(row => ({
              ...row,
              errorMessage:
                shouldShowIndividualErrors &&
                getReviewError({
                  id: row.review.id,
                }),
            }))}
            schema={schema()}
            updateTableKey={`${displayedReviews.length.toString()}${isLoaded}`}
          />
          <div className="w-100 nr5 nb5 flex justify-end mt5">
            <Button
              variation="tertiary"
              onClick={() => handleCloseModal(!!shouldShowIndividualErrors)}
            >
              <FormattedMessage id="admin/reviews.table.modal.approveReviews.cancel" />
            </Button>
            <ApproveReviewsButton
              label={
                <FormattedMessage id="admin/reviews.table.modal.approveReviews.send" />
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
              // onMixedError={() => {
              //   setDisplayedReviews(currentDisplayed =>
              //     filterFailedReviews(currentDisplayed, successList)
              //   )
              //   setAllErrors(err)
              //   setMainError(err)
              // }}
              onGlobalError={setMainError}
              onSuccess={() => handleCloseModal(true)}
              buildArgs={formatReviewsToApprove}
            />
          </div>
        </div>
      </ToastProvider>
    </Modal>
  )
}

export default injectIntl(ApproveReview)
