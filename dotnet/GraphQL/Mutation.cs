using GraphQL;
using GraphQL.Types;
using ReviewsRatings.GraphQL.Types;
using ReviewsRatings.Models;
using ReviewsRatings.Services;
using System.Net;

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
                    return productReviewService.NewReview(review, true);
                });

            FieldAsync<ReviewType>(
                "editReview",
                arguments: new QueryArguments(
                    new QueryArgument<NonNullGraphType<StringGraphType>> {Name = "id"},
                    new QueryArgument<NonNullGraphType<EditReviewInputType>> {Name = "review"}
                ),
                resolve: async context =>
                {
                    var id = context.GetArgument<string>("id");
                    var review = context.GetArgument<Review>("review");
                    review.Id = id;
                    (Review review, HttpStatusCode status) prodEditResult = await productReviewService.EditReview(review);

                    if (prodEditResult.status == HttpStatusCode.OK)
                    {
                        return prodEditResult.review;
                    }
                    else
                    {
                        context.Errors.Add(new ExecutionError(prodEditResult.status.ToString())
                        {
                            Code = prodEditResult.status.ToString()
                        });
                        
                        return default;
                    }
                });

            FieldAsync<BooleanGraphType>(
                "deleteReview",
                arguments: new QueryArguments(
                    new QueryArgument<ListGraphType<StringGraphType>> { Name = "ids"}
                ),
                resolve: async context =>
                {
                    var ids = context.GetArgument<string[]>("ids");
                    (bool retval, HttpStatusCode status) prodDelResult = await productReviewService.DeleteReview(ids);

                    if (prodDelResult.status == HttpStatusCode.OK)
                    {
                        return prodDelResult.retval;
                    }
                    else
                    {
                        context.Errors.Add(new ExecutionError(prodDelResult.status.ToString())
                        {
                            Code = prodDelResult.status.ToString()
                        });
                        
                        return default;
                    }
                });

            FieldAsync<BooleanGraphType>(
                "moderateReview",
                arguments: new QueryArguments(
                    new QueryArgument<ListGraphType<StringGraphType>> { Name = "ids" },
                    new QueryArgument<BooleanGraphType> { Name = "approved"}
                ),
                resolve: async context =>
                {
                    var ids = context.GetArgument<string[]>("ids");
                    var approved = context.GetArgument<bool>("approved");
                    (bool retval, HttpStatusCode status) prodReviewResult = await productReviewService.ModerateReview(ids, approved);

                    if (prodReviewResult.status == HttpStatusCode.OK)
                    {
                        return prodReviewResult.retval;
                    }
                    else
                    {
                        context.Errors.Add(new ExecutionError(prodReviewResult.status.ToString())
                        {
                            Code = prodReviewResult.status.ToString()
                        });
                        
                        return default;
                    }
                }
            );
        }
    }
}