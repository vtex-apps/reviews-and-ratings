namespace ReviewsRatings.Services
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Reflection;
    using System.Text;
    using System.Threading.Tasks;
    using Models;
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

        public async Task<bool> DeleteLegacyReview(int[] ids)
        {
            bool retval = true;
            IDictionary<int, string> lookup = await _productReviewRepository.LoadLookupAsync();
            string productId = string.Empty;
            foreach (int id in ids)
            {
                if (lookup.TryGetValue(id, out productId))
                {
                    IList<LegacyReview> reviews = await this._productReviewRepository.GetProductReviewsAsync(productId);
                    LegacyReview reviewToRemove = reviews.Where(r => r.Id == id).FirstOrDefault();
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
                lookup.Remove(id);
            }

            await _productReviewRepository.SaveLookupAsync(lookup);

            return retval;
        }

        public async Task<Review> EditReview(Review review)
        {
            IList<Review> reviews = await _productReviewRepository.GetProductReviewsMD($"id={review.Id}");
            Review oldReview = reviews.FirstOrDefault();

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
            review.VerifiedPurchaser = review.VerifiedPurchaser ?? oldReview.VerifiedPurchaser;

            bool success = await this._productReviewRepository.SaveProductReviewMD(review);
            if (!success)
                review = null;

            return review;
        }

        public async Task<decimal> GetAverageRatingByProductId(string productId)
        {
            string searchQuery = $"productId={productId}";
            decimal averageRating = 0m;
            AppSettings settings = await GetAppSettings();
            if (settings.RequireApproval)
            {
                searchQuery = $"{searchQuery}&approved=true";
            }

            IList<Review> reviews = await this._productReviewRepository.GetProductReviewsMD(searchQuery);
            if (reviews != null)
            {
                int numberOfReviews = reviews.Count;
                if (numberOfReviews > 0)
                {
                    decimal totalRating = reviews.Sum(r => r.Rating ?? 0);
                    averageRating = totalRating / numberOfReviews;
                }
            }

            return decimal.Round(averageRating, 2, MidpointRounding.AwayFromZero);
        }

        public async Task<Review> GetReview(int Id)
        {
            Review review = null;
            IList<Review> reviews = await this._productReviewRepository.GetProductReviewsMD($"id={Id}");
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
                int maxProducts = maximumReturnedRecords;
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

                    //if (productsCounter > maxProducts)
                    //{
                    //    break;
                    //}
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
        public async Task<IList<Review>> GetReviews(string searchTerm, int from, int to, string orderBy, string status)
        {
            IList<Review> reviews = await GetReviews();
            reviews = await FilterReviews(reviews, searchTerm, orderBy, status);
            reviews = await LimitReviews(reviews, from, to);
            return reviews;
        }

        public async Task<IList<Review>> GetReviewsByProductId(string productId)
        {
            return await this.GetReviewsByProductId(productId, 0, maximumReturnedRecords, string.Empty);
        }

        public async Task<IList<Review>> GetReviewsByProductId(string productId, int offset, int limit, string orderBy)
        {
            if(limit == 0)
            {
                limit = maximumReturnedRecords;
            }

            limit = Math.Min(limit, maximumReturnedRecords);
            IList<Review> reviews = await this._productReviewRepository.GetProductReviewsMD($"productId={productId}");
            if (reviews != null && reviews.Count > 0)
            {
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
                            reviews = reviews.OrderByDescending(x => pi.GetValue(x, null)).ToList();
                        }
                        else
                        {
                            reviews = reviews.OrderBy(x => pi.GetValue(x, null)).ToList();
                        }
                    }
                }

                reviews = reviews.Skip(offset).Take(limit).ToList();
            }
            else
            {
                reviews = new List<Review>();
            }

            return reviews;
        }

        public async Task<Review> NewReview(Review review, bool doValidation)
        {
            bool success = false;
            if (review != null)
            {
                if (doValidation)
                {
                    bool userValidated = false;
                    bool hasShopperReviewed = false;
                    bool hasShopperPurchased = false;
                    string userId = string.Empty;
                    ValidatedUser validatedUser = null;
                    try
                    {
                        validatedUser = await this.ValidateUserToken(_context.Vtex.StoreUserAuthToken);
                    }
                    catch (Exception ex)
                    {
                        _context.Vtex.Logger.Error("NewReview", null, "Error Validating User", ex);
                    }

                    if (validatedUser != null)
                    {
                        if (validatedUser.AuthStatus.Equals("Success"))
                        {
                            userValidated = true;
                        }
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

                //IDictionary<int, string> lookup = await _productReviewRepository.LoadLookupAsync();

                //int maxKeyValue = 0;
                //if (lookup != null && lookup.Count > 0)
                //{
                //    maxKeyValue = lookup.Keys.Max();
                //}
                //else
                //{
                //    lookup = new Dictionary<int, string>();
                //}

                //review.Id = ++maxKeyValue;
                //review.CacheId = review.Id;

                if (string.IsNullOrWhiteSpace(review.ReviewDateTime))
                {
                    // TODO: Check timezone for store
                    review.ReviewDateTime = DateTime.Now.ToString();
                }

                //string productId = review.ProductId;

                //IList<Review> reviews = await this._productReviewRepository.GetProductReviewsAsync(productId);
                //if (reviews == null)
                //{
                //    reviews = new List<Review>();
                //}

                //reviews.Add(review);
                //await this._productReviewRepository.SaveProductReviewsAsync(productId, reviews);
                //lookup.Add(review.Id, review.ProductId);
                //await this._productReviewRepository.SaveLookupAsync(lookup);

                success = await _productReviewRepository.SaveProductReviewMD(review);
                if (!success)
                    review = null;
            }

            return review;
        }

        public async Task<IList<Review>> GetReviewsByShopperId(string shopperId)
        {
            IList<Review> reviews = await this.GetReviews();
            reviews = reviews.Where(r => r.ShopperId == shopperId).ToList();

            return reviews;
        }

        public async Task ClearData()
        {
            IDictionary<int, string> lookup = await _productReviewRepository.LoadLookupAsync();
            if (lookup != null)
            {
                Console.WriteLine($"lookup =  {lookup.Count}");
                List<string> productIds = lookup.Values.Distinct().ToList();
                foreach (string productId in productIds)
                {
                    Console.WriteLine($"Removing {productId}");
                    await this._productReviewRepository.SaveProductReviewsAsync(productId, null);
                }
            }
            else
            {
                Console.WriteLine("Lookup Null!");
            }

            await _productReviewRepository.SaveLookupAsync(null);
        }

        private async Task<string> LookupProductById(int Id)
        {
            IDictionary<int, string> lookup = await _productReviewRepository.LoadLookupAsync();
            string productId = string.Empty;
            lookup.TryGetValue(Id, out productId);
            return productId;
        }

        private async Task<int> GetNewId()
        {
            IDictionary<int, string> lookup = await _productReviewRepository.LoadLookupAsync();
            int maxKeyValue = 0;
            if (lookup != null)
            {
                maxKeyValue = lookup.Keys.Max();
            }

            return ++maxKeyValue;
        }

        public async Task<bool> ModerateReview(string[] ids, bool approved)
        {
            bool retval = true;
            IDictionary<int, string> lookup = await _productReviewRepository.LoadLookupAsync();
            foreach (string id in ids)
            {
                IList<Review> reviews = await this._productReviewRepository.GetProductReviewsMD($"id={id}");
                Review reviewToModerate = reviews.Where(r => r.Id == id).FirstOrDefault();
                if (reviewToModerate != null)
                {
                    reviewToModerate.Approved = approved;
                    retval &= await this._productReviewRepository.SaveProductReviewMD(reviewToModerate);
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
            try
            {
                IList<Review> reviews = await this._productReviewRepository.GetProductReviewsMD($"shopperId={shopperId}&productId={productId}");
                if (reviews != null && reviews.Count > 0)
                {
                    retval = true;
                }
            }
            catch(Exception ex)
            {
                _context.Vtex.Logger.Error("HasShopperReviewed", null, "Request Error", ex);
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
                _context.Vtex.Logger.Error("ShopperHasPurchasedProduct", null, "Request Error", ex);
            }

            return hasPurchased;
        }

        public async Task<bool> VerifySchema()
        {
            return await _productReviewRepository.VerifySchema();
        }

        private async Task<Review> ConvertLegacyReview(LegacyReview review)
        {
            Review newReview = new Review
            {
                Approved = review.Approved,
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
                VerifiedPurchaser = review.VerifiedPurchaser
            };

            return newReview;
        }

        public async Task<string> MigrateData()
        {
            StringBuilder sb = new StringBuilder();

            await this.VerifySchema();
            IList<LegacyReview> reviews = await this.GetLegacyReviews();
            if(reviews != null && reviews.Count > 0)
            {
                foreach(LegacyReview review in reviews)
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
            }
            else
            {
                sb.AppendLine("No reviews.");
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
                }
                else
                {
                    sb.AppendLine("No reviews.");
                }
            }

            return sb.ToString();
        }

        public async Task<IList<Review>> GetReviews()
        {
            return await _productReviewRepository.GetProductReviewsMD(string.Empty);
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
    }
}
