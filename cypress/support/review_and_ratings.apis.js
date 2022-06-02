import { updateRetry } from './common/support.js'
import { VTEX_AUTH_HEADER, FAIL_ON_STATUS_CODE } from './common/constants'
import {
  ratingsAPI,
  deleteReviewAPI,
  deleteReviewAPIs,
  editReviewAPI,
} from './product.apis'

export function getProductRatingsAPI(productId) {
  it('Get rating for product', updateRetry(2), () => {
    cy.getVtexItems().then(vtex => {
      cy.getAPI(ratingsAPI(vtex.baseUrl, `rating/${productId}`)).then(res => {
        expect(res.status).to.equal(200)
        expect(res.body).to.have.property('average')
        expect(res.body).to.have.property('totalCount')
      })
    })
  })
}

export function addReviewAPI(
  product,
  { name, rating, review },
  duplicate = false
) {
  it(`Add review ${name}`, updateRetry(3), () => {
    cy.addDelayBetweenRetries(2000)
    cy.getVtexItems().then(vtex => {
      cy.request({
        method: 'POST',
        url: ratingsAPI(vtex.baseUrl, 'review'),
        headers: {
          VtexIdclientAutCookie: vtex.userAuthCookieValue,
        },
        body: {
          ProductId: product,
          Rating: rating,
          Title: name,
          Text: review,
          ReviewerName: "Syed",
          Approved: true
        },
        ...FAIL_ON_STATUS_CODE,
      }).then(response => {
        expect(response.status).to.equal(200)
        if (!duplicate) {
          expect(response.body).to.not.equal('Duplicate Review')
          expect(response.body).to.contain('-')
          cy.setReviewItem(name, response.body)
        } else {
          expect(response.body).to.equal('Duplicate Review')
        }
      })
    })
  })
}

export function invalidPayloadInAddReview(
  {payload,message},
  multiple=false
) {
  it(`Add review${multiple ? 's':''} API should return response ${message}`, updateRetry(3), () => {
    const { ProductId,Title, Rating, Text,ReviewerName,Approved}=payload
    const endpoint = multiple? 'reviews': 'review'
    const body = multiple ? payload : {
      ProductId,
      Rating,
      Title,
      Text,
      ReviewerName,
      Approved,
    }

    cy.getVtexItems().then(vtex => {

    const headers = multiple ?  {
      ...VTEX_AUTH_HEADER(vtex.apiKey, vtex.apiToken),
    } :{
      VtexIdclientAutCookie: vtex.userAuthCookieValue,
    }

    cy.addDelayBetweenRetries(2000)
      cy.request({
        method: 'POST',
        url: ratingsAPI(vtex.baseUrl, endpoint),
        headers,
        body,
        ...FAIL_ON_STATUS_CODE,
      }).then(response => {
        expect(response.status).to.equal(400)
        expect(response.body).to.contain(message)
      })
    })
  })
}

export function addReviewsAPI(reviews, env) {
  it(`Adding multuple reviews`, updateRetry(3), () => {
    cy.addDelayBetweenRetries(2000)
    cy.getVtexItems().then(vtex => {
      cy.request({
        method: 'POST',
        url: ratingsAPI(vtex.baseUrl, 'reviews'),
        headers: {
          ...VTEX_AUTH_HEADER(vtex.apiKey, vtex.apiToken),
        },
        body: reviews,
        ...FAIL_ON_STATUS_CODE,
      }).then(response => {
        expect(response.status).to.equal(200)
        // eslint-disable-next-line array-callback-return
        response.body.map((review, i) => {
          cy.setReviewItem(env + i, review)
        })
      })
    })
  })
}

export function retrieveReviewAPI(product, { name }) {
  it(`Retrieve review ${name}`, updateRetry(5), () => {
    cy.getVtexItems().then(vtex => {
      cy.getReviewItems().then(review => {
        cy.getAPI(ratingsAPI(vtex.baseUrl, `review/${review[name]}`)).then(
          response => {
            expect(response.status).to.equal(200)
            expect(response.body).to.not.equal(null)
            expect(response.body.productId).to.equal(product.toString())
            cy.setReviewItem(`${name}-review`, response.body)
          }
        )
      })
    })
  })
}

export function retrieveReviewsListAPI(productId) {
  it(
    `Retrieve list of reviews for product ${productId} `,
    updateRetry(4),
    () => {
      cy.getVtexItems().then(vtex => {
        cy.getAPI(
          ratingsAPI(vtex.baseUrl, `reviews?product_id=${productId}`)
        ).then(response => {
          expect(response.status).to.equal(200)
          expect(response.body).to.not.equal(null)
        })
      })
    }
  )
}

export function deleteReview({ name }) {
  it(`Delete review for this ${name}`, updateRetry(5), () => {
    cy.getVtexItems().then(vtex => {
      cy.getReviewItems().then(review => {
        cy.request({
          method: 'DELETE',
          url: deleteReviewAPI(vtex.baseUrl, `${review[name]}`),
          headers: {
            VtexIdclientAutCookie: vtex.userAuthCookieValue,
          },
          ...FAIL_ON_STATUS_CODE,
        }).then(response => {
          expect(response.status).to.equal(200)
          expect(response.body).to.be.true
        })
      })
    })
  })
}

export function deleteReviews(user1, user2, env) {
  it('Delete multiple reviews', updateRetry(5), () => {
    const { patchReviewEnv, addReviewsEnv } = env

    cy.getVtexItems().then(vtex => {
      cy.getReviewItems().then(review => {
        const reviewIds = [
          review[user1.name],
          review[user2.name],
          review[patchReviewEnv],
          review[addReviewsEnv + 0],
          review[addReviewsEnv + 1],
        ]

        cy.request({
          method: 'DELETE',
          url: deleteReviewAPIs(vtex.baseUrl),
          headers: {
            ...VTEX_AUTH_HEADER(vtex.apiKey, vtex.apiToken),
          },
          body: JSON.stringify(reviewIds),
          ...FAIL_ON_STATUS_CODE,
        }).then(response => {
          expect(response.status).to.equal(200)
          expect(response.body).to.be.true
        })
      })
    })
  })
}

export function editReview({ name }, env) {
  it(`Approve a review ${name}`, updateRetry(2), () => {
    cy.getVtexItems().then(vtex => {
      cy.getReviewItems().then(review => {
        const body = review[`${name}-review`]

        body.approved = true

        cy.request({
          method: 'PATCH',
          url: editReviewAPI(vtex.baseUrl),
          headers: {
            ...VTEX_AUTH_HEADER(vtex.apiKey, vtex.apiToken),
          },
          body,
          ...FAIL_ON_STATUS_CODE,
        }).then(response => {
          expect(response.status).to.equal(200)
          cy.setReviewItem(env, response.body.id)
        })
      })
    })
  })
}
