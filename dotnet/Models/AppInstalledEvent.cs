namespace ReviewsRatings.Models
{
    public class AppInstalledEvent
    {
        public InstalledApp To { get; set; }
    }

    public class InstalledApp
    {
        public string Id { get; set; }
        public string Registry { get; set; }
    }
}