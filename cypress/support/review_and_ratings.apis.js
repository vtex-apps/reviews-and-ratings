import { VTEX_AUTH_HEADER } from './common/constants'
import { ratingsAPI } from './product.apis'

export function getProductRatingsAPI(productId) {
  it('Get rating for product', () => {
    cy.getVtexItems().then(vtex => {
      cy.log(vtex)
      cy.getAPI(ratingsAPI(vtex.baseUrl, `rating/${productId}`), {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }).then(res => {
        expect(res.status).to.equal(200)
        expect(res.body).to.have.property('average')
        expect(res.body).to.have.property('totalCount')
      })
    })
  })
}

export function addReviewAPI(productId, user) {
  it('Add review and rating for product', () => {
    cy.getVtexItems().then(vtex => {
      cy.request({
        method: 'POST',
        url: ratingsAPI(vtex.baseUrl, 'review'),
        headers: {
          VtexIdclientAutCookie: vtex.adminAuthCookieValue,
        },
        body: {
          ProductId: productId,
          Rating: user.rating,
          Title: '',
          Text: user.review,
        },
      }).then(response => {
        expect(response.status).to.equal(200)
        expect(response.body).to.not.equal('Duplicate Review')
        cy.setReviewItem(`ReviewID-${productId}`, response.body)
      })
    })
  })
}

export function retriveReviewAPI(productId) {
  it('Retrive review for product', () => {
    cy.getVtexItems().then(vtex => {
      cy.getReviewItems().then(review => {
        cy.log(vtex)
        cy.getAPI(
          ratingsAPI(vtex.baseUrl, `review/${review[`ReviewID-${productId}`]}`),
          {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          }
        ).then(response => {
          expect(response.status).to.equal(200)
          expect(response.body).to.not.equal(null)
          expect(response.body.productId).to.equal(productId.toString())
        })
      })
    })
  })
}
