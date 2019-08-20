namespace ReviewsRatings.Services
{
    using Models;
    using System.Collections.Generic;

    public interface IProductReviewService
    {
        IList<Review> GetReviewsByProductId(string productId);

        Review GetReview(string Id);

        IList<Review> GetReviews();

        decimal GetAverageRatingByProductId(string productId);

        Review NewReview(Review review);

        Review EditReview(Review review);

        bool DeleteReview(string Id);
    }
}
