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
        private const int maximumReturnedRecords = 99;

        public ProductReviewService(IProductReviewRepository productReviewRepository)
        {
            this._productReviewRepository = productReviewRepository ??
                                            throw new ArgumentNullException(nameof(productReviewRepository));
        }

        public async Task<bool> DeleteReview(int Id)
        {
            Console.WriteLine($"    >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Deleting {Id}");

            bool retval = false;
            IDictionary<int, string> lookup = await _productReviewRepository.LoadLookupAsync();
            string productId = string.Empty;
            lookup.TryGetValue(Id, out productId);
            if (!string.IsNullOrEmpty(productId))
            {
                IList<Review> reviews = await this._productReviewRepository.GetProductReviewsAsync(productId);
                Review reviewToRemove = reviews.Where(r => r.Id == Id).FirstOrDefault();
                if (reviewToRemove != null && reviews.Remove(reviewToRemove))
                {
                    await this._productReviewRepository.SaveProductReviewsAsync(productId, reviews);
                    retval = true;
                }

                // also remove the reference to the review from the loopup
                //lookup.Remove(Id);
                //await _productReviewRepository.SaveLookupAsync(lookup);
            }
            else
            {
                Console.WriteLine($"    >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Unknown Product Id for {Id}");
            }

            // also remove the reference to the review from the loopup
            lookup.Remove(Id);
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
            int numberOfReviews = reviews.Count;
            if (numberOfReviews > 0)
            {
                int totalRating = reviews.Sum(r => r.Rating);
                averageRating = totalRating / numberOfReviews;

                Console.WriteLine($" >>>>>>>>>>>>>>>>>>>>>>>>>>>> Average Rating for {productId}: {averageRating} from {numberOfReviews} reviews.");
            }

            return averageRating;
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

        public async Task<IList<Review>> GetReviews(int offset, int limit, string orderBy)
        {
            Console.WriteLine($"    >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> GetReviews ");

            List<Review> reviews = new List<Review>();
            IDictionary<int, string> lookup = await _productReviewRepository.LoadLookupAsync();
            if (lookup != null)
            {
                List<string> productIds = lookup.Values.Distinct().ToList();
                Console.WriteLine($"    >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> GetReviews Prod Id #{productIds.Count}");
                foreach (string productId in productIds)
                {
                    Console.WriteLine($"    >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> GetReviews Prod {productId}");
                    // Get all results - sort/limit later
                    IList<Review> returnedReviewList = await this.GetReviewsByProductId(productId, 0, maximumReturnedRecords, string.Empty);
                    reviews.AddRange(returnedReviewList);
                }
            }

            if (reviews != null && reviews.Count > 0)
            {
                //Console.WriteLine($"    >>>>>>>>>>>>>>>>>   {reviews.Count} reviews (unfiltered)");
                if (!string.IsNullOrEmpty(orderBy))
                {
                    //Console.WriteLine($"    >>>>>>>>>>>>>>>>>   Order By {orderBy}");
                    string[] orderByArray = orderBy.Split(":");
                    PropertyInfo pi = typeof(Review).GetProperty(orderByArray[0]);
                    if (pi != null)
                    {
                        bool descendingOrder = false;
                        if (orderByArray.Length > 1)
                        {
                            if (orderByArray[1].ToLower().Contains("desc"))
                            {
                                descendingOrder = true;
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
                        //Console.WriteLine($"    >>>>>>>>>>>>>>>>>   Could not get {orderBy} property info.");
                    }
                }

                reviews = reviews.Skip(offset).Take(limit).ToList();
                //Console.WriteLine($"    >>>>>>>>>>>>>>>>>   {reviews.Count} reviews (filtered)");
            }

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
            Console.WriteLine($"    >>>>>>>>>>>>>>>>>  GetReviewsByProductId: {productId}  offset:{offset} limit:{limit} orderBy:{orderBy}");
            IList<Review> reviews = await this._productReviewRepository.GetProductReviewsAsync(productId);
            if (reviews != null && reviews.Count > 0)
            {
                Console.WriteLine($"    >>>>>>>>>>>>>>>>>   {reviews.Count} reviews (unfiltered)");
                if (!string.IsNullOrEmpty(orderBy))
                {
                    Console.WriteLine($"    >>>>>>>>>>>>>>>>>   Order By {orderBy}");
                    string[] orderByArray = orderBy.Split(":");
                    PropertyInfo pi = typeof(Review).GetProperty(orderByArray[0]);
                    if (pi != null)
                    {
                        bool descendingOrder = false;
                        if (orderByArray.Length > 1)
                        {
                            if(orderByArray[1].ToLower().Contains("desc"))
                            {
                                descendingOrder = true;
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
                Console.WriteLine($"    >>>>>>>>>>>>>>>>>   {reviews.Count} reviews (filtered)");
            }

            return reviews;
        }

        public async Task<Review> NewReview(Review review)
        {
            IDictionary<int, string> lookup = await _productReviewRepository.LoadLookupAsync();

            Console.WriteLine($"    >>>>>>>>>>>>>>>>>   ID:{review.Id}  Exists?{lookup.ContainsKey(review.Id)}");

            int maxKeyValue = 0;
            if (lookup != null)
            {
                maxKeyValue = lookup.Keys.Max();
            }
            else
            {
                lookup = new Dictionary<int, string>();
            }

            review.Id = ++maxKeyValue;
            review.CacheId = review.Id;
            if(string.IsNullOrWhiteSpace(review.ReviewerName))
            {
                review.ReviewerName = string.Empty;
                //review.ReviewerName = "anon";
            }

            if (string.IsNullOrWhiteSpace(review.ReviewDateTime))
            {
                review.ReviewDateTime = DateTime.Now.ToString();
            }

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

            return review;
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
    }
}
