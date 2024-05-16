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

            FieldAsync<ReviewType>(
                "newReview",
                arguments: new QueryArguments(
                    new QueryArgument<NonNullGraphType<ReviewInputType>> {Name = "review"}
                ),
                resolve: async context =>
                {
                    AppSettings appSettings = await productReviewService.GetAppSettings();
                    if (!appSettings.AllowAnonymousReviews)
                    {
                        HttpStatusCode isValidAuthUser = await productReviewService.IsValidAuthUser();

                        if (isValidAuthUser != HttpStatusCode.OK)
                        {
                            context.Errors.Add(new ExecutionError(isValidAuthUser.ToString())
                            {
                                Code = isValidAuthUser.ToString()
                            });
                            
                            return default;
                        }
                    }

                    var review = context.GetArgument<Review>("review");
                    return await productReviewService.NewReview(review, true);
                }
            );

            FieldAsync<ReviewType>(
                "editReview",
                arguments: new QueryArguments(
                    new QueryArgument<NonNullGraphType<StringGraphType>> {Name = "id"},
                    new QueryArgument<NonNullGraphType<EditReviewInputType>> {Name = "review"}
                ),
                resolve: async context =>
                {
                    HttpStatusCode IsAdminAuthUser = await productReviewService.IsAdminAuthUser();
            
                    if (IsAdminAuthUser != HttpStatusCode.OK)
                    {
                        context.Errors.Add(new ExecutionError(IsAdminAuthUser.ToString())
                        {
                            Code = IsAdminAuthUser.ToString()
                        });
                        
                        return default;
                    }

                    var id = context.GetArgument<string>("id");
                    var review = context.GetArgument<Review>("review");
                    review.Id = id;
                    return await productReviewService.EditReview(review);
                });

            FieldAsync<BooleanGraphType>(
                "deleteReview",
                arguments: new QueryArguments(
                    new QueryArgument<ListGraphType<StringGraphType>> { Name = "ids"}
                ),
                resolve: async context =>
                {
                    HttpStatusCode IsAdminAuthUser = await productReviewService.IsAdminAuthUser();
            
                    if (IsAdminAuthUser != HttpStatusCode.OK)
                    {
                        context.Errors.Add(new ExecutionError(IsAdminAuthUser.ToString())
                        {
                            Code = IsAdminAuthUser.ToString()
                        });
                        
                        return default;
                    }

                    var ids = context.GetArgument<string[]>("ids");
                    return await productReviewService.DeleteReview(ids);
                });

            FieldAsync<BooleanGraphType>(
                "moderateReview",
                arguments: new QueryArguments(
                    new QueryArgument<ListGraphType<StringGraphType>> { Name = "ids" },
                    new QueryArgument<BooleanGraphType> { Name = "approved"}
                ),
                resolve: async context =>
                {
                    HttpStatusCode IsAdminAuthUser = await productReviewService.IsAdminAuthUser();
            
                    if (IsAdminAuthUser != HttpStatusCode.OK)
                    {
                        context.Errors.Add(new ExecutionError(IsAdminAuthUser.ToString())
                        {
                            Code = IsAdminAuthUser.ToString()
                        });
                        
                        return default;
                    }

                    var ids = context.GetArgument<string[]>("ids");
                    var approved = context.GetArgument<bool>("approved");

                    return await productReviewService.ModerateReview(ids, approved);
                }
            );
        }
    }
}
