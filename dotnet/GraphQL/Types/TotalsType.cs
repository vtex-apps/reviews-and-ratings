using GraphQL;
using GraphQL.Types;
using ReviewsRatings.Models;
using ReviewsRatings.Services;
using System;
using System.Collections.Generic;
using System.Text;

namespace ReviewsRatings.GraphQL.Types
{
    [GraphQLMetadata("Totals")]
    public class TotalsType : ObjectGraphType<Totals>
    {
        public TotalsType(IProductReviewService productReviewService)
        {
            Name = "Range";
            Field(b => b.Total5);
            Field(b => b.Total4);
            Field(b => b.Total3);
            Field(b => b.Total2);
            Field(b => b.Total1);
        }
    }
}
