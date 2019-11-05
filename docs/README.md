# Reviews and Ratings

## Description

This app provides a VTEX native solution for product reviews and ratings, including an admin interface for review moderation.

## Usage

### Setup

After installing this app in your account, navigate to the app's settings in your admin dashboard under **Apps** > **Reviews and Ratings**.
_Allow Anonymous Reviews_: If unchecked, only logged-in shoppers will be able to review products.
_Require Admin Approval_: Checking this box activates the review moderation system. Newly submitted reviews will not be displayed on the store website until an administrator approves them.
_Ask For User's Location_: Checking this box activates an optional review field. Shoppers that submit reviews will be asked to fill in their current location (i.e. "Boston, MA").

### Moderation

To access the review moderation admin interface in your admin dashboard, navigate to **Catalog** > **Reviews**.

You may view either **Pending** or **Approved** reviews using the tabs at the top of the interface.

Individual pending reviews may be either approved or deleted. Multiple reviews can also be selected using the checkboxes in the left column, and either approved or deleted in bulk.

Approved reviews may be deleted, either individually or in bulk.

### Store Theme: Blocks

This app uses the abstract interfaces from `vtex.product-review-interfaces` to fill the standard VTEX review blocks with content. Those blocks are:

`"product-reviews"`: This block can be added to the product page (`store.product`) and renders a paginated list of reviews for the product being viewed, as well as a form for the shopper to add a new review.

`"product-rating-summary"`: This block can be added to the product page (`store.product`) and renders the average rating for the product being viewed as well as the number of reviews that have been submitted. If moderation is being used, only approved reviews will count toward these figures.

`"product-rating-inline"`: Similar to the previous block, but intended to be used in product shelves. Displays the product's average rating only.

### Store Theme: Styles API

This app provides some CSS classes as an API for style customization.

To use this CSS API, you must add the `styles` builder to your `store-theme` and create an app styling CSS file.

1. Add the `styles` builder to your `manifest.json`:

```json
  "builders": {
    "styles": "1.x"
  }
```

2. Create a file called `vtex.reviews-and-ratings.css` inside the `styles/css` folder. Add your custom styles:

```css
.star {
  margin-top: 10px;
}
```

You can see what CSS namespaces are available, and any default styles, by viewing [styles.css](/react/styles.css)

## To Do

A feature planned for future implementation is a way to verify purchases such that if a shopper has purchased an item and then leaves a review, the review will be displayed with a "Verified Purchaser" badge next to it.

## Troubleshooting

You can check if others are passing through similar issues [here](https://github.com/vtex/ReviewsRatings/issues). Also feel free to [open issues](https://github.com/vtex/ReviewsRatings/issues/new) or contribute with pull requests.

## Contributing

Check it out [how to contribute](https://github.com/vtex-apps/awesome-io#contributing) with this project.
