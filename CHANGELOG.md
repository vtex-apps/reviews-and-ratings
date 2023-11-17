# Changelog

All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- Using static language-country pairings derived from the locale and searching for `locale={locale}-*` only as fallback

## [3.13.3] - 2023-11-16

### Removed

- Prefix wildcard to query for locale at Master Data's ProductReviews

## [3.13.2] - 2023-08-09

### Added

- Translation of the ShowMore component.

## [3.13.1] - 2023-06-13

### Fixed

- Fixes of i18n on readme file.

## [3.13.0] - 2023-03-28

### Added
- German translation.

## [3.12.7] - 2023-02-24
### Added

- `showMoreButton` CSS handles.

### Changed

- The ShowMore component now has a CSS handle: `showMoreButton`

## [3.12.6] - 2023-02-03


### Added

- Added ListOrders policy

### Added

- Add Hardretries in signed in users while verifiying average rating
- Review api allows duplicate reviews. So, created a ticket (REVIEWS-135) and disabled the testcase

### Added

- For verifiedPurchaser testcase, added HasShopperReviewed intercept

### Added

- Added updateRetry to verify ratings and some messages

## [3.12.5] - 2023-01-09

### Removed

- Removed store-graphql dependency

### Fixed

- Fixed context provider error on the get review query

## [3.12.4] - 2023-01-03

### Fixed

- Fixed review state dispatch & improve GetAverageRatingByProductId loading time

## [3.12.3] - 2022-12-22

### Fixed

- Fixed product search and added assertions before targeting the search selectors

## [3.12.2] - 2022-12-19

### Fixed

- Fixed review stars laoding

### Added

- Updated the App name and using the graphql from common folder
- Updated cy-runner.yml and removed unneccesary selectors

### Fixed

- Portuguese translations.

## [3.12.1] - 2022-12-05

### Added

- Indonesian translation.

### Fixed

- Italian and English translations.

## [3.12.0] - 2022-11-04

### Added

- Custom GTM dataLayer event for when user submits a review

## [3.11.2] - 2022-10-20

### Changed

- Count stars within the `averageRatingByProductId` query

### Changed

- GitHub reusable workflow and cy-runner updated to version 2

## [3.11.1] - 2022-09-14

### Fixed

- Added GraphQL provider to queries and mutations
- Added additional VerifySchema checks
- VerifySchema now uses the app's token to authenticate
- Added error log if app is unable to search MasterData

## [3.11.0] - 2022-09-14

### Fixed

- Adjust GraphQL caching

## [3.10.9] - 2022-09-07

### Fixed

- (REVIEWS-118) If datetime parsing fails, attempt parsing by cultureinfo

## [3.10.8] - 2022-08-30

### Fixed

- Fixed empty strings to "0".

## [3.10.7] - 2022-08-30

### Fixed

- Increased memory in service.json file.

## [3.10.5] - 2022-08-23

## [3.10.4] - 2022-08-15

### Fixed

- (REVIEWS-112) Fixed time ago intl variables.

### Fixed

- (REVIEWS-112) Fixed time ago messages.

## [3.10.3] - 2022-08-09

### Changed

- (REVIEWS-108)
- Reduced calls to Verify Schema to instances when we should have valid credentials
- Changed Task Cancelled errors to warnings.

## [3.10.2] - 2022-08-08

### Fixed

- English, Spanish, Italian, Portuguese and Thai translations.

## [3.10.1] - 2022-07-25

### Changed

- (REVIEWS-107) Translate 'Migrate Data' button to all languages.

## [3.10.0] - 2022-07-14

### Added

- Added Auth to edit/delete/moderate reviews

## [3.9.2] - 2022-07-01

### Changed

- (REVIEWS-102) Updated VerifySchema function

## [3.9.1] - 2022-06-03

### Fixed

- Convert to review date to local time in the front pending and approved tables.
- Use IsNullOrEmpty for validations in rest APIs.

## [3.9.0] - 2022-06-02

### Added

- Thai translations.

### Fixed

- French translations.

## [3.8.15] - 2022-06-01

### Fixed

- Added body fields validations for post methods rest api.

## [3.8.14] - 2022-05-24

### Added

- (REVIEWS-98) Added error handling.

## [3.8.13] - 2022-05-13

### Fixed

- Create a review saved custom event to update the RatingSummary component.
- Use useQuery graphQL hook to destructure refetch in RatingSummary component.

## [3.8.12] - 2022-05-10

### Fixed

- Use useQuery graphQL hook to destructure refetch in Reviews component.
- Passed refetchReviews to ReviewForm component to refetch after a new review is saved.

## [3.8.11] - 2022-05-05

### Added

- Updated readme file for API documentation and graphQL endpoints.

## [3.8.10] - 2022-05-04

### Fixed

- Deprecate the reviewByDateTime graphQL service.
- Set a default time to 23:59:59 in reviewByDateRange if no time received in toDate param.

## [3.8.9] - 2022-04-22

### Fixed

- Update reviews list without refresh the page when save a new review.
- Set a default value as 5 if the reviews has no rating.
- Fix the time of the review in case of invalid date.

## [3.8.8] - 2022-04-22

### Fixed

- Render loading message before product page completely loads.

## [3.8.7] - 2022-04-21

### Fixed

-If adminApproval is false set approved to true when save review.

## [3.8.6] - 2022-04-19

### Fixed

- Fixed newReview mutation to avoid locale equal to "".

## [3.8.5] - 2022-04-18

### Fixed

- Create the EditReviewInputType for the editReview mutation.
- Set default values to from and to variables in the graphQL schema.

## [3.8.4] - 2022-04-08

### Fixed

- Change the query arguments to be strings in order to match the types.

## [3.8.3] - 2022-04-07

### Fixed

- Force UTC format date.

## [3.8.2] - 2022-03-24

### Fixed

- Remove the UTC string to avoid returning invalid date for new Date.

## [3.8.1] - 2022-03-24

### Fixed

- Use search-date field to order reviews instead reviewDateTime.

## [3.8.0] - 2022-03-11

### Fixed

- Change the order of the PUT calls, i put first the verify schema and then the hashed one in vBase.
- Throw Exception message if the first put schema status code !IsSuccessStatusCode or NotModified.

## [3.7.5] - 2022-03-07

### Fixed

- Structured data rendered only if reviews > 0.

## [3.7.4] - 2022-03-07

### Fixed

- Set `awaitRefetchQueries` to `false`.

## [3.7.3] - 2022-03-04

### Fixed

- Fix the ValidateKeyAndToken function alerts, added retry and maximum retry is 5 times

## [3.7.2] - 2022-03-01

### Fixed

- Conditioning the use of AND depending on locale parameter in GetReviewsByProductId.

## [3.7.1] - 2022-02-25

### Fixed

- GetReviewsByProductId url request fixed.

## [3.7.0] - 2022-02-15

### Added

- Arabic translation.

## [3.6.2] - 2022-02-11

### Fixed

Fix the bug for product reviews filter at store front

## [3.6.1] - 2022-02-10

### Fixed

Fix the bug for totalReviewsByProductId query

## [3.6.0] - 2022-02-08

### Added

- added admin setting about default stars of rating

## [3.5.2] - 2022-01-27

### Added

- Added warning information about the migration of data admin button.

## [3.5.1] - 2022-01-26

### Fixed

- admin panel pagination bugfix

## [3.5.0] - 2022-01-25

### Added

- Added Locale(Bindings) filters feature for the store front

## [3.4.4] - 2022-01-24

### Fixed

- reviewsByProductId input string format errors
- review GET, PATCH, POST
- Eslint errors and warnings except Unexpected any.
- remove package-lock.json and reinstall yarn

## [3.4.3] - 2022-01-14

### Fixed

- Fixed headers for Verify Schema.
- Add to verify schema process hashed schema comparison.
- Run Migrate Data automatically only when it's necessary.
- Added a button to migrate data if they need.

### Added

- Quality engineering actions (SonarCloud analysis for .Net and TS)

## [3.4.2] - 2022-01-13

### Changed

- Use product's URI as @id on `Product` schema for `RatingSummary` and `Reviews` blocks.

## [3.4.1] - 2022-01-04

### Fixed

- Bugfix for the rating parsing issues

## [3.4.0] - 2021-12-23

### Added

- Added rating filters feature for the store front

## [3.3.7] - 2021-12-22

### Fixed

- French, Italian, Japanese, Korean, Portuguese, Dutch and Romanian translations

### Removed

- Pseudolanguage

## [3.3.6] - 2021-12-17

### Added

- Specify cache control for REST API

## [3.3.5] - 2021-12-16

### Fixed

- Set alreadysubmitted state depending on the hasAlreadySubmitted query response.
- Enabled cache for REST API.

## [3.3.4] - 2021-12-16

### Fixed

- Fixed get call reviews filtering correctly by the approve field according on the require approval setting

## [3.3.3] - 2021-12-13

### Fixed

- Added immediate indexing in MasterData to fix caching problems

## [3.3.2] - 2021-12-10

### Fixed

- Metadata folder re-estructured according the new submit process

## [3.3.1] - 2021-12-09

## [3.3.0] - 2021-12-08

### Fixed

- Fixed Place icon.png into images folder

### Fixed

- Improved logging of migration

## [3.2.1] - 2021-12-06

### Fixed

- Fixed Admin Messages

## [3.2.0] - 2021-12-02

### Fixed

- Updated README file

### Added

- Add date range fillter and the export function in the new 'download' tab

## [3.1.0] - 2021-10-05

### Changed

- Performance improvements
- Pagination

## [3.0.2] - 2021-09-22

### Fixed

- Added REST-Range header to search

## [3.0.1] - 2021-09-21

### Fixed

- Data migration error handing

## [3.0.0] - 2021-09-17

### Changed

- Changed from vBase to Masterdata

## [2.11.0] - 2021-09-16

### Added

- I18n Bg and pseudo language to implement In Context tool.

## [2.12.3] - 2021-09-14

### Fixed

-Loading reviews messages translated

## [2.12.2] - 2021-09-10

### Changed

- Limit number of records
- Increased timeout

## [2.12.1] - 2021-09-08

### Fixed

- Default to false when Approved is null

## [2.12.0] - 2021-09-07

### Added

- Add setting to display stars in `product-rating-inline` block when the product has no reviews
- Use locale to format review's date in account admin view

## [2.11.8] - 2021-08-30

### Fixed

- Fix to editing review

## [2.11.7] - 2021-08-12

### Fixed

- Added a CSS handle for review pagination container

## [2.11.6] - 2021-08-02

### Fixed

- Add loading state to "Submit Review" button to prevent duplicate submissions

## [2.11.5] - 2021-07-23

### Fixed

- When validating app key and token, first validate with VTEX ID to see if key/token pair is valid, then validate with License Manager to see if app key has access to at least one resource

## [2.11.4] - 2021-07-23

### Added

- `Get_Account_By_Identifier` policy

### Security

- Removed sensitive information from log

## [2.11.3] - 2021-07-22

### Fixed

- Fix path in manafest.json

## [2.11.2] - 2021-07-22

### Fixed

- Fix license validate url

## [2.11.1] - 2021-07-16

### Fixed

- Fix to API user validation

## [2.11.0] - 2021-07-15

### Added

- `formSection`, `formBottomLine`, `formRating`, `formName`, `formLocation`, `formEmail`, `formReview`, `formSubmit`, `formInvalidMessage`, `reviewCommentMessage`, `reviewsOrderBy`, `reviewInfo`, `reviewVerifiedPurchase`, `reviewDate`, `reviewDateSubmitted`, `reviewDateValue`, `reviewAuthor`, `reviewAuthorBy`, `reviewAuthorName`, `summaryTotalReviews` and `writeReviewButton` CSS handles.

### Changed

- Review details structure (author and date) from using `ul` to `div` and `span`s.

## [2.10.2] - 2021-06-02

### Fixed

- Fix for anonymous review submission

## [2.10.1] - 2021-05-27

### Security

- Showing sensitive information

## [2.10.0] - 2021-05-03

### Added

- I18n Fr, It, Kr and Nl.

### Changed

- Crowdin configuration file.

## [2.9.2] - 2021-04-14

### Fixed

- Added an `id` property to structered data

## [2.9.1] - 2021-03-16

### Fixed

- CPU factor by `80`

## [2.9.0] - 2021-03-10

### Added

- I18n Ro.

## [2.8.0] - 2021-03-10

### Added

- I18n Jp.

### Changed

- Crowdin configuration file.

## [2.7.3] - 2021-03-09

### Added

- Added CPU request to service.json

## [2.7.2] - 2021-02-05

### Changed

- Changed user validation url

## [2.7.1] - 2021-02-05

### Added

- Added outbound access policies

## [2.7.0] - 2021-02-05

### Added

- Logging

## [2.6.0] - 2021-02-04

### Added

- Added prop position to v4 navigation item object in `admin/navigation.json`

## [2.5.0] - 2021-01-27

### Added

- Added API interface

## [2.4.0] - 2021-01-15

### Added

- Display graph option in app settings
- New settings to display stars even if the product has no reviews
- New settings to hide the total number of reviews in product-rating-summary block
- New settings to add `Add Review` button under the stars in product-rating-summary block

## [2.3.2] - 2020-12-21

### Fixed

- App types.
- DOM hierarchy.

### Changed

- Use Apollo and React Intl hooks instead of HOCs.

## [2.3.1] - 2020-12-14

### Security

- Setting infrastructure `replica` parameters

## [2.3.0] - 2020-12-10

### Added

- Navigation setup for admin v4.

## [2.2.1] - 2020-10-27

### Fixed

- Missing parenthesis in translation message.

### Added

- Display graph option in app settings

## [2.2.1] - 2020-10-27

### Fixed

- Missing parenthesis in translation message.

### Added

- Display graph option in app settings
- New settings to display stars even if the product has no reviews
- New settings to hide the total number of reviews in product-rating-summary block
- New settings to add `Add Review` button under the stars in product-rating-summary block

## [2.2.1] - 2020-10-27

### Fixed

- Missing parenthesis in translation message.

## [2.2.0] - 2020-10-02

### Added

- New feature to specify number of initial expanded reviews

## [2.1.0] - 2020-09-30

### Added

- Missing CSS Handles

## [2.0.3] - 2020-09-16

### Fixed

- App documentation (`readme.md` file)

## [2.0.2] - 2020-08-18

### Changed

- New app store descriptions (EN, ES, PT) and transparent icon

### Fixed

- Add billingOptions type and availableCountries

## [2.0.1] - 2020-08-18

### Changed

- Dependabot: Bump lodash from 4.17.15 to 4.17.19

## [2.0.0] - 2020-07-15

### Changed

- Add app store assets and billing options
- Update docs

## [1.6.2] - 2020-07-09

### Fixed

- Default value of email input

## [1.6.1] - 2020-05-28

### Added

- CSS handle for login link

### Fixed

- Implement JSON.stringify to ensure LD+JSON is valid

## [1.6.0] - 2020-05-28

### Added

- LD+JSON structured data snippets for reviews

### Fixed

- Console errors generated by dropdown and form components

## [1.5.2] - 2020-05-25

### Added

- `reviewsHeading` and `reviewCommentsContainer` CSS handles.

## [1.5.1] - 2020-05-20

## [1.5.0] - 2020-04-29

### Added

- Check if user is a "Verified Purchaser"

## [1.4.1] - 2020-04-27

### Security

- Bump dependencies versions.

## [1.4.0] - 2020-04-23

### Added

- `es` local translation

## [1.3.0] - 2020-04-08

### Added

- New feature switch to swap collapsible review text accordions for staticly displayed reviews with show more/show less links

## [1.2.3] - 2020-01-31

### Added

- CSS Handles, including new `writeReviewContainer` handle

## [1.2.2] - 2020-01-30

### Fixed

- Changed Queries to Async

## [1.2.1] - 2019-12-30

### Changed

- Improved date field sorting

## [1.2.0] - 2019-12-30

### Added

- Implemented full internationalization for admin and frontend messages

## [1.1.2] - 2019-12-17

### Changed

- Documentation updated

## [1.1.1] - 2019-12-16

### Fixed

- App will no longer attempt to display reviews containing invalid JSON

## [1.0.8] - 2019-12-04

### Fixed

- Calls to VBASE now use account and workspace from request headers rathen than env variables
- Infra service calls (vbase, apps) now use new `infra.io.vtex.com` domain

## [1.0.7] - 2019-12-04

### Fixed

- Republishing app to fix empty `plugins.json`

## [1.0.6] - 2019-11-27

### Fixed

- Republishing app to fix empty `plugins.json` (failed)

## [1.0.5] - 2019-11-06

### Added

- Admin table now shows product name (and link to product form page) in addition to product ID

### Fixed

- Added "pointer" className to `StarPicker`

## [1.0.4] - 2019-11-05

### Added

- Docs folder and README.md

### Removed

- Removed `review-form` interface and plugin (review form is embedded in `Reviews` component, not displayed on separate page)

## [1.0.3] - 2019-11-04

### Fixed

- `averageRatingByProductId` and `totalReviewsByProductId` queries now take `requireApproval` setting into account

### Added

- New review form now includes a custom `StarPicker` component instead of `NumericStepper`
- "Please log in to write review" message now includes link to login page

## [1.0.2] - 2019-10-29

### Fixed

- If 'approval required' setting is enabled, only count approved reviews in average & totals

## [1.0.1] - 2019-10-28

### Fixed

- Disabled truncation of review text in admin.

## [1.0.0] - 2019-10-25

### Added

- Initial release.
