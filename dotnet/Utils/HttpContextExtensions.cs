using Microsoft.AspNetCore.Http;

namespace ReviewsRatings.Utils
{
    public static class HttpContextExtensions
    {
        public static string GetAccount(this HttpContext @this)
        {
            return @this.Request.Headers["x-vtex-account"];
        }

        public static string GetWorkspace(this HttpContext @this)
        {
            return @this.Request.Headers["x-vtex-workspace"];
        }

        public static string GetAuthToken(this HttpContext @this)
        {
            return @this.Request.Headers["x-vtex-credential"];
        }

        public static string GetCaller(this HttpContext @this)
        {
            return @this.Request.Headers["x-vtex-caller"];
        }
    }
}