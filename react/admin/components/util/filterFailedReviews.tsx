// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { SingleActionResponse } from '../../types'

// const isInMap = (obj: { id: number }, map: any) => {
//   return map[`${obj.id}`] ? true : false
// }

// const toSuccessMap = (successResponses: SingleActionResponse[]) => {
//   const successResponsesObj =
//     successResponses &&
//     successResponses.reduce((acc, response) => {
//       return {
//         ...acc,
//         [`${response.reviewId}`]: response,
//       }
//     }, {})

//   return successResponsesObj
// }

// const filterFailedReviews = (allReviews: any, successList: any) => {
//   const successMap = toSuccessMap(successList)

//   const newValue = allReviews.filter(
//     (review: any) => !isInMap({ id: review.id }, successMap)
//   )
//   return newValue
// }

// export default filterFailedReviews
