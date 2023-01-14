export default {
  // *************Reviews and Ratings Constants start here************ //

  formBottomLine: 'div[class*=formBottomLine] label div input',
  ratingStar: 'div[class*=formRating] > label > span:nth-child(2)',
  emptyStars:
    'div[class*=formRating] > label > span:nth-child(2) > span[class*=star--empty]',
  filledStars:
    'div[class*=formRating] > label > span:nth-child(2) > span[class*=star--filled]',
  formName: 'div[class*=formName] > label > div > input',
  formEmail: 'div[class*=formEmail] > label > div > input',
  formTextArea: 'div[class*=formReview] > label > textarea',
  formSubmit: 'div[class*=formSubmit] > button',
  submittedReviewText: 'div[class*=formContainer] > div > h5',
  graphContent: 'div[class*=graphContent]',
  summaryContainer: 'div[class*=summaryContainer]',
  inlineContainer: 'div[class*=inlineContainer]  span[class*=star]',
  summaryTotalReviews: 'span[class*=summaryTotalReviews]',
  summaryButtonContainer: 'div[class*=summaryButtonContainer]',
  reviewCommentRating: 'div[class*=reviewCommentRating]',
  selectSort:
    'div[class*=reviewsOrderBy] > div:nth-child(1) > label> div> select',
  selectFilter:
    'div[class*=reviewsOrderBy] > div:nth-child(2) > label> div> select',
  reviewStarsCount:
    'div[class*=reviewCommentRating] > span > span[class*=filled]',
  ReviewComment: 'span[class*=reviewComment]',
  // Product Specification Page
  LoginLink: 'div[class*=review] a[href*=login]',
  PostalCode: 'div[class*=postalCode]',
  ForgotPassword: 'a[class*=forgot]',
  WriteReview: 'span[class*=writeReviewButton]',
  Danger: 'div[class*=danger]',
  ReviewContainer: 'div[class*=reviewCommentRating]',
  GetReviewByIndex: index => {
    return `div[class*=reviewCommentsContainer] div[class*=reviewComment]:nth-child(${index}) div[class*=reviewCommentRating] span[class*=filled]`
  },
  Download: 'div[class*=pal] > .vtex-button]',
  FromDate: position => {
    return `:nth-child(${position}) > div[class*=wrapper] > div[class*=_input-container] > label[class*=input] > div[class*=input-prefix__group] > .vtex-styleguide-9-x-input`
  },
  SelectDate: day => {
    return `div[class*=datepicker__day--0${day}]`
  },
}
