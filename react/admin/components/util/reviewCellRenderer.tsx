/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react'
import copy from 'copy-to-clipboard'
import {
  FormattedMessage,
  defineMessages,
  injectIntl,
  InjectedIntlProps,
} from 'react-intl'
import { IconCopy, ToastConsumer, Tooltip } from 'vtex.styleguide'

import Stars from '../../../components/Stars'
import { ToastRenderProps } from '../../types'
import { ReviewSummary } from '../../schemas'

const DEFAULT_TOAST_DURATION_MS = 1500

type Props = {
  cellData: ReviewSummary
} & InjectedIntlProps

const messages = defineMessages({
  copyTitle: {
    id: 'admin/reviews.table.actions.copy.title',
    defaultMessage: 'Copy',
  },
  anonymous: {
    id: 'admin/reviews.table.reviewCell.anonymous',
    defaultMessage: 'anonymous',
  },
})

const IntlReviewCellRenderer: React.FC<Props> = ({ cellData, intl }) => {
  const [showCopy, setShowCopy] = useState(false)

  return cellData ? (
    <ToastConsumer>
      {({ showToast }: ToastRenderProps) => (
        <div
          className="w-100 db t-body review-table-shopper-id pv3 ws-normal"
          onMouseEnter={() => setShowCopy(true)}
          onMouseLeave={() => setShowCopy(false)}
        >
          <p className="ma0">
            <span className="t-heading-4 v-mid">
              <Stars rating={cellData.rating} />
            </span>{' '}
            <span>{cellData.title}</span>
          </p>
          <p className="ma0 flex items-center mt3 t-small c-muted-1">
            <span className="fw6 mr2" title={cellData.shopperId}>
              <FormattedMessage
                id="admin/reviews.table.reviewCell.author"
                values={{
                  author: cellData.reviewerName
                    ? cellData.reviewerName
                    : intl.formatMessage(messages.anonymous),
                }}
              />{' '}
              {cellData.shopperId ? `(${cellData.shopperId})` : ''}
            </span>
            <Tooltip
              label={intl.formatMessage(messages.copyTitle)}
              position="right"
            >
              <span
                className="hover-c-action-primary h1"
                onClick={e => {
                  e.preventDefault()
                  e.stopPropagation()
                  copy(
                    cellData.shopperId
                      ? cellData.shopperId
                      : cellData.reviewerName
                  )
                  showToast({
                    message: (
                      <FormattedMessage id="admin/reviews.table.actions.copy.toast" />
                    ),
                    duration: DEFAULT_TOAST_DURATION_MS,
                  })
                }}
              >
                {showCopy && <IconCopy />}
              </span>
            </Tooltip>
          </p>
          <p className="ma0 mt3 t-small c-muted-1">
            <span>{cellData.text}</span>
          </p>
        </div>
      )}
    </ToastConsumer>
  ) : null
}

const ReviewCellRenderer = injectIntl(IntlReviewCellRenderer)

export default ReviewCellRenderer
