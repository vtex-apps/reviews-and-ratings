using GraphQL;
using GraphQL.Types;
using ReviewsRatings.Models;

namespace ReviewsRatings.GraphQL.Types
{
    [GraphQLMetadata("EditReviewInputType")]
    public class EditReviewInputType : InputObjectGraphType<Review>
    {
        public EditReviewInputType()
        {
            Name = "EditReviewInput";
            Field(x => x.Id, nullable: true);
            Field(x => x.ProductId, nullable: true);
            Field(x => x.Rating, nullable: true);
            Field(x => x.Title, nullable: true);
            Field(x => x.Text, nullable: true);
            Field(x => x.ReviewerName, nullable: true);
            Field(x => x.ReviewDateTime, nullable: true);
            Field(x => x.Sku, nullable: true);
            Field(x => x.ShopperId, nullable: true);
        }
    }
}