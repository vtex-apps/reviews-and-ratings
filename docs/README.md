📢 Use this project, [contribute](https://github.com/vtex-apps/breadcrumb) to it or open issues to help evolve it using [Store Discussion](https://github.com/vtex-apps/store-discussion).
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-0-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

# Reviews and Ratings

The Reviews and Ratings app is a VTEX native solution for product review and rating.

![reviews-and-ratings-app](https://user-images.githubusercontent.com/52087100/71026526-31e7d580-20e8-11ea-93d8-094c1e8af7cd.png)

## Configuration

1. [Install](https://vtex.io/docs/recipes/store/installing-an-app) the `reviews-and-ratings` app in the desired account;
2. In the admin's account, access **Apps** and then select the **Reviews and Ratings** box;

![apps-reviews-and-ratings](https://user-images.githubusercontent.com/52087100/71026670-77a49e00-20e8-11ea-9e01-0cb4dec12a56.png)

3. Once in the app's page, define the apps configurations in the **setup** section:

![setup-reviews-and-ratings](https://user-images.githubusercontent.com/52087100/71026561-4330e200-20e8-11ea-9f44-167cf0e77fc6.png)

- **Allow Anonymous Reviews**: if unchecked, only logged-in shoppers will be able to review products.

- **Require Admin Approval**: Checking this box activates the review moderation system. Newly submitted reviews will not be displayed on the store website until an administrator approves them in the account's admin.

- **Ask For Reviewer's Location**: Checking this box activates an optional review field. Shoppers that submit reviews will be asked to fill in their current location (i.e. "Boston, MA").

- **Default all review accordions to open**: Checking this box will cause all review accordions on the product page to default to open with review text limited to 3 lines. Reviews with more than 3 lines of text will be truncated with and ellipsis and a "Show More" link that can be used to display the whole review text.

:warning: This app fills the standard VTEX review blocks with content using abstract interfaces from `vtex.product-review-interfaces` . The **VTEX review blocks** are:

- `"product-reviews"`: This block can be added to the product page (`store.product`). It renders a paginated list of reviews for the product being viewed, as well as a form for the shopper to add a new review.

- `"product-rating-summary"`: This block can be added to the product page (`store.product`) and renders the average rating for the product being viewed as well as the number of reviews that have been submitted. If moderation is being used by the account, only approved reviews will count toward these figures.

- `"product-rating-inline"`: Similar to the previous block, but intended to be used in product shelves. The block displays the product's average rating only.

## Modus Operandi

As said previously, the app may be configured to use a **review moderation interface** where an administrator is responsible for approving the reviews before they are displayed on the store website.

To access and use the review moderation admin interface, follow the instruction below:

1. In the account's admin, navigate to **Catalog** using the admin's sidebar;
2. Access the **Reviews** section;
3. You may view either **Pending** or **Approved** reviews using the tabs at the top of the page.

Individual pending reviews may be either approved or deleted using the Kebab Menu (3 dots button) in the right column or selecting the checkbox in the left. Multiple reviews can also be selected using the checkboxes, being approved or deleted in bulk.

Approved reviews may be deleted as well, either individually or in bulk.

## Customization

In order to apply CSS customizations in this and other blocks, follow the instructions given in the recipe on [Using CSS Handles for store customization](https://vtex.io/docs/recipes/style/using-css-handles-for-store-customization).

| CSS Handles            |
| ---------------------- |
| `stars`                |
| `starpicker`           |
| `star`                 |
| `star--filled`         |
| `star--empty`          |
| `container`            |
| `formContainer`        |
| `writeReviewContainer` |
| `summaryContainer`     |


**Upcoming documentation:**

 - [Add es locale translation](https://github.com/vtex-apps/reviews-and-ratings/pull/15)
## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
