import { ObservableQueryFields } from 'react-apollo'
import {
  SearchReviewArgs,
  SearchReviewData,
  ReviewTableRowData,
  GenericActionResponse,
} from '../../types'
import { DataProxy } from 'apollo-cache'

import reviews from '../../../../graphql/reviews.graphql'

const updateCache = (
  cache: DataProxy,
  selectedReviews: ReviewTableRowData[],
  data?: { actionResult: GenericActionResponse } | null,
  searchReviewsArgs?: SearchReviewArgs,
  fetchMore?: ObservableQueryFields<
    SearchReviewData,
    SearchReviewArgs
  >['fetchMore']
) => {
  const queryAndVariables = {
    query: reviews,
    variables: searchReviewsArgs,
  }

  const reviewsCache = cache.readQuery<SearchReviewData, SearchReviewArgs>(
    queryAndVariables
  )

  if (data && reviewsCache) {
    const updatedTotal =
      reviewsCache.reviews.range.total - data.actionResult.successes.length

    const filteredReviews = reviewsCache.reviews.data.filter(
      review =>
        !selectedReviews.find(
          selectedReview => selectedReview.id === review.id
        ) ||
        data.actionResult.errors.find(
          response => response.reviewId === review.id
        )
    )
    cache.writeQuery({
      ...queryAndVariables,
      data: {
        reviews: {
          ...reviewsCache.reviews,
          data: filteredReviews,
          range: {
            ...reviewsCache.reviews.range,
            total: updatedTotal,
          },
        },
      },
    })

    const listLength =
      searchReviewsArgs &&
      searchReviewsArgs.to &&
      (searchReviewsArgs.from || searchReviewsArgs.from === 0)
        ? searchReviewsArgs.to - searchReviewsArgs.from
        : 0

    searchReviewsArgs &&
      searchReviewsArgs.to &&
      listLength &&
      fetchMore &&
      fetchMore({
        variables: {
          ...searchReviewsArgs,
          from: searchReviewsArgs.to,
          to: searchReviewsArgs.to + (listLength - filteredReviews.length),
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) {
            return prev
          }
          return {
            ...prev,
            reviews: {
              ...prev.reviews,
              data: prev.reviews.data.concat(fetchMoreResult.reviews.data),
            },
          }
        },
      })
  }
}

export default updateCache
