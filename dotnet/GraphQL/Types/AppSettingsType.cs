using GraphQL;
using GraphQL.Types;
using ReviewsRatings.Models;
using ReviewsRatings.Services;

namespace ReviewsRatings.GraphQL.Types
{
    [GraphQLMetadata("Review")]
    public class AppSettingsType : ObjectGraphType<AppSettings>
    {
        public AppSettingsType(IProductReviewService productReviewService)
        {
            Name = "AppSettings";

            Field(b => b.AllowAnonymousReviews).Description("Indicates whether anonymous reviews are allowed.");
            Field(b => b.RequireApproval).Description("Indicates whether reviews require approval.");
            Field(b => b.UseLocation).Description("Indicates whether to use Location field.");
        }
    }
}
