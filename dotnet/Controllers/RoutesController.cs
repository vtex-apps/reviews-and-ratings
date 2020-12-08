using Microsoft.AspNetCore.Mvc;
using ReviewsRatings.Services;
using System;
using System.Threading.Tasks;

namespace ReviewsRatings.Controllers
{
    public class RoutesController : Controller
    {
        private readonly IProductReviewService _productReviewsService;

        public RoutesController(IProductReviewService productReviewsService)
        {
            this._productReviewsService = productReviewsService ?? throw new ArgumentNullException(nameof(productReviewsService));
        }

        public void ClearData()
        {
            _productReviewsService.ClearData();
        }

        public async Task<IActionResult> GetUserData()
        {
            return Json(await _productReviewsService.GetUserData());
        }
    }
}
