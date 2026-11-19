using System;
using System.Linq;

namespace ReviewsRatings.Utils
{
    public static class ReviewerNameMasker
    {
        /// <summary>
        /// Returns the initials of the first and last names, e.g. "Maria da Silva" becomes "M. S.".
        /// Returns null when the name has no letters or digits, so nothing of the original is kept.
        /// </summary>
        public static string ToInitials(string name)
        {
            if (string.IsNullOrWhiteSpace(name))
            {
                return name;
            }

            string[] initials = name
                .Split((char[])null, StringSplitOptions.RemoveEmptyEntries)
                .Select(part => part.FirstOrDefault(char.IsLetterOrDigit))
                .Where(initial => initial != default(char))
                .Select(initial => $"{char.ToUpperInvariant(initial)}.")
                .ToArray();

            if (initials.Length == 0)
            {
                return null;
            }

            if (initials.Length == 1)
            {
                return initials[0];
            }

            return $"{initials.First()} {initials.Last()}";
        }
    }
}
