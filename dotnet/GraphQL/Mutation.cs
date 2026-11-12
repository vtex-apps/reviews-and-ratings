using GraphQL;
using GraphQL.Types;
using ReviewsRatings.GraphQL.Types;
using ReviewsRatings.Models;
using ReviewsRatings.Services;
using System.Net;
using System.Threading.Tasks;

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

            FieldAsync<ReviewType>(
                "editReview",
                arguments: new QueryArguments(
                    new QueryArgument<NonNullGraphType<IdGraphType>> {Name = "id"},
                    new QueryArgument<NonNullGraphType<ReviewInputType>> {Name = "review"}
                ),
                resolve: async context =>
                {
                    if (!await IsAdmin(productReviewService, context))
                    {
                        return null;
                    }

                    var id = context.GetArgument<int>("id");
                    var review = context.GetArgument<Review>("review");
                    review.Id = id;
                    return await productReviewService.EditReview(review);
                });

            FieldAsync<BooleanGraphType>(
                "deleteReview",
                arguments: new QueryArguments(
                    new QueryArgument<ListGraphType<IdGraphType>> { Name = "ids"}
                ),
                resolve: async context =>
                {
                    if (!await IsAdmin(productReviewService, context))
                    {
                        return null;
                    }

                    var ids = context.GetArgument<int[]>("ids");
                    return await productReviewService.DeleteReview(ids);
                });

            FieldAsync<BooleanGraphType>(
                "moderateReview",
                arguments: new QueryArguments(
                    new QueryArgument<ListGraphType<IdGraphType>> { Name = "ids" },
                    new QueryArgument<BooleanGraphType> { Name = "approved"}
                ),
                resolve: async context =>
                {
                    if (!await IsAdmin(productReviewService, context))
                    {
                        return null;
                    }

                    var ids = context.GetArgument<int[]>("ids");
                    var approved = context.GetArgument<bool>("approved");
                    return await productReviewService.ModerateReview(ids, approved);
                });
        }

        private static async Task<bool> IsAdmin(IProductReviewService productReviewService, ResolveFieldContext<object> context)
        {
            HttpStatusCode isAdminAuthUser = await productReviewService.IsAdminAuthUser();
            if (isAdminAuthUser == HttpStatusCode.OK)
            {
                return true;
            }

            context.Errors.Add(new ExecutionError(isAdminAuthUser.ToString())
            {
                Code = isAdminAuthUser.ToString()
            });

            return false;
        }
    }
}
