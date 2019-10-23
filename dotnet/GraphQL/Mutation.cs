using GraphQL;
using GraphQL.Types;
using ReviewsRatings.GraphQL.Types;
using ReviewsRatings.Models;
using ReviewsRatings.Services;

namespace ReviewsRatings.GraphQL
{
    [GraphQLMetadata("Mutation")]
    public class Mutation : ObjectGraphType<object>
    {
        public Mutation(IProductReviewService productReviewService)
        {
            Name = "Mutation";

            Field<ReviewType>(
                "newReview",
                arguments: new QueryArguments(
                    new QueryArgument<NonNullGraphType<ReviewInputType>> {Name = "review"}
                ),
                resolve: context =>
                {
                    var review = context.GetArgument<Review>("review");
                    return productReviewService.NewReview(review);
                });

            Field<ReviewType>(
                "editReview",
                arguments: new QueryArguments(
                    new QueryArgument<NonNullGraphType<IdGraphType>> {Name = "id"},
                    new QueryArgument<NonNullGraphType<ReviewInputType>> {Name = "review"}
                ),
                resolve: context =>
                {
                    var id = context.GetArgument<int>("id");
                    var review = context.GetArgument<Review>("review");
                    review.Id = id;
                    return productReviewService.EditReview(review);
                });

            Field<BooleanGraphType>(
                "deleteReview",
                arguments: new QueryArguments(
                    new QueryArgument<ListGraphType<IdGraphType>> { Name = "ids"}
                ),
                resolve: context =>
                {
                    var ids = context.GetArgument<int[]>("ids");
                    return productReviewService.DeleteReview(ids);
                });

            Field<BooleanGraphType>(
                "moderateReview",
                arguments: new QueryArguments(
                    new QueryArgument<ListGraphType<IdGraphType>> { Name = "ids" },
                    new QueryArgument<BooleanGraphType> { Name = "approved"}
                ),
                resolve: context =>
                {
                    var ids = context.GetArgument<int[]>("ids");
                    var approved = context.GetArgument<bool>("approved");
                    return productReviewService.ModerateReview(ids, approved);
                });
        }
    }
}