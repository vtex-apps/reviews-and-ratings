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

        public async Task<bool> DeleteReview(string Id)
        {
            bool retval = false;
            string productId = await this.LookupProductById(Id);
            if (!string.IsNullOrEmpty(productId))
            {
                IList<Review> reviews = await this._productReviewRepository.GetProductReviewsAsync(productId);
                Review reviewToRemove = reviews.Where(r => r.Id == Id).FirstOrDefault();
                if (reviewToRemove != null && reviews.Remove(reviewToRemove))
                {
                    await this._productReviewRepository.SaveProductReviewsAsync(productId, reviews);
                    retval = true;
                }
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

        public async Task<Review> GetReview(string Id)
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
            IDictionary<string, string> lookup = await _productReviewRepository.LoadLookupAsync();
            List<string> productIds = lookup.Values.ToList();
            foreach(string productId in productIds)
            {
                IList<Review> returnedReviewList = await this.GetReviewsByProductId(productId);
                reviews.AddRange(returnedReviewList);
            }

            return reviews;
        }

        public async Task<IList<Review>> GetReviewsByProductId(string productId)
        {
            return await this._productReviewRepository.GetProductReviewsAsync(productId);
        }

        public async Task<Review> NewReview(Review review)
        {
            IList<Review> reviews = new List<Review> { review };
            string productId = review.ProductId;
            await this._productReviewRepository.SaveProductReviewsAsync(productId, reviews);
            return review;
        }

        private async Task<string> LookupProductById(string Id)
        {
            IDictionary<string, string> lookup = await _productReviewRepository.LoadLookupAsync();
            string productId = string.Empty;
            lookup.TryGetValue(Id, out productId);
            return productId;
        }
    }
}
