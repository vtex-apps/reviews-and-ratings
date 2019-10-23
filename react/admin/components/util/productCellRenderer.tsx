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

import { Product, ToastRenderProps } from '../../types'

const DEFAULT_TOAST_DURATION_MS = 1500

type Props = {
  cellData: Product
} & InjectedIntlProps

const messages = defineMessages({
  copyTitle: {
    id: 'admin/reviews.table.actions.copy.title',
    defaultMessage: 'Copy',
  },
})

const IntlProductCellRenderer: React.FC<Props> = ({ cellData, intl }) => {
  const [showCopy, setShowCopy] = useState(false)

  return cellData ? (
    <ToastConsumer>
      {({ showToast }: ToastRenderProps) => (
        <div
          className="w-100 db t-body review-table-product-name"
          onMouseEnter={() => setShowCopy(true)}
          onMouseLeave={() => setShowCopy(false)}
        >
          <p className="ma0 flex items-center">
            <span className="fw6 mr2 truncate" title={cellData.productId}>
              {cellData.productId}
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
                  copy(cellData.productId)
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
            {cellData.sku ? (
              <span className="truncate">{cellData.sku}</span>
            ) : null}
          </p>
        </div>
      )}
    </ToastConsumer>
  ) : null
}

const ProductCellRenderer = injectIntl(IntlProductCellRenderer)

export default ProductCellRenderer
