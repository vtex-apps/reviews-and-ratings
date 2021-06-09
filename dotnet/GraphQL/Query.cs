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

            FieldAsync<ReviewType>(
                "review",
                arguments: new QueryArguments(
                    new QueryArgument<NonNullGraphType<IdGraphType>> { Name = "id", Description = "id of the review" }
                ),
                resolve: async context =>
                {
                    return await context.TryAsyncResolve(
                        async c => await productReviewService.GetReview(context.GetArgument<int>("id")));
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
                    var searchResult = productReviewService.GetReviews();
                    IList<Review> searchData = await productReviewService.FilterReviews(searchResult.Result, searchTerm, orderBy, status);
                    int totalCount = searchData.Count;

                    int total5 = 0;
                    int total4 = 0;
                    int total3 = 0;
                    int total2 = 0;
                    int total1 = 0;
                    for (int i = 0; i < searchData.Count; i++)
                    {
                        if (searchData[i].Rating == 5)
                        {
                            total5++;
                        }
                        else if (searchData[i].Rating == 4)
                        {
                            total4++;
                        }
                        else if (searchData[i].Rating == 3)
                        {
                            total3++;
                        }
                        else if (searchData[i].Rating == 2)
                        {
                            total2++;
                        }
                        else if (searchData[i].Rating == 1)
                        {
                            total1++;
                        }
                    }
                    Console.WriteLine($"total3 = {total3}");

                    searchData = await productReviewService.LimitReviews(searchData, from, to);
                    Console.WriteLine($"totalCount = {totalCount} : Filtered to {searchData.Count}");
                    SearchResponse searchResponse = new SearchResponse
                    {
                        Data = new DataElement { data = searchData },
                        Range = new SearchRange { From = from, To = to, Total = totalCount },
                        Totals = new Totals { Total5 = total5, Total4 = total4, Total3 = total3, Total2 = total2, Total1 = total1 }
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
                    IList<Review> searchData = await productReviewService.FilterReviews(searchResult, searchTerm, orderBy, status);
                    int totalCount = searchData.Count;

                    int total5 = 0;
                    int total4 = 0;
                    int total3 = 0;
                    int total2 = 0;
                    int total1 = 0;
                    for (int i = 0; i < searchData.Count; i++) 
                    {
                        if (searchData[i].Rating == 5)
                        {
                            total5++;
                        }
                        else if (searchData[i].Rating == 4)
                        {
                            total4++;
                        }
                        else if (searchData[i].Rating == 3)
                        {
                            total3++;
                        }
                        else if (searchData[i].Rating == 2)
                        {
                            total2++;
                        }
                        else if (searchData[i].Rating == 1)
                        {
                            total1++;
                        }
                    }
                    Console.WriteLine($"total3 = {total3}");

                    searchData = await productReviewService.LimitReviews(searchData, from, to);
                    Console.WriteLine($"totalCount = {totalCount} : Filtered to {searchData.Count}");
                    SearchResponse searchResponse = new SearchResponse
                    {
                        Data = new DataElement { data = searchData },
                        Range = new SearchRange { From = from, To = to, Total = totalCount },
                        Totals = new Totals { Total5 = total5, Total4 = total4, Total3 = total3, Total2 = total2, Total1 = total1 }
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

            FieldAsync<IntGraphType>(
                "totalReviewsByProductId5",
                arguments: new QueryArguments(
                    new QueryArgument<NonNullGraphType<StringGraphType>> { Name = "productId", Description = "Product Id" }
                    ),
                resolve: async context =>
                {
                    int count = 0;
                    var searchResult = await productReviewService.GetReviewsByProductId(context.GetArgument<string>("productId"));

                    if (searchResult != null && searchResult.Count > 0)
                    {
                        for (int i = 0; i < searchResult.Count; i++) {
                            if (searchResult[i].Rating == 5)
                            {
                                count++;
                            }
                        }
                    }

                    return count;
                }
            );

            FieldAsync<IntGraphType>(
                "totalReviewsByProductId4",
                arguments: new QueryArguments(
                    new QueryArgument<NonNullGraphType<StringGraphType>> { Name = "productId", Description = "Product Id" }
                    ),
                resolve: async context =>
                {
                    int count = 0;
                    var searchResult = await productReviewService.GetReviewsByProductId(context.GetArgument<string>("productId"));

                    if (searchResult != null && searchResult.Count > 0)
                    {
                        for (int i = 0; i < searchResult.Count; i++)
                        {
                            if (searchResult[i].Rating == 4)
                            {
                                count++;
                            }
                        }
                    }

                    return count;
                }
            );

            FieldAsync<IntGraphType>(
                "totalReviewsByProductId3",
                arguments: new QueryArguments(
                    new QueryArgument<NonNullGraphType<StringGraphType>> { Name = "productId", Description = "Product Id" }
                    ),
                resolve: async context =>
                {
                    int count = 0;
                    var searchResult = await productReviewService.GetReviewsByProductId(context.GetArgument<string>("productId"));

                    if (searchResult != null && searchResult.Count > 0)
                    {
                        for (int i = 0; i < searchResult.Count; i++)
                        {
                            if (searchResult[i].Rating == 3)
                            {
                                count++;
                            }
                        }
                    }

                    return count;
                }
            );

            FieldAsync<IntGraphType>(
                "totalReviewsByProductId2",
                arguments: new QueryArguments(
                    new QueryArgument<NonNullGraphType<StringGraphType>> { Name = "productId", Description = "Product Id" }
                    ),
                resolve: async context =>
                {
                    int count = 0;
                    var searchResult = await productReviewService.GetReviewsByProductId(context.GetArgument<string>("productId"));

                    if (searchResult != null && searchResult.Count > 0)
                    {
                        for (int i = 0; i < searchResult.Count; i++)
                        {
                            if (searchResult[i].Rating == 2)
                            {
                                count++;
                            }
                        }
                    }

                    return count;
                }
            );

            FieldAsync<IntGraphType>(
                "totalReviewsByProductId1",
                arguments: new QueryArguments(
                    new QueryArgument<NonNullGraphType<StringGraphType>> { Name = "productId", Description = "Product Id" }
                    ),
                resolve: async context =>
                {
                    int count = 1;
                    var searchResult = await productReviewService.GetReviewsByProductId(context.GetArgument<string>("productId"));

                    if (searchResult != null && searchResult.Count > 0)
                    {
                        for (int i = 0; i < searchResult.Count; i++)
                        {
                            if (searchResult[i].Rating == 1)
                            {
                                count++;
                            }
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

                    var searchResult = productReviewService.GetReviewsByShopperId(shopperId);
                    IList<Review> searchData = await productReviewService.FilterReviews(searchResult.Result, searchTerm, orderBy, status);
                    int totalCount = searchData.Count;

                    int total5 = 0;
                    int total4 = 0;
                    int total3 = 0;
                    int total2 = 0;
                    int total1 = 0;
                    for (int i = 0; i < searchData.Count; i++) 
                    {
                        if (searchData[i].Rating == 5)
                        {
                            total5++;
                        }
                        else if (searchData[i].Rating == 4)
                        {
                            total4++;
                        }
                        else if (searchData[i].Rating == 3)
                        {
                            total3++;
                        }
                        else if (searchData[i].Rating == 2)
                        {
                            total2++;
                        }
                        else if (searchData[i].Rating == 1)
                        {
                            total1++;
                        }
                    }
                    Console.WriteLine($"total3 = {total3}");

                    searchData = await productReviewService.LimitReviews(searchData, from, to);
                    Console.WriteLine($"totalCount = {totalCount} : Filtered to {searchData.Count}");
                    SearchResponse searchResponse = new SearchResponse
                    {
                        Data = new DataElement { data = searchData },
                        Range = new SearchRange { From = from, To = to, Total = totalCount },
                        Totals = new Totals { Total5 = total5, Total4 = total4, Total3 = total3, Total2 = total2, Total1 = total1 }
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
    }
}