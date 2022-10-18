namespace ReviewsRatings.Services
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Reflection;
    using System.Text;
    using System.Threading.Tasks;
    using Models;
    using Newtonsoft.Json;
    using System.Net;
    using ReviewsRatings.DataSources;
    using Vtex.Api.Context;

    /// <summary>
    /// Business logic 
    /// </summary>
    public class ProductReviewService : IProductReviewService
    {
        private readonly IProductReviewRepository _productReviewRepository;
        private readonly IAppSettingsRepository _appSettingsRepository;
        private readonly IIOServiceContext _context;
        private const int maximumReturnedRecords = 500;
        private const string DELIMITER = ":";

        public ProductReviewService(IProductReviewRepository productReviewRepository, IAppSettingsRepository appSettingsRepository, IIOServiceContext context)
        {
            this._productReviewRepository = productReviewRepository ??
                                            throw new ArgumentNullException(nameof(productReviewRepository));
            this._appSettingsRepository = appSettingsRepository ??
                                            throw new ArgumentNullException(nameof(appSettingsRepository));
            this._context = context ??
                            throw new ArgumentNullException(nameof(context));
        }

        public async Task<bool> DeleteLegacyReview(int[] ids, string productId = null)
        {
            bool retval = true;

            try
            {
                IDictionary<int, string> lookup = await _productReviewRepository.LoadLookupAsync();
                foreach (int id in ids)
                {
                    if (string.IsNullOrEmpty(productId) && lookup != null)
                    {
                        lookup.TryGetValue(id, out productId);
                    }

                    if (!string.IsNullOrEmpty(productId))
                    {
                        IList<LegacyReview> reviews = await this._productReviewRepository.GetProductReviewsAsync(productId);
                        LegacyReview reviewToRemove = reviews.FirstOrDefault(r => r.Id == id);
                        if (reviewToRemove != null && reviews.Remove(reviewToRemove))
                        {
                            await this._productReviewRepository.SaveProductReviewsAsync(productId, reviews);
                        }
                    }
                    else
                    {
                        retval = false;
                    }

                    // also remove the reference to the review from the loopup
                    if (lookup != null && lookup.Keys.Contains(id))
                    {
                        lookup.Remove(id);
                    }
                }

                await _productReviewRepository.SaveLookupAsync(lookup);
            }
            catch (Exception ex)
            {
                _context.Vtex.Logger.Error("DeleteLegacyReview", null, 
                "Error:", ex,
                new[]
                {
                    ( "ids", JsonConvert.SerializeObject(ids) ),
                    ( "productId", productId )
                });
            }

            return retval;
        }

        public async Task<Review> EditReview(Review review)
        {
            ReviewsResponseWrapper wrapper = await _productReviewRepository.GetProductReviewsMD($"id={review.Id}", null, null);
            Review oldReview = wrapper.Reviews.FirstOrDefault();

            review.Approved = review.Approved ?? oldReview.Approved;
            review.Location = string.IsNullOrEmpty(review.Location) ? oldReview.Location : review.Location;
            review.ProductId = string.IsNullOrEmpty(review.ProductId) ? oldReview.ProductId : review.ProductId;
            review.Rating = review.Rating ?? oldReview.Rating;
            review.ReviewDateTime = string.IsNullOrEmpty(review.ReviewDateTime) ? oldReview.ReviewDateTime : review.ReviewDateTime;
            review.ReviewerName = string.IsNullOrEmpty(review.ReviewerName) ? oldReview.ReviewerName : review.ReviewerName;
            review.ShopperId = string.IsNullOrEmpty(review.ShopperId) ? oldReview.ShopperId : review.ShopperId;
            review.Sku = string.IsNullOrEmpty(review.Sku) ? oldReview.Sku : review.Sku;
            review.Text = string.IsNullOrEmpty(review.Text) ? oldReview.Text : review.Text;
            review.Title = string.IsNullOrEmpty(review.Title) ? oldReview.Title : review.Title;
            review.Locale = string.IsNullOrEmpty(review.Locale) ? oldReview.Locale : review.Locale;
            review.VerifiedPurchaser = review.VerifiedPurchaser ?? oldReview.VerifiedPurchaser;

            string id = await this._productReviewRepository.SaveProductReviewMD(review);
            if (string.IsNullOrEmpty(id))
            {
                review = null;
            }
            else
            {
                review.Id = id;
            }

            return review;
        }

        public async Task<AverageCount> GetAverageRatingByProductId(string productId)
        {
            decimal averageRating = 0m;
            int stars1 = 0;
            int stars2 = 0;
            int stars3 = 0;
            int stars4 = 0;
            int stars5 = 0;
            int numberOfReviews = 0;

            string searchQuery = $"productId={productId}";
            AppSettings settings = await GetAppSettings();
            if (settings.RequireApproval)
            {
                searchQuery = $"{searchQuery}&approved=true";
            }

            ReviewsResponseWrapper wrapper = await this._productReviewRepository.GetProductReviewsMD(searchQuery, null, null);
            IList<Review> reviews = wrapper.Reviews;
            if (reviews != null)
            {
                decimal totalRating = 0;

                foreach(Review review in reviews)
                {
                    if (review.Rating != null && review.Rating >= 0.00 && review.Rating <= 5.00)
                    {
                        totalRating = totalRating + review.Rating ?? 0;
                        numberOfReviews++;
                        if (review.Rating == 5) stars5++;
                        else if (review.Rating == 4) stars4++;
                        else if (review.Rating == 3) stars3++;
                        else if (review.Rating == 2) stars2++;
                        else stars1++;
                    }
                }
                if (numberOfReviews != 0)
                {
                    averageRating = totalRating / numberOfReviews;
                }
                
            }

            AverageCount avergae = new AverageCount
            {
                Average = decimal.Round(averageRating, 2, MidpointRounding.AwayFromZero),
                StarsFive = stars5,
                StarsFour = stars4,
                StarsThree = stars3,
                StarsTwo = stars2,
                StarsOne = stars1,
                Total = numberOfReviews
            };
            return avergae;
        }

        public async Task<Review> GetReview(string Id)
        {
            Review review = null;
            ReviewsResponseWrapper wrapper = await this._productReviewRepository.GetProductReviewsMD($"id={Id}", null, null);
            IList<Review> reviews = wrapper.Reviews;

            if (reviews != null)
            {
                review = reviews.FirstOrDefault();
            }

            return review;
        }

        public async Task<IList<LegacyReview>> GetLegacyReviews()
        {
            List<LegacyReview> reviews = new List<LegacyReview>();
            IDictionary<int, string> lookup = await _productReviewRepository.LoadLookupAsync();
            if (lookup != null)
            {
                List<string> productIds = lookup.Values.Distinct().ToList();
                int productsCounter = 0;
                foreach (string productId in productIds)
                {
                    // Get all results - sort/limit later
                    IList<LegacyReview> returnedReviewList = await _productReviewRepository.GetProductReviewsAsync(productId);
                    if (returnedReviewList.Count > 0)
                    {
                        reviews.AddRange(returnedReviewList);
                        productsCounter++;
                    }
                    else
                    {
                        // Remove any broken lookup references
                        try
                        {
                            List<int> missingIds = new List<int>();
                            foreach(var lookupPair in lookup)
                            {
                                if (lookupPair.Value == null || lookupPair.Value.Equals(productId))
                                {
                                    missingIds.Add(lookupPair.Key);
                                }
                            }

                            if (missingIds != null)
                            {
                                _context.Vtex.Logger.Warn("GetReviews", null, $"Removing broken lookup ids for product id {productId}\n{string.Join(",", missingIds.ToArray())}");
                                foreach (int idToRemove in missingIds)
                                {
                                    lookup.Remove(idToRemove);
                                }

                                await _productReviewRepository.SaveLookupAsync(lookup);
                            }
                        }
                        catch(Exception ex)
                        {
                            _context.Vtex.Logger.Error("GetReviews", null, $"Error removing broken lookup ids for product id {productId}", ex);
                        }
                    }
                }
            }

            return reviews;
        }

        public async Task<IList<Review>> LimitReviews(IList<Review> reviews, int from, int to)
        {
            int take = maximumReturnedRecords;
            if (to > 0)
            {
                take = Math.Min((to - from) + 1, maximumReturnedRecords);
            }

            reviews = reviews.Skip(from - 1).Take(take).ToList();

            return reviews;
        }

        public async Task<IList<Review>> FilterReviews(IList<Review> reviews, string searchTerm, string orderBy, string status)
        {
            if (reviews != null && reviews.Count > 0)
            {
                if (!string.IsNullOrEmpty(searchTerm))
                {
                    reviews = reviews.Where(x => new[]
                    {
                        x.ProductId ?? string.Empty,
                        x.Sku ?? string.Empty,
                        x.ShopperId ?? string.Empty,
                        x.ReviewerName ?? string.Empty
                    }.Any(s => s.Contains(searchTerm))).ToList();
                }

                if (!string.IsNullOrEmpty(orderBy))
                {
                    string[] orderByArray = orderBy.Split(DELIMITER);
                    PropertyInfo pi = typeof(Review).GetProperty(orderByArray[0]);
                    if (pi != null)
                    {
                        bool descendingOrder = true;
                        if (orderByArray.Length > 1)
                        {
                            if (orderByArray[1].ToLower().Contains("asc"))
                            {
                                descendingOrder = false;
                            }
                        }

                        if (descendingOrder)
                        {
                            if (pi.Name.Equals("ReviewDateTime"))
                            {
                                reviews = reviews.OrderByDescending(x =>
                                {
                                    DateTime dt;
                                    DateTime.TryParse(x.ReviewDateTime, out dt);
                                    return dt;
                                }).ToList();
                            }
                            else
                            {
                                reviews = reviews.OrderByDescending(x => pi.GetValue(x, null)).ToList();
                            }
                        }
                        else
                        {
                            if (pi.Name.Equals("ReviewDateTime"))
                            {
                                reviews = reviews.OrderBy(x =>
                                {
                                    DateTime dt;
                                    DateTime.TryParse(x.ReviewDateTime, out dt);
                                    return dt;
                                }).ToList();
                            }
                            else
                            {
                                reviews = reviews.OrderBy(x => pi.GetValue(x, null)).ToList();
                            }
                        }
                    }
                }

                if (!string.IsNullOrEmpty(status))
                {
                    reviews = reviews.Where(x => (x.Approved ?? false).Equals(bool.Parse(status))).ToList();
                }
            }

            return reviews;
        }

        /// query Reviews($searchTerm: String, $from: Int, $to: Int, $orderBy: String, $status: Boolean)
        public async Task<ReviewsResponseWrapper> GetReviews(string searchTerm, int from, int to, string orderBy, string status)
        {
            ReviewsResponseWrapper wrapper = new ReviewsResponseWrapper();

            try
            {
                string searchQuery = string.Empty;
                string statusQuery = string.Empty;
                if (!string.IsNullOrEmpty(searchTerm))
                {
                    searchQuery = $"&_keyword={searchTerm}";
                }

                if (!string.IsNullOrEmpty(status))
                {
                    statusQuery = $"&approved={status}";
                }

                string sortQuery = await this.GetSortQuery(orderBy);

                wrapper = await _productReviewRepository.GetProductReviewsMD($"{searchQuery}{sortQuery}{statusQuery}", Convert.ToString(from), Convert.ToString(to));
            }
            catch (Exception ex)
            {
                _context.Vtex.Logger.Error("GetReviews", null, 
                "Error:", ex,
                new[]
                {
                    ( "searchTerm", searchTerm ),
                    ( "from", from.ToString() ),
                    ( "to", to.ToString() ),
                    ( "orderBy", orderBy ),
                    ( "status", status )
                });
            }
            
            return wrapper;
        }

        public async Task<ReviewsResponseWrapper> GetReviewsByProductId(string productId)
        {
            ReviewsResponseWrapper wrapper = new ReviewsResponseWrapper();

            try
            {
                wrapper = await this.GetReviewsByProductId(productId, 0, maximumReturnedRecords, string.Empty, string.Empty, 0, string.Empty, true);
                if (wrapper != null)
                {
                    _context.Vtex.Logger.Info("GetReviewsByProductId", null, $"Getting reviews", new[] { ("productId", productId), ("Total", wrapper.Range.Total.ToString()) });
                }

            }
            catch (Exception ex)
            {

                _context.Vtex.Logger.Error("GetReviewsByProductId", null, 
                "Error:", ex,
                new[]
                {
                    ( "productId", productId )
                });
            }

            return wrapper;
        }

        public async Task<ReviewsResponseWrapper> GetReviewsByProductId(string productId, int from, int to, string orderBy, string searchTerm, int rating, string locale, bool pastReviews)
        {
            string searchQuery = string.Empty;
            string ratingQuery = string.Empty;
            string localeQuery = string.Empty;
            bool ratingFilter = rating > 0 && rating <= 5;
            bool pastRevNLocale = pastReviews && !string.IsNullOrEmpty(locale);
            ReviewsResponseWrapper wrapper = new ReviewsResponseWrapper();

            try
            {
                string sort = await this.GetSortQuery(orderBy);

                if (!string.IsNullOrEmpty(searchTerm))
                {
                    searchQuery = $"&_keyword={searchTerm}";
                }

                if (to == 0 || to < from) {
                    to = maximumReturnedRecords;
                }

                AppSettings settings = await GetAppSettings();

                if (pastRevNLocale)
                {
                    if (settings.RequireApproval)
                    {
                        searchQuery = $" AND approved=true";
                    }
                    localeQuery = $"((locale=*{locale}-*) OR (locale is null))";
                    if (ratingFilter)
                    {
                        ratingQuery = $" AND rating={rating}";
                    }
                    string productQuery = $" AND productId={productId}";

                    wrapper = await this._productReviewRepository.GetProductReviewsMD($"_where={localeQuery}{ratingQuery}{productQuery}{searchQuery}{sort}", from.ToString(), to.ToString());
                }
                else
                {
                    if (ratingFilter)
                    {
                        ratingQuery = $"&rating={rating}";
                    }
                    if (settings.RequireApproval)
                    {
                        searchQuery = $"{searchQuery}&approved=true";
                    }
                    if (!string.IsNullOrEmpty(locale))
                    {
                        localeQuery = $"&locale=*{locale}-*";
                    }

                    wrapper = await this._productReviewRepository.GetProductReviewsMD($"productId={productId}{sort}{searchQuery}{ratingQuery}{localeQuery}", from.ToString(), to.ToString());
                }
            }
            catch (Exception ex)
            {
                _context.Vtex.Logger.Error("GetReviewsByProductId", null, 
                "Error:", ex,
                new[]
                {
                    ( "productId", productId ),
                    ( "from", from.ToString() ),
                    ( "to", to.ToString() ),
                    ( "orderBy", orderBy ),
                    ( "searchTerm", searchTerm ),
                    ( "rating", rating.ToString() ),
                    ( "locale", locale ),
                    ( "pastReviews", pastReviews.ToString() )
                });
            }

            return wrapper;
        }

        public async Task<Review> NewReview(Review review, bool doValidation)
        {
            try
            {
                if (review != null)
                {
                    if (doValidation)
                    {
                        bool userValidated = false;
                        bool hasShopperReviewed = false;
                        bool hasShopperPurchased = false;
                        string userId = string.Empty;
                        ValidatedUser validatedUser = null;
                        validatedUser = await this.ValidateUserToken(_context.Vtex.StoreUserAuthToken);

                        if (validatedUser != null && validatedUser.AuthStatus.Equals("Success"))
                        {
                            userValidated = true;
                        }

                        if (userValidated)
                        {
                            userId = validatedUser.User;
                            hasShopperReviewed = await this.HasShopperReviewed(userId, review.ProductId);
                            if (hasShopperReviewed)
                            {
                                return null;
                            }

                            hasShopperPurchased = await this.ShopperHasPurchasedProduct(userId, review.ProductId);
                        }

                        review.ShopperId = userId;
                        review.VerifiedPurchaser = hasShopperPurchased;
                    }

                    if (review.Approved == null)
                    {
                        review.Approved = false;
                    }

                    if (string.IsNullOrWhiteSpace(review.ReviewDateTime))
                    {
                        // TODO: Check timezone for store
                        review.ReviewDateTime = DateTime.Now.ToString();
                    }

                    string id = await this._productReviewRepository.SaveProductReviewMD(review);
                    if (string.IsNullOrEmpty(id))
                    {
                        review = null;
                    }
                    else
                    {
                        review.Id = id;
                    }
                }
            }
            catch (Exception ex)
            {
                _context.Vtex.Logger.Error("NewReview", null, 
                "Error:", ex,
                new[]
                {
                    ( "review", JsonConvert.SerializeObject(review) ),
                    ( "doValidation", doValidation.ToString() )
                });
            }

            return review;
        }

        public async Task<ReviewsResponseWrapper> GetReviewsByShopperId(string shopperId)
        {
            return await _productReviewRepository.GetProductReviewsMD($"shopperId={shopperId}", null, null);;
        }

        public async Task<ReviewsResponseWrapper> GetReviewsByreviewDateTime(string reviewDateTime)
        {
            return await _productReviewRepository.GetProductReviewsMD($"reviewDateTime={reviewDateTime}",null, null);
        }

        public async Task<ReviewsResponseWrapper> GetReviewsByDateRange(string fromDate, string toDate)
        {
            return await _productReviewRepository.GetRangeReviewsMD(fromDate, toDate);
        }

        public async Task ClearData()
        {
            try
            {
                IDictionary<int, string> lookup = await _productReviewRepository.LoadLookupAsync();

                if (lookup != null)
                {
                    List<string> productIds = lookup.Values.Distinct().ToList();
                    foreach (string productId in productIds)
                    {
                        await this._productReviewRepository.SaveProductReviewsAsync(productId, null);
                    }
                }

                await _productReviewRepository.SaveLookupAsync(null);
            }
            catch (Exception ex)
            {
                _context.Vtex.Logger.Error("ClearData", null, "Error:", ex);
            }
        }

        public async Task<bool> ModerateReview(string[] ids, bool approved)
        {
            bool retval = true;

            
            IDictionary<int, string> lookup = await _productReviewRepository.LoadLookupAsync();
            foreach (string id in ids)
            {
                ReviewsResponseWrapper wrapper = await this._productReviewRepository.GetProductReviewsMD($"id={id}", null, null);
                Review reviewToModerate = wrapper.Reviews.FirstOrDefault(r => r.Id == id);
                if (reviewToModerate != null)
                {
                    reviewToModerate.Approved = approved;
                    string returnedId = await this._productReviewRepository.SaveProductReviewMD(reviewToModerate);
                    if (string.IsNullOrEmpty(returnedId))
                    {
                        retval = false;
                    }
                }
                else
                {
                    retval = false;
                }
            }

            return retval;
        }

        public async Task<bool> HasShopperReviewed(string shopperId, string productId)
        {
            bool retval = false;
            ReviewsResponseWrapper wrapper = await this._productReviewRepository.GetProductReviewsMD($"shopperId={shopperId}&productId={productId}", null, null);
            IList<Review> reviews = wrapper.Reviews;
            if (reviews != null && reviews.Count > 0)
            {
                retval = true;
            }

            return retval;
        }

        public async Task<AppSettings> GetAppSettings()
        {
            return await this._appSettingsRepository.GetAppSettingAsync();
        }

        public async Task<ValidatedUser> ValidateUserToken(string token)
        {
            return await this._productReviewRepository.ValidateUserToken(token);
        }

        public async Task<HttpStatusCode> IsValidAuthUser()
        {
            if (string.IsNullOrEmpty(_context.Vtex.AdminUserAuthToken))
            {
                return HttpStatusCode.Unauthorized;
            }

            ValidatedUser validatedUser = null;
            try {
                validatedUser = await ValidateUserToken(_context.Vtex.AdminUserAuthToken);
            }
            catch (Exception ex)
            {
                _context.Vtex.Logger.Error("IsValidAuthUser", null, "Error fetching user", ex);
                return HttpStatusCode.BadRequest;
            }

            bool hasPermission = validatedUser != null && validatedUser.AuthStatus.Equals("Success");
            
            if (!hasPermission)
            {
                _context.Vtex.Logger.Warn("IsValidAuthUser", null, "User Does Not Have Permission");
                return HttpStatusCode.Forbidden;
            }

            return HttpStatusCode.OK;
        }

        public async Task<bool> ValidateKeyAndToken(string key, string token, string baseUrl)
        {
            return await this._productReviewRepository.ValidateKeyAndToken(key, token, baseUrl);
        }

        public async Task<bool> ShopperHasPurchasedProduct(string shopperId, string productId)
        {
            bool hasPurchased = false;
            try
            {
                VtexOrderList vtexOrderList = await this._productReviewRepository.ListOrders($"q={shopperId}");
                var orderIds = vtexOrderList.List.Select(o => o.OrderId);
                foreach (string orderId in orderIds)
                {
                    VtexOrder vtexOrder = await this._productReviewRepository.GetOrderInformation(orderId);
                    var productIds = vtexOrder.Items.Select(i => i.ProductId);
                    hasPurchased = productIds.Contains(productId);
                    if (hasPurchased)
                    {
                        break;
                    }
                }
            }
            catch(Exception ex)
            {
                _context.Vtex.Logger.Error("ShopperHasPurchasedProduct", null, "Request Error", ex, new[] { ("shopperId", shopperId), ("productId", productId) });
            }

            return hasPurchased;
        }

        public async Task<string> VerifySchema()
        {
            return await _productReviewRepository.VerifySchema();
        }

        public async Task<string> VerifyMigration()
        {
            return await _productReviewRepository.VerifyMigration();
        }

        public async Task<string> SuccessfulMigration()
        {
            return await _productReviewRepository.SuccessfulMigration();
        }

        private async Task<Review> ConvertLegacyReview(LegacyReview review)
        {
            Review newReview = new Review
            {
                Approved = review.Approved ?? false,
                Id = review.Id.ToString(),
                Location = review.Location,
                ProductId = review.ProductId,
                Rating = review.Rating,
                ReviewDateTime = review.ReviewDateTime,
                ReviewerName = review.ReviewerName,
                ShopperId = review.ShopperId,
                Sku = review.Sku,
                Text = review.Text,
                Title = review.Title,
                Locale = review.Locale,
                VerifiedPurchaser = review.VerifiedPurchaser ?? false
            };

            return newReview;
        }

        public async Task<string> MigrateData()
        {
            
            StringBuilder sb = new StringBuilder();
            string verify = await this.VerifySchema();

            sb.AppendLine(verify);

            try
            {
                IList<LegacyReview> reviews = await this.GetLegacyReviews();
                if (reviews != null && reviews.Count > 0)
                {
                    foreach (LegacyReview review in reviews)
                    {
                        try
                        {
                            sb.AppendLine($"MigrateData {review.Id} {review.ProductId} {review.ShopperId}");
                            Review newReview = await ConvertLegacyReview(review);
                            Review result = await this.NewReview(newReview, false);
                            if (result != null)
                            {
                                await this.DeleteLegacyReview(new[] { review.Id });
                            }
                            else
                            {
                                sb.AppendLine($"Did not save review {review.Id}");
                            }
                        }
                        catch (Exception ex)
                        {
                            sb.AppendLine($"Error saving review {review.Id} {ex.Message}");
                            _context.Vtex.Logger.Error("MigrateData", null, $"Error Saving {review.Id}", ex);
                        }
                    }
                }
                else
                {
                    sb.AppendLine("No reviews.");
                }
            }
            catch (Exception ex)
            {
                _context.Vtex.Logger.Error("MigrateData", null, "Error migrating data", ex);
                sb.AppendLine($"Error: {ex.Message}");
            }

            return sb.ToString();
        }

        public async Task<string> MigrateData(List<string> productIds)
        {
            StringBuilder sb = new StringBuilder();
            await this.VerifySchema();

            foreach (string productId in productIds)
            {
                IList<LegacyReview> reviews = await _productReviewRepository.GetProductReviewsAsync(productId);
                if (reviews != null && reviews.Count > 0)
                {
                    foreach (LegacyReview review in reviews)
                    {
                        try
                        {
                            sb.AppendLine($"MigrateData {review.Id} {review.ProductId} {review.ShopperId}");
                            Review newReview = await ConvertLegacyReview(review);
                            Review result = await this.NewReview(newReview, false);
                            if (result != null)
                            {
                                await this.DeleteLegacyReview(new[] { review.Id }, productId);
                            }
                            else
                            {
                                sb.AppendLine($"Did not save review {review.Id}");
                            }
                        }
                        catch(Exception ex)
                        {
                            _context.Vtex.Logger.Error("Error Migrating", null, 
                            "Error:", ex,
                            new[]
                            {
                                ( "review.Id", review.Id.ToString() ),
                                ( "review.ProductId", review.ProductId.ToString() ),
                                ( "review.ShopperId", review.ShopperId.ToString() ),
                            });

                            sb.AppendLine($"Error Migrating {review.Id} {review.ProductId} {review.ShopperId} : {ex.Message}");
                        }
                    }
                }
                else
                {
                    sb.AppendLine("No reviews.");
                }
            }

            return sb.ToString();
        }

        public async Task<ReviewsResponseWrapper> GetReviews()
        {
            return await _productReviewRepository.GetProductReviewsMD(string.Empty, null, null);
        }

        public async Task<ReviewsResponseWrapper> GetReviews(int from, int to)
        {
            return await _productReviewRepository.GetProductReviewsMD(string.Empty, from.ToString(), to.ToString());
        }

        public async Task<bool> DeleteReview(string[] ids)
        {
            bool retval = true;
            
            foreach (string id in ids)
            {
                retval &= await _productReviewRepository.DeleteProductReviewMD(id);
            }

            return retval;
        }

        private async Task<string> GetSortQuery(string orderBy)
        {
            string sort = string.Empty;
            if (!string.IsNullOrEmpty(orderBy))
            {
                string[] orderByArray = orderBy.Split(DELIMITER);
                PropertyInfo pi = typeof(Review).GetProperty(orderByArray[0]);
                if (pi != null)
                {
                    bool descendingOrder = true;
                    if (orderByArray.Length > 1)
                    {
                        if (orderByArray[1].ToLower().Contains("asc"))
                        {
                            descendingOrder = false;
                        }
                    }

                    string fieldName = Char.ToLowerInvariant(pi.Name[0]) + pi.Name.Substring(1);

                    sort = $"&_sort={fieldName}";

                    if (descendingOrder)
                    {
                        sort = $"{sort} DESC";
                    }
                    else
                    {
                        sort = $"{sort} ASC";
                    }
                }
            }

            return sort;
        }

        public async Task AddSearchDate()
        {
            var recordsToUpdate = await _productReviewRepository.GetProductReviewsMD("_where=searchDate is null", null, null);
            foreach (var review in recordsToUpdate.Reviews)
            {
                await _productReviewRepository.SaveProductReviewMD(review);
            }
        }

        public async Task<LegacyReview> NewReviewLegacy(LegacyReview review)
        {
            IDictionary<int, string> lookup = await _productReviewRepository.LoadLookupAsync();
            int maxKeyValue = 0;
            if (lookup != null)
            {
                maxKeyValue = lookup.Keys.Max();
                maxKeyValue++;
            }

            review.Id = maxKeyValue;

            IList<LegacyReview> reviews = await this._productReviewRepository.GetProductReviewsAsync(review.ProductId);
            if(reviews == null)
            {
                reviews = new List<LegacyReview>();
            }

            reviews.Add(review);
            await this._productReviewRepository.SaveProductReviewsAsync(review.ProductId, reviews);
            try
            {
                lookup.Add(review.Id, review.ProductId);
            }
            catch(Exception ex)
            {
                Console.WriteLine($"NewReviewLegacy {ex.Message}");
            }

            await _productReviewRepository.SaveLookupAsync(lookup);

            return review;
        }
    }
}
