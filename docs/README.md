📢 Use this project, [contribute](https://github.com/vtex-apps/reviews-and-ratings) to it or open issues to help evolve it using [Store Discussion](https://github.com/vtex-apps/store-discussion).

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->

[![All Contributors](https://img.shields.io/badge/all_contributors-2-orange.svg?style=flat-square)](#contributors-)

<!-- ALL-CONTRIBUTORS-BADGE:END -->

# Reviews and Ratings

Reviews & Ratings is a VTEX IO native solution that allows shoppers to submit reviews and ratings for products, as well as see them while navigating the store..

![reviews-and-ratings-app](https://user-images.githubusercontent.com/52087100/71026526-31e7d580-20e8-11ea-93d8-094c1e8af7cd.png)

## Configuration

### Step 1 - Installing the Reviews and Ratings app

Using your terminal, log in to the desired VTEX account and run the following command:

`vtex install vtex.reviews-and-ratings@3.x`

### Step 2 - Defining the app settings

1. In the account's admin dashboard, access `Apps > My Apps` and then click on the box for `Reviews and Ratings`:

![apps-reviews-and-ratings](https://user-images.githubusercontent.com/52087100/71026670-77a49e00-20e8-11ea-9e01-0cb4dec12a56.png)
_When using the admin v3_

![apps-reviews-and-ratings](https://user-images.githubusercontent.com/26655596/99747634-b772c300-2ab9-11eb-927b-cd03e89421af.png)
_When using the admin v4_

2. Once in the app's settings page, define the following settings according to the desired scenario:

![reviews-settings](https://user-images.githubusercontent.com/43498488/97418081-0e4d0880-1911-11eb-9b80-47b92bbdef93.jpg)

- **Allow Anonymous Reviews** - If unchecked, only logged-in shoppers will be able to review products.

- **Require Admin Approval** - Checking this box activates the review moderation system. Newly submitted reviews will not be displayed on the store website until an administrator approves them in the account's admin. For more details on this, access the Modus Operandi section below.

- **Ask For Reviewer's Location** - Checking this box activates an optional review field. Shoppers that submit reviews will be asked to fill in their current location (i.e. "Boston, MA").

- **Default all review accordions to open** - The app displays reviews on the product page inside collapsible accordions. Checking this box will cause _all_ review accordions to default to open when the page is loaded, with review text limited to 3 lines. Reviews with more than 3 lines of text will be truncated with an ellipsis and a `Show More` link that can be used to display the whole review text.

- **Number of open review accordions** - Checking this box allows you to set a specific number of review accordions (instead of all of them) to automatically open when the page is loaded, displaying all the review text. If the `Default all review accordions to open` setting is active, this option is ignored.

- **Display graph** - Checking this box allows you to display the reviews graph on the product details page.

- **Display stars in `product-rating-summary` if there are no reviews** - Checking this box allows you to display empty stars even if the product still has no reviews.

- **Display total reviews number on `product-rating-summary` block** - Checking this box allows you to display the total number of reviews for a product.

- **Display `Add review` button on `product-rating-summary` block** - Checking this box allows you to display an `Add review` button under the stars.

- **Display stars in `product-rating-summary` if there are no reviews** - Checking this box allows you to display empty stars even if the product still has no reviews.

- **Display total reviews number on `product-rating-summary` block** - Checking this box allows you to display the total number of reviews for a product.

- **Display `Add review` button on `product-rating-summary` block** - Checking this box allows you to display an `Add review` button under the stars.

### Step 3 - Declaring the app's blocks in your store theme

Once the app is configured, it is time to place the following blocks in your Store Theme app:

- `product-reviews` - This block can be added to the product page template (`store.product`). It renders a paginated list of reviews for the product being viewed, as well as a form for the shopper to add a new review.

- `product-rating-summary` - This block can be added to the product page template (`store.product`) and renders the average rating for the product being viewed as well as the number of reviews that have been submitted. If moderation is being used by the account, only approved reviews will count toward these figures.

- `product-rating-inline`: Similar to the previous block (`product-rating-summary`), but intended to be used in [product shelves](https://vtex.io/docs/components/all/vtex.shelf/). The block displays the product's average rating only.

## Modus Operandi

As described above, the app may be configured to use a **review moderation interface** where an administrator is responsible for approving the reviews before they are displayed on the store website.

To access and use the review moderation admin interface, follow the instructions below:

1. Enable the **Require Admin Approval** setting as described above.
2. In the admin dashboard, navigate to **Catalog > Reviews** using the admin's sidebar.
3. You may view either **Pending** or **Approved** reviews using the tabs at the top of the page.
> ⚠️ Warning
>
> You can export reviews to XLS files from the **Download** tab, and it is limited to exporting 800 reviews at a time. Please use the date pickers to select the time range of reviews you want to export.

> ⚠️ Warning
>
> If you have updated to version 3.x after using a prior version of **Reviews and Ratings**, you may see the **Migrate Data** button instead of a list of reviews in the **Catalog > Reviews** page. Clicking this button will migrate all existing review data from the previous storage solution (VBASE) to the new solution (Masterdata V2). Once the migration is finished, the page will automatically refresh, and the list of reviews will become available for you.

Individual pending reviews may be either approved or deleted using the Kebab Menu (3 dots button) in the right column or selecting the checkbox in the left. Multiple reviews can also be selected using the checkboxes, being approved or deleted in bulk.

Approved reviews may be deleted as well, either individually or in bulk.

## Customization

In order to apply CSS customizations in this and other blocks, follow the instructions given in the recipe on [Using CSS Handles for store customization](https://vtex.io/docs/recipes/style/using-css-handles-for-store-customization).

| CSS Handles               |
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
| `reviewCommentMessage`    |
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

# API

## Get Product Rating


![Generic badge](https://img.shields.io/badge/GET-green.svg) `https://{{accountName}}.{{enviroment}}/reviews-and-ratings/api/rating/{{productId}}`

### cURL

```shell
curl --location --request GET 'https://{{accountName}}.{{enviroment}}/reviews-and-ratings/api/rating/{{productId}}' \
--header 'VtexIdclientAutCookie: {{VtexIdclientAutCookie}}'
```

### Headers

| Key                   | Value                             |
| --------------------- | --------------------------------- |
| Accept                | `application/json`                |
| Content-Type          | `application/json; charset=utf-8` |
| VtexIdclientAutCookie | `eyJhbGciOi...`                   |

### URL Params

| Name | Type | Description | Required |
| --| ---| ---| ---|
|productId|string|Product Id|Yes|

### Response Body Example
```
{
    "average": 3.86,
    "totalCount": 7
}
```

## Save Review

![Generic badge](https://img.shields.io/badge/POST-blue.svg) `https://{{accountName}}.{{enviroment}}/reviews-and-ratings/api/review/`

### cURL

```
curl --location --request POST 'https://arturoreviews--sandboxusdev.myvtex.com/reviews-and-ratings/api/review/' \
--header 'VtexIdclientAutCookie: {{VtexIdclientAutCookie}}' \
--header 'Content-Type: application/json' \
--data-raw '{
  "productId": "65444",
  "rating": 5,
  "title": "Good Product",
  "text": "It's the best product that I have seen",
  "reviewerName": "Arturo"
}'
```

### Headers

| Key                   | Value                             |
| --------------------- | --------------------------------- |
| Accept                | `application/json`                |
| Content-Type          | `application/json; charset=utf-8` |
| VtexIdclientAutCookie | `eyJhbGciOi...`                   |

### Request Body

| Name         | Type   | Description   | Required |
| ------------ | ---    | ------------- | -------- |
| productId    | string | Product Id    | Yes      |
| rating       | number | 0 to 5        | No       |
| id           | string | Review Id     | No       |
| title        | string | Review Title  | No       |
| text         | string | Review Text   | No       |
| reviewerName | string | Reviewer Name | No       |

### Response Body Example
```
"b49a0730-c0be-11ec-835d-1230835b93c1"
```

## Save Multiple Reviews

![Generic badge](https://img.shields.io/badge/POST-blue.svg) `https://{{accountName}}.{{enviroment}}/reviews-and-ratings/api/reviews/`

### cURL

```
curl --location --request POST 'https://{{accountName}}.{{enviroment}}/reviews-and-ratings/api/reviews/' \
--header 'X-VTEX-API-AppKey: X-VTEX-API-AppKey' \
--header 'X-VTEX-API-AppToken: X-VTEX-API-AppToken' \
--header 'Content-Type: application/json' \
--data-raw '[
    {
        "productId": "1",
        "rating": 4,
        "title": "test multiple reviews",
        "text": "test multiple reviews",
        "reviewerName": "Arturo",
        "approved": false,
        "verifiedPurchaser": false
    },
    {
        "productId": "2",
        "rating": 4,
        "title": "test review 2 multiple reviews",
        "text": "test review 2 multiple reviews",
        "reviewerName": "Arturo",
        "approved": false,
        "verifiedPurchaser": false
    }
]'
```

### Headers

| Key                 | Value                             |
| ------------------- | --------------------------------- |
| Accept              | `application/json`                |
| Content-Type        | `application/json; charset=utf-8` |
| X-VTEX-API-AppKey   | `X-VTEX-API-AppKey`               |
| X-VTEX-API-AppToken | `X-VTEX-API-AppToken`             |

### Request Body

| Name              | Type    | Description           | Required |
| ----------------- | ------- | -----------           | -------- |
| productId         | string  | Product Id            | Yes      |
| verifiedPurchaser | boolean | Verified Purchaser    | Yes      |
| rating            | number  | 0 to 5                | No       |
| id                | string  | Review Id             | No       |
| title             | string  | Review Title          | No       |
| text              | string  | Review Text           | No       |
| reviewerName      | string  | Reviewer Name         | No       |
| approved          | boolean | Approved by the admin | No       |

### Response Body Example
```
[
    "8e1a5e11-c0c9-11ec-835d-0a591b8a3ec1",
    "9257c203-c0c9-11ec-835d-0e02dd207951"
]
```

## Get Review by Review Id

![Generic badge](https://img.shields.io/badge/GET-green.svg) `https://{{accountName}}.{{enviroment}}/reviews-and-ratings/api/review/{{reviewId}}`

### cURL

```
curl --location --request GET 'https://{{accountName}}.{{enviroment}}/reviews-and-ratings/api/review/{{reviewId}}'
```

### Headers

| Key          | Value                             |
| ------------ | --------------------------------- |
| Accept       | `application/json`                |
| Content-Type | `application/json; charset=utf-8` |

### URL Params

| Name     | Type   | Description | Required |
| -------- | ------ | ----------- | -------- |
| reviewId | string | Review Id   | Yes      |

### Response Body Example
```
{
    "id": "5323fdaa-c012-11ec-835d-0ebee58edbb3",
    "productId": "1",
    "rating": 5,
    "title": "Test title...",
    "text": "This is a test in a test environment, but Not Slithering...",
    "reviewerName": "Arturo",
    "shopperId": "",
    "reviewDateTime": "04/19/2022 18:55:58",
    "searchDate": "2022-04-19T18:55:58Z",
    "verifiedPurchaser": false,
    "sku": null,
    "approved": false,
    "location": null,
    "locale": "en-US",
    "pastReviews": null
}
```

## Get a list of Reviews

![Generic badge](https://img.shields.io/badge/GET-green.svg) `https://{{accountName}}.{{enviroment}}/reviews-and-ratings/api/reviews?search_term={{search_term}}&from={{from}}&to={{to}}&order_by={{order_by}}&status={{status}}&product_id={{product_id}}`

### cURL

```
curl --location --request GET 'https://{{accountName}}.{{enviroment}}/reviews-and-ratings/api/reviews?search_term={{search_term}}&from={{from}}&to={{to}}&order_by={{order_by}}&status={{status}}&product_id={{product_id}}'
```

### Headers

| Key          | Value                             |
| ------------ | --------------------------------- |
| Accept       | `application/json`                |
| Content-Type | `application/json; charset=utf-8` |

### URL Params

| Name        | Type   | Description                                                                                        | Required |
| ----------- | ------ | -------------------------------------------------------------------------------------------------- | -------- |
| search_term | string | Returns Reviews that contain the search term in `productId`, `sku`, `shopperId`, or `reviewerName` | No       |
| from        | string | Zero base starting record number, `0` is the default value                                         | No       |
| to          | string | Zero base ending record number, `3` is the default value                                           | No       |
| order_by    | string | Case-sensitive fieldName to order records (optionally add `:asc` or `:desc`)                       | No       |
| status      | string | `true` or `false` it reruns approved or not approved reviews                                       | No       |
| product_id  | string | ilter the reviews by Product Id                                                                    | No       |

### Response Body Example
```
{
    "data": [
        {
            "id": "1",
            "productId": "880035",
            "rating": 3,
            "title": "anon",
            "text": "anon",
            "reviewerName": "anon",
            "shopperId": "anon@anon.com",
            "reviewDateTime": "06/02/2021 20:58:43",
            "searchDate": "2021-06-02T20:58:43Z",
            "verifiedPurchaser": false,
            "sku": null,
            "approved": true,
            "location": "",
            "locale": null,
            "pastReviews": null
        },
        {
            "id": "2",
            "productId": "880035",
            "rating": 5,
            "title": "logged in",
            "text": "it's cool",
            "reviewerName": "Brian",
            "shopperId": "brian.talma@vtex.com.br",
            "reviewDateTime": "06/02/2021 21:00:00",
            "searchDate": "2021-06-02T21:00:00Z",
            "verifiedPurchaser": false,
            "sku": null,
            "approved": true,
            "location": "",
            "locale": null,
            "pastReviews": null
        },
        {
            "id": "c66d8bc0-787c-11ec-82ac-028dd4526e77",
            "productId": "880035",
            "rating": 3,
            "title": "I am in Korean",
            "text": "ko-KR",
            "reviewerName": "ko-KR",
            "shopperId": "au.roraercc@gmail.com",
            "reviewDateTime": "01/18/2022 16:36:33",
            "searchDate": "2022-01-18T16:36:33Z",
            "verifiedPurchaser": false,
            "sku": null,
            "approved": true,
            "location": null,
            "locale": "ko-KR",
            "pastReviews": null
        }
    ],
    "range": {
        "total": 26,
        "from": 0,
        "to": 3
    }
}
```

## Delete Review

![Generic badge](https://img.shields.io/badge/DELETE-red.svg) `https://{{accountName}}.{{enviroment}}/reviews-and-ratings/api/review/{{reviewId}}`

### cURL

```
curl --location --request DELETE 'https://arturoreviews--sandboxusdev.myvtex.com/reviews-and-ratings/api/review/{{reviewId}}' \
--header 'X-VTEX-API-AppKey: X-VTEX-API-AppKey' \
--header 'X-VTEX-API-AppToken: X-VTEX-API-AppToken' \
```

### Headers

| Key                 | Value                             |
| ------------------- | --------------------------------- |
| Accept              | `application/json`                |
| Content-Type        | `application/json; charset=utf-8` |
| X-VTEX-API-AppKey   | `X-VTEX-API-AppKey`               |
| X-VTEX-API-AppToken | `X-VTEX-API-AppToken`             |

### URL Params

| Name     | Type   | Description | Required |
| -------- | ------ | ----------- | -------- |
| reviewId | string | Review Id   | No       |

### Response Body Example
```
true
```

## Delete Multiple Reviews

![Generic badge](https://img.shields.io/badge/DELETE-red.svg) `https://https://{{accountName}}.{{enviroment}}/reviews-and-ratings/api/reviews/`

### cURL

```
curl --location --request DELETE 'https://https://{{accountName}}.{{enviroment}}/reviews-and-ratings/api/reviews/' \
--header 'X-VTEX-API-AppKey: X-VTEX-API-AppKey' \
--header 'X-VTEX-API-AppToken: X-VTEX-API-AppToken' \
--data-raw '[
    "{reviewId}",
    "{reviewId}",
    "{reviewId}"
]'
```

### Headers

| Key                 | Value                             |
| ------------------- | --------------------------------- |
| Accept              | `application/json`                |
| Content-Type        | `application/json; charset=utf-8` |
| X-VTEX-API-AppKey   | `X-VTEX-API-AppKey`               |
| X-VTEX-API-AppToken | `X-VTEX-API-AppToken`             |

### Request Body

Array of ids to remove

| Name     | Type   | Description | Required     |
| -------- | ------ | ----------- | ------------ |
| reviewId | string | Review Id   | At least one |

### Response Body Example
```
true
```

## Edit Review

![Generic badge](https://img.shields.io/badge/PATCH-gray.svg) `https://https://{{accountName}}.{{enviroment}}/reviews-and-ratings/api/review/{{reviewId}} `

### cURL

```
curl --location --request PATCH 'http://arturoreviews--sandboxusdev.myvtex.com/reviews-and-ratings/api/review/{{reviewId}}' \
--header 'VtexIdclientAutCookie: VtexIdclientAutCookie' \
--data-raw '{
    "id": {{id}},
    "productId": {{productId}},
    "rating": {{rating}},
    "title": {{title}},
    "text": {{text}},
    "reviewerName": {{reviewerName}},
    "shopperId": {{shopperId}},
    "reviewDateTime": {{reviewDateTime}},
    "verifiedPurchaser": {{verifiedPurchaser}},
    "locale": {{locale}}
}'
```

### Headers

| Key                    | Value                             |
| -----------------------| --------------------------------- |
| Accept                 | `application/json`                |
| Content-Type           | `application/json; charset=utf-8` |
| VtexIdclientAutCookie  | `VtexIdclientAutCookie`           |

### URL Params


| Name     | Type   | Description | Required |
| -------- | ------ | ----------- | -------- |
| reviewId | string | Review Id   | Yes      |

### Request Body

| Name              | Type   | Description                              | Required |
| ----------------- | ------ | ---------------------------------------- | -------- |
| id                | string | Review Id                                | No       |
| productId         | string | Product Id                               | No       |
| rating            | number | Review Rating                            | No       |
| title             | string | Review Title                             | No       |
| text              | string | Review Text                              | No       |
| reviewerName      | string | Reviewer Name                            | No       |
| shopperId         | string | Reviewer Email                           | No       |
| verifiedPurchaser | string | Verified Purchaser                       | No       |
| locale            | string | Language and region, for example `en-US` | No       |
### Response Body Example
```
{
    "id": "c66d8bc0-787c-11ec-82ac-028dd4526e77",
    "productId": "880035",
    "rating": 3,
    "title": "I am in Korean",
    "text": "ko-KR",
    "reviewerName": "ko-KR",
    "shopperId": "au.roraercc@gmail.com",
    "reviewDateTime": "01/18/2022 16:36:33",
    "searchDate": "2022-01-18T16:36:33Z",
    "verifiedPurchaser": false,
    "sku": null,
    "approved": true,
    "location": null,
    "locale": "ko-KR",
    "pastReviews": null
}
```

# GraphQL IDE
In order to see how to use the graphQL queries and mutations you can go through the next steps:
1. Open the Admin [GraphQL IDE app](https://developers.vtex.com/vtex-developer-docs/docs/vtex-admin-graphql-ide). 
2. Select vtex.reviews-and-ratings app.
3. Click on `docs` at the top right corner.
![reviews-and-ratings-app](/public/metadata/images/screenshots/graphQL_docs.png)

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
