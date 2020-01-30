namespace ReviewsRatings.Services
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Reflection;
    using System.Threading.Tasks;
    using Models;
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
                    Console.WriteLine($"    >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Unknown Product Id for {id}");
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

                    //Console.WriteLine($" >>>>>>>>>>>>>>>>>>>>>>>>>>>> Average Rating for {productId}: {averageRating} from {numberOfReviews} reviews.");
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
                //Console.WriteLine($"    >>>>>>>>>>>>>>>>>  Take {take} reviews {from}-{to}");
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

                //Console.WriteLine($"    >>>>>>>>>>>>>>>>>   {reviews.Count} reviews (unfiltered)");
                if (!string.IsNullOrEmpty(orderBy))
                {
                    //Console.WriteLine($"    >>>>>>>>>>>>>>>>>   Order By {orderBy}");
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
                    else
                    {
                        Console.WriteLine($"    >>>>>>>>>>>>>>>>>   Could not get {orderBy} property info.");
                    }
                }

                if (!string.IsNullOrEmpty(status))
                {
                    //Console.WriteLine($"------------||| Returning order with Approved status of {status} ||||----------------");
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
            //Console.WriteLine($"    >>>>>>>>>>>>>>>>>  GetReviewsByProductId: {productId}  offset:{offset} limit:{limit} orderBy:{orderBy}");
            IList<Review> reviews = await this._productReviewRepository.GetProductReviewsAsync(productId);
            if (reviews != null && reviews.Count > 0)
            {
                //Console.WriteLine($"    >>>>>>>>>>>>>>>>>   {reviews.Count} reviews for {productId} (unfiltered)");
                if (!string.IsNullOrEmpty(orderBy))
                {
                    Console.WriteLine($"    >>>>>>>>>>>>>>>>>   Order By {orderBy}");
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
                    else
                    {
                        Console.WriteLine($"    >>>>>>>>>>>>>>>>>   Could not get {orderBy} property info.");
                    }
                }

                reviews = reviews.Skip(offset).Take(limit).ToList();
                Console.WriteLine($"    >>>>>>>>>>>>>>>>>   {reviews.Count} reviews for {productId} (filtered)");
            }
            else
            {
                reviews = new List<Review>();
            }

            return reviews;
        }

        public async Task<Review> NewReview(Review review)
        {
            if (review != null)
            {
                IDictionary<int, string> lookup = await _productReviewRepository.LoadLookupAsync();

                // Console.WriteLine($"    >>>>>>>>>>>>>>>>>   ID:{review.Id}  Exists?{lookup.ContainsKey(review.Id)}");

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
                //if(string.IsNullOrWhiteSpace(review.ReviewerName))
                //{
                //    review.ReviewerName = string.Empty;
                //    //review.ReviewerName = "anon";
                //}

                if (string.IsNullOrWhiteSpace(review.ReviewDateTime))
                {
                    review.ReviewDateTime = DateTime.Now.ToString();
                }

                //if (string.IsNullOrWhiteSpace(review.Sku))
                //{
                //    review.Sku = string.Empty;
                //}

                string productId = review.ProductId;

                IList<Review> reviews = await this._productReviewRepository.GetProductReviewsAsync(productId);
                if (reviews == null)
                {
                    reviews = new List<Review>();
                }

                reviews.Add(review);

                Console.WriteLine($"    >>>>>>>>>>>>>>>>>   Saving [{review.Id}] {productId}");

                await this._productReviewRepository.SaveProductReviewsAsync(productId, reviews);

                lookup.Add(review.Id, review.ProductId);
                await this._productReviewRepository.SaveLookupAsync(lookup);
            }
            else
            {
                Console.WriteLine("-!-!- New Review - Null review.");
            }

            return review;
        }

        public async Task<IList<Review>> GetReviewsByShopperId(string shopperId)
        {
            Console.WriteLine($"    >>>>>>>>>>>>>>>>>   GetReviewsByShopperId {shopperId}");
            //IList<Review> reviews = await this.GetReviews(0, maximumReturnedRecords, string.Empty);
            IList<Review> reviews = await this.GetReviews();
            Console.WriteLine($"    >>>>>>>>>>>>>>>>>   GetReviewsByShopperId {shopperId} - {reviews.Count} total reviews");
            reviews = reviews.Where(r => r.ShopperId == shopperId).ToList();
            Console.WriteLine($"    >>>>>>>>>>>>>>>>>   {reviews.Count} reviews for {shopperId}");

            return reviews;
        }

        public async Task ClearData()
        {
            Console.WriteLine("------------------------------------------------------------------------");
            IDictionary<int, string> lookup = await _productReviewRepository.LoadLookupAsync();
            if (lookup != null)
            {
                List<string> productIds = lookup.Values.Distinct().ToList();
                Console.WriteLine($"    >>>>>>>>>>>>>>>>>>>>>>  productIds {productIds.Count}");
                foreach (string productId in productIds)
                {
                    Console.WriteLine($"    >>>>>>>>>>>>>>>>>>>>>>  Deleting reviews for {productId}");
                    await this._productReviewRepository.SaveProductReviewsAsync(productId, null);
                }
            }

            Console.WriteLine("     >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  Deleting lookup.");
            await _productReviewRepository.SaveLookupAsync(null);
            Console.WriteLine("------------------------------------------------------------------------");
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
                    Console.WriteLine($"    >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Unknown Product Id for {id}");
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
    }
}
