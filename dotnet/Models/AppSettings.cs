namespace ReviewsRatings.Models
{
    using System;
    using System.Collections.Generic;
    using System.Text;

    /// <summary>
    /// type AppSettings {
    /// allowAnonymousReviews: Boolean
    /// requireApproval: Boolean
    /// useLocation: Boolean
    /// }
    /// </summary>
    public class AppSettings
    {
        public bool AllowAnonymousReviews { get; set; }
        public bool RequireApproval { get; set; }
        public bool UseLocation { get; set; }
    }
}
