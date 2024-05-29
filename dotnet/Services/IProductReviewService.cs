﻿namespace ReviewsRatings.Services
{
    using Models;
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using System.Net;

    public interface IProductReviewService
    {
        Task<IList<Review>> GetReviewsByProductId(string productId, int offset, int limit, string orderBy);

        Task<IList<Review>> GetReviewsByProductId(string productId);

        Task<Review> GetReview(int Id);

        Task<IList<Review>> GetReviews();

        Task<IList<Review>> GetReviews(string searchTerm, int from, int to, string orderBy, string status);

        Task<decimal> GetAverageRatingByProductId(string productId);

        Task<Review> NewReview(Review review, bool doValidation);

        Task<Review> EditReview(Review review);

        Task<bool> DeleteReview(int[] ids);

        Task<HttpStatusCode> IsValidAuthUser();

        Task<HttpStatusCode> IsAdminAuthUser();

        Task<IList<Review>> GetReviewsByShopperId(string shopperId);

        Task ClearData();

        Task<bool> ModerateReview(int[] ids, bool approved);

        Task<bool> HasShopperReviewed(string shopperId, string productId);

        Task<AppSettings> GetAppSettings();

        Task<IList<Review>> FilterReviews(IList<Review> reviews, string searchTerm, string orderBy, string status);

        Task<IList<Review>> LimitReviews(IList<Review> reviews, int from, int to);

        Task<ValidatedUser> ValidateUserToken(string token);

        Task<bool> ValidateKeyAndToken(string key, string token, string baseUrl);

        Task<bool> ShopperHasPurchasedProduct(string shopperId, string productId);
    }
}
