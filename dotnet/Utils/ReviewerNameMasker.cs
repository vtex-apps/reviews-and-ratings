using System;
using System.Globalization;

namespace ReviewsRatings.Utils
{
    public static class ReviewerNameMasker
    {
        public static string ToInitials(string reviewerName)
        {
            if (string.IsNullOrWhiteSpace(reviewerName))
            {
                return null;
            }

            string[] names = reviewerName.Split((char[])null, StringSplitOptions.RemoveEmptyEntries);
            string initials = Initial(names[0]);
            if (names.Length > 1)
            {
                initials = $"{initials} {Initial(names[names.Length - 1])}";
            }

            return initials;
        }

        private static string Initial(string name)
        {
            return $"{StringInfo.GetNextTextElement(name).ToUpperInvariant()}.";
        }
    }
}
