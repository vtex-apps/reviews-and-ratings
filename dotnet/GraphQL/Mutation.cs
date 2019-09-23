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
                    new QueryArgument<IdGraphType> {Name = "id"}
                ),
                resolve: context =>
                {
                    var id = context.GetArgument<int>("id");
                    return productReviewService.DeleteReview(id);
                });
        }
    }
}