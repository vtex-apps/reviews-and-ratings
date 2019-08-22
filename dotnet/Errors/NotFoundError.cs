using System;
using System.Collections;
using GraphQL;
using Microsoft.AspNetCore.Http;

namespace ReviewsRatings.Errors
{
    public class NotFoundError : ExecutionError
    {
        public NotFoundError(string message) : base(message)
        {
            Code = "NOT_FOUND";
            Data.Add(Constants.ExecutionErrorStatusCode, StatusCodes.Status404NotFound);
        }

        protected NotFoundError(string message, IDictionary data) : base(message, data)
        {
        }

        protected NotFoundError(string message, Exception exception) : base(message, exception)
        {
        }
    }
}