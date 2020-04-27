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
import { useQuery } from 'react-apollo'
import {
  IconCopy,
  IconExternalLink,
  ToastConsumer,
  Tooltip,
} from 'vtex.styleguide'

import ProductQuery from '../../graphql/ProductQuery.graphql'
import { Product, ToastRenderProps } from '../../types'

const DEFAULT_TOAST_DURATION_MS = 1500

type Props = {
  cellData: Product
} & InjectedIntlProps

interface ProductResult {
  productName: string
}

interface ProductData {
  product: ProductResult
}

interface ProductVars {
  identifier: ProductUniqueIdentifier
}

interface ProductUniqueIdentifier {
  field: string
  value: string
}

const messages = defineMessages({
  copyTitle: {
    id: 'admin/reviews.table.actions.copy.title',
    defaultMessage: 'Copy',
  },
})

const IntlProductCellRenderer: React.FC<Props> = ({ cellData, intl }) => {
  const [showCopy, setShowCopy] = useState(false)

  const { data } = useQuery<ProductData, ProductVars>(ProductQuery, {
    variables: {
      identifier: {
        field: 'id',
        value: cellData ? cellData.productId : '',
      },
    },
  })

  return cellData ? (
    <ToastConsumer>
      {({ showToast }: ToastRenderProps) => (
        <div
          className="w-100 db t-body review-table-product-name"
          onMouseEnter={() => setShowCopy(true)}
          onMouseLeave={() => setShowCopy(false)}
        >
          {data && (
            <p className="ma0 mb3 fw6">
              <a
                href={`../../Site/ProdutoForm.aspx?id=${cellData.productId}`}
                className="no-underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {data.product.productName}
              </a>{' '}
              <IconExternalLink size={10} />
            </p>
          )}
          <p className="ma0 flex items-center">
            <span className="fw4 mr2 truncate" title={cellData.productId}>
              <FormattedMessage
                id="admin/reviews.table.productCell.productId"
                values={{
                  productId: cellData.productId,
                }}
              />
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
              <span className="truncate">
                <FormattedMessage
                  id="admin/reviews.table.productCell.SKU"
                  values={{
                    sku: cellData.sku,
                  }}
                />
              </span>
            ) : null}
          </p>
        </div>
      )}
    </ToastConsumer>
  ) : null
}

const ProductCellRenderer = injectIntl(IntlProductCellRenderer)

export default ProductCellRenderer
