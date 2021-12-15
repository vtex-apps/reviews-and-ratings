namespace ReviewsRatings.DataSources
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Net;
    using System.Net.Http;
    using System.Net.Http.Headers;
    using System.Text;
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Http;
    using Newtonsoft.Json;
    using ReviewsRatings.Models;
    using ReviewsRatings.Services;
    using Vtex.Api.Context;
    using System.Web;

    public class ProductReviewRepository : IProductReviewRepository
    {
        private const string REVIEWS_BUCKET = "productReviews";
        private const string LOOKUP = "productLookup";
        private const string DATA_ENTITY = "productReviews";
        private const string SCHEMA = "reviewsSchema";
        private const string SCHEMA_JSON = "{\"name\":\"reviewsSchema\",\"properties\":{\"productId\":{\"type\":\"string\",\"title\":\"productId\"},\"rating\":{\"type\":[\"integer\",\"null\"],\"title\":\"rating\"},\"title\":{\"type\":[\"string\",\"null\"],\"title\":\"title\"},\"text\":{\"type\":[\"string\",\"null\"],\"title\":\"text\"},\"reviewerName\":{\"type\":[\"string\",\"null\"],\"title\":\"reviewerName\"},\"shopperId\":{\"type\":[\"string\",\"null\"],\"title\":\"shopperId\"},\"reviewDateTime\":{\"type\":\"string\",\"title\":\"reviewDateTime\"},\"searchDate\":{\"type\":[\"string\",\"null\"],\"title\":\"searchDate\",\"format\":\"date-time\"}, \"verifiedPurchaser\":{\"type\":\"boolean\",\"title\":\"verifiedPurchaser\"},\"sku\":{\"type\":[\"string\",\"null\"],\"title\":\"sku\"},\"approved\":{\"type\":\"boolean\",\"title\":\"approved\"},\"location\":{\"type\":[\"string\",\"null\"],\"title\":\"location\"}},\"v-indexed\":[\"productId\",\"shopperId\",\"approved\",\"reviewDateTime\",\"searchDate\", \"rating\"],\"v-security\":{\"allowGetAll\":true},\"v-immediate-indexing\":true}";
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


        public async Task<IList<LegacyReview>> GetProductReviewsAsync(string productId)
        {
            var request = new HttpRequestMessage
            {
                Method = HttpMethod.Get,
                //RequestUri = new Uri($"http://infra.io.vtex.com/vbase/v2/{this._httpContextAccessor.HttpContext.Request.Headers[HEADER_VTEX_ACCOUNT]}/{this._httpContextAccessor.HttpContext.Request.Headers[HEADER_VTEX_WORKSPACE]}/buckets/{this._applicationName}/{REVIEWS_BUCKET}/files/{productId}"),
                RequestUri = new Uri($"http://infra.io.vtex.com/vbase/v2/{this._httpContextAccessor.HttpContext.Request.Headers[HEADER_VTEX_ACCOUNT]}/master/buckets/{this._applicationName}/{REVIEWS_BUCKET}/files/{productId}"),
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
                //_context.Vtex.Logger.Info("GetProductReviewsAsync", null, $"[{response.StatusCode}] {responseContent}");
                if (response.StatusCode == HttpStatusCode.NotFound)
                {
                    _context.Vtex.Logger.Info("GetProductReviewsAsync", null, $"[{response.StatusCode}] {responseContent}");
                    return null;
                }
            }
            catch (Exception ex)
            {
                _context.Vtex.Logger.Error("GetProductReviewsAsync", null, "Request Error", ex);
            }

            IList<LegacyReview> productReviews = null;
            try
            {
                productReviews = JsonConvert.DeserializeObject<IList<LegacyReview>>(responseContent);
            }
            catch (Exception ex)
            {
                _context.Vtex.Logger.Error("GetProductReviewsAsync", null, "DeserializeObject Error", ex);
            }

            return productReviews;
        }

        public async Task SaveProductReviewsAsync(string productId, IList<LegacyReview> productReviews)
        {
            if (productReviews == null)
            {
                productReviews = new List<LegacyReview>();
            }

            var jsonSerializedProducReviews = JsonConvert.SerializeObject(productReviews);
            var request = new HttpRequestMessage
            {
                Method = HttpMethod.Put,
                RequestUri = new Uri($"http://infra.io.vtex.com/vbase/v2/{this._httpContextAccessor.HttpContext.Request.Headers[HEADER_VTEX_ACCOUNT]}/{this._httpContextAccessor.HttpContext.Request.Headers[HEADER_VTEX_WORKSPACE]}/buckets/{this._applicationName}/{REVIEWS_BUCKET}/files/{productId}"),
                //RequestUri = new Uri($"http://infra.io.vtex.com/vbase/v2/{this._httpContextAccessor.HttpContext.Request.Headers[HEADER_VTEX_ACCOUNT]}/master/buckets/{this._applicationName}/{REVIEWS_BUCKET}/files/{productId}"),
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
                //_context.Vtex.Logger.Info("SaveProductReviewsAsync", null, $"[{response.StatusCode}] {responseContent}");
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
                //RequestUri = new Uri($"http://infra.io.vtex.com/vbase/v2/{this._httpContextAccessor.HttpContext.Request.Headers[HEADER_VTEX_ACCOUNT]}/master/buckets/{this._applicationName}/{REVIEWS_BUCKET}/files/{LOOKUP}"),
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
                //_context.Vtex.Logger.Info("LoadLookupAsync", null, $"[{response.StatusCode}] {responseContent}");
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
                _context.Vtex.Logger.Error("LoadLookupAsync", null, "DeserializeObject Error", ex);
            }

            return lookupDictionary;
        }

        public async Task SaveLookupAsync(IDictionary<int, string> lookupDictionary)
        {
            return;
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
                //_context.Vtex.Logger.Info("ValidateUserToken", null, $"[{response.StatusCode}] {responseContent}");
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

            string authToken = this._httpContextAccessor.HttpContext.Request.Headers[HEADER_VTEX_CREDENTIAL];

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

                if (authToken != null)
                {
                    vtexIdRequest.Headers.Add(AUTHORIZATION_HEADER_NAME, authToken);
                }

                try
                {
                    var client = _clientFactory.CreateClient();
                    var response = await client.SendAsync(vtexIdRequest);
                    string responseContent = await response.Content.ReadAsStringAsync();
                    //_context.Vtex.Logger.Info("ValidateKeyAndToken", null, $"[{response.StatusCode}]");
                    if (response.IsSuccessStatusCode)
                    {
                        var validatedKeyAndToken = JsonConvert.DeserializeObject<ValidatedKeyAndToken>(responseContent);
                        keyAndTokenValidated = validatedKeyAndToken.AuthStatus.Equals("Success");
                    }
                    else
                    {
                        _context.Vtex.Logger.Info("ValidateKeyAndToken", null, $"[{response.StatusCode}]");
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

                if (authToken != null)
                {
                    request.Headers.Add(AUTHORIZATION_HEADER_NAME, authToken);
                }

                try
                {
                    var client = _clientFactory.CreateClient();
                    var response = await client.SendAsync(request);
                    string responseContent = await response.Content.ReadAsStringAsync();
                    //_context.Vtex.Logger.Info("ValidateKeyAccessGranted", null, $"[{response.StatusCode}] {responseContent}");
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
                }
            }
            catch (Exception ex)
            {
                _context.Vtex.Logger.Error("ListOrders", null, "Request Error", ex);
            }

            return vtexOrderList;
        }

        public async Task<bool> VerifySchema()
        {
            // https://{{accountName}}.vtexcommercestable.com.br/api/dataentities/{{data_entity_name}}/schemas/{{schema_name}}
            var request = new HttpRequestMessage
            {
                Method = HttpMethod.Get,
                RequestUri = new Uri($"https://{this._httpContextAccessor.HttpContext.Request.Headers[VTEX_ACCOUNT_HEADER_NAME]}.vtexcommercestable.com.br/api/dataentities/{DATA_ENTITY}/schemas/{SCHEMA}")
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
            //_context.Vtex.Logger.Debug("VerifySchema", null, $"[{response.StatusCode}] {responseContent}");

            if (response.IsSuccessStatusCode && !responseContent.Equals(SCHEMA_JSON))
            {
                request = new HttpRequestMessage
                {
                    Method = HttpMethod.Put,
                    RequestUri = new Uri($"https://{this._httpContextAccessor.HttpContext.Request.Headers[VTEX_ACCOUNT_HEADER_NAME]}.vtexcommercestable.com.br/api/dataentities/{DATA_ENTITY}/schemas/{SCHEMA}"),
                    Content = new StringContent(SCHEMA_JSON, Encoding.UTF8, APPLICATION_JSON)
                };

                if (authToken != null)
                {
                    request.Headers.Add(AUTHORIZATION_HEADER_NAME, authToken);
                    request.Headers.Add(VTEX_ID_HEADER_NAME, authToken);
                    request.Headers.Add(PROXY_AUTHORIZATION_HEADER_NAME, authToken);
                }

                response = await client.SendAsync(request);
                responseContent = await response.Content.ReadAsStringAsync();

                _context.Vtex.Logger.Debug("VerifySchema", null, $"Applying Schema [{response.StatusCode}] {responseContent}");
            }

            return response.IsSuccessStatusCode;
        }

        public async Task<ReviewsResponseWrapper> GetProductReviewsMD(string searchQuery, string from, string to)
        {
            ReviewsResponseWrapper reviewsResponse = null;
            IList<Review> reviews = null;
            string total = string.Empty;
            string responseFrom = string.Empty;
            string responseTo = string.Empty;

            if (string.IsNullOrEmpty(from))
                from = "0";
            if (string.IsNullOrEmpty(to))
                to = "300";
            if(!string.IsNullOrEmpty(searchQuery))
            {
                if(!searchQuery.First().Equals('&'))
                {
                    searchQuery = $"&{searchQuery}";
                }
            }


            var request = new HttpRequestMessage
            {
                Method = HttpMethod.Get,
                RequestUri = new Uri($"http://{this._httpContextAccessor.HttpContext.Request.Headers[VTEX_ACCOUNT_HEADER_NAME]}.vtexcommercestable.com.br/api/dataentities/{DATA_ENTITY}/search?_fields=_all&_schema={SCHEMA}{searchQuery}")
            };

            request.Headers.Add("REST-Range", $"resources={from}-{to}");

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
            if (response.IsSuccessStatusCode)
            {
                reviews = JsonConvert.DeserializeObject<IList<Review>>(responseContent);
            }

            HttpHeaders headers = response.Headers;
            IEnumerable<string> values;
            if (headers.TryGetValues("REST-Content-Range", out values))
            {
                // resources 0-10/168
                string resources = values.First();
                string[] split = resources.Split(' ');
                string ranges = split[1];
                string[] splitRanges = ranges.Split('/');
                string fromTo = splitRanges[0];
                total = splitRanges[1];
                string[] splitFromTo = fromTo.Split('-');
                responseFrom = splitFromTo[0];
                responseTo = splitFromTo[1];
            }

            reviewsResponse = new ReviewsResponseWrapper
            {
                Reviews = reviews,
                Range = new SearchRange
                {
                    From = long.Parse(responseFrom),
                    To = long.Parse(responseTo),
                    Total = long.Parse(total)
                }
            };

            return reviewsResponse;
        }
 
        public async Task<ReviewsResponseWrapper> GetRangeReviewsMD(string fromDate, string toDate)
        {
            ReviewsResponseWrapper reviewsResponse = null;
            IList<Review> reviews = new List<Review>();
            DateTime dtFromDate = DateTime.Parse(fromDate);
            fromDate = dtFromDate.ToString("yyyy-MM-ddTHH:mm:ssZ");
            DateTime dtToDate = DateTime.Parse(toDate);
            toDate = dtToDate.ToString("yyyy-MM-ddTHH:mm:ssZ");
            string total = "0";
            string responseFrom = "0";
            string responseTo = "0";
            fromDate = HttpUtility.UrlEncode(fromDate);
            toDate = HttpUtility.UrlEncode(toDate);

            var request = new HttpRequestMessage
            {
                Method = HttpMethod.Get,
                RequestUri = new Uri($"http://{this._httpContextAccessor.HttpContext.Request.Headers[VTEX_ACCOUNT_HEADER_NAME]}.vtexcommercestable.com.br/api/dataentities/{DATA_ENTITY}/search?_fields=_all&_schema={SCHEMA}&_where=searchDate between {fromDate} AND {toDate}")
            };

            request.Headers.Add("REST-Range", $"resources={0}-{800}");

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
            if (response.IsSuccessStatusCode)
            {
                reviews = JsonConvert.DeserializeObject<IList<Review>>(responseContent);
            }

            HttpHeaders headers = response.Headers;
            IEnumerable<string> values;
            if (headers.TryGetValues("REST-Content-Range", out values))
            {
                // resources 0-10/168
                string resources = values.First();
                string[] split = resources.Split(' ');
                string ranges = split[1];
                string[] splitRanges = ranges.Split('/');
                string fromTo = splitRanges[0];
                total = splitRanges[1];
                string[] splitFromTo = fromTo.Split('-');
                responseFrom = splitFromTo[0];
                responseTo = splitFromTo[1];
            }

            reviewsResponse = new ReviewsResponseWrapper
            {
                Reviews = reviews,
                Range = new SearchRange
                {
                    From = long.Parse(responseFrom),
                    To = long.Parse(responseTo),
                    Total = long.Parse(total)
                }
            };

            return reviewsResponse;
        }

        public async Task<bool> DeleteProductReviewMD(string documentId)
        {
            // DELETE https://{accountName}.{environment}.com.br/api/dataentities/data_entity_name/documents/id

            var request = new HttpRequestMessage
            {
                Method = HttpMethod.Delete,
                RequestUri = new Uri($"http://{this._httpContextAccessor.HttpContext.Request.Headers[VTEX_ACCOUNT_HEADER_NAME]}.vtexcommercestable.com.br/api/dataentities/{DATA_ENTITY}/documents/{documentId}")
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

            return response.IsSuccessStatusCode;
        }

        public async Task<string> SaveProductReviewMD(Review review)
        {
            // PATCH https://{{accountName}}.vtexcommercestable.com.br/api/dataentities/{{data_entity_name}}/documents
            string id = string.Empty;

            // before SerializeObject
            if(string.IsNullOrEmpty(review.SearchDate)) 
            {
                DateTime dtSearchDate = DateTime.Parse(review.ReviewDateTime);
                review.SearchDate = dtSearchDate.ToString("yyyy-MM-ddTHH:mm:ssZ");
            }

            var jsonSerializedReview = JsonConvert.SerializeObject(review);
            var request = new HttpRequestMessage
            {
                Method = HttpMethod.Put,
                RequestUri = new Uri($"http://{this._httpContextAccessor.HttpContext.Request.Headers[VTEX_ACCOUNT_HEADER_NAME]}.vtexcommercestable.com.br/api/dataentities/{DATA_ENTITY}/documents?_schema={SCHEMA}"),
                Content = new StringContent(jsonSerializedReview, Encoding.UTF8, APPLICATION_JSON)
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
            if (response.IsSuccessStatusCode)
            {
                dynamic savedReview = JsonConvert.DeserializeObject<dynamic>(responseContent);
                id = savedReview.DocumentId;
            }
            else
            {
                _context.Vtex.Logger.Warn("SaveProductReview", null, $"Did not save review [{response.StatusCode}] '{responseContent}'\n{jsonSerializedReview}");
            }

            return id;
        }

    }
}
