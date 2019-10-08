using GraphQL;
using GraphQL.Types;
using ReviewsRatings.GraphQL.Types;
using ReviewsRatings.Services;

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

            Field<ListGraphType<ReviewType>>(
                "reviews",
                arguments: new QueryArguments(
                    new QueryArgument<IntGraphType> { Name = "offset", Description = "Offset" },
                    new QueryArgument<IntGraphType> { Name = "limit", Description = "Limit" },
                    new QueryArgument<StringGraphType> { Name = "orderBy", Description = "Order by" }
                ),
                resolve: context => productReviewService.GetReviews(context.GetArgument<int>("offset"), context.GetArgument<int>("limit"), context.GetArgument<string>("orderBy"))
            );

            Field<ListGraphType<ReviewType>>(
                "reviewsByProductId",
                arguments: new QueryArguments(
                    new QueryArgument<NonNullGraphType<StringGraphType>> { Name = "productId", Description = "Product Id" },
                    new QueryArgument<IntGraphType> { Name = "offset", Description = "Offset" },
                    new QueryArgument<IntGraphType> { Name = "limit", Description = "Limit" },
                    new QueryArgument<StringGraphType> { Name = "orderBy", Description = "Order by" }
                ),
                resolve: context => productReviewService.GetReviewsByProductId(context.GetArgument<string>("productId"), context.GetArgument<int>("offset"), context.GetArgument<int>("limit"), context.GetArgument<string>("orderBy"))
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

            Field<ListGraphType<ReviewType>>(
                "reviewsByShopperId",
                arguments: new QueryArguments(
                    new QueryArgument<NonNullGraphType<StringGraphType>> { Name = "shopperId", Description = "Shopper Id" },
                    new QueryArgument<IntGraphType> { Name = "offset", Description = "Offset" },
                    new QueryArgument<IntGraphType> { Name = "limit", Description = "Limit" },
                    new QueryArgument<StringGraphType> { Name = "orderBy", Description = "Order by" }
                ),
                resolve: context => productReviewService.GetReviewsByShopperId(context.GetArgument<string>("shopperId"), context.GetArgument<int>("offset"), context.GetArgument<int>("limit"), context.GetArgument<string>("orderBy"))
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