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
    using System.Security.Cryptography;
    using Microsoft.AspNetCore.Http;
    using Newtonsoft.Json;
    using ReviewsRatings.Models;
    using ReviewsRatings.Services;
    using Vtex.Api.Context;
    using System.Web;
    using System.Globalization;

    public class AuthorizationRepository : IAuthorizationRepository
    {
        private const string HEADER_VTEX_CREDENTIAL = "X-Vtex-Credential";
        private const string HEADER_VTEX_WORKSPACE = "X-Vtex-Workspace";
        private const string HEADER_VTEX_ACCOUNT = "X-Vtex-Account";
        private const string APPLICATION_JSON = "application/json";
        private readonly IVtexEnvironmentVariableProvider _environmentVariableProvider;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IHttpClientFactory _clientFactory;
        private readonly IIOServiceContext _context;
        private readonly string _applicationName;
        private const string AUTHORIZATION_HEADER_NAME = "Authorization";
        private const string HEADER_VTEX_APP_KEY = "X-VTEX-API-AppKey";
        private const string HEADER_VTEX_APP_TOKEN = "X-VTEX-API-AppToken";
        private const string VTEX_ID_HEADER_NAME = "VtexIdclientAutCookie";
        private const string PROXY_AUTHORIZATION_HEADER_NAME = "Proxy-Authorization";
        private const string USE_HTTPS_HEADER_NAME = "X-Vtex-Use-Https";
        private const string PROXY_TO_HEADER_NAME = "X-Vtex-Proxy-To";
        private const string ENVIRONMENT = "vtexcommercestable";
        private const string VTEX_ACCOUNT_HEADER_NAME = "X-Vtex-Account";

        public AuthorizationRepository(IVtexEnvironmentVariableProvider environmentVariableProvider, IHttpContextAccessor httpContextAccessor, IHttpClientFactory clientFactory, IIOServiceContext context)
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
        }

        public async Task<ValidatedUser> ValidateUserToken(string token)
        {
            string account = this._httpContextAccessor.HttpContext.Request.Headers[HEADER_VTEX_ACCOUNT];
            ValidatedUser validatedUser = null;
            ValidateToken validateToken = new ValidateToken
            {
                Token = token
            };

            if (string.IsNullOrEmpty(token) || string.IsNullOrEmpty(account))
            {
                return null;
            }

            var jsonSerializedToken = JsonConvert.SerializeObject(validateToken);
            
            var request = new HttpRequestMessage
            {
                Method = HttpMethod.Post,
                RequestUri = new Uri($"https://{account}.vtexcommercestable.com.br/api/vtexid/credential/validate"),
                Content = new StringContent(jsonSerializedToken, Encoding.UTF8, APPLICATION_JSON)
            };

            try
            {   var client = _clientFactory.CreateClient();
                var response = await client.SendAsync(request);
                string responseContent = await response.Content.ReadAsStringAsync();
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

        public async Task<bool> ValidateLicenseManagerAccess(string userId)
        {   
            bool userHasAccess = false;
            string account = this._httpContextAccessor.HttpContext.Request.Headers[HEADER_VTEX_ACCOUNT];
            string authToken = this._httpContextAccessor.HttpContext.Request.Headers[HEADER_VTEX_CREDENTIAL];
            
            if (string.IsNullOrEmpty(account) || string.IsNullOrEmpty(authToken) || string.IsNullOrEmpty(userId))
            {
                return false;
            }

            var request = new HttpRequestMessage
            {
                Method = HttpMethod.Get,
                RequestUri = new Uri($"https://licensemanager.vtexcommercestable.com.br/api/license-manager/pvt/accounts/{account}/logins/{userId}/granted")
            };
            request.Headers.Add(AUTHORIZATION_HEADER_NAME, authToken);
            
            try
            {
                var client = _clientFactory.CreateClient();
                var response = await client.SendAsync(request);
                string responseContent = await response.Content.ReadAsStringAsync();
                _context.Vtex.Logger.Info("ValidateLicenseManagerAccess", null, $"[{response.StatusCode}] {responseContent}");
                userHasAccess = response.IsSuccessStatusCode && responseContent.Equals("true");
            }
            catch (Exception ex)
            {
                _context.Vtex.Logger.Error("ValidateLicenseManagerAccess", null, $"Error validating access for user '{userId}'", ex);
            }

            return userHasAccess;
        }

        public async Task<ValidatedKeyAndToken> GetAppkeyToken(string appkey, string apptoken){
            string account = this._httpContextAccessor.HttpContext.Request.Headers[HEADER_VTEX_ACCOUNT];
            ValidatedKeyAndToken validatedKey = null;
            ValidateKeyAndToken validateKeyAndToken = new ValidateKeyAndToken
            {
                AppKey = appkey,
                AppToken = apptoken
            };

            if (string.IsNullOrEmpty(appkey) || string.IsNullOrEmpty(apptoken) || string.IsNullOrEmpty(account))
            {
                return null;
            }

            var jsonSerializedToken = JsonConvert.SerializeObject(validateKeyAndToken);
            
            var request = new HttpRequestMessage
            {
                Method = HttpMethod.Post,
                RequestUri = new Uri($"https://{account}.vtexcommercestable.com.br/api/vtexid/apptoken/login"),
                Content = new StringContent(jsonSerializedToken, Encoding.UTF8, APPLICATION_JSON)
            };

            try
            {   
                var client = _clientFactory.CreateClient();
                var response = await client.SendAsync(request);
                string responseContent = await response.Content.ReadAsStringAsync();
                if (response.IsSuccessStatusCode)
                {
                    validatedKey = JsonConvert.DeserializeObject<ValidatedKeyAndToken>(responseContent);
                }
            }
            catch (Exception ex)
            {
                _context.Vtex.Logger.Error("ValidateUserToken", null, $"Error validating user token", ex);
            }

            return validatedKey;
        }
    }
}
