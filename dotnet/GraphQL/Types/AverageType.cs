using GraphQL;
using GraphQL.Types;
using ReviewsRatings.Models;
using ReviewsRatings.Services;
using System;
using System.Collections.Generic;
using System.Text;

namespace ReviewsRatings.GraphQL.Types
{
    [GraphQLMetadata("Average")]
    public class AverageType : ObjectGraphType<AverageCount>
    {
        public AverageType(IProductReviewService productReviewService)
        {
            Name = "Average";
            Field(b => b.Average);
            Field(b => b.StarsFive);
            Field(b => b.StarsFour);
            Field(b => b.StarsThree);
            Field(b => b.StarsTwo);
            Field(b => b.StarsOne);
            Field(b => b.Total);
        }
    }
}
