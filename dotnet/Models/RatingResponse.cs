using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace ReviewsRatings.Models
{
    public class RatingResponse
    {
        [JsonProperty("average")]
        public decimal Average { get; set; }

        [JsonProperty("totalCount")]
        public long TotalCount { get; set; }
    }
}
