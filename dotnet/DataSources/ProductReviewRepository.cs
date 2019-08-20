namespace ReviewsRatings.DataSources
{
    using System;
    using System.Collections.Generic;
    using System.Net;
    using System.Net.Http;
    using System.Text;
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Http;
    using Newtonsoft.Json;
    using ReviewsRatings.Models;
    using ReviewsRatings.Services;

    public class ProductReviewRepository : IProductReviewRepository
    {
        private const string BUCKET = "productReviews";
        private const string HEADER_VTEX_CREDENTIAL = "X-Vtex-Credential";
        private const string APPLICATION_JSON = "application/json";
        private readonly IVtexEnvironmentVariableProvider _environmentVariableProvider;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly HttpClient _httpClient;
        private readonly string _applicationName;
        private string AUTHORIZATION_HEADER_NAME;


        public ProductReviewRepository(IVtexEnvironmentVariableProvider environmentVariableProvider, IHttpContextAccessor httpContextAccessor, HttpClient httpClient)
        {
            this._environmentVariableProvider = environmentVariableProvider ??
                                                throw new ArgumentNullException(nameof(environmentVariableProvider));

            this._httpContextAccessor = httpContextAccessor ??
                                        throw new ArgumentNullException(nameof(httpContextAccessor));

            this._httpClient = httpClient ??
                               throw new ArgumentNullException(nameof(httpClient));

            this._applicationName =
                $"{this._environmentVariableProvider.ApplicationVendor}.{this._environmentVariableProvider.ApplicationName}";

            AUTHORIZATION_HEADER_NAME = "Authorization";
        }


        public async Task<IList<Review>> GetProductReviewsAsync(string productId)
        {
            Console.WriteLine($"GetProductReview called with {this._environmentVariableProvider.Account},{this._environmentVariableProvider.Workspace},{this._environmentVariableProvider.ApplicationName},{this._environmentVariableProvider.ApplicationVendor},{this._environmentVariableProvider.Region}");

            var request = new HttpRequestMessage
            {
                Method = HttpMethod.Get,
                RequestUri = new Uri($"http://vbase.{this._environmentVariableProvider.Region}.vtex.io/{this._environmentVariableProvider.Account}/{this._environmentVariableProvider.Workspace}/buckets/{this._applicationName}/{BUCKET}/files/{productId}"),
            };

            string authToken = this._httpContextAccessor.HttpContext.Request.Headers[HEADER_VTEX_CREDENTIAL];
            if (authToken != null)
            {
                request.Headers.Add(AUTHORIZATION_HEADER_NAME, authToken);
            }

            var response = await _httpClient.SendAsync(request);
            string responseContent = await response.Content.ReadAsStringAsync();

            if (response.StatusCode == HttpStatusCode.NotFound)
            {
                return null;
            }

            response.EnsureSuccessStatusCode();

            IList<Review> productReviews =  JsonConvert.DeserializeObject<IList<Review>>(responseContent);
            return productReviews;
        }

        public async Task SaveProductReviewsAsync(string productId,IList<Review> productReviews)
        {
            if (productReviews == null)
            {
                productReviews = new List<Review>();
            }

            var jsonSerializedProducReviews = JsonConvert.SerializeObject(productReviews);
            var request = new HttpRequestMessage
            {
                Method = HttpMethod.Put,
                RequestUri = new Uri($"http://vbase.{this._environmentVariableProvider.Region}.vtex.io/{this._environmentVariableProvider.Account}/{this._environmentVariableProvider.Workspace}/buckets/{this._applicationName}/{BUCKET}/files/{productId}"),
                Content = new StringContent(jsonSerializedProducReviews, Encoding.UTF8, APPLICATION_JSON)
            };

            string authToken = this._httpContextAccessor.HttpContext.Request.Headers[HEADER_VTEX_CREDENTIAL];
            if (authToken != null)
            {
                request.Headers.Add(AUTHORIZATION_HEADER_NAME, authToken);
            }

            var response = await _httpClient.SendAsync(request);

            response.EnsureSuccessStatusCode();
        }

    }
}
