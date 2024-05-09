﻿namespace ReviewsRatings.Services
{
    using Models;
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using System.Net;

    public interface IProductReviewService
    {
        Task<ReviewsResponseWrapper> GetReviewsByProductId(string productId, int from, int to, string orderBy, string searchTerm, int rating, string locale, bool pastReviews);

        Task<ReviewsResponseWrapper> GetReviewsByProductId(string productId);

        Task<Review> GetReview(string Id);

        Task<ReviewsResponseWrapper> GetReviews();
        Task<ReviewsResponseWrapper> GetReviews(int from, int to);

        Task<ReviewsResponseWrapper> GetReviews(string searchTerm, int from, int to, string orderBy, string status);

        Task<AverageCount> GetAverageRatingByProductId(string productId);

        Task<Review> NewReview(Review review, bool doValidation);

        Task<Review> EditReview(Review review);

        Task<bool> DeleteReview(string[] ids);

        Task<HttpStatusCode> IsValidAuthUser();

        Task<HttpStatusCode> IsAdminAuthUser();

        Task<ReviewsResponseWrapper> GetReviewsByShopperId(string shopperId);

        Task<ReviewsResponseWrapper> GetReviewsByreviewDateTime(string reviewDateTime);

        Task<ReviewsResponseWrapper> GetReviewsByDateRange(string fromDate, string toDate);

        Task ClearData();

        Task<bool> ModerateReview(string[] ids, bool approved);

        Task<bool> HasShopperReviewed(string shopperId, string productId);

        Task<AppSettings> GetAppSettings();

        Task<IList<Review>> FilterReviews(IList<Review> reviews, string searchTerm, string orderBy, string status);

        Task<IList<Review>> LimitReviews(IList<Review> reviews, int from, int to);

        Task<ValidatedUser> ValidateUserToken(string token);

        Task<bool> ValidateKeyAndToken(string key, string token, string baseUrl);

        Task<bool> ShopperHasPurchasedProduct(string shopperId, string productId);

        Task<string> VerifySchema();

        Task<string> VerifyMigration();

        Task<string> SuccessfulMigration();

        Task<string> MigrateData();
        Task<string> MigrateData(List<string> productIds);

        Task AddSearchDate();

        Task<LegacyReview> NewReviewLegacy(LegacyReview review);
    }
}
