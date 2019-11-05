import { defineMessages } from 'react-intl'

export const layoutHeaderMessage = defineMessages({
  label: {
    id: 'admin/reviews.title',
    defaultMessage: 'Reviews',
  },
})

export const tableQueryMessages = defineMessages({
  errorFeedback: {
    id: 'admin/reviews.table.query.errorFeedback',
    defaultMessage:
      'There was an error while fetching your reviews. Refresh your page or try again later.',
  },
})

export const adminReviewMessages = defineMessages({
  pendingTab: {
    id: 'admin/reviews.tab.pending',
    defaultMessage: 'Pending',
  },
  approvedTab: {
    id: 'admin/reviews.tab.approved',
    defaultMessage: 'Approved',
  },
})

export const mutationFeedbackMessages = defineMessages({
  approvalFeedback: {
    id: 'admin/reviews.mutations.approvalFeedback',
    defaultMessage: 'Successfully approved reviews.',
  },
})

export const tableActionsMessages = defineMessages({
  approveReview: {
    id: 'admin/reviews.table.actions.approveReview',
    defaultMessage: 'Approve review',
  },
  // viewReview: {
  //   id: 'admin/reviews.table.actions.viewReview',
  //   defaultMessage: 'Review details',
  // },
  deleteReview: {
    id: 'admin/reviews.table.actions.deleteReview',
    defaultMessage: 'Delete review',
  },
})

export const tableBulkActionsMessages = defineMessages({
  allRowsSelected: {
    id: 'admin/reviews.table.bulkActions.allRowsSelected',
    defaultMessage: 'All rows selected',
  },
  approveReview: {
    id: 'admin/reviews.table.bulkActions.approveReview',
    defaultMessage: 'Approve review(s)',
  },
  more: {
    id: 'admin/reviews.table.bulkActions.more',
    defaultMessage: 'More',
  },
  selectAll: {
    id: 'admin/reviews.table.bulkActions.selectAll',
    defaultMessage: 'Select all',
  },
  selectedRows: {
    id: 'admin/reviews.table.bulkActions.selectedRows',
    defaultMessage: 'Selected rows',
  },
  deleteReview: {
    id: 'admin/reviews.table.bulkActions.deleteReview',
    defaultMessage: 'Delete review(s)',
  },
})

export const tableSearchMessages = defineMessages({
  placeholder: {
    id: 'admin/reviews.table.search.placeholder',
    defaultMessage: 'Search by product ID, SKU name, or shopper ID',
  },
})

export const tablePaginationMessages = defineMessages({
  textShowRows: {
    id: 'admin/reviews.table.pagination.textShowRows',
    defaultMessage: 'Show rows',
  },
  textOf: {
    id: 'admin/reviews.table.pagination.textOf',
    defaultMessage: 'of',
  },
})

export const tableEmptyStateMessages = defineMessages({
  label: {
    id: 'admin/reviews.table.empty-state',
    defaultMessage: 'Nothing here.',
  },
})

export const reviewSchemaMessages = defineMessages({
  review: {
    id: 'admin/reviews.reviewSchema.review',
    defaultMessage: 'Review',
  },
  product: {
    id: 'admin/reviews.reviewSchema.product',
    defaultMessage: 'Product',
  },
  date: {
    id: 'admin/reviews.reviewSchema.date',
    defaultMessage: 'Date',
  },
})
