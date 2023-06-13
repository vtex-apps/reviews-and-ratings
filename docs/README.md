📢 Use this project, [contribute](https://github.com/vtex-apps/reviews-and-ratings) to it or open issues to help evolve it using [Store Discussion](https://github.com/vtex-apps/store-discussion).

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->

[![All Contributors](https://img.shields.io/badge/all_contributors-2-orange.svg?style=flat-square)](#contributors-)

<!-- ALL-CONTRIBUTORS-BADGE:END -->

# Reviews and Ratings

**Reviews & Ratings** allows customers to submit reviews and ratings for products and see them while navigating the store.

![reviews-and-ratings-app](https://cdn.jsdelivr.net/gh/vtexdocs/dev-portal-content@main/images/vtex-reviews-and-ratings-0.png)

## Configuration

### Step 1 - Installing the Reviews and Ratings app

Using your terminal, log in to the desired VTEX account and run the following command:

`vtex install vtex.reviews-and-ratings@3.x`

### Step 2 - Defining the app settings

1. Access the Admin, go to `Apps > My Apps` and then click the `Reviews and Ratings` card:


![apps-reviews-and-ratings](https://cdn.jsdelivr.net/gh/vtexdocs/dev-portal-content@main/images/vtex-reviews-and-ratings-2.png)

2. On the app settings page, define the following settings based on the desired scenario:

![reviews-settings](https://cdn.jsdelivr.net/gh/vtexdocs/dev-portal-content@main/images/vtex-reviews-and-ratings-3.jpg)

- **Allow Anonymous Reviews** - If unchecked, only logged-in customers will be able to review products.

- **Require Admin Approval** - Checking this box activates the review moderation system. Newly submitted reviews will not be displayed on the store until an admin approves them in the Admin account. For more information, see the [App behavior](#app-behavior) section below.

- **Ask For Reviewer Location** - Checking this box activates an optional review field. Customers that submit reviews will be asked to enter their current location (e.g., "Boston, MA").

- **Default all review accordions to open** - The app displays reviews on the product page inside collapsible accordions. Checking this box will cause _all_ review accordions to default to open when the page is loaded, with review text limited to three lines. Reviews with more than three lines of text will be truncated with an ellipsis and a `Show more` link that can be used to display the whole review text.

- **Number of open review accordions** - Checking this box allows you to set a specific number of review accordions (instead of all of them) to automatically open when the page is loaded, displaying all the review text. If the `Default all review accordions to open` setting is active, this option is ignored.

- **Display graph** - Checking this box allows you to display the reviews graph on the product details page.

- **Display stars in `product-rating-summary` if there are no reviews** - Checking this box allows you to display empty stars even if the product has no reviews yet.

- **Display total reviews number on `product-rating-summary` block** - Checking this box allows you to display the total number of reviews for a product.

- **Display `Add review` button on `product-rating-summary` block** - Checking this box allows you to display an `Add review` button under the stars.

- **Display stars in `product-rating-summary` if there are no reviews** - Checking this box allows you to display empty stars even if the product has no reviews yet.

- **Display total reviews number on `product-rating-summary` block** - Checking this box allows you to display the total number of reviews for a product.

- **Display `Add review` button on `product-rating-summary` block** - Checking this box allows you to display an `Add review` button under the stars.

### Step 3 - Declaring the app blocks in your store theme

Once the app is configured, it is time to place the following blocks in your Store Theme app:

- `product-reviews` - This block can be added to the product page template (`store.product`). It renders a paginated list of reviews for the product being viewed and a form for the customer to add a new review.

- `product-rating-summary` - This block can be added to the product page template (`store.product`) and renders the average rating for the product being viewed as well as the number of reviews that have been submitted. Only approved reviews will count toward these figures if the account uses moderation.

- `product-rating-inline`: Similar to the previous block (`product-rating-summary`), but intended to be used in [product shelves](https://developers.vtex.com/docs/guides/vtex-shelf/). This block only displays the product average rating.

## App behavior

As described above, the app may be configured to use a **review moderation interface** where an admin is responsible for approving the reviews before they are displayed on the store.

To access and use the review moderation admin interface, follow the instructions below:

1. Enable the **Require Admin Approval** setting as described above.
2. Open the Admin and navigate to **Catalog > Reviews**.
3. You may view either **Pending** or **Approved** reviews using the tabs at the top of the page.
> You can export reviews to XLS files from the **Download** tab. The export is limited to 800 reviews at a time. Please use the date pickers to choose the time range of reviews you want to export.

> ⚠️ If you have updated to version 3.x after using a prior version of **Reviews and Ratings**, you may see the **Migrate Data** button instead of a list of reviews in the **Catalog > Reviews** page. Clicking this button will migrate all existing review data from the previous storage solution (VBASE) to the new solution (Masterdata V2). Once the migration is finished, the page will automatically refresh, and the list of reviews will become available.

Individual pending reviews may be approved or deleted using the kebab menu (3 dots button) in the right column or by selecting the checkbox on the left. Multiple reviews can also be selected using the checkboxes to approve or delete in bulk.

Approved reviews may be deleted as well, either individually or in bulk.

## Customization

To apply CSS customizations in this and other blocks, follow the instructions given in the recipe on [Using CSS handles for store customization](https://developers.vtex.com/docs/guides/vtex-io-documentation-using-css-handles-for-store-customization).

| CSS handles               |
| ------------------------- |
| `container`               |
| `formContainer`           |
| `formSection`             |
| `formBottomLine`          |
| `formRating`              |
| `formName`                |
| `formLocation`            |
| `formEmail`               |
| `formReview`              |
| `formSubmit`              |
| `formInvalidMessage`      |
| `graphBar`                |
| `graphBarContainer`       |
| `graphBarPercent`         |
| `graphContent`            |
| `graphContainer`          |
| `graphText`               |
| `graphTextLabel`          |
| `loginLink`               |
| `reviewComment`           |
| `reviewMessage`           |
| `reviewCommentRating`     |
| `reviewCommentsContainer` |
| `reviewCommentUser`       |
| `reviewsHeading`          |
| `reviewsRating`           |
| `reviewsRatingAverage`    |
| `reviewsRatingCount`      |
| `reviewsOrderBy`          |
| `reviewsPaging`           |
| `reviewInfo`              |
| `reviewVerifiedPurchase`  |
| `reviewDate`              |
| `reviewDateSubmitted`     |
| `reviewDateValue`         |
| `reviewAuthor`            |
| `reviewAuthorBy`          |
| `reviewAuthorName`        |
| `star--empty`             |
| `star--filled`            |
| `star`                    |
| `starpicker`              |
| `stars`                   |
| `starsContainer`          |
| `summaryContainer`        |
| `summaryButtonContainer`  |
| `writeReviewContainer`    |
| `graphContent`            |
| `graphContainer`          |
| `graphText`               |
| `graphTextLabel`          |
| `graphBarContainer`       |
| `graphBar`                |
| `graphBarPercent`         |
| `summaryButtonContainer`  |
| `summaryTotalReviews`     |
| `writeReviewContainer`    |
| `writeReviewButton`       |

## Rest APIs

To see how to use the list of REST APIs, read [Reviews and Ratings API overview](https://developers.vtex.com/docs/api-reference/reviews-and-ratings-api#overview).

## GraphQL IDE

To see how to use the graphQL queries and mutations, follow these steps:

1. Open the Admin [GraphQL IDE app](https://developers.vtex.com/docs/guides/vtex-admin-graphql-ide).
2. Select  the`vtex.reviews-and-ratings` app.
3. Click `docs` in the top right corner. 
     ![reviews-and-ratings-app](https://raw.githubusercontent.com/vtexdocs/dev-portal-content/main/public/metadata/images/screenshots/graphQL_docs.png)

You will see the list of all available queries and mutations, including schemas and variable descriptions.

<!-- DOCS-IGNORE:start -->

## Contributors ✨

Thanks goes to these wonderful people:

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/khrizzcristian"><img src="https://avatars1.githubusercontent.com/u/43498488?v=4" width="100px;" alt=""/><br /><sub><b>khrizzcristian</b></sub></a><br /><a href="https://github.com/vtex-apps/reviews-and-ratings/commits?author=khrizzcristian" title="Code">💻</a></td>
    <td align="center"><a href="https://juliomoreira.pro"><img src="https://avatars2.githubusercontent.com/u/1207017?v=4" width="100px;" alt=""/><br /><sub><b>Julio Moreira</b></sub></a><br /><a href="https://github.com/vtex-apps/reviews-and-ratings/commits?author=juliomoreira" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/btalma"><img src="https://avatars.githubusercontent.com/u/47258865?v=4" width="100px;" alt=""/><br /><sub><b>Brian Talma</b></sub></a><br /><a href="https://github.com/vtex-apps/reviews-and-ratings/commits?author=btalma" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/arturo777"><img src="https://avatars.githubusercontent.com/u/49737670?v=4" width="100px;" alt=""/><br /><sub><b>Arturo Castillo</b></sub></a><br /><a href="https://github.com/vtex-apps/reviews-and-ratings/commits?author=arturo777" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

<!-- DOCS-IGNORE:end -->
