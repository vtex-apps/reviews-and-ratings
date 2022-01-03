using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using ReviewsRatings.Models;
using ReviewsRatings.Services;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ReviewsRatings.Controllers
{
    public class RoutesController : Controller
    {
        private readonly IProductReviewService _productReviewsService;

        private const string REVIEW = "review";
        private const string REVIEWS = "reviews";
        private const string RATING = "rating";
        private const string HEADER_VTEX_COOKIE = "VtexIdclientAutCookie";
        private const string AUTH_SUCCESS = "Success";
        private const string HEADER_VTEX_APP_KEY = "X-VTEX-API-AppKey";
        private const string HEADER_VTEX_APP_TOKEN = "X-VTEX-API-AppToken";
        private const string FORWARDED_HOST = "X-Forwarded-Host";

        public RoutesController(IProductReviewService productReviewsService)
        {
            this._productReviewsService = productReviewsService ?? throw new ArgumentNullException(nameof(productReviewsService));
        }

        public async Task<IActionResult> ReviewApiAction(string requestedAction)
        {
            var queryString = HttpContext.Request.Query;
            var id = queryString["id"];
            return await ProcessReviewApiAction(requestedAction, id);
        }

        public async Task<IActionResult> ReviewApiActionId(string requestedAction, string id)
        {
            return await ProcessReviewApiAction(requestedAction, id);
        }

        public async Task<IActionResult> ProcessReviewApiAction(string requestedAction, string id)
        {
            Response.Headers.Add("Cache-Control", "public, max-age=300, stale-while-revalidate=3600, stale-if-error=3600");
            string responseString = string.Empty;
            string vtexCookie = HttpContext.Request.Headers[HEADER_VTEX_COOKIE];
            ValidatedUser validatedUser = null;
            bool userValidated = false;
            bool keyAndTokenValid = false;
            string vtexAppKey = HttpContext.Request.Headers[HEADER_VTEX_APP_KEY];
            string vtexAppToken = HttpContext.Request.Headers[HEADER_VTEX_APP_TOKEN];
            if (!string.IsNullOrEmpty(vtexCookie))
            {
                validatedUser = await this._productReviewsService.ValidateUserToken(vtexCookie);
                if (validatedUser != null)
                {
                    if (validatedUser.AuthStatus.Equals(AUTH_SUCCESS))
                    {
                        userValidated = true;
                    }
                }
            }

            if (!string.IsNullOrEmpty(vtexAppKey) && !string.IsNullOrEmpty(vtexAppToken))
            {
                string baseUrl = HttpContext.Request.Headers[FORWARDED_HOST];
                keyAndTokenValid = await this._productReviewsService.ValidateKeyAndToken(vtexAppKey, vtexAppToken, baseUrl);
            }

            if (string.IsNullOrEmpty(requestedAction))
            {
                return BadRequest("Missing parameter");
            }

            if ("post".Equals(HttpContext.Request.Method, StringComparison.OrdinalIgnoreCase))
            {
                string bodyAsText = await new System.IO.StreamReader(HttpContext.Request.Body).ReadToEndAsync();
                switch (requestedAction)
                {
                    case REVIEW:
                        if (!userValidated)
                        {
                            return Unauthorized("Invalid User");
                        }

                        Review newReview = JsonConvert.DeserializeObject<Review>(bodyAsText);
                        bool hasShopperReviewed = await _productReviewsService.HasShopperReviewed(validatedUser.User, newReview.ProductId);
                        if (hasShopperReviewed)
                        {
                            return Json("Duplicate Review");
                        }

                        bool hasShopperPurchased = await _productReviewsService.ShopperHasPurchasedProduct(validatedUser.User, newReview.ProductId);

                        Review reviewToSave = new Review
                        {
                            ProductId = newReview.ProductId,
                            Rating = newReview.Rating,
                            ShopperId = validatedUser.User,
                            Title = newReview.Title,
                            Text = newReview.Text,
                            VerifiedPurchaser = hasShopperPurchased
                        };

                        var reviewResponse = await this._productReviewsService.NewReview(reviewToSave, false);
                        return Json(reviewResponse.Id);
                        break;
                    case REVIEWS:
                        if (!keyAndTokenValid)
                        {
                            return Unauthorized();
                        }

                        IList<Review> reviews = JsonConvert.DeserializeObject<IList<Review>>(bodyAsText);
                        List<string> ids = new List<string>();
                        foreach (Review review in reviews)
                        {
                            var reviewsResponse = await this._productReviewsService.NewReview(review, false);
                            ids.Add(reviewsResponse.Id);
                        }

                        return Json(ids);
                        break;
                }
            }
            else if ("delete".Equals(HttpContext.Request.Method, StringComparison.OrdinalIgnoreCase))
            {
                string[] ids;
                switch (requestedAction)
                {
                    case REVIEW:
                        if (!userValidated && !keyAndTokenValid)
                        {
                            return Json("Invalid User");
                        }

                        if (string.IsNullOrEmpty(id))
                        {
                            return BadRequest("Missing parameter.");
                        }

                        ids = new string[1];
                        ids[0] = id;
                        return Json(await this._productReviewsService.DeleteReview(ids));
                        break;
                    case REVIEWS:
                        if (!keyAndTokenValid)
                        {
                            return Unauthorized();
                        }

                        string bodyAsText = await new System.IO.StreamReader(HttpContext.Request.Body).ReadToEndAsync();
                        ids = JsonConvert.DeserializeObject<string[]>(bodyAsText);
                        return Json(await this._productReviewsService.DeleteReview(ids));
                        break;
                }
            }
            else if ("patch".Equals(HttpContext.Request.Method, StringComparison.OrdinalIgnoreCase))
            {
                switch (requestedAction)
                {
                    case REVIEW:
                        if (!userValidated && !keyAndTokenValid)
                        {
                            return Json("Invalid User");
                        }

                        string bodyAsText = await new System.IO.StreamReader(HttpContext.Request.Body).ReadToEndAsync();
                        Review review = JsonConvert.DeserializeObject<Review>(bodyAsText);
                        return Json(await this._productReviewsService.EditReview(review));
                        break;
                }
            }
            else if ("get".Equals(HttpContext.Request.Method, StringComparison.OrdinalIgnoreCase))
            {
                ReviewsResponseWrapper wrapper = null;
                var queryString = HttpContext.Request.Query;
                var searchTerm = queryString["search_term"];
                var fromParam = queryString["from"];
                var toParam = queryString["to"];
                var orderBy = queryString["order_by"];
                var status = queryString["status"];
                var productId = queryString["product_id"];
                int rating = 0;
                string ratingQS = queryString["rating"];
                switch (requestedAction)
                {
                    case REVIEW:
                        if (string.IsNullOrEmpty(id))
                        {
                            return BadRequest("Missing parameter.");
                        }

                        Review review = await this._productReviewsService.GetReview(int.Parse(id));
                        return Json(review);
                        break;
                    case REVIEWS:
                        IList<Review> reviews;
                        if (!string.IsNullOrEmpty(ratingQS))
                        {
                            int.TryParse(ratingQS, out rating);
                        }

                        if (string.IsNullOrEmpty(fromParam))
                        {
                            fromParam = "0";
                        }

                        if (string.IsNullOrEmpty(toParam))
                        {
                            toParam = "3";
                        }

                        int from = int.Parse(fromParam);
                        int to = int.Parse(toParam);

                        if (!string.IsNullOrEmpty(productId))
                        {
                            wrapper = await _productReviewsService.GetReviewsByProductId(productId, from, to, orderBy, searchTerm, rating);
                        }
                        else
                        {
                            wrapper = await _productReviewsService.GetReviews(searchTerm, from, to, orderBy, status);
                        }

                        SearchResponse searchResponse = new SearchResponse
                        {
                            Data = new DataElement { data = wrapper.Reviews },
                            Range = wrapper.Range
                        };

                        return Json(searchResponse);
                        break;
                    case RATING:
                        decimal average = await _productReviewsService.GetAverageRatingByProductId(id);
                        wrapper = await _productReviewsService.GetReviewsByProductId(id);
                        RatingResponse ratingResponse = new RatingResponse
                        {
                            Average = average,
                            TotalCount = wrapper.Range.Total
                        };

                        return Json(ratingResponse);
                }
            }

            return Json(responseString);
        }

        public async Task<IActionResult> ClearData()
        {
            Response.Headers.Add("Cache-Control", "no-cache");
            await _productReviewsService.ClearData();

            return Json("Done");
        }

        public async Task<IActionResult> VerifySchema()
        {
            Response.Headers.Add("Cache-Control", "no-cache");
            string result = await _productReviewsService.VerifySchema();

            return Json(result);
        }

        public async Task<IActionResult> MigrateData()
        {
            Response.Headers.Add("Cache-Control", "no-cache");
            string result = string.Empty;
            if ("post".Equals(HttpContext.Request.Method, StringComparison.OrdinalIgnoreCase))
            {
                try
                {
                    string bodyAsText = await new System.IO.StreamReader(HttpContext.Request.Body).ReadToEndAsync();
                    List<string> productIds = JsonConvert.DeserializeObject<List<string>>(bodyAsText);
                    result = await _productReviewsService.MigrateData(productIds);
                }
                catch(Exception ex)
                {
                    result = $"Error migrating data {ex.Message}";
                }
            }
            else if ("get".Equals(HttpContext.Request.Method, StringComparison.OrdinalIgnoreCase))
            {
                try
                {
                    result = await _productReviewsService.MigrateData();
                }
                catch (Exception ex)
                {
                    result = $"Error migrating data {ex.Message}";
                }
            }

            return Json(result);
        }

        public async Task<IActionResult> AddSearchDate()
        {
            Response.Headers.Add("Cache-Control", "no-cache");
            try
            {
                await _productReviewsService.AddSearchDate();
            }
            catch(Exception ex)
            {
                return Json("False");
            }

            return Json("Done");
        }

        public async Task<IActionResult> CreateTestReviews()
        {
            Response.Headers.Add("Cache-Control", "no-cache");
            StringBuilder sb = new StringBuilder();
            Random rnd = new Random();
            for (int i = 0; i < 10; i++)
            {
                LegacyReview review = new LegacyReview
                {
                    Approved = true,
                    Location = "nowhere",
                    ProductId = rnd.Next(100, 99999).ToString(),
                    Rating = rnd.Next(1, 5),
                    ReviewerName = "Test Reviewer",
                    ShopperId = "test@test.com",
                    VerifiedPurchaser = true,
                    Title = "Test Review",
                    Text = "This is a test Review."
                };

                LegacyReview result = await _productReviewsService.NewReviewLegacy(review);

                sb.AppendLine($"[{i}] {result.Id} {result.ProductId}");
            }

            return Json(sb.ToString());
        }
    }
}
