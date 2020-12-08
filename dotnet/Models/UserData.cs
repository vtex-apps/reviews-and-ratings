using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace ReviewsRatings.Models
{
    public class UserData
    {
        //[JsonProperty("id")]
        //public string Id { get; set; }

        //[JsonProperty("name")]
        //public string Name { get; set; }

        //[JsonProperty("email")]
        //public string Email { get; set; }

        [JsonProperty("UserId")]
        public string UserId { get; set; }

        [JsonProperty("Login")]
        public string Login { get; set; }

        [JsonProperty("Name")]
        public string Name { get; set; }

        [JsonProperty("IsAdmin")]
        public bool IsAdmin { get; set; }

        [JsonProperty("IsReliable")]
        public bool IsReliable { get; set; }

        [JsonProperty("IsBlocked")]
        public bool IsBlocked { get; set; }

        [JsonProperty("Require2FA")]
        public bool Require2Fa { get; set; }
    }
}
