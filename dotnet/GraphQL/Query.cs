using GraphQL;
using GraphQL.Types;
using ReviewsRatings.GraphQL.Types;
using ReviewsRatings.Models;
using ReviewsRatings.Services;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace ReviewsRatings.GraphQL
{
    [GraphQLMetadata("Query")]
    public class Query : ObjectGraphType<object>
    {
        public Query(IProductReviewService productReviewService)
        {
            Name = "Query";

            FieldAsync<ReviewType>(
                "review",
                arguments: new QueryArguments(
                    new QueryArgument<NonNullGraphType<IdGraphType>> { Name = "id", Description = "id of the review" }
                ),
                resolve: async context =>
                {
                    Review review = await productReviewService.GetReview(context.GetArgument<int>("id"));
                    if (review != null && await productReviewService.IsAdminAuthUser() != HttpStatusCode.OK)
                    {
                        AppSettings appSettings = await productReviewService.GetAppSettings();
                        if (appSettings.RequireApproval && !review.Approved)
                        {
                            return null;
                        }

                        review.ShopperId = null;
                    }

                    return review;
                }
            );

            /// query Reviews($searchTerm: String, $from: Int, $to: Int, $orderBy: String, $status: Boolean)
            FieldAsync<SearchResponseType>(
                "reviews",
                arguments: new QueryArguments(
                    new QueryArgument<StringGraphType> { Name = "searchTerm", Description = "Search term" },
                    new QueryArgument<IntGraphType> { Name = "from", Description = "From" },
                    new QueryArgument<IntGraphType> { Name = "to", Description = "To" },
                    new QueryArgument<StringGraphType> { Name = "orderBy", Description = "Order by" },
                    new QueryArgument<StringGraphType> { Name = "status", Description = "Status" }
                ),
                resolve: async context =>
                {
                    string searchTerm = context.GetArgument<string>("searchTerm");
                    int from = context.GetArgument<int>("from");
                    int to = context.GetArgument<int>("to");
                    string orderBy = context.GetArgument<string>("orderBy");
                    string status = context.GetArgument<string>("status");
                    IList<Review> searchResult = await productReviewService.GetReviews();
                    status = await RestrictForNonAdmin(productReviewService, searchResult, status);
                    IList<Review> searchData = await productReviewService.FilterReviews(searchResult, searchTerm, orderBy, status);
                    int totalCount = searchData.Count;
                    searchData = await productReviewService.LimitReviews(searchData, from, to);
                    Console.WriteLine($"totalCount = {totalCount} : Filtered to {searchData.Count}");
                    SearchResponse searchResponse = new SearchResponse
                    {
                        Data = new DataElement { data = searchData },
                        Range = new SearchRange { From = from, To = to, Total = totalCount }
                    };

                    return searchResponse;
                }
            );

            FieldAsync<SearchResponseType>(
                "reviewsByProductId",
                arguments: new QueryArguments(
                    new QueryArgument<NonNullGraphType<StringGraphType>> { Name = "productId", Description = "Product Id" },
                    new QueryArgument<StringGraphType> { Name = "searchTerm", Description = "Search term" },
                    new QueryArgument<IntGraphType> { Name = "from", Description = "From" },
                    new QueryArgument<IntGraphType> { Name = "to", Description = "To" },
                    new QueryArgument<StringGraphType> { Name = "orderBy", Description = "Order by" },
                    new QueryArgument<StringGraphType> { Name = "status", Description = "Status" }
                ),
                resolve: async context =>
                {
                    string productId = context.GetArgument<string>("productId");
                    string searchTerm = context.GetArgument<string>("searchTerm");
                    int from = context.GetArgument<int>("from");
                    int to = context.GetArgument<int>("to");
                    string orderBy = context.GetArgument<string>("orderBy");
                    string status = context.GetArgument<string>("status");

                    var searchResult = await productReviewService.GetReviewsByProductId(productId);
                    status = await RestrictForNonAdmin(productReviewService, searchResult, status);
                    IList<Review> searchData = await productReviewService.FilterReviews(searchResult, searchTerm, orderBy, status);
                    int totalCount = searchData.Count;
                    searchData = await productReviewService.LimitReviews(searchData, from, to);
                    Console.WriteLine($"totalCount = {totalCount} : Filtered to {searchData.Count}");
                    SearchResponse searchResponse = new SearchResponse
                    {
                        Data = new DataElement { data = searchData },
                        Range = new SearchRange { From = from, To = to, Total = totalCount }
                    };

                    return searchResponse;
                }
            );

            FieldAsync<DecimalGraphType>(
                "averageRatingByProductId",
                arguments: new QueryArguments(
                    new QueryArgument<NonNullGraphType<StringGraphType>> { Name = "productId", Description = "Product Id" }
                    ),
                resolve: async context =>
                {
                    return await context.TryAsyncResolve(
                        async c => await productReviewService.GetAverageRatingByProductId(context.GetArgument<string>("productId")));
                }
            );

            FieldAsync<IntGraphType>(
                "totalReviewsByProductId",
                arguments: new QueryArguments(
                    new QueryArgument<NonNullGraphType<StringGraphType>> { Name = "productId", Description = "Product Id" }
                    ),
                resolve: async context =>
                {
                    int count = 0;
                    var searchResult = await productReviewService.GetReviewsByProductId(context.GetArgument<string>("productId"));
                    if (searchResult != null && searchResult.Count > 0)
                    {
                        count = searchResult.Count;
                        AppSettings appSettings = await productReviewService.GetAppSettings();
                        if (appSettings.RequireApproval)
                        {
                            count = searchResult.Where(x => x.Approved).ToList().Count;
                        }
                    }

                    return count;
                }
            );

            FieldAsync<SearchResponseType>(
                "reviewsByShopperId",
                arguments: new QueryArguments(
                    new QueryArgument<NonNullGraphType<StringGraphType>> { Name = "shopperId", Description = "Shopper Id" },
                    new QueryArgument<StringGraphType> { Name = "searchTerm", Description = "Search term" },
                    new QueryArgument<IntGraphType> { Name = "from", Description = "From" },
                    new QueryArgument<IntGraphType> { Name = "to", Description = "To" },
                    new QueryArgument<StringGraphType> { Name = "orderBy", Description = "Order by" },
                    new QueryArgument<StringGraphType> { Name = "status", Description = "Status" }
                ),
                resolve: async context =>
                {
                    string shopperId = context.GetArgument<string>("shopperId");
                    string searchTerm = context.GetArgument<string>("searchTerm");
                    int from = context.GetArgument<int>("from");
                    int to = context.GetArgument<int>("to");
                    string orderBy = context.GetArgument<string>("orderBy");
                    string status = context.GetArgument<string>("status");

                    IList<Review> searchResult = await productReviewService.GetReviewsByShopperId(shopperId);
                    status = await RestrictForNonAdmin(productReviewService, searchResult, status);
                    IList<Review> searchData = await productReviewService.FilterReviews(searchResult, searchTerm, orderBy, status);
                    int totalCount = searchData.Count;
                    searchData = await productReviewService.LimitReviews(searchData, from, to);
                    Console.WriteLine($"totalCount = {totalCount} : Filtered to {searchData.Count}");
                    SearchResponse searchResponse = new SearchResponse
                    {
                        Data = new DataElement { data = searchData },
                        Range = new SearchRange { From = from, To = to, Total = totalCount }
                    };

                    return searchResponse;
                }
            );

            FieldAsync<BooleanGraphType>(
                "hasShopperReviewed",
                arguments: new QueryArguments(
                    new QueryArgument<NonNullGraphType<StringGraphType>> { Name = "shopperId", Description = "Shopper Id" },
                    new QueryArgument<NonNullGraphType<StringGraphType>> { Name = "productId", Description = "Product Id" }
                    ),
                resolve: async context =>
                {
                    return await context.TryAsyncResolve(
                        async c => await productReviewService.HasShopperReviewed(
                            context.GetArgument<string>("shopperId"), context.GetArgument<string>("productId")));
                }
            );

            FieldAsync<AppSettingsType>(
                "appSettings",
                resolve: async context =>
                {
                    return await context.TryAsyncResolve(
                        async c => await productReviewService.GetAppSettings());
                }
            );
        }

        /// <summary>
        /// For callers that are not admin users: clears ShopperId and, when the store requires approval,
        /// limits the result to approved reviews. Must run before FilterReviews, so searchTerm and orderBy
        /// cannot probe ShopperId. Returns the status filter to use.
        /// </summary>
        private static async Task<string> RestrictForNonAdmin(IProductReviewService productReviewService, IList<Review> reviews, string status)
        {
            if (await productReviewService.IsAdminAuthUser() == HttpStatusCode.OK)
            {
                return status;
            }

            if (reviews != null)
            {
                foreach (Review review in reviews)
                {
                    review.ShopperId = null;
                }
            }

            AppSettings appSettings = await productReviewService.GetAppSettings();
            return appSettings.RequireApproval ? "true" : status;
        }
    }
}
