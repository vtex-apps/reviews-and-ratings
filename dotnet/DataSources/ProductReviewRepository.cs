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
    using Vtex.Api.Context;

    public class ProductReviewRepository : IProductReviewRepository
    {
        private const string REVIEWS_BUCKET = "productReviews";
        private const string LOOKUP = "productLookup";
        private const string HEADER_VTEX_CREDENTIAL = "X-Vtex-Credential";
        private const string HEADER_VTEX_WORKSPACE = "X-Vtex-Workspace";
        private const string HEADER_VTEX_ACCOUNT = "X-Vtex-Account";
        private const string APPLICATION_JSON = "application/json";
        private readonly IVtexEnvironmentVariableProvider _environmentVariableProvider;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IHttpClientFactory _clientFactory;
        private readonly IIOServiceContext _context;
        private readonly string _applicationName;
        private string AUTHORIZATION_HEADER_NAME;
        private const string HEADER_VTEX_APP_KEY = "X-VTEX-API-AppKey";
        private const string HEADER_VTEX_APP_TOKEN = "X-VTEX-API-AppToken";
        private const string VTEX_ID_HEADER_NAME = "VtexIdclientAutCookie";
        private const string PROXY_AUTHORIZATION_HEADER_NAME = "Proxy-Authorization";
        private const string USE_HTTPS_HEADER_NAME = "X-Vtex-Use-Https";
        private const string PROXY_TO_HEADER_NAME = "X-Vtex-Proxy-To";
        private const string ENVIRONMENT = "vtexcommercestable";
        private const string VTEX_ACCOUNT_HEADER_NAME = "X-Vtex-Account";

        public ProductReviewRepository(IVtexEnvironmentVariableProvider environmentVariableProvider, IHttpContextAccessor httpContextAccessor, IHttpClientFactory clientFactory, IIOServiceContext context)
        {
            this._environmentVariableProvider = environmentVariableProvider ??
                                                throw new ArgumentNullException(nameof(environmentVariableProvider));

            this._httpContextAccessor = httpContextAccessor ??
                                        throw new ArgumentNullException(nameof(httpContextAccessor));

            this._clientFactory = clientFactory ??
                               throw new ArgumentNullException(nameof(clientFactory));

            this._applicationName =
                $"{this._environmentVariableProvider.ApplicationVendor}.{this._environmentVariableProvider.ApplicationName}";

            this._context = context ??
                            throw new ArgumentNullException(nameof(context));

            AUTHORIZATION_HEADER_NAME = "Authorization";
        }


        public async Task<IList<Review>> GetProductReviewsAsync(string productId)
        {
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

            string responseContent = string.Empty;
            try
            {
                var client = _clientFactory.CreateClient();
                var response = await client.SendAsync(request);
                responseContent = await response.Content.ReadAsStringAsync();
                _context.Vtex.Logger.Info("GetProductReviewsAsync", null, $"[{response.StatusCode}] {responseContent}");
                if (response.StatusCode == HttpStatusCode.NotFound)
                {
                    return null;
                }
            }
            catch (Exception ex)
            {
                _context.Vtex.Logger.Error("GetProductReviewsAsync", null, "Request Error", ex);
            }

            IList<Review> productReviews = null;
            try
            {
                productReviews = JsonConvert.DeserializeObject<IList<Review>>(responseContent);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"DeserializeObject Error: {ex.Message} ");
                _context.Vtex.Logger.Error("GetProductReviewsAsync", null, "DeserializeObject Error", ex);
            }

            return productReviews;
        }

        public async Task SaveProductReviewsAsync(string productId, IList<Review> productReviews)
        {
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

            try
            {
                var client = _clientFactory.CreateClient();
                var response = await client.SendAsync(request);
                string responseContent = await response.Content.ReadAsStringAsync();
                _context.Vtex.Logger.Info("SaveProductReviewsAsync", null, $"[{response.StatusCode}] {responseContent}");
            }
            catch (Exception ex)
            {
                _context.Vtex.Logger.Error("SaveProductReviewsAsync", null, "Request Error", ex);
            }
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

            string responseContent = string.Empty;

            try
            {
                var client = _clientFactory.CreateClient();
                var response = await client.SendAsync(request);
                responseContent = await response.Content.ReadAsStringAsync();
                _context.Vtex.Logger.Info("LoadLookupAsync", null, $"[{response.StatusCode}] {responseContent}");
                if (response.StatusCode == HttpStatusCode.NotFound)
                {
                    return null;
                }
            }
            catch (Exception ex)
            {
                _context.Vtex.Logger.Error("LoadLookupAsync", null, "Request Error", ex);
            }

            IDictionary<int, string> lookupDictionary = null;
            try
            {
                lookupDictionary = JsonConvert.DeserializeObject<IDictionary<int, string>>(responseContent);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"DeserializeObject Error: {ex.Message} ");
                _context.Vtex.Logger.Error("LoadLookupAsync", null, "DeserializeObject Error", ex);
            }

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

            try
            {
                var client = _clientFactory.CreateClient();
                var response = await client.SendAsync(request);
                string responseContent = await response.Content.ReadAsStringAsync();
                _context.Vtex.Logger.Info("SaveLookupAsync", null, $"[{response.StatusCode}] {responseContent}");
            }
            catch (Exception ex)
            {
                _context.Vtex.Logger.Error("SaveLookupAsync", null, "Request Error", ex);
            }
        }

        public async Task<ValidatedUser> ValidateUserToken(string token)
        {
            ValidatedUser validatedUser = null;
            ValidateToken validateToken = new ValidateToken
            {
                Token = token
            };

            var jsonSerializedToken = JsonConvert.SerializeObject(validateToken);
            var request = new HttpRequestMessage
            {
                Method = HttpMethod.Post,
                RequestUri = new Uri($"http://{this._httpContextAccessor.HttpContext.Request.Headers[HEADER_VTEX_ACCOUNT]}.vtexcommercestable.com.br/api/vtexid/credential/validate"),
                Content = new StringContent(jsonSerializedToken, Encoding.UTF8, APPLICATION_JSON)
            };

            string authToken = this._httpContextAccessor.HttpContext.Request.Headers[HEADER_VTEX_CREDENTIAL];
            if (authToken != null)
            {
                request.Headers.Add(AUTHORIZATION_HEADER_NAME, authToken);
            }

            var client = _clientFactory.CreateClient();
            try
            {
                var response = await client.SendAsync(request);
                string responseContent = await response.Content.ReadAsStringAsync();
                _context.Vtex.Logger.Info("ValidateUserToken", null, $"[{response.StatusCode}] {responseContent}");
                if (response.IsSuccessStatusCode)
                {
                    validatedUser = JsonConvert.DeserializeObject<ValidatedUser>(responseContent);
                }
            }
            catch (Exception ex)
            {
                _context.Vtex.Logger.Error("ValidateUserToken", null, $"Error validating user token", ex);
            }

            return validatedUser;
        }

        public async Task<bool> ValidateKeyAndToken(string key, string token, string baseUrl)
        {
            bool keyAndTokenValidated = false;
            bool keyHasAccess = false;

            if (key != null && token != null)
            {
                ValidateKeyAndToken validateKeyAndToken = new ValidateKeyAndToken
                {
                    AppKey = key,
                    AppToken = token
                };
                var jsonSerializedKeyAndToken = JsonConvert.SerializeObject(validateKeyAndToken);

                var vtexIdRequest = new HttpRequestMessage
                {
                    Method = HttpMethod.Post,
                    RequestUri = new Uri($"http://{this._httpContextAccessor.HttpContext.Request.Headers[VTEX_ACCOUNT_HEADER_NAME]}.{ENVIRONMENT}.com.br/api/vtexid/apptoken/login"),
                    Content = new StringContent(jsonSerializedKeyAndToken, Encoding.UTF8, APPLICATION_JSON)
                };

                try
                {
                    var client = _clientFactory.CreateClient();
                    var response = await client.SendAsync(vtexIdRequest);
                    string responseContent = await response.Content.ReadAsStringAsync();
                    _context.Vtex.Logger.Info("ValidateKeyAndToken", null, $"[{response.StatusCode}]");
                    if (response.IsSuccessStatusCode)
                    {
                        var validatedKeyAndToken = JsonConvert.DeserializeObject<ValidatedKeyAndToken>(responseContent);
                        keyAndTokenValidated = validatedKeyAndToken.AuthStatus.Equals("Success");
                    }
                }
                catch (Exception ex)
                {
                    _context.Vtex.Logger.Error("ValidateKeyAndToken", null, $"Error validating key and token '{key}'", ex);
                }

                var request = new HttpRequestMessage
                {
                    Method = HttpMethod.Get,
                    RequestUri = new Uri($"http://licensemanager.vtexcommercestable.com.br/api/license-manager/pvt/accounts/{this._httpContextAccessor.HttpContext.Request.Headers[VTEX_ACCOUNT_HEADER_NAME]}/logins/{key}/granted")
                };

                string authToken = this._httpContextAccessor.HttpContext.Request.Headers[HEADER_VTEX_CREDENTIAL];

                if (authToken != null)
                {
                    request.Headers.Add(AUTHORIZATION_HEADER_NAME, authToken);
                }

                try
                {
                    var client = _clientFactory.CreateClient();
                    var response = await client.SendAsync(request);
                    string responseContent = await response.Content.ReadAsStringAsync();
                    _context.Vtex.Logger.Info("ValidateKeyAccessGranted", null, $"[{response.StatusCode}] {responseContent}");
                    keyHasAccess = response.IsSuccessStatusCode && responseContent.Equals("true");
                }
                catch (Exception ex)
                {
                    _context.Vtex.Logger.Error("ValidateKeyAccessGranted", null, $"Error validating access for key '{key}'", ex);
                }
            }

            return keyAndTokenValidated && keyHasAccess;
        }

        public async Task<VtexOrder> GetOrderInformation(string orderId)
        {
            VtexOrder vtexOrder = null;

            try
            {
                var request = new HttpRequestMessage
                {
                    Method = HttpMethod.Get,
                    RequestUri = new Uri($"http://{this._httpContextAccessor.HttpContext.Request.Headers[VTEX_ACCOUNT_HEADER_NAME]}.{ENVIRONMENT}.com.br/api/oms/pvt/orders/{orderId}")
                };

                request.Headers.Add(USE_HTTPS_HEADER_NAME, "true");
                string authToken = this._httpContextAccessor.HttpContext.Request.Headers[HEADER_VTEX_CREDENTIAL];
                if (authToken != null)
                {
                    request.Headers.Add(AUTHORIZATION_HEADER_NAME, authToken);
                    request.Headers.Add(VTEX_ID_HEADER_NAME, authToken);
                    request.Headers.Add(PROXY_AUTHORIZATION_HEADER_NAME, authToken);
                }

                var client = _clientFactory.CreateClient();
                var response = await client.SendAsync(request);
                string responseContent = await response.Content.ReadAsStringAsync();
                //_context.Vtex.Logger.Info("GetOrderInformation", null, $"[{response.StatusCode}] {responseContent}");
                if (response.IsSuccessStatusCode)
                {
                    vtexOrder = JsonConvert.DeserializeObject<VtexOrder>(responseContent);
                    Console.WriteLine($"GetOrderInformation: [{response.StatusCode}] ");
                }
            }
            catch (Exception ex)
            {
                _context.Vtex.Logger.Error("GetOrderInformation", null, "Request Error", ex);
            }

            return vtexOrder;
        }

        public async Task<VtexOrderList> ListOrders(string queryString)
        {
            VtexOrderList vtexOrderList = new VtexOrderList();

            try
            {
                var request = new HttpRequestMessage
                {
                    Method = HttpMethod.Get,
                    RequestUri = new Uri($"http://{this._httpContextAccessor.HttpContext.Request.Headers[VTEX_ACCOUNT_HEADER_NAME]}.{ENVIRONMENT}.com.br/api/oms/pvt/orders?{queryString}")
                };

                string authToken = this._httpContextAccessor.HttpContext.Request.Headers[HEADER_VTEX_CREDENTIAL];
                if (authToken != null)
                {
                    request.Headers.Add(AUTHORIZATION_HEADER_NAME, authToken);
                    request.Headers.Add(VTEX_ID_HEADER_NAME, authToken);
                    request.Headers.Add(PROXY_AUTHORIZATION_HEADER_NAME, authToken);
                }

                var client = _clientFactory.CreateClient();
                var response = await client.SendAsync(request);
                string responseContent = await response.Content.ReadAsStringAsync();
                //_context.Vtex.Logger.Info("ListOrders", null, $"[{response.StatusCode}] {responseContent}");
                if (response.IsSuccessStatusCode)
                {
                    vtexOrderList = JsonConvert.DeserializeObject<VtexOrderList>(responseContent);
                    //Console.WriteLine($"ListOrders: [{response.StatusCode}] ");
                }
                else
                {
                    //Console.WriteLine($"ListOrders: [{response.StatusCode}] '{responseContent}'");
                }
            }
            catch (Exception ex)
            {
                _context.Vtex.Logger.Error("ListOrders", null, "Request Error", ex);
            }

            return vtexOrderList;
        }
    }
}
