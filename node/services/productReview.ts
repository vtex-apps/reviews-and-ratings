import type { Logger } from '@vtex/api'

import type { AppSettingsClient } from '../clients/appSettings'
import type { ProductReviewClient } from '../clients/productReview'
import type {
  AppSettings,
  AverageCount,
  LegacyReview,
  Review,
  ReviewsResponseWrapper,
  ValidatedUser,
} from '../types'
import { DELIMITER, MAXIMUM_RETURNED_RECORDS } from '../utils/constants'
import { localeList } from '../utils/locale'

// ==================== App Settings ====================

export async function getAppSettings(
  appSettingsClient: AppSettingsClient
): Promise<AppSettings> {
  return appSettingsClient.getAppSettingAsync()
}

// ==================== Single Review ====================

export async function getReview(
  productReviewClient: ProductReviewClient,
  id: string
): Promise<Review | null> {
  const wrapper = await productReviewClient.getProductReviewsMD(
    `id=${id}`,
    null,
    null
  )

  if (wrapper.reviews && wrapper.reviews.length > 0) {
    return wrapper.reviews[0]
  }

  return null
}

// ==================== Get Reviews (admin) ====================

export async function getReviews(
  productReviewClient: ProductReviewClient,
  searchTerm: string | null,
  from: number,
  to: number,
  orderBy: string | null,
  status: string | null,
  logger: Logger
): Promise<ReviewsResponseWrapper> {
  try {
    let searchQuery = ''
    let statusQuery = ''

    if (searchTerm) {
      searchQuery = `&_keyword=${searchTerm}`
    }

    if (status) {
      statusQuery = `&approved=${status}`
    }

    const sortQuery = getSortQuery(orderBy)

    return await productReviewClient.getProductReviewsMD(
      `${searchQuery}${sortQuery}${statusQuery}`,
      String(from),
      String(to)
    )
  } catch (err: any) {
    logger.error({
      message: 'getReviews error',
      error: err,
      searchTerm,
      from,
      to,
      orderBy,
      status,
    })

    return { reviews: [], range: { total: 0, from: 0, to: 0 } }
  }
}

export async function getAllReviews(
  productReviewClient: ProductReviewClient
): Promise<ReviewsResponseWrapper> {
  return productReviewClient.getProductReviewsMD('', null, null)
}

export async function getReviewsPaginated(
  productReviewClient: ProductReviewClient,
  from: number,
  to: number
): Promise<ReviewsResponseWrapper> {
  return productReviewClient.getProductReviewsMD(
    '',
    String(from),
    String(to)
  )
}

// ==================== Reviews by Product ====================

export async function getReviewsByProductId(
  productReviewClient: ProductReviewClient,
  appSettingsClient: AppSettingsClient,
  productId: string,
  logger: Logger
): Promise<ReviewsResponseWrapper> {
  try {
    const result = await getReviewsByProductIdFull(
      productReviewClient,
      appSettingsClient,
      productId,
      0,
      MAXIMUM_RETURNED_RECORDS,
      '',
      '',
      0,
      '',
      true,
      logger
    )

    if (result) {
      logger.info({
        message: 'getReviewsByProductId',
        productId,
        total: result.range.total,
      })
    }

    return result
  } catch (err: any) {
    logger.error({
      message: 'getReviewsByProductId error',
      error: err,
      productId,
    })

    return { reviews: [], range: { total: 0, from: 0, to: 0 } }
  }
}

export async function getReviewsByProductIdFull(
  productReviewClient: ProductReviewClient,
  appSettingsClient: AppSettingsClient,
  productId: string,
  from: number,
  to: number,
  orderBy: string,
  searchTerm: string,
  rating: number,
  locale: string,
  pastReviews: boolean,
  logger: Logger
): Promise<ReviewsResponseWrapper> {
  let searchQuery = ''
  let ratingQuery = ''
  let localeQuery = ''
  const ratingFilter = rating > 0 && rating <= 5
  const pastRevNLocale = pastReviews && !!locale
  let isLocaleWildcard = true

  try {
    const sort = getSortQuery(orderBy)

    if (searchTerm) {
      searchQuery = `&_keyword=${searchTerm}`
    }

    if (to === 0 || to < from) {
      to = MAXIMUM_RETURNED_RECORDS
    }

    const settings = await getAppSettings(appSettingsClient)

    if (locale && localeList[locale]) {
      isLocaleWildcard = false
      const languages = localeList[locale]

      localeQuery = languages
        .map((lang: string) => `(locale=${locale}-${lang})`)
        .join(' OR')

      // remove trailing space if any
      localeQuery = localeQuery.trimEnd()
    }

    if (pastRevNLocale) {
      if (settings.requireApproval) {
        searchQuery = ' AND approved=true'
      }

      if (isLocaleWildcard) {
        localeQuery = `(locale=${locale}-*)`
      }

      localeQuery += 'OR(locale is null)'

      if (ratingFilter) {
        ratingQuery = ` AND rating=${rating}`
      }

      const productQuery = ` AND productId=${productId}`

      return await productReviewClient.getProductReviewsMD(
        `_where=(${localeQuery})${ratingQuery}${productQuery}${searchQuery}${sort}`,
        String(from),
        String(to)
      )
    }

    if (ratingFilter) {
      ratingQuery = `&rating=${rating}`
    }

    if (settings.requireApproval) {
      searchQuery = `${searchQuery}&approved=true`
    }

    if (locale) {
      if (isLocaleWildcard) {
        localeQuery = `&locale=${locale}-*`
      } else {
        localeQuery = `&_where=${localeQuery}`
      }
    }

    return await productReviewClient.getProductReviewsMD(
      `productId=${productId}${sort}${searchQuery}${ratingQuery}${localeQuery}`,
      String(from),
      String(to)
    )
  } catch (err: any) {
    logger.error({
      message: 'getReviewsByProductIdFull error',
      error: err,
      productId,
      from,
      to,
      orderBy,
      searchTerm,
      rating,
      locale,
      pastReviews,
    })

    return { reviews: [], range: { total: 0, from: 0, to: 0 } }
  }
}

// ==================== Average Rating ====================

export async function getAverageRatingByProductId(
  productReviewClient: ProductReviewClient,
  appSettingsClient: AppSettingsClient,
  productId: string
): Promise<AverageCount> {
  let averageRating = 0
  let stars1 = 0
  let stars2 = 0
  let stars3 = 0
  let stars4 = 0
  let stars5 = 0
  let numberOfReviews = 0

  let searchQuery = `productId=${productId}`
  const settings = await getAppSettings(appSettingsClient)

  if (settings.requireApproval) {
    searchQuery = `${searchQuery}&approved=true`
  }

  const wrapper = await productReviewClient.getProductReviewsMD(
    searchQuery,
    null,
    null
  )

  const reviews = wrapper.reviews

  if (reviews) {
    let totalRating = 0

    numberOfReviews = reviews.length
    for (const review of reviews) {
      totalRating += review.rating ?? 0
      if ((review.rating ?? 0) >= 5) stars5++
      else if (review.rating === 4) stars4++
      else if (review.rating === 3) stars3++
      else if (review.rating === 2) stars2++
      else stars1++
    }

    if (numberOfReviews !== 0) {
      averageRating = totalRating / numberOfReviews
    }
  }

  return {
    average: Math.round(averageRating * 100) / 100,
    starsFive: stars5,
    starsFour: stars4,
    starsThree: stars3,
    starsTwo: stars2,
    starsOne: stars1,
    total: numberOfReviews,
  }
}

// ==================== New Review ====================

export async function newReview(
  productReviewClient: ProductReviewClient,
  appSettingsClient: AppSettingsClient,
  review: Review,
  doValidation: boolean,
  storeUserAuthToken: string | undefined,
  logger: Logger
): Promise<Review | null> {
  try {
    if (!review) return null

    if (doValidation) {
      let userValidated = false
      let hasShopperReviewedFlag = false
      let hasShopperPurchased = false
      let userId = ''

      const validatedUser = await productReviewClient.validateUserToken(
        storeUserAuthToken ?? ''
      )

      if (validatedUser && validatedUser.authStatus === 'Success') {
        userValidated = true
      }

      if (userValidated && validatedUser) {
        userId = validatedUser.user
        hasShopperReviewedFlag = await hasShopperReviewed(
          productReviewClient,
          userId,
          review.productId
        )

        if (hasShopperReviewedFlag) {
          return null
        }

        hasShopperPurchased = await shopperHasPurchasedProduct(
          productReviewClient,
          userId,
          review.productId,
          logger
        )
      }

      review.shopperId = userId
      review.verifiedPurchaser = hasShopperPurchased
    }

    const settings = await getAppSettings(appSettingsClient)

    review.approved = !settings.requireApproval

    if ((review.rating ?? 0) < 1) review.rating = 1
    if ((review.rating ?? 0) > 5) review.rating = 5

    if (!review.reviewDateTime?.trim()) {
      review.reviewDateTime = new Date().toString()
    }

    const id = await productReviewClient.saveProductReviewMD(review)

    if (!id) {
      return null
    }

    review.id = id

    return review
  } catch (err: any) {
    logger.error({
      message: 'newReview error',
      error: err,
      review,
      doValidation,
    })

    return null
  }
}

// ==================== Edit Review ====================

export async function editReview(
  productReviewClient: ProductReviewClient,
  review: Review
): Promise<Review | null> {
  const wrapper = await productReviewClient.getProductReviewsMD(
    `id=${review.id}`,
    null,
    null
  )

  const oldReview = wrapper.reviews?.[0]

  if (!oldReview) return null

  review.approved = review.approved ?? oldReview.approved
  review.location = review.location || oldReview.location
  review.productId = review.productId || oldReview.productId
  review.rating = review.rating ?? oldReview.rating
  review.reviewDateTime = review.reviewDateTime || oldReview.reviewDateTime
  review.reviewerName = review.reviewerName || oldReview.reviewerName
  review.shopperId = review.shopperId || oldReview.shopperId
  review.sku = review.sku || oldReview.sku
  review.text = review.text || oldReview.text
  review.title = review.title || oldReview.title
  review.locale = review.locale || oldReview.locale
  review.verifiedPurchaser = review.verifiedPurchaser ?? oldReview.verifiedPurchaser

  if ((review.rating ?? 0) < 1) review.rating = 1
  if ((review.rating ?? 0) > 5) review.rating = 5

  const id = await productReviewClient.saveProductReviewMD(review)

  if (!id) {
    return null
  }

  review.id = id

  return review
}

// ==================== Delete Review ====================

export async function deleteReview(
  productReviewClient: ProductReviewClient,
  ids: string[]
): Promise<boolean> {
  let retval = true

  for (const id of ids) {
    const result = await productReviewClient.deleteProductReviewMD(id)

    retval = retval && result
  }

  return retval
}

// ==================== Moderate Review ====================

export async function moderateReview(
  productReviewClient: ProductReviewClient,
  ids: string[],
  approved: boolean
): Promise<boolean> {
  let retval = true

  for (const id of ids) {
    const wrapper = await productReviewClient.getProductReviewsMD(
      `id=${id}`,
      null,
      null
    )

    const reviewToModerate = wrapper.reviews?.find((r) => r.id === id)

    if (reviewToModerate) {
      reviewToModerate.approved = approved
      const returnedId = await productReviewClient.saveProductReviewMD(
        reviewToModerate
      )

      if (!returnedId) {
        retval = false
      }
    } else {
      retval = false
    }
  }

  return retval
}

// ==================== Has Shopper Reviewed ====================

export async function hasShopperReviewed(
  productReviewClient: ProductReviewClient,
  shopperId: string,
  productId: string
): Promise<boolean> {
  const wrapper = await productReviewClient.getProductReviewsMD(
    `shopperId=${shopperId}&productId=${productId}`,
    null,
    null
  )

  return !!(wrapper.reviews && wrapper.reviews.length > 0)
}

// ==================== Shopper Purchased Product ====================

export async function shopperHasPurchasedProduct(
  productReviewClient: ProductReviewClient,
  shopperId: string,
  productId: string,
  logger: Logger
): Promise<boolean> {
  let hasPurchased = false

  try {
    const vtexOrderList = await productReviewClient.listOrders(
      `q=${shopperId}`
    )

    if (!vtexOrderList?.list) return false

    const orderIds = vtexOrderList.list.map((o) => o.orderId)

    for (const orderId of orderIds) {
      const vtexOrder = await productReviewClient.getOrderInformation(orderId)

      if (vtexOrder?.items) {
        const productIds = vtexOrder.items.map((i) => i.productId)

        hasPurchased = productIds.includes(productId)
        if (hasPurchased) break
      }
    }
  } catch (err: any) {
    logger.error({
      message: 'shopperHasPurchasedProduct error',
      error: err,
      shopperId,
      productId,
    })
  }

  return hasPurchased
}

// ==================== Auth Checks ====================

export async function isValidAuthUser(
  productReviewClient: ProductReviewClient,
  storeUserAuthToken: string | undefined,
  adminUserAuthToken: string | undefined,
  vtexIdCookie: string | undefined,
  logger: Logger
): Promise<number> {
  if (!storeUserAuthToken && !adminUserAuthToken && !vtexIdCookie) {
    return 401
  }

  let validatedUser: ValidatedUser | null = null
  let validatedAdminUser: ValidatedUser | null = null
  let validatedKeyApp: ValidatedUser | null = null

  try {
    validatedUser = await productReviewClient.validateUserToken(
      storeUserAuthToken ?? ''
    )

    validatedAdminUser = await productReviewClient.validateUserToken(
      adminUserAuthToken ?? ''
    )

    validatedKeyApp = await productReviewClient.validateUserToken(
      vtexIdCookie ?? ''
    )
  } catch (err: any) {
    logger.error({ message: 'isValidAuthUser error fetching user', error: err })

    return 400
  }

  const hasPermission =
    validatedUser != null && validatedUser.authStatus === 'Success'

  const hasAdminPermission =
    validatedAdminUser != null && validatedAdminUser.authStatus === 'Success'

  const hasPermissionToken =
    validatedKeyApp != null && validatedKeyApp.authStatus === 'Success'

  if (!hasPermission && !hasAdminPermission && !hasPermissionToken) {
    logger.warn({ message: 'isValidAuthUser: User Does Not Have Permission' })

    return 403
  }

  return 200
}

export async function isAdminAuthUser(
  productReviewClient: ProductReviewClient,
  adminUserAuthToken: string | undefined,
  account: string,
  logger: Logger
): Promise<number> {
  if (!adminUserAuthToken) {
    return 401
  }

  let validatedAdminUser: ValidatedUser | null = null

  try {
    validatedAdminUser = await productReviewClient.validateUserToken(
      adminUserAuthToken
    )
  } catch (err: any) {
    logger.error({
      message: 'isAdminAuthUser error fetching user',
      error: err,
    })

    return 400
  }

  let hasAdminPermission =
    validatedAdminUser != null &&
    validatedAdminUser.authStatus === 'Success' &&
    validatedAdminUser.account === account &&
    validatedAdminUser.audience === 'admin'

  if (!hasAdminPermission) {
    logger.warn({ message: 'isAdminAuthUser: User Does Not Have Permission' })

    return 403
  }

  try {
    hasAdminPermission =
      await productReviewClient.validateLicenseManagerAccess(
        validatedAdminUser!.id
      )
  } catch (err: any) {
    logger.error({
      message: 'isAdminAuthUser error fetching user',
      error: err,
    })

    return 400
  }

  if (!hasAdminPermission) {
    logger.warn({
      message: 'isAdminAuthUser: User Does Not Have Permission (LM)',
    })

    return 403
  }

  return 200
}

// ==================== Schema & Migration ====================

export async function verifySchema(
  productReviewClient: ProductReviewClient
): Promise<string> {
  return productReviewClient.verifySchema()
}

export async function verifyMigration(
  productReviewClient: ProductReviewClient
): Promise<string> {
  return productReviewClient.verifyMigration()
}

export async function successfulMigration(
  productReviewClient: ProductReviewClient
): Promise<string> {
  return productReviewClient.successfulMigration()
}

// ==================== Reviews by Shopper / Date ====================

export async function getReviewsByShopperId(
  productReviewClient: ProductReviewClient,
  shopperId: string
): Promise<ReviewsResponseWrapper> {
  return productReviewClient.getProductReviewsMD(
    `shopperId=${shopperId}`,
    null,
    null
  )
}

export async function getReviewsByreviewDateTime(
  productReviewClient: ProductReviewClient,
  reviewDateTime: string
): Promise<ReviewsResponseWrapper> {
  return productReviewClient.getProductReviewsMD(
    `reviewDateTime=${reviewDateTime}`,
    null,
    null
  )
}

export async function getReviewsByDateRange(
  productReviewClient: ProductReviewClient,
  fromDate: string,
  toDate: string
): Promise<ReviewsResponseWrapper> {
  return productReviewClient.getRangeReviewsMD(fromDate, toDate)
}

// ==================== Add Search Date ====================

export async function addSearchDate(
  productReviewClient: ProductReviewClient
): Promise<void> {
  const recordsToUpdate = await productReviewClient.getProductReviewsMD(
    '_where=searchDate is null',
    null,
    null
  )

  for (const review of recordsToUpdate.reviews) {
    await productReviewClient.saveProductReviewMD(review)
  }
}

// ==================== Legacy Reviews & Migration ====================

export async function getLegacyReviews(
  productReviewClient: ProductReviewClient,
  logger: Logger
): Promise<LegacyReview[]> {
  const reviews: LegacyReview[] = []
  const lookup = await productReviewClient.loadLookupAsync()

  if (!lookup) return reviews

  const productIds = [...new Set(Object.values(lookup))]

  for (const productId of productIds) {
    const returnedReviewList =
      await productReviewClient.getProductReviewsAsync(productId)

    if (returnedReviewList && returnedReviewList.length > 0) {
      reviews.push(...returnedReviewList)
    } else {
      try {
        const missingIds: number[] = []

        for (const [key, value] of Object.entries(lookup)) {
          if (value === null || value === productId) {
            missingIds.push(Number(key))
          }
        }

        if (missingIds.length > 0) {
          logger.warn({
            message: `Removing broken lookup ids for product id ${productId}`,
            missingIds: missingIds.join(','),
          })

          for (const idToRemove of missingIds) {
            delete lookup[idToRemove]
          }

          await productReviewClient.saveLookupAsync(lookup)
        }
      } catch (err: any) {
        logger.error({
          message: `Error removing broken lookup ids for product id ${productId}`,
          error: err,
        })
      }
    }
  }

  return reviews
}

function convertLegacyReview(review: LegacyReview): Review {
  return {
    approved: review.Approved ?? false,
    id: String(review.Id),
    location: review.Location ?? undefined,
    productId: review.ProductId,
    rating: review.Rating,
    reviewDateTime: review.ReviewDateTime ?? undefined,
    reviewerName: review.ReviewerName ?? undefined,
    shopperId: review.ShopperId ?? undefined,
    sku: review.Sku ?? undefined,
    text: review.Text ?? undefined,
    title: review.Title ?? undefined,
    locale: review.Locale ?? undefined,
    verifiedPurchaser: review.VerifiedPurchaser ?? false,
  }
}

export async function migrateData(
  productReviewClient: ProductReviewClient,
  appSettingsClient: AppSettingsClient,
  logger: Logger
): Promise<string> {
  const lines: string[] = []
  const verify = await verifySchema(productReviewClient)

  lines.push(verify)

  try {
    const reviews = await getLegacyReviews(productReviewClient, logger)

    if (reviews && reviews.length > 0) {
      for (const review of reviews) {
        try {
          lines.push(
            `MigrateData ${review.Id} ${review.ProductId} ${review.ShopperId}`
          )

          const newRev = convertLegacyReview(review)
          const result = await newReview(
            productReviewClient,
            appSettingsClient,
            newRev,
            false,
            undefined,
            logger
          )

          if (result) {
            await deleteLegacyReview(
              productReviewClient,
              [review.Id],
              undefined,
              logger
            )
          } else {
            lines.push(`Did not save review ${review.Id}`)
          }
        } catch (err: any) {
          lines.push(`Error saving review ${review.Id} ${err.message}`)
          logger.error({
            message: `MigrateData: Error Saving ${review.Id}`,
            error: err,
          })
        }
      }
    } else {
      lines.push('No reviews.')
    }
  } catch (err: any) {
    logger.error({ message: 'MigrateData error', error: err })
    lines.push(`Error: ${err.message}`)
  }

  return lines.join('\n')
}

export async function migrateDataByProductIds(
  productReviewClient: ProductReviewClient,
  appSettingsClient: AppSettingsClient,
  productIds: string[],
  logger: Logger
): Promise<string> {
  const lines: string[] = []

  await verifySchema(productReviewClient)

  for (const productId of productIds) {
    const reviews = await productReviewClient.getProductReviewsAsync(productId)

    if (reviews && reviews.length > 0) {
      for (const review of reviews) {
        try {
          lines.push(
            `MigrateData ${review.Id} ${review.ProductId} ${review.ShopperId}`
          )

          const newRev = convertLegacyReview(review)
          const result = await newReview(
            productReviewClient,
            appSettingsClient,
            newRev,
            false,
            undefined,
            logger
          )

          if (result) {
            await deleteLegacyReview(
              productReviewClient,
              [review.Id],
              productId,
              logger
            )
          } else {
            lines.push(`Did not save review ${review.Id}`)
          }
        } catch (err: any) {
          logger.error({
            message: 'Error Migrating',
            error: err,
            reviewId: review.Id,
            productId: review.ProductId,
            shopperId: review.ShopperId,
          })

          lines.push(
            `Error Migrating ${review.Id} ${review.ProductId} ${review.ShopperId} : ${err.message}`
          )
        }
      }
    } else {
      lines.push('No reviews.')
    }
  }

  return lines.join('\n')
}

export async function deleteLegacyReview(
  productReviewClient: ProductReviewClient,
  ids: number[],
  productId: string | undefined,
  logger: Logger
): Promise<boolean> {
  let retval = true

  try {
    const lookup = await productReviewClient.loadLookupAsync()

    for (const id of ids) {
      let pid = productId

      if (!pid && lookup) {
        pid = lookup[id]
      }

      if (pid) {
        const reviews = await productReviewClient.getProductReviewsAsync(pid)

        if (reviews) {
          const idx = reviews.findIndex((r) => r.Id === id)

          if (idx !== -1) {
            reviews.splice(idx, 1)
            await productReviewClient.saveProductReviewsAsync(pid, reviews)
          }
        }
      } else {
        retval = false
      }

      if (lookup && id in lookup) {
        delete lookup[id]
      }
    }

    if (lookup) {
      await productReviewClient.saveLookupAsync(lookup)
    }
  } catch (err: any) {
    logger.error({
      message: 'deleteLegacyReview error',
      error: err,
      ids,
      productId,
    })
  }

  return retval
}

export async function clearData(
  productReviewClient: ProductReviewClient,
  logger: Logger
): Promise<void> {
  try {
    const lookup = await productReviewClient.loadLookupAsync()

    if (lookup) {
      const productIds = [...new Set(Object.values(lookup))]

      for (const productId of productIds) {
        await productReviewClient.saveProductReviewsAsync(productId, null)
      }
    }

    await productReviewClient.saveLookupAsync(null)
  } catch (err: any) {
    logger.error({ message: 'clearData error', error: err })
  }
}

export async function validateUserToken(
  productReviewClient: ProductReviewClient,
  token: string
): Promise<ValidatedUser | null> {
  return productReviewClient.validateUserToken(token)
}

// ==================== Sort Query Building ====================

const REVIEW_FIELDS = [
  'id',
  'productId',
  'rating',
  'title',
  'text',
  'reviewerName',
  'shopperId',
  'reviewDateTime',
  'searchDate',
  'verifiedPurchaser',
  'sku',
  'approved',
  'location',
  'locale',
  'pastReviews',
]

function getSortQuery(orderBy: string | null): string {
  if (!orderBy) return ''

  const parts = orderBy.split(DELIMITER)
  const fieldName = parts[0]

  // Check if field is valid (case-insensitive comparison against Review fields)
  const matchedField = REVIEW_FIELDS.find(
    (f) => f.toLowerCase() === fieldName.toLowerCase()
  )

  if (!matchedField) return ''

  let descendingOrder = true

  if (parts.length > 1 && parts[1].toLowerCase().includes('asc')) {
    descendingOrder = false
  }

  // Workaround: Sometimes master data returns in wrong order when sorting by reviewDateTime
  let sortField = matchedField

  if (sortField === 'reviewDateTime') {
    sortField = 'createdIn'
  }

  const direction = descendingOrder ? 'DESC' : 'ASC'

  return `&_sort=${sortField} ${direction}`
}
