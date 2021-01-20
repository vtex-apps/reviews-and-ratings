﻿namespace ReviewsRatings.DataSources
{
    using System.Collections.Generic;
    using Models;
    using System.Threading.Tasks;

    public interface IProductReviewRepository
    {
        Task<IList<Review>> GetProductReviewsAsync(string productId);

        Task SaveProductReviewsAsync(string productId, IList<Review> productReviews);

        Task<IDictionary<int, string>> LoadLookupAsync();

        Task SaveLookupAsync(IDictionary<int, string> lookupDictionary);

        Task<ValidatedUser> ValidateUserToken(string token);

        Task<bool> ValidateKeyAndToken(string key, string token, string baseUrl);

        Task<VtexOrder> GetOrderInformation(string orderId);

        Task<VtexOrderList> ListOrders(string queryString);
    }
}
