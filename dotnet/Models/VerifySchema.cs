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
    /// displayInlineIfNone: Boolean
    /// displaySummaryTotalReviews: Boolean
    /// displaySummaryAddButton: Boolean
    /// }
    /// </summary>
    public class VerifySchema
    {
        public string verifySchemaResponse { get; set; }
    }
}
