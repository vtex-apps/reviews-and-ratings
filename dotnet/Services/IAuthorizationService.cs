namespace ReviewsRatings.Services
{
    using Models;
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using System.Net;

    public interface IAuthorizationService
    {
        Task<ValidatedUser> ValidateUserToken(string token);

        Task<bool> ValidateLicenseManagerAccess(string userId);

        Task<ValidatedUser> RetrieveAuthenticatedUser();
    }
}
