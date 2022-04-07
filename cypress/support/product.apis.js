export default {
  ratingsAPI: (baseUrl, productID) => {
    return `${baseUrl}/reviews-and-ratings/api/${productID}`
  },
  deleteReviewAPI: (baseUrl, reviewId) => {
    return `${baseUrl}/reviews-and-ratings/api/review?id=${reviewId}`
  },
  deleteReviewAPIs: baseUrl => {
    return `${baseUrl}/reviews-and-ratings/api/reviews`
  },
}
