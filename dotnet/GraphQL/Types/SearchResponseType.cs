using GraphQL;
using GraphQL.Types;
using ReviewsRatings.Models;
using ReviewsRatings.Services;
using System;
using System.Collections.Generic;
using System.Text;

namespace ReviewsRatings.GraphQL.Types
{
    [GraphQLMetadata("SearchResponse")]
    public class SearchResponseType : ObjectGraphType<SearchResponse>
    {
        public SearchResponseType(IProductReviewService productReviewService)
        {
            Name = "SearchResponse";
            Field(b => b.Data, type: typeof(ListGraphType<ReviewType>)).Description("List of Reviews.");
            Field(b => b.Range, type: typeof(RangeType)).Description("Pagination values.");
            Field(b => b.Totals, type: typeof(TotalsType)).Description("Total values.");
            //Field<ListGraphType<ReviewType>>("data");
            //Field<RangeType>("range");
        }
    }
}
