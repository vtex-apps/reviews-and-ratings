namespace ReviewsRatings.Services
{
    using Models;
    using System.Collections.Generic;
    using System.Threading.Tasks;

    public interface IProductReviewService
    {
        Task<IList<Review>> GetReviewsByProductId(string productId);

        Task<Review> GetReview(int Id);

        Task<IList<Review>> GetReviews();

        Task<decimal> GetAverageRatingByProductId(string productId);

        Task<Review> NewReview(Review review);

        Task<Review> EditReview(Review review);

        Task<bool> DeleteReview(int Id);
    }
}
