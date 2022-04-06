export default {
  ratingsAPI: (baseUrl, productID) => {
    return `${baseUrl}/reviews-and-ratings/api/${productID}`
  },
}
