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
            await this.VerifySchema();
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
                if (validatedUser != null && validatedUser.AuthStatus.Equals(AUTH_SUCCESS))
                {
                    userValidated = true;
                }
            }

            if (!string.IsNullOrEmpty(vtexAppKey) && !string.IsNullOrEmpty(vtexAppToken))
            {
                string baseUrl = HttpContext.Request.Headers[FORWARDED_HOST];
                keyAndTokenValid = await this._productReviewsService.ValidateKeyAndToken(vtexAppKey, vtexAppToken, baseUrl);
                if(keyAndTokenValid)
                {
                    await VerifySchema();
                }
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

                        if(string.IsNullOrEmpty(newReview.ProductId))
                        {
                            return BadRequest("ProductId is missing.");
                        }
                        if(newReview.Rating == null)
                        {
                            return BadRequest("Rating is missing.");
                        }
                        if(string.IsNullOrEmpty(newReview.Title))
                        {
                            return BadRequest("Title is missing.");
                        }
                        if(string.IsNullOrEmpty(newReview.Text))
                        {
                            return BadRequest("Text is missing.");
                        }
                        if(string.IsNullOrEmpty(newReview.ReviewerName))
                        {
                            return BadRequest("ReviewerName is missing.");
                        }
                        if(newReview.Approved == null)
                        {
                            return BadRequest("Approved is missing.");
                        }

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
                            ReviewerName = newReview.ReviewerName,
                            ReviewDateTime = newReview.ReviewDateTime,
                            VerifiedPurchaser = hasShopperPurchased,
                            Approved = newReview.Approved
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
                            if(review.VerifiedPurchaser == null)
                            {
                                review.VerifiedPurchaser = false;
                            }
                            if(string.IsNullOrEmpty(review.ProductId))
                            {
                                return BadRequest("ProductId is missing for one or more reviews.");
                            }
                            if(review.Rating == null)
                            {
                                return BadRequest("Rating is missing for one or more reviews.");
                            }
                            if(string.IsNullOrEmpty(review.Title))
                            {
                                return BadRequest("Title is missing for one or more reviews.");
                            }
                            if(string.IsNullOrEmpty(review.Text))
                            {
                                return BadRequest("Text is missing for one or more reviews.");
                            }
                            if(string.IsNullOrEmpty(review.ReviewerName))
                            {
                                return BadRequest("ReviewerName is missing for one or more reviews.");
                            }
                            if(review.Approved == null)
                            {
                                return BadRequest("Approved is missing for one or more reviews.");
                            }
                        }
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
                    case REVIEWS:
                        if (!keyAndTokenValid)
                        {
                            return Unauthorized();
                        }

                        string bodyAsText = await new System.IO.StreamReader(HttpContext.Request.Body).ReadToEndAsync();
                        ids = JsonConvert.DeserializeObject<string[]>(bodyAsText);
                        return Json(await this._productReviewsService.DeleteReview(ids));
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
                        review.Id = id;
                        return Json(await this._productReviewsService.EditReview(review));
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
                var locale = queryString["locale"];
                var boolValue = queryString["pastReviews"];
                bool pastReviews = false;
                bool.TryParse(boolValue, out pastReviews);
                switch (requestedAction)
                {
                    case REVIEW:
                        if (string.IsNullOrEmpty(id))
                        {
                            return BadRequest("Missing parameter.");
                        }

                        Review review = await this._productReviewsService.GetReview(id);
                        return Json(review);
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
                            wrapper = await _productReviewsService.GetReviewsByProductId(productId, from, to, orderBy, searchTerm, rating, locale, pastReviews);
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
                    case RATING:
                        AverageCount average = await _productReviewsService.GetAverageRatingByProductId(id);
                        wrapper = await _productReviewsService.GetReviewsByProductId(id);
                        RatingResponse ratingResponse = new RatingResponse
                        {
                            Average = average.Average,
                            StarsFive = average.StarsFive,
                            StarsFour = average.StarsFour,
                            StarsThree = average.StarsThree,
                            StarsTwo = average.StarsTwo,
                            StarsOne = average.StarsOne,
                            TotalCount = wrapper.Range.Total
                        };

                        return Json(ratingResponse);
                }
            }

            return Json(responseString);
        }

        public async Task<IActionResult> ClearData()
        {
            await _productReviewsService.ClearData();

            return Json("Done");
        }

        public async Task<IActionResult> VerifySchema()
        {
            string result = await _productReviewsService.VerifySchema();

            return Json(result);
        }

        public async Task<IActionResult> VerifyMigration()
        {
            string result = await _productReviewsService.VerifyMigration();

            return Json(result);
        }

        public async Task<IActionResult> SuccessfulMigration()
        {
            string result = await _productReviewsService.SuccessfulMigration();

            return Json(result);
        }

        public async Task<IActionResult> MigrateData()
        {
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
            StringBuilder sb = new StringBuilder();
            Random rnd = new Random();
            for (int i = 0; i < 10; i++)
            {
                LegacyReview review = new LegacyReview
                {
                    Approved = true,
                    Location = "nowhere",
                    Locale = "nowhere",
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
