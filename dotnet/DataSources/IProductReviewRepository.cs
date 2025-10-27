namespace ReviewsRatings.DataSources
{
    using System.Collections.Generic;
    using Models;
    using System.Threading.Tasks;

    public interface IProductReviewRepository
    {
        Task<IList<LegacyReview>> GetProductReviewsAsync(string productId);

        Task SaveProductReviewsAsync(string productId, IList<LegacyReview> productReviews);

        Task<IDictionary<int, string>> LoadLookupAsync();

        Task SaveLookupAsync(IDictionary<int, string> lookupDictionary);

        Task<ValidatedUser> ValidateUserToken(string token);

        Task<bool> ValidateLicenseManagerAccess(string userId);

        Task<VtexOrder> GetOrderInformation(string orderId);

        Task<VtexOrderList> ListOrders(string queryString);

        Task<string> VerifySchema();
        Task<string> VerifyMigration();
        Task<string> SuccessfulMigration();
        Task<ReviewsResponseWrapper> GetProductReviewsMD(string searchQuery, string from, string to);

        Task<ReviewsResponseWrapper> GetRangeReviewsMD(string fromDate, string toDate);
        
        Task<bool> DeleteProductReviewMD(string documentId);
        Task<string> SaveProductReviewMD(Review review);
    }
}
