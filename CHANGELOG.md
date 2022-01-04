# Changelog

All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
