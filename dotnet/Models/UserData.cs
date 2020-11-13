using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace ReviewsRatings.Models
{
    public class UserData
    {
        [JsonProperty("id")]
        public string Id { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("email")]
        public string Email { get; set; }
    }
}
