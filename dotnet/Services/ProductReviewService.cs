namespace ReviewsRatings.Services
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Reflection;
    using System.Threading.Tasks;
    using Models;
    using Newtonsoft.Json;
    using ReviewsRatings.DataSources;

    /// <summary>
    /// Business logic 
    /// </summary>
    public class ProductReviewService : IProductReviewService
    {
        private readonly IProductReviewRepository _productReviewRepository;
        private readonly IAppSettingsRepository _appSettingsRepository;
        private const int maximumReturnedRecords = 999;
        private const string DELIMITER = ":";

        public ProductReviewService(IProductReviewRepository productReviewRepository, IAppSettingsRepository appSettingsRepository)
        {
            this._productReviewRepository = productReviewRepository ??
                                            throw new ArgumentNullException(nameof(productReviewRepository));
            this._appSettingsRepository = appSettingsRepository ??
                                            throw new ArgumentNullException(nameof(appSettingsRepository));
        }

        public async Task<bool> DeleteReview(int[] ids)
        {
            bool retval = true;
            IDictionary<int, string> lookup = await _productReviewRepository.LoadLookupAsync();
            string productId = string.Empty;
            foreach (int id in ids)
            {
                if (lookup.TryGetValue(id, out productId))
                {
                    IList<Review> reviews = await this._productReviewRepository.GetProductReviewsAsync(productId);
                    Review reviewToRemove = reviews.Where(r => r.Id == id).FirstOrDefault();
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
            string productId = await this.LookupProductById(review.Id);
            if (!string.IsNullOrEmpty(productId))
            {
                IList<Review> reviews = await this._productReviewRepository.GetProductReviewsAsync(productId);
                // Remove the old version
                Review reviewToRemove = reviews.Where(r => r.Id == review.Id).FirstOrDefault();
                if (reviewToRemove != null && reviews.Remove(reviewToRemove))
                {
                    // Add and save the new version
                    reviews.Add(review);
                    await this._productReviewRepository.SaveProductReviewsAsync(productId, reviews);
                }
            }

            return review;
        }

        public async Task<decimal> GetAverageRatingByProductId(string productId)
        {
            decimal averageRating = 0m;
            IList<Review> reviews = await this._productReviewRepository.GetProductReviewsAsync(productId);
            if (reviews != null)
            {
                AppSettings settings = await GetAppSettings();
                if(settings.RequireApproval)
                {
                    reviews = reviews.Where(x => x.Approved).ToList();
                }

                int numberOfReviews = reviews.Count;
                if (numberOfReviews > 0)
                {
                    decimal totalRating = reviews.Sum(r => r.Rating);
                    averageRating = totalRating / numberOfReviews;
                }
            }

            return decimal.Round(averageRating, 2, MidpointRounding.AwayFromZero);
        }

        public async Task<Review> GetReview(int Id)
        {
            Review review = null;
            string productId = await this.LookupProductById(Id);
            if (!string.IsNullOrEmpty(productId))
            {
                IList<Review> reviews = await this._productReviewRepository.GetProductReviewsAsync(productId);
                review = reviews.Where(r => r.Id == Id).FirstOrDefault();
            }

            return review;
        }

        public async Task<IList<Review>> GetReviews()
        {
            List<Review> reviews = new List<Review>();
            IDictionary<int, string> lookup = await _productReviewRepository.LoadLookupAsync();
            if (lookup != null)
            {
                List<string> productIds = lookup.Values.Distinct().ToList();
                foreach (string productId in productIds)
                {
                    // Get all results - sort/limit later
                    IList<Review> returnedReviewList = await this.GetReviewsByProductId(productId, 0, maximumReturnedRecords, string.Empty);
                    reviews.AddRange(returnedReviewList);
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
                    reviews = reviews.Where(x => x.Approved.Equals(Boolean.Parse(status))).ToList();
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
            IList<Review> reviews = await this._productReviewRepository.GetProductReviewsAsync(productId);
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

        public async Task<Review> NewReview(Review review)
        {
            // TODO: Check if user has already submitted a review for this product
            if (review != null)
            {
                IDictionary<int, string> lookup = await _productReviewRepository.LoadLookupAsync();

                int maxKeyValue = 0;
                if (lookup != null && lookup.Count > 0)
                {
                    maxKeyValue = lookup.Keys.Max();
                }
                else
                {
                    lookup = new Dictionary<int, string>();
                }

                review.Id = ++maxKeyValue;
                review.CacheId = review.Id;

                if (string.IsNullOrWhiteSpace(review.ReviewDateTime))
                {
                    // TODO: Check timezone for store
                    review.ReviewDateTime = DateTime.Now.ToString();
                }

                string productId = review.ProductId;

                IList<Review> reviews = await this._productReviewRepository.GetProductReviewsAsync(productId);
                if (reviews == null)
                {
                    reviews = new List<Review>();
                }

                reviews.Add(review);
                await this._productReviewRepository.SaveProductReviewsAsync(productId, reviews);
                lookup.Add(review.Id, review.ProductId);
                await this._productReviewRepository.SaveLookupAsync(lookup);
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
                List<string> productIds = lookup.Values.Distinct().ToList();
                foreach (string productId in productIds)
                {
                    await this._productReviewRepository.SaveProductReviewsAsync(productId, null);
                }
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

        public async Task<bool> ModerateReview(int[] ids, bool approved)
        {
            bool retval = true;
            IDictionary<int, string> lookup = await _productReviewRepository.LoadLookupAsync();
            string productId = string.Empty;
            foreach (int id in ids)
            {
                lookup.TryGetValue(id, out productId);
                if (!string.IsNullOrEmpty(productId))
                {
                    IList<Review> reviews = await this._productReviewRepository.GetProductReviewsAsync(productId);
                    Review reviewToModerate = reviews.Where(r => r.Id == id).FirstOrDefault();
                    if (reviewToModerate != null)
                    {
                        reviewToModerate.Approved = approved;
                        await this._productReviewRepository.SaveProductReviewsAsync(productId, reviews);
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
            IList<Review> reviews = await this._productReviewRepository.GetProductReviewsAsync(productId);
            if (reviews != null && reviews.Count > 0)
            {
                reviews = reviews.Where(r => r.ShopperId == shopperId).ToList();
                if (reviews != null && reviews.Count > 0)
                {
                    retval = true;
                }
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
            VtexOrderList vtexOrderList = await this._productReviewRepository.ListOrders($"q={shopperId}");
            var orderIds = vtexOrderList.List.Select(o => o.OrderId);
            foreach(string orderId in orderIds)
            {
                VtexOrder vtexOrder = await this._productReviewRepository.GetOrderInformation(orderId);
                var productIds = vtexOrder.Items.Select(i => i.ProductId);
                hasPurchased = productIds.Contains(productId);
                if(hasPurchased)
                {
                    break;
                }
            }

            return hasPurchased;
        }
    }
}
