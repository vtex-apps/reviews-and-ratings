using System;
using System.Collections;
using Microsoft.AspNetCore.Http;
using GraphQL;

namespace ReviewsRatings.Errors
{
    public class UserInputError : ExecutionError
    {
        public UserInputError(string message) : base(message)
        {

            Code = "BAD_USER_INPUT";
            Data.Add(Constants.ExecutionErrorStatusCode, StatusCodes.Status400BadRequest);
        }

        protected UserInputError(string message, IDictionary data) : base(message, data)
        {
        }

        protected UserInputError(string message, Exception exception) : base(message, exception)
        {
        }
    }
}