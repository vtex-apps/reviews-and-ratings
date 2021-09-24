using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using ReviewsRatings.Models;
using ReviewsRatings.Services;
using System;
using System.Collections.Generic;
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
                        List<int> ids = new List<int>();
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
                int[] ids;
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

                        ids = new int[1];
                        ids[0] = int.Parse(id);
                        return Json(await this._productReviewsService.DeleteReview(ids));
                        break;
                    case REVIEWS:
                        if (!keyAndTokenValid)
                        {
                            return Unauthorized();
                        }

                        string bodyAsText = await new System.IO.StreamReader(HttpContext.Request.Body).ReadToEndAsync();
                        ids = JsonConvert.DeserializeObject<int[]>(bodyAsText);
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
                var queryString = HttpContext.Request.Query;
                var searchTerm = queryString["search_term"];
                var fromParam = queryString["from"];
                var toParam = queryString["to"];
                var orderBy = queryString["order_by"];
                var status = queryString["status"];
                var productId = queryString["product_id"];
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
                        IList<Review> searchResult = null;
                        int totalCount = 0;

                        if (!string.IsNullOrEmpty(productId))
                        {
                            searchResult = await _productReviewsService.GetReviewsByProductId(productId);
                        }
                        else
                        {
                            searchResult = await _productReviewsService.GetReviews();
                        }

                        IList<Review> searchData = await _productReviewsService.FilterReviews(searchResult, searchTerm, orderBy, status);
                        totalCount = searchData.Count;
                        searchData = await _productReviewsService.LimitReviews(searchData, from, to);

                        SearchResponse searchResponse = new SearchResponse
                        {
                            Data = new DataElement { data = searchData },
                            Range = new SearchRange { From = from, To = to, Total = totalCount }
                        };

                        return Json(searchResponse);
                        break;
                    case RATING:
                        decimal average = await _productReviewsService.GetAverageRatingByProductId(id);
                        searchResult = await _productReviewsService.GetReviewsByProductId(id);
                        totalCount = searchResult.Count;
                        RatingResponse ratingResponse = new RatingResponse
                        {
                            Average = average,
                            TotalCount = totalCount
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
    }
}
