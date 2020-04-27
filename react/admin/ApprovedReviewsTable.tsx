/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC, useState, Fragment } from 'react'
import { injectIntl, InjectedIntlProps, FormattedMessage } from 'react-intl'
import { Box, ToastConsumer } from 'vtex.styleguide'

import {
  Review,
  ReviewTableRowData,
  SearchReviewArgs,
  ToastRenderProps,
} from './types'
import {
  reviewSchema,
  reviewWithErrorSchema,
  productSchema,
  dateSchema,
} from './schemas'
import DeleteReviewsPanel from './components/DeleteReviews'
import useBulkActionsApproved from './components/tableHelpers/useBulkActionsApproved'
import useLineActionsApproved from './components/tableHelpers/useLineActionsApproved'
import ReviewsTable from './components/ReviewsTable'
import { TOAST_DURATION_MS } from './utils'

const schema = (intl: ReactIntl.InjectedIntl) => ({
  properties: {
    ...reviewSchema.properties,
    ...reviewWithErrorSchema,
    ...productSchema.properties,
    ...dateSchema(intl).properties,
  },
})

export const ApprovedReviewsTable: FC<InjectedIntlProps> = ({ intl }) => {
  const [selected, setSelected] = useState<ReviewTableRowData[]>([])

  const [isDeletingReviews, setIsDeletingReviews] = useState(false)

  const [bulkActions, { setTotalItems }] = useBulkActionsApproved(
    0,
    setSelected,
    setIsDeletingReviews,
    intl
  )

  const [{ deleteLineAction }] = useLineActionsApproved(
    setSelected,
    setIsDeletingReviews
  )

  const lineActions = [deleteLineAction]

  const toReviewTableRowData = (review: Review) => {
    const {
      id,
      reviewDateTime,
      reviewerName,
      title,
      text,
      productId,
      shopperId,
      rating,
      sku,
    } = review

    return {
      date: reviewDateTime,
      product: {
        productId,
        sku,
      },
      review: {
        id,
        shopperId,
        reviewerName,
        rating,
        title,
        text,
      },
    }
  }

  return (
    <ToastConsumer>
      {({ showToast }: ToastRenderProps) => {
        const resetSelectionWithMessage = (message: JSX.Element | string) => {
          showToast({
            message,
            duration: TOAST_DURATION_MS,
          })
          setSelected([])
        }

        return (
          <ReviewsTable
            toRowData={toReviewTableRowData}
            reviewStatus="true"
            schema={schema(intl)}
            emptyStateText={
              <FormattedMessage id="admin/reviews.table.empty-state.approved" />
            }
            lineActions={lineActions}
            bulkActions={{
              ...bulkActions,
              onChange: ({ selectedRows }: any) => {
                setSelected(selectedRows)
              },
              selectedRows: selected,
              fixed: true,
            }}
            setTotal={setTotalItems}
            filterOptionsLists={{}}
          >
            {({
              fetchMore,
              variables,
              table,
            }: {
              fetchMore: any
              variables: SearchReviewArgs
              table: JSX.Element
            }) => (
              <Fragment>
                {isDeletingReviews && (
                  <DeleteReviewsPanel
                    stopDeletingReviews={({
                      shouldRemoveSelection,
                    }: {
                      shouldRemoveSelection?: boolean
                    }) => {
                      setIsDeletingReviews(false)
                      if (shouldRemoveSelection) {
                        resetSelectionWithMessage(
                          <FormattedMessage id="admin/reviews.table.modal.delete.success" />
                        )
                      }
                    }}
                    selectedReviews={selected}
                    searchReviewsArgs={variables}
                    fetchMore={fetchMore}
                  />
                )}
                <div className="w-100 h-100 mt7">
                  <Box>{table}</Box>
                </div>
              </Fragment>
            )}
          </ReviewsTable>
        )
      }}
    </ToastConsumer>
  )
}

export default injectIntl(ApprovedReviewsTable)
