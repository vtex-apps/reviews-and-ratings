using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace ReviewsRatings.Models
{
    public class AverageCount
    {
        [JsonProperty("average")]
        public decimal Average { get; set; }

        [JsonProperty("starsFive")]
        public int StarsFive { get; set; }

        [JsonProperty("starsFour")]
        public int StarsFour { get; set; }

        [JsonProperty("starsThree")]
        public int StarsThree { get; set; }

        [JsonProperty("starsTwo")]
        public int StarsTwo { get; set; }

        [JsonProperty("starsOne")]
        public int StarsOne { get; set; }

        [JsonProperty("total")]
        public int Total { get; set; }
    }
}
