﻿namespace ReviewsRatings.DataSources
{
    using System;
    using System.Collections.Generic;
    using System.Net;
    using System.Net.Http;
    using System.Text;
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Http;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Linq;
    using ReviewsRatings.Models;
    using ReviewsRatings.Services;

    public class ProductReviewRepository : IProductReviewRepository
    {
        private const string REVIEWS_BUCKET = "productReviews";
        private const string LOOKUP = "productLookup";
        private const string HEADER_VTEX_CREDENTIAL = "X-Vtex-Credential";
        private const string HEADER_VTEX_WORKSPACE = "X-Vtex-Workspace";
        private const string HEADER_VTEX_ACCOUNT = "X-Vtex-Account";
        private const string APPLICATION_JSON = "application/json";
        private const string USE_HTTPS_HEADER_NAME = "X-Vtex-Use-Https";
        private const string VTEX_ACCOUNT_HEADER_NAME = "X-Vtex-Account";
        public const string PROXY_AUTHORIZATION_HEADER_NAME = "Proxy-Authorization";
        public const string VtexIdCookie = "VtexIdclientAutCookie";
        private readonly IVtexEnvironmentVariableProvider _environmentVariableProvider;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IHttpClientFactory _clientFactory;
        private readonly string _applicationName;
        private string AUTHORIZATION_HEADER_NAME;


        public ProductReviewRepository(IVtexEnvironmentVariableProvider environmentVariableProvider, IHttpContextAccessor httpContextAccessor, IHttpClientFactory clientFactory)
        {
            this._environmentVariableProvider = environmentVariableProvider ??
                                                throw new ArgumentNullException(nameof(environmentVariableProvider));

            this._httpContextAccessor = httpContextAccessor ??
                                        throw new ArgumentNullException(nameof(httpContextAccessor));

            this._clientFactory = clientFactory ??
                               throw new ArgumentNullException(nameof(clientFactory));

            this._applicationName =
                $"{this._environmentVariableProvider.ApplicationVendor}.{this._environmentVariableProvider.ApplicationName}";

            AUTHORIZATION_HEADER_NAME = "Authorization";
        }


        public async Task<IList<Review>> GetProductReviewsAsync(string productId)
        {
            Console.WriteLine($"GetProductReview called with {this._httpContextAccessor.HttpContext.Request.Headers[HEADER_VTEX_ACCOUNT]},{this._httpContextAccessor.HttpContext.Request.Headers[HEADER_VTEX_WORKSPACE]},{this._environmentVariableProvider.ApplicationName},{this._environmentVariableProvider.ApplicationVendor},{this._environmentVariableProvider.Region}");

            var request = new HttpRequestMessage
            {
                Method = HttpMethod.Get,
                RequestUri = new Uri($"http://infra.io.vtex.com/vbase/v2/{this._httpContextAccessor.HttpContext.Request.Headers[HEADER_VTEX_ACCOUNT]}/{this._httpContextAccessor.HttpContext.Request.Headers[HEADER_VTEX_WORKSPACE]}/buckets/{this._applicationName}/{REVIEWS_BUCKET}/files/{productId}"),
            };

            string authToken = this._httpContextAccessor.HttpContext.Request.Headers[HEADER_VTEX_CREDENTIAL];
            if (authToken != null)
            {
                request.Headers.Add(AUTHORIZATION_HEADER_NAME, authToken);
            }

            var client = _clientFactory.CreateClient();
            var response = await client.SendAsync(request);
            string responseContent = await response.Content.ReadAsStringAsync();

            if (response.StatusCode == HttpStatusCode.NotFound)
            {
                return null;
            }

            response.EnsureSuccessStatusCode();

            // responseContent = Utils.ReviewSanitizer.SantizeReviewText(responseContent);

            //Console.WriteLine($"Before DeserializeObject");
            IList<Review> productReviews = null;
            try
            {
                productReviews = JsonConvert.DeserializeObject<IList<Review>>(responseContent);
            }
            catch(Exception ex)
            {
                Console.WriteLine($"DeserializeObject Error: {ex.Message} ");
                Console.WriteLine($"{{\"__VTEX_IO_LOG\":true, \"service\":\"review\", \"error\":\"{ex.Message}\", \"productId\":\"{productId}\"}}");
            }

            //Console.WriteLine($"productReviews.Count = {productReviews.Count}");
            return productReviews;
        }

        public async Task SaveProductReviewsAsync(string productId, IList<Review> productReviews)
        {
            Console.WriteLine($"        >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> SaveProductReviewsAsync for [{productId}]");

            if (productReviews == null)
            {
                productReviews = new List<Review>();
            }

            var jsonSerializedProducReviews = JsonConvert.SerializeObject(productReviews);
            var request = new HttpRequestMessage
            {
                Method = HttpMethod.Put,
                RequestUri = new Uri($"http://infra.io.vtex.com/vbase/v2/{this._httpContextAccessor.HttpContext.Request.Headers[HEADER_VTEX_ACCOUNT]}/{this._httpContextAccessor.HttpContext.Request.Headers[HEADER_VTEX_WORKSPACE]}/buckets/{this._applicationName}/{REVIEWS_BUCKET}/files/{productId}"),
                Content = new StringContent(jsonSerializedProducReviews, Encoding.UTF8, APPLICATION_JSON)
            };

            string authToken = this._httpContextAccessor.HttpContext.Request.Headers[HEADER_VTEX_CREDENTIAL];
            if (authToken != null)
            {
                request.Headers.Add(AUTHORIZATION_HEADER_NAME, authToken);
            }

            var client = _clientFactory.CreateClient();
            var response = await client.SendAsync(request);

            response.EnsureSuccessStatusCode();

            // Console.WriteLine($"        >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> {response.IsSuccessStatusCode} {response.ReasonPhrase}");
        }

        public async Task<IDictionary<int, string>> LoadLookupAsync()
        {
            var request = new HttpRequestMessage
            {
                Method = HttpMethod.Get,
                RequestUri = new Uri($"http://infra.io.vtex.com/vbase/v2/{this._httpContextAccessor.HttpContext.Request.Headers[HEADER_VTEX_ACCOUNT]}/{this._httpContextAccessor.HttpContext.Request.Headers[HEADER_VTEX_WORKSPACE]}/buckets/{this._applicationName}/{REVIEWS_BUCKET}/files/{LOOKUP}"),
            };

            string authToken = this._httpContextAccessor.HttpContext.Request.Headers[HEADER_VTEX_CREDENTIAL];
            if (authToken != null)
            {
                request.Headers.Add(AUTHORIZATION_HEADER_NAME, authToken);
            }

            var client = _clientFactory.CreateClient();
            var response = await client.SendAsync(request);
            string responseContent = await response.Content.ReadAsStringAsync();

            if (response.StatusCode == HttpStatusCode.NotFound)
            {
                return null;
            }

            response.EnsureSuccessStatusCode();

            IDictionary<int, string> lookupDictionary = JsonConvert.DeserializeObject<IDictionary<int, string>>(responseContent);

            return lookupDictionary;
        }

        public async Task SaveLookupAsync(IDictionary<int, string> lookupDictionary)
        {
            if (lookupDictionary == null)
            {
                lookupDictionary = new Dictionary<int, string>();
            }

            var jsonSerializedLookup = JsonConvert.SerializeObject(lookupDictionary);
            var request = new HttpRequestMessage
            {
                Method = HttpMethod.Put,
                RequestUri = new Uri($"http://infra.io.vtex.com/vbase/v2/{this._httpContextAccessor.HttpContext.Request.Headers[HEADER_VTEX_ACCOUNT]}/{this._httpContextAccessor.HttpContext.Request.Headers[HEADER_VTEX_WORKSPACE]}/buckets/{this._applicationName}/{REVIEWS_BUCKET}/files/{LOOKUP}"),
                Content = new StringContent(jsonSerializedLookup, Encoding.UTF8, APPLICATION_JSON)
            };

            string authToken = this._httpContextAccessor.HttpContext.Request.Headers[HEADER_VTEX_CREDENTIAL];
            if (authToken != null)
            {
                request.Headers.Add(AUTHORIZATION_HEADER_NAME, authToken);
            }

            var client = _clientFactory.CreateClient();
            var response = await client.SendAsync(request);

            response.EnsureSuccessStatusCode();
        }

        public async Task<UserData> GetUserData(string userId)
        {
            UserData userData = null;

            var request = new HttpRequestMessage
            {
                Method = HttpMethod.Get,
                RequestUri = new Uri($"http://{this._httpContextAccessor.HttpContext.Request.Headers[VTEX_ACCOUNT_HEADER_NAME]}.vtexcommercestable.com.br/api/license-manager/users/{userId}"),
            };

            request.Headers.Add(USE_HTTPS_HEADER_NAME, "true");
            string authToken = this._httpContextAccessor.HttpContext.Request.Headers[HEADER_VTEX_CREDENTIAL];
            if (authToken != null)
            {
                request.Headers.Add(AUTHORIZATION_HEADER_NAME, authToken);
            }

            var client = _clientFactory.CreateClient();
            var response = await client.SendAsync(request);
            string responseContent = await response.Content.ReadAsStringAsync();

            Console.WriteLine($"GetUserData '{userId}' [{response.StatusCode}] {responseContent}");

            if (response.IsSuccessStatusCode)
            {
                userData = JsonConvert.DeserializeObject<UserData>(responseContent);
            }

            return userData;
        }

        public async Task<UserData> GetUserData()
        {
            UserData userData = null;
            string jsonSerializedToken;
            VtexToken vtexToken = new VtexToken();
            string authToken = this._httpContextAccessor.HttpContext.Request.Headers[HEADER_VTEX_CREDENTIAL];
            if (authToken != null)
            {
                vtexToken.Token = authToken;
            }

            jsonSerializedToken = JsonConvert.SerializeObject(vtexToken);

            var request = new HttpRequestMessage
            {
                Method = HttpMethod.Post,
                RequestUri = new Uri($"http://{this._httpContextAccessor.HttpContext.Request.Headers[VTEX_ACCOUNT_HEADER_NAME]}.myvtex.com/api/vtexid/credential/validate"),
                Content = new StringContent(jsonSerializedToken, Encoding.UTF8, APPLICATION_JSON)
            };

            request.Headers.Add(USE_HTTPS_HEADER_NAME, "true");
            if (authToken != null)
            {
                request.Headers.Add(AUTHORIZATION_HEADER_NAME, authToken);
            }

            var client = _clientFactory.CreateClient();
            var response = await client.SendAsync(request);
            string responseContent = await response.Content.ReadAsStringAsync();

            Console.WriteLine($"     ----------> validate [{response.StatusCode}] {responseContent}");

            if (response.IsSuccessStatusCode)
            {
                UserCredential userCredential = JsonConvert.DeserializeObject<UserCredential>(responseContent);
                if(!string.IsNullOrEmpty(userCredential.Id))
                {
                    request = new HttpRequestMessage
                    {
                        Method = HttpMethod.Get,
                        RequestUri = new Uri($"http://{this._httpContextAccessor.HttpContext.Request.Headers[VTEX_ACCOUNT_HEADER_NAME]}.myvtex.com/api/license-manager/pvt/users/{userCredential.Id}"),
                    };

                    request.Headers.Add(USE_HTTPS_HEADER_NAME, "true");
                    if (authToken != null)
                    {
                        request.Headers.Add(AUTHORIZATION_HEADER_NAME, authToken);
                        request.Headers.Add("Cookie", $"{VtexIdCookie}={authToken}");
                        request.Headers.Add(PROXY_AUTHORIZATION_HEADER_NAME, authToken);
                    }

                    client = _clientFactory.CreateClient();
                    response = await client.SendAsync(request);
                    responseContent = await response.Content.ReadAsStringAsync();

                    Console.WriteLine($"     ----------> users '{userCredential.Id}' [{response.StatusCode}] {responseContent}");

                    if (response.IsSuccessStatusCode)
                    {
                        userData = JsonConvert.DeserializeObject<UserData>(responseContent);
                    }
                }
            }

            return userData;
        }
    }
}
