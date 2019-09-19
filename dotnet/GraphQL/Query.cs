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
                    new QueryArgument<IntGraphType> { Name = "orderBy", Description = "Order by" }
                ),
                resolve: context => productReviewService.GetReviews()
            );

            Field<ListGraphType<ReviewType>>(
                "reviewsByProductId",
                arguments: new QueryArguments(
                    new QueryArgument<NonNullGraphType<IdGraphType>> { Name = "productId", Description = "Product Id" },
                    new QueryArgument<IntGraphType> { Name = "offset", Description = "Offset" },
                    new QueryArgument<IntGraphType> { Name = "limit", Description = "Limit" },
                    new QueryArgument<IntGraphType> { Name = "orderBy", Description = "Order by" }
                ),
                resolve: context => productReviewService.GetReviewsByProductId(context.GetArgument<string>("productId")).Result.Count
            );

            Field<IntGraphType>(
                "averageRatingByProductId",
                arguments: new QueryArguments(
                    new QueryArgument<NonNullGraphType<IdGraphType>> { Name = "productId", Description = "Product Id" }
                    ),
                resolve: context => productReviewService.GetAverageRatingByProductId(context.GetArgument<string>("productId"))
            );

            Field<IntGraphType>(
                "totalReviewsByProductId",
                arguments: new QueryArguments(
                    new QueryArgument<NonNullGraphType<IdGraphType>> { Name = "productId", Description = "Product Id" }
                    ),
                resolve: context => productReviewService.GetReviewsByProductId(context.GetArgument<string>("productId")).Result.Count
            );
        }
    }
}