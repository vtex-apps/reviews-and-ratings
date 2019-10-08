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
            Field(b => b.Title, nullable: true).Description("The title of the review.");
            Field(b => b.Text, nullable: true).Description("The text of the review.");
            Field(b => b.ReviewerName, nullable: true).Description("The name of the reviewer.");
            Field(b => b.ShopperId, nullable: true).Description("The id of the reviewer.");
            Field(b => b.ReviewDateTime, nullable: true).Description("The date and time of the review.");
            Field(b => b.VerifiedPurchaser, nullable: true).Description("Indicates whether the reviewer is a verified purchaser.");
            Field(b => b.Sku, nullable: true).Description("The product sku of the review.");
            Field(b => b.Approved, nullable: true).Description("Indicates whether the review has been approved.");
            Field(b => b.Location, nullable: true).Description("Reviewer location.");
        }
    }
}