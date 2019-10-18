using GraphQL;
using GraphQL.Types;
using ReviewsRatings.GraphQL.Types;
using ReviewsRatings.Models;
using ReviewsRatings.Services;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;

namespace ReviewsRatings.GraphQL
{
    [GraphQLMetadata("Query")]
    public class Query : ObjectGraphType<object>
    {
        public Query(IProductReviewService productReviewService)
        {
            Name = "Query";

            Field<ReviewType>(
                "review",
                arguments: new QueryArguments(
                    new QueryArgument<NonNullGraphType<IdGraphType>> { Name = "id", Description = "id of the review" }
                ),
                resolve: context => productReviewService.GetReview(context.GetArgument<int>("id"))
            );

            /// query Reviews($searchTerm: String, $from: Int, $to: Int, $orderBy: String, $status: String)
            Field<SearchResponseType>(
                "reviews",
                arguments: new QueryArguments(
                    new QueryArgument<StringGraphType> { Name = "searchTerm", Description = "Search term" },
                    new QueryArgument<IntGraphType> { Name = "from", Description = "From" },
                    new QueryArgument<IntGraphType> { Name = "to", Description = "To" },
                    new QueryArgument<StringGraphType> { Name = "orderBy", Description = "Order by" },
                    new QueryArgument<BooleanGraphType> { Name = "status", Description = "Status" }
                ),
                resolve: context =>
                {
                    string searchTerm = context.GetArgument<string>("searchTerm");
                    int from = context.GetArgument<int>("from");
                    int to = context.GetArgument<int>("to");
                    string orderBy = context.GetArgument<string>("orderBy");
                    bool status = context.GetArgument<bool>("status");

                    var searchResult = productReviewService.GetReviews();
                    IList<Review> searchData = productReviewService.FilterReviews(searchResult.Result, searchTerm, orderBy, status);
                    int totalCount = searchResult.Result.Count;
                    searchData = productReviewService.LimitReviews(searchResult.Result, from, to);
                    Console.WriteLine($"totalCount = {totalCount} : Filtered to {searchData.Count}");
                    SearchResponse searchResponse = new SearchResponse
                    {
                        Data = new DataElement { data = searchData },
                        Range = new SearchRange { From = from, To = to, Total = totalCount }
                    };

                    return searchResponse;
                }
            );

            Field<SearchResponseType>(
                "reviewsByProductId",
                arguments: new QueryArguments(
                    new QueryArgument<NonNullGraphType<StringGraphType>> { Name = "productId", Description = "Product Id" },
                    new QueryArgument<StringGraphType> { Name = "searchTerm", Description = "Search term" },
                    new QueryArgument<IntGraphType> { Name = "from", Description = "From" },
                    new QueryArgument<IntGraphType> { Name = "to", Description = "To" },
                    new QueryArgument<StringGraphType> { Name = "orderBy", Description = "Order by" },
                    new QueryArgument<BooleanGraphType> { Name = "status", Description = "Status" }
                ),
                resolve: context =>
                {
                    string productId = context.GetArgument<string>("productId");
                    string searchTerm = context.GetArgument<string>("searchTerm");
                    int from = context.GetArgument<int>("from");
                    int to = context.GetArgument<int>("to");
                    string orderBy = context.GetArgument<string>("orderBy");
                    bool status = context.GetArgument<bool>("status");

                    var searchResult = productReviewService.GetReviewsByProductId(productId);
                    IList<Review> searchData = productReviewService.FilterReviews(searchResult.Result, searchTerm, orderBy, status);
                    int totalCount = searchResult.Result.Count;
                    searchData = productReviewService.LimitReviews(searchResult.Result, from, to);
                    Console.WriteLine($"totalCount = {totalCount} : Filtered to {searchData.Count}");
                    SearchResponse searchResponse = new SearchResponse
                    {
                        Data = new DataElement { data = searchData },
                        Range = new SearchRange { From = from, To = to, Total = totalCount }
                    };

                    return searchResponse;
                }
            );

            Field<DecimalGraphType>(
                "averageRatingByProductId",
                arguments: new QueryArguments(
                    new QueryArgument<NonNullGraphType<StringGraphType>> { Name = "productId", Description = "Product Id" }
                    ),
                resolve: context => productReviewService.GetAverageRatingByProductId(context.GetArgument<string>("productId"))
            );

            Field<IntGraphType>(
                "totalReviewsByProductId",
                arguments: new QueryArguments(
                    new QueryArgument<NonNullGraphType<StringGraphType>> { Name = "productId", Description = "Product Id" }
                    ),
                resolve: context => productReviewService.GetReviewsByProductId(context.GetArgument<string>("productId")).Result.Count
            );

            Field<SearchResponseType>(
                "reviewsByShopperId",
                arguments: new QueryArguments(
                    new QueryArgument<NonNullGraphType<StringGraphType>> { Name = "shopperId", Description = "Shopper Id" },
                    new QueryArgument<StringGraphType> { Name = "searchTerm", Description = "Search term" },
                    new QueryArgument<IntGraphType> { Name = "from", Description = "From" },
                    new QueryArgument<IntGraphType> { Name = "to", Description = "To" },
                    new QueryArgument<StringGraphType> { Name = "orderBy", Description = "Order by" },
                    new QueryArgument<BooleanGraphType> { Name = "status", Description = "Status" }
                ),
                resolve: context =>
                {
                    string shopperId = context.GetArgument<string>("shopperId");
                    string searchTerm = context.GetArgument<string>("searchTerm");
                    int from = context.GetArgument<int>("from");
                    int to = context.GetArgument<int>("to");
                    string orderBy = context.GetArgument<string>("orderBy");
                    bool status = context.GetArgument<bool>("status");

                    var searchResult = productReviewService.GetReviewsByShopperId(shopperId);
                    IList<Review> searchData = productReviewService.FilterReviews(searchResult.Result, searchTerm, orderBy, status);
                    int totalCount = searchResult.Result.Count;
                    searchData = productReviewService.LimitReviews(searchResult.Result, from, to);
                    Console.WriteLine($"totalCount = {totalCount} : Filtered to {searchData.Count}");
                    SearchResponse searchResponse = new SearchResponse
                    {
                        Data = new DataElement { data = searchData },
                        Range = new SearchRange { From = from, To = to, Total = totalCount }
                    };

                    return searchResponse;
                }
            );

            Field<BooleanGraphType>(
                "hasShopperReviewed",
                arguments: new QueryArguments(
                    new QueryArgument<NonNullGraphType<StringGraphType>> { Name = "shopperId", Description = "Shopper Id" },
                    new QueryArgument<NonNullGraphType<StringGraphType>> { Name = "productId", Description = "Product Id" }
                    ),
                resolve: context => productReviewService.HasShopperReviewed(context.GetArgument<string>("shopperId"), context.GetArgument<string>("productId")).Result
            );

            Field<AppSettingsType>(
                "appSettings",
                resolve: context => productReviewService.GetAppSettings().Result
            );
        }
    }
}