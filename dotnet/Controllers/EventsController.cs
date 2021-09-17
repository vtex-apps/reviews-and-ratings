using Microsoft.AspNetCore.Mvc;
using ReviewsRatings.Models;
using ReviewsRatings.Services;
using System;
using System.Threading.Tasks;
using Vtex.Api.Context;

namespace ReviewsRatings.Controllers
{
    public class EventsController : Controller
    {
        private readonly IProductReviewService _productReviewService;
        private readonly IIOServiceContext _context;

        public EventsController(IProductReviewService productReviewService, IIOServiceContext context)
        {
            this._productReviewService = productReviewService ?? throw new ArgumentNullException(nameof(productReviewService));
            this._context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public async Task OnAppInstalled([FromBody] AppInstalledEvent @event)
        {
            if (@event.To.Id.Contains("vtex.reviews-and-ratings"))
            {
                await _productReviewService.VerifySchema();
            }
        }
    }
}
