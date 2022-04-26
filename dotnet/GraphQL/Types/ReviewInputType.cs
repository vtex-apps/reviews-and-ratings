using GraphQL;
using GraphQL.Types;
using ReviewsRatings.Models;

namespace ReviewsRatings.GraphQL.Types
{
    [GraphQLMetadata("ReviewInputType")]
    public class ReviewInputType : InputObjectGraphType<Review>
    {
        public ReviewInputType()
        {
            Name = "ReviewInput";
            Field(x => x.Id, nullable: true);
            //Field(x => x.CacheId, nullable: true);
            Field(x => x.ProductId, nullable: true);
            Field(x => x.Rating, nullable: true);
            Field(x => x.Title, nullable: true);
            Field(x => x.Text, nullable: true);
            Field(x => x.ReviewerName, nullable: true);
            Field(x => x.ShopperId, nullable: true);
            Field(x => x.ReviewDateTime, nullable: true);
            //Field(x => x.VerifiedPurchaser);
            Field(x => x.Sku, nullable: true);
            Field(x => x.Location, nullable: true);
            Field(x => x.Locale, nullable: true);
            Field(x => x.Approved, nullable: true);
        }
    }
}