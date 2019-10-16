using GraphQL;
using GraphQL.Types;
using ReviewsRatings.Models;
using ReviewsRatings.Services;
using System;
using System.Collections.Generic;
using System.Text;

namespace ReviewsRatings.GraphQL.Types
{
    [GraphQLMetadata("Range")]
    public class RangeType : ObjectGraphType<SearchRange>
    {
        public RangeType(IProductReviewService productReviewService)
        {
            Name = "Range";
            Field(b => b.From);
            Field(b => b.To);
            Field(b => b.Total);
        }
    }
}
