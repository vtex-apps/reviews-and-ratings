namespace ReviewsRatings.Services
{
    using Models;
    using System.Collections.Generic;
    using System.Threading.Tasks;

    public interface IProductReviewService
    {
        Task<IList<Review>> GetReviewsByProductId(string productId, int offset, int limit, string orderBy);

        Task<IList<Review>> GetReviewsByProductId(string productId);

        Task<Review> GetReview(int Id);

        Task<IList<Review>> GetReviews(int offset, int limit, string orderBy);

        Task<decimal> GetAverageRatingByProductId(string productId);

        Task<Review> NewReview(Review review);

        Task<Review> EditReview(Review review);

        Task<bool> DeleteReview(int Id);

        Task<IList<Review>> GetReviewsByShopperId(string shopperId, int offset, int limit, string orderBy);

        Task ClearData();

        Task<bool> ModerateReview(int[] ids, bool approved);

        Task<bool> HasShopperReviewed(string shopperId, string productId);

        Task<AppSettings> GetAppSettings();

        Task SaveAppSettings(AppSettings appSettings);
    }
}
