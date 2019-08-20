using System;
using System.Collections;
using Microsoft.AspNetCore.Http;
using GraphQL;

namespace ReviewsRatings.Errors
{
    public class AuthenticationError : ExecutionError
    {
        public AuthenticationError(string message) : base(message)
        {
            Code = "UNAUTHENTICATED";
            Data.Add(Constants.ExecutionErrorStatusCode, StatusCodes.Status401Unauthorized);
        }
        protected AuthenticationError(string message, IDictionary data) : base(message, data)
        {
        }

        protected AuthenticationError(string message, Exception exception) : base(message, exception)
        {
        }
    }
}