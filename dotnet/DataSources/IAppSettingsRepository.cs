using System.Threading.Tasks;
using ReviewsRatings.Models;

namespace ReviewsRatings.DataSources
{
    public interface IAppSettingsRepository
    {
        Task<AppSettings> GetAppSettingAsync();
    }
}