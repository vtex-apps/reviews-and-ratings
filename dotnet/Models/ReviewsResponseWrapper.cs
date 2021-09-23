using System;
using System.Collections.Generic;
using System.Text;

namespace ReviewsRatings.Models
{
    public class ReviewsResponseWrapper
    {
        public IList<Review> Reviews { get; set; }
        public SearchRange Range { get; set; }
    }
}
