namespace ReviewsRatings.Services
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using Models;
    using ReviewsRatings.DataSources;

    /// <summary>
    /// Business logic 
    /// </summary>
    public class ProductReviewService : IProductReviewService
    {
        private readonly IProductReviewRepository _productReviewRepository;

        public ProductReviewService(IProductReviewRepository productReviewRepository)
        {
            this._productReviewRepository = productReviewRepository ??
                                            throw new ArgumentNullException(nameof(productReviewRepository));
        }

        public async Task<bool> DeleteReview(int Id)
        {
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
                lookup.Remove(Id);
                await _productReviewRepository.SaveLookupAsync(lookup);
            }

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

        public async Task<IList<Review>> GetReviews()
        {
            List<Review> reviews = new List<Review>();
            IDictionary<int, string> lookup = await _productReviewRepository.LoadLookupAsync();
            if (lookup != null)
            {
                List<string> productIds = lookup.Values.ToList();
                foreach (string productId in productIds)
                {
                    IList<Review> returnedReviewList = await this.GetReviewsByProductId(productId);
                    reviews.AddRange(returnedReviewList);
                }
            }

            return reviews;
        }

        public async Task<IList<Review>> GetReviewsByProductId(string productId)
        {
            return await this._productReviewRepository.GetProductReviewsAsync(productId);
        }

        public async Task<Review> NewReview(Review review)
        {
            IDictionary<int, string> lookup = await _productReviewRepository.LoadLookupAsync();
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

            if (review.ReviewDateTime == null)
            {
                review.ReviewDateTime = DateTime.Now.ToString();
            }

            IList<Review> reviews = new List<Review> { review };
            string productId = review.ProductId;
            await this._productReviewRepository.SaveProductReviewsAsync(productId, reviews);

            lookup.Add(review.Id, review.ProductId);
            await this._productReviewRepository.SaveLookupAsync(lookup);

            return review;
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
