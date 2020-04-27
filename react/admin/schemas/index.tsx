/* eslint-disable react/display-name */
import React from 'react'
import { FormattedMessage, InjectedIntl } from 'react-intl'

import { Product, ReviewTableRowData } from '../types'
import ProductCellRenderer from '../components/util/productCellRenderer'
import ReviewCellRenderer from '../components/util/reviewCellRenderer'
import {
  PRODUCT_COLUMN_WIDTH_PX,
  REVIEW_COLUMN_WIDTH_PX,
  DATE_COLUMN_WIDTH_PX,
} from '../utils'
import { reviewSchemaMessages } from '../utils/messages'
import toRightCellRenderer from '../components/util/toRightCellRenderer'

export interface CellRendererArgs<TCellData> {
  cellData: TCellData
  rowData: ReviewTableRowData
  index: number
}

export interface ReviewSummary {
  shopperId: string
  reviewerName: string
  rating: number
  title: string
  text: string
}

export const reviewSchema = {
  properties: {
    review: {
      type: 'object',
      width: REVIEW_COLUMN_WIDTH_PX,
      properties: {
        id: 'string',
        shopperId: 'string',
        reviewerName: 'string',
        rating: 'number',
        title: 'string',
        text: 'string',
      },
      cellRenderer: ({ cellData }: CellRendererArgs<ReviewSummary>) => (
        <ReviewCellRenderer cellData={cellData} />
      ),
      headerRenderer: () => (
        <FormattedMessage {...reviewSchemaMessages.review} />
      ),
    },
  },
}

export const productSchema = {
  properties: {
    product: {
      type: 'object',
      width: PRODUCT_COLUMN_WIDTH_PX,
      properties: {
        productId: 'string',
        sku: 'string',
      },
      cellRenderer: ({ cellData }: CellRendererArgs<Product>) => (
        <ProductCellRenderer cellData={cellData} />
      ),
      headerRenderer: () => (
        <FormattedMessage {...reviewSchemaMessages.product} />
      ),
    },
  },
}

export const dateSchema = (intl: InjectedIntl) => ({
  properties: {
    date: {
      type: 'string',
      width: DATE_COLUMN_WIDTH_PX,
      title: intl.formatMessage(reviewSchemaMessages.date),
      sortable: true,
      headerRight: true,
      cellRenderer: ({ cellData }: CellRendererArgs<string>) =>
        toRightCellRenderer(<div className="t-body">{cellData}</div>),
    },
  },
})

export const reviewWithErrorSchema = {
  review: {
    type: 'object',
    properties: {
      shopperId: 'string',
      reviewerName: 'string',
      rating: 'number',
      title: 'string',
      text: 'string',
    },
    cellRenderer: ({
      cellData,
      rowData,
    }: {
      cellData: ReviewSummary
      rowData: { errorMessage: string | JSX.Element }
    }) => (
      <div className="flex items-center flex-column justify-center">
        <ReviewCellRenderer cellData={cellData} />
        {rowData.errorMessage && (
          <div className="t-small red mt2 w-100">{rowData.errorMessage}</div>
        )}
      </div>
    ),
    headerRenderer: () => null,
  },
}

export const baseSchema = () => ({
  properties: {
    ...reviewSchema.properties,
    ...productSchema.properties,
  },
})
