using GraphQL;
using GraphQL.Types;
using ReviewsRatings.Models;
using ReviewsRatings.Services;

namespace ReviewsRatings.GraphQL.Types
{
    [GraphQLMetadata("VerifySchema")]
    public class VerifySchemaType : ObjectGraphType<VerifySchema>
    {
        public VerifySchemaType(IProductReviewService productReviewService)
        {
            Name = "VerifySchema";

            Field(b => b.verifySchemaResponse).Description("Verify schema response");
        }
    }
}
