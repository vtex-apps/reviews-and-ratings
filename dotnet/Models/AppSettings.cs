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
    /// defaultOpen: Boolean
    /// defaultOpenCount: Integer
    /// showGraph: Boolean
    /// displaySummaryIfNone: Boolean
    /// displaySummaryTotalReviews: Boolean
    /// displaySummaryAddButton: Boolean
    /// }
    /// </summary>
    public class AppSettings
    {
        public bool AllowAnonymousReviews { get; set; }
        public bool RequireApproval { get; set; }
        public bool UseLocation { get; set; }
        public bool defaultOpen { get; set; }
        public int defaultOpenCount { get; set; }
        public bool showGraph { get; set; }
        public bool displaySummaryIfNone { get; set; }
        public bool displaySummaryTotalReviews { get; set; }
        public bool displaySummaryAddButton { get; set; }
    }
}
