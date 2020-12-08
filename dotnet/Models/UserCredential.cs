using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace ReviewsRatings.Models
{
    public class UserCredential
    {
        [JsonProperty("authStatus")]
        public string AuthStatus { get; set; }

        [JsonProperty("id")]
        public string Id { get; set; }

        [JsonProperty("user")]
        public string User { get; set; }
    }
}
