using GraphQL;
using GraphQL.Types;
using ReviewsRatings.Models;
using ReviewsRatings.Services;

namespace ReviewsRatings.GraphQL.Types
{
    [GraphQLMetadata("Review")]
    public class ReviewType : ObjectGraphType<Review>
    {
        public ReviewType(IProductReviewService productReviewService)
        {
            Name = "Review";

            Field(b => b.Id).Description("The id of the review.");
            Field(b => b.CacheId).Description("The cache id of the review.");
            Field(b => b.ProductId).Description("The product id of the review.");
            Field(b => b.Rating).Description("The rating of the review.");
            Field(b => b.Title).Description("The title of the review.");
            Field(b => b.Text).Description("The text of the review.");
            Field(b => b.ReviewerName).Description("The name of the reviewer.");
            Field(b => b.ShopperId).Description("The id of the reviewer.");
            Field(b => b.ReviewDateTime).Description("The date and time of the review.");
            Field(b => b.VerifiedPurchaser).Description("Indicates whether the reviewer is a verified purchaser.");
        }
    }
}