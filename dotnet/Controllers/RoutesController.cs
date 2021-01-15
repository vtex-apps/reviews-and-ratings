using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using ReviewsRatings.DataSources;
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
        private const string HEADER_KEY = "key";

        public RoutesController(IProductReviewService productReviewsService)
        {
            this._productReviewsService = productReviewsService ?? throw new ArgumentNullException(nameof(productReviewsService));
        }

        public async Task<IActionResult> ReviewApiAction(string requestedAction)
        {
            Response.Headers.Add("Cache-Control", "no-cache");
            string responseString = string.Empty;
            string key = HttpContext.Request.Headers[HEADER_KEY];
            if(string.IsNullOrEmpty(key))
            {
                return Unauthorized("10");
            }
            else
            {
                AppSettings appSettings = await this._productReviewsService.GetAppSettings();
                Console.WriteLine($"AppSettings = {JsonConvert.SerializeObject(appSettings)}");
                if(appSettings != null && appSettings.merchantKey != null)
                {
                    if(!appSettings.merchantKey.Equals(key))
                    {
                        return Unauthorized("11");
                    }
                }
                else
                {
                    //DEBUG!!
                    //return Unauthorized("12");
                }
            }

            if(string.IsNullOrEmpty(requestedAction))
            {
                return BadRequest("20");
            }

            if ("post".Equals(HttpContext.Request.Method, StringComparison.OrdinalIgnoreCase))
            {
                string bodyAsText = await new System.IO.StreamReader(HttpContext.Request.Body).ReadToEndAsync();
                switch (requestedAction)
                {
                    case REVIEW:
                        Review newReview = JsonConvert.DeserializeObject<Review>(bodyAsText);
                        var reviewResponse = await this._productReviewsService.NewReview(newReview);
                        return Json(reviewResponse);
                        break;
                    case REVIEWS:
                        IList<Review> reviews = JsonConvert.DeserializeObject<IList<Review>>(bodyAsText);
                        foreach(Review review in reviews)
                        {
                            var reviewsResponse = await this._productReviewsService.NewReview(review);
                        }

                        break;
                }
            }
            else if("delete".Equals(HttpContext.Request.Method, StringComparison.OrdinalIgnoreCase))
            {
                int[] ids = null;
                switch (requestedAction)
                {
                    case REVIEW:
                            var queryString = HttpContext.Request.Query;
                            var id = queryString["id"];
                            ids = new int[1];
                            ids[0] = int.Parse(id);
                            return Json(await this._productReviewsService.DeleteReview(ids));
                        break;
                    case REVIEWS:
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
                        string bodyAsText = await new System.IO.StreamReader(HttpContext.Request.Body).ReadToEndAsync();
                        Review review = JsonConvert.DeserializeObject<Review>(bodyAsText);
                        return Json(await this._productReviewsService.EditReview(review));
                        break;
                }
            }
            else if("get".Equals(HttpContext.Request.Method, StringComparison.OrdinalIgnoreCase))
            {
                var queryString = HttpContext.Request.Query;
                var id = queryString["id"];
                var searchTerm = queryString["search_term"];
                var from = queryString["from"];
                var to = queryString["to"];
                var orderBy = queryString["order_by"];
                var status = queryString["status"];
                //Console.WriteLine($"query id ======== {id} ");
                switch (requestedAction)
                {
                    case REVIEW:
                        Review review = await this._productReviewsService.GetReview(int.Parse(id));
                        //responseString = JsonConvert.SerializeObject(review);
                        return Json(review);
                        break;
                    case REVIEWS:
                        var reviews = await this._productReviewsService.GetReviews(searchTerm, int.Parse(from), int.Parse(to), orderBy, status);
                        //responseString = JsonConvert.SerializeObject(reviews);
                        return Json(reviews);
                        break;
                }
            }

            return Json(responseString);
        }
    }
}
