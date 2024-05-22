using System;
using System.Collections.Generic;
using System.Text;

namespace ReviewsRatings.Models
{
    public class ValidatedUser
    {
        public string AuthStatus { get; set; }
        public string Id { get; set; }
        public string User { get; set; }    // email
        public string Account { get; set; }
        public string Audience { get; set; }
        public string TokenType { get; set; }
    }
}
