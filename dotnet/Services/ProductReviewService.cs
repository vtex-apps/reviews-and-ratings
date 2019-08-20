namespace ReviewsRatings.Services
{
    using System;
    using System.Collections.Generic;
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

        public bool DeleteReview(string Id)
        {
            throw new NotImplementedException();
        }

        public Review EditReview(Review review)
        {
            throw new NotImplementedException();
        }

        public decimal GetAverageRatingByProductId(string productId)
        {
            throw new NotImplementedException();
        }

        public Review GetReview(string Id)
        {
            throw new NotImplementedException();
        }

        public IList<Review> GetReviews()
        {
            throw new NotImplementedException();
        }

        public IList<Review> GetReviewsByProductId(string productId)
        {
            throw new NotImplementedException();
        }

        public Review NewReview(Review review)
        {
            throw new NotImplementedException();
        }
    }
}
