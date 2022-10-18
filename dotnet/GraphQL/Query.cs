using GraphQL;
using GraphQL.Types;
using ReviewsRatings.GraphQL.Types;
using ReviewsRatings.Models;
using ReviewsRatings.Services;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;

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
                    return await context.TryAsyncResolve(
                        async c => await productReviewService.GetReview(context.GetArgument<string>("id")));
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
                    int to = context.GetArgument<int>("to") + 1;
                    string orderBy = context.GetArgument<string>("orderBy");
                    string status = context.GetArgument<string>("status");
                    var searchResult = await productReviewService.GetReviews(searchTerm, from, to, orderBy, status);
                    SearchResponse searchResponse = new SearchResponse
                    {
                        Data = new DataElement { data = searchResult.Reviews },
                        Range = searchResult.Range
                    };

                    return searchResponse;
                }
            );

            FieldAsync<SearchResponseType>(
                "reviewsByProductId",
                arguments: new QueryArguments(
                    new QueryArgument<NonNullGraphType<StringGraphType>> { Name = "productId", Description = "Product Id" },
                    new QueryArgument<IntGraphType> { Name = "rating", Description = "Rating" },
                    new QueryArgument<StringGraphType> { Name = "locale", Description = "Locale" },
                    new QueryArgument<BooleanGraphType> { Name = "pastReviews", Description = "PastReviews" },
                    new QueryArgument<StringGraphType> { Name = "searchTerm", Description = "Search term" },
                    new QueryArgument<IntGraphType> { Name = "from", Description = "From" },
                    new QueryArgument<IntGraphType> { Name = "to", Description = "To" },
                    new QueryArgument<StringGraphType> { Name = "orderBy", Description = "Order by" },
                    new QueryArgument<StringGraphType> { Name = "status", Description = "Status" }
                ),
                resolve: async context =>
                {
                    string productId = context.GetArgument<string>("productId");
                    int rating = context.GetArgument<int>("rating");
                    string locale = context.GetArgument<string>("locale");
                    bool pastReviews = context.GetArgument<bool>("pastReviews");
                    string searchTerm = context.GetArgument<string>("searchTerm");
                    int from = context.GetArgument<int>("from");
                    int to = context.GetArgument<int>("to") + 1;
                    string orderBy = context.GetArgument<string>("orderBy");
                    string status = context.GetArgument<string>("status");

                    var searchResult = await productReviewService.GetReviewsByProductId(productId, from, to, orderBy, searchTerm, rating, locale, pastReviews);
                    SearchResponse searchResponse = new SearchResponse
                    {
                        Data = new DataElement { data = searchResult.Reviews },
                        Range = searchResult.Range
                    };

                    return searchResponse;
                }
            );

            FieldAsync<AverageType>(
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
                    if (searchResult != null && searchResult.Reviews != null && searchResult.Reviews.Count > 0)
                    {
                        count = searchResult.Reviews.Count;
                        AppSettings appSettings = await productReviewService.GetAppSettings();
                        if (appSettings.RequireApproval)
                        {
                            count = searchResult.Reviews.Where(x => x.Approved ?? false).ToList().Count;
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
                    int to = context.GetArgument<int>("to") + 1;
                    string orderBy = context.GetArgument<string>("orderBy");
                    string status = context.GetArgument<string>("status");

                    var searchResult = await productReviewService.GetReviewsByShopperId(shopperId);
                    SearchResponse searchResponse = new SearchResponse
                    {
                        Data = new DataElement { data = searchResult.Reviews },
                        Range = searchResult.Range
                    };

                    return searchResponse;
                }
            );

            FieldAsync<SearchResponseType>(
                "reviewByreviewDateTime",
                arguments: new QueryArguments(
                    new QueryArgument<NonNullGraphType<StringGraphType>> { Name = "reviewDateTime", Description = "Review DateTime" },
                    new QueryArgument<IntGraphType> { Name = "from", Description = "From" },
                    new QueryArgument<IntGraphType> { Name = "to", Description = "to" },
                    new QueryArgument<StringGraphType> { Name = "orderBy", Description = "Order By" },
                    new QueryArgument<StringGraphType> { Name = "status", Description = "Status" }
                ),
                resolve: async context =>
                {
                    string reviewDateTime = context.GetArgument<string>("reviewDateTime");
                    int from = context.GetArgument<int>("from");
                    int to = context.GetArgument<int>("to") + 1;
                    string orderBy = context.GetArgument<string>("orderBy");
                    string status = context.GetArgument<string>("status");

                    var searchResult = await productReviewService.GetReviewsByreviewDateTime(reviewDateTime);
                    SearchResponse searchResponse = new SearchResponse
                    {
                        Data = new DataElement { data = searchResult.Reviews },
                        Range = searchResult.Range
                    };

                    return searchResponse;
                }
            );

              FieldAsync<SearchResponseType>(
                "reviewByDateRange",
                arguments: new QueryArguments(
                    new QueryArgument<StringGraphType> { Name = "fromDate", Description = "From Date" },
                    new QueryArgument<StringGraphType> { Name = "toDate", Description = "To Date" },
                    new QueryArgument<StringGraphType> { Name = "orderBy", Description = "Order by" },
                    new QueryArgument<StringGraphType> { Name = "status", Description = "Status" }
                ),
                resolve: async context =>
                {
                    string fromDate = context.GetArgument<string>("fromDate");
                    string toDate = context.GetArgument<string>("toDate");
                    string orderBy = context.GetArgument<string>("orderBy");
                    string status = context.GetArgument<string>("status");

                    var searchResult = await productReviewService.GetReviewsByDateRange(fromDate, toDate);
                    SearchResponse searchResponse = new SearchResponse
                    {
                        Data = new DataElement { data = searchResult.Reviews },
                        Range = searchResult.Range
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

            FieldAsync<StringGraphType>(
                "verifySchema",
                resolve: async context =>
                {
                    return await productReviewService.VerifySchema();
                }
            );

            FieldAsync<StringGraphType>(
                "migrateData",
                resolve: async context =>
                {
                    return await productReviewService.MigrateData();
                }
            );

            FieldAsync<StringGraphType>(
                "verifyMigration",
                resolve: async context =>
                {
                    return await productReviewService.VerifyMigration();
                }
            );

            FieldAsync<StringGraphType>(
                "successfulMigration",
                resolve: async context =>
                {
                 return await productReviewService.SuccessfulMigration();
                }
            );
        }
    }
}