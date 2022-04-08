export default {
  // *************Reviews and Ratings Constants start here************ //

  writeReviewButton: '.vtex-reviews-and-ratings-3-x-formSubmit > button',
  formBottomLine:
    '.vtex-reviews-and-ratings-3-x-formBottomLine label div input',
  ratingStar:
    '.vtex-reviews-and-ratings-3-x-formRating > label > span:nth-child(2)',
  formName: '.vtex-reviews-and-ratings-3-x-formName > label > div > input',
  formEmail: '.vtex-reviews-and-ratings-3-x-formEmail > label > div > input',
  formTextArea: '.vtex-reviews-and-ratings-3-x-formReview > label > textarea',
  formSubmit: '.vtex-reviews-and-ratings-3-x-formSubmit > button',
  submittedReviewText: '.vtex-reviews-and-ratings-3-x-formContainer > div > h5',
  starCount:
    '.vtex-reviews-and-ratings-3-x-reviewsRating > div > span > .vtex-reviews-and-ratings-3-x-star--filled',
  averageRating: '.review__rating--average',
  graphContent: 'vtex-reviews-and-ratings-3-x-graphContent',
  summaryContainer: 'vtex-reviews-and-ratings-3-x-summaryContainer',
  inlineContainer: 'vtex-reviews-and-ratings-3-x-inlineContainer',
  summaryTotalReviews: 'vtex-reviews-and-ratings-3-x-summaryTotalReviews',
  summaryButtonContainer: 'vtex-reviews-and-ratings-3-x-summaryButtonContainer',
  reviewCommentRating: `vtex-reviews-and-ratings-3-x-reviewCommentRating`,
  selectSort:
    '.vtex-reviews-and-ratings-3-x-reviewsOrderBy > div:nth-child(1) > label> div> select',
  selectFilter:
    '.vtex-reviews-and-ratings-3-x-reviewsOrderBy > div:nth-child(2) > label> div> select',
  reviewStarsCount:
    '.vtex-reviews-and-ratings-3-x-reviewCommentRating > span > span[class*=filled]',

  // Product Specification Page
  LoginLink: 'div[class*=review] a[href*=login]',
  PostalCode: 'div[class*=postalCode]',
  ForgotPassword: 'a[class*=forgot]',
  Cropped: '#menu-item-cropped',
  StarsFilled: 'label[class*=review] .t-heading-4 span[class*=filled]',
  WriteReview: '.vtex-reviews-and-ratings-3-x-writeReviewButton',
  Danger: 'div[class*=danger]',
  ReviewContainer: 'div[class*=reviewCommentRating]',
  GetReviewByIndex: index => {
    return `div[class*=reviewCommentsContainer] div[class*=reviewComment]:nth-child(${index}) div[class*=reviewCommentRating] span[class*=filled]`
  },
}
