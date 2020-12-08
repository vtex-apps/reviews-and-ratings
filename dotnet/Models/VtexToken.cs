using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace ReviewsRatings.Models
{
    public class VtexToken
    {
        [JsonProperty("token")]
        public string Token { get; set; }
    }
}
