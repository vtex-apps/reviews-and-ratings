// Files to save state
// MUST exist on the plase EMPTY
const reviewsJson = '.reviews.json'

// Save orders
Cypress.Commands.add('setReviewItem', (reviewItem, reviewValue) => {
  cy.readFile(reviewsJson).then(items => {
    items[reviewItem] = reviewValue
    cy.writeFile(reviewsJson, items)
  })
})

// Get orders
Cypress.Commands.add('getReviewItems', () => {
  cy.readFile(reviewsJson).then(items => {
    return items
  })
})
