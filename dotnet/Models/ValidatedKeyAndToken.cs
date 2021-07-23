using System;
using System.Collections.Generic;
using System.Text;

namespace ReviewsRatings.Models
{
    public class ValidatedKeyAndToken
    {
        public string AuthStatus { get; set; }
        public string Token { get; set; }
        public string Expires { get; set; }
    }
}
