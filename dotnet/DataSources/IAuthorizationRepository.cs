using System.Threading.Tasks;
using ReviewsRatings.Models;

namespace ReviewsRatings.DataSources
{
    public interface IAuthorizationRepository
    {
        Task<ValidatedUser> ValidateUserToken(string token);

        Task<bool> ValidateLicenseManagerAccess(string userId);

        Task<ValidatedKeyAndToken> GetAppkeyToken(string appkey, string apptoken);

        // Task<bool> ValidateLicenseManagerResourceAccess(string userId, string productId, string resourceCode);
    }
}