namespace ReviewsRatings.Services
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Reflection;
    using System.Text;
    using System.Threading.Tasks;
    using Models;
    using Newtonsoft.Json;
    using System.Net;
    using ReviewsRatings.DataSources;
    using Vtex.Api.Context;
    using ReviewsRatings.Utils;
    using Microsoft.AspNetCore.Http;

    /// <summary>
    /// Business logic 
    /// </summary>
    public class AuthorizationService : IAuthorizationService
    {
        private readonly IAuthorizationRepository _authorizationRepository;
        private readonly IAppSettingsRepository _appSettingsRepository;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IIOServiceContext _context;

        private const string HEADER_VTEX_APP_KEY = "X-Vtex-Api-Appkey";
        private const string HEADER_VTEX_APP_TOKEN = "X-Vtex-Api-Apptoken";
        private const string HEADER_VTEX_COOKIE = "VtexIdclientAutCookie";

        public AuthorizationService(IAuthorizationRepository authorizationRepository, IAppSettingsRepository appSettingsRepository, IHttpContextAccessor httpContextAccessor, IIOServiceContext context)
        {
            this._authorizationRepository = authorizationRepository ??
                                            throw new ArgumentNullException(nameof(authorizationRepository));
    
            this._appSettingsRepository = appSettingsRepository ??
                                            throw new ArgumentNullException(nameof(appSettingsRepository));

            this._httpContextAccessor = httpContextAccessor ??
                                        throw new ArgumentNullException(nameof(httpContextAccessor));
            this._context = context ??
                            throw new ArgumentNullException(nameof(context));
        }

        public async Task<ValidatedUser> ValidateUserToken(string token){
            return await this._authorizationRepository.ValidateUserToken(token);
        }

        public async Task<bool> ValidateLicenseManagerAccess(string userId){
            return await this._authorizationRepository.ValidateLicenseManagerAccess(userId);
        }

        public async Task<ValidatedUser> RetrieveAuthenticatedUser(){
            
            ValidatedUser authenticatedUser = null;
           
            string vtexIdHeader = this._httpContextAccessor.HttpContext.Request.Headers[HEADER_VTEX_COOKIE];
            string vtexAppKey = this._httpContextAccessor.HttpContext.Request.Headers[HEADER_VTEX_APP_KEY];
            string vtexAppToken = this._httpContextAccessor.HttpContext.Request.Headers[HEADER_VTEX_APP_TOKEN];

            string token = null;

            if (!string.IsNullOrEmpty(vtexIdHeader)) 
            {
                token = vtexIdHeader;
            }
            else if ( !string.IsNullOrEmpty(vtexAppKey) && !string.IsNullOrEmpty(vtexAppToken) )
            {
                ValidatedKeyAndToken validatedToken = await this._authorizationRepository.GetAppkeyToken(vtexAppKey, vtexAppToken);
                if (validatedToken != null)
                {
                    token = validatedToken.Token;
                }
            }
            else if (!string.IsNullOrEmpty(this._context.Vtex.AdminUserAuthToken))
            {
                token = this._context.Vtex.AdminUserAuthToken; 
            }
            else if (!string.IsNullOrEmpty(this._context.Vtex.StoreUserAuthToken))
            {
                token = this._context.Vtex.StoreUserAuthToken; 
            }
            
            authenticatedUser = await this._authorizationRepository.ValidateUserToken(token);

            if ( authenticatedUser == null)
            {
                return null;
            }

            return authenticatedUser;
        }
    }
}
