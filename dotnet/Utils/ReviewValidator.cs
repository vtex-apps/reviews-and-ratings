namespace ReviewsRatings.Utils
{
    public static class ReviewValidator
    {
        public const int MinRating = 1;
        public const int MaxRating = 5;

        public static bool IsValidRating(int? rating)
        {
            return rating.HasValue && rating.Value >= MinRating && rating.Value <= MaxRating;
        }
    }
}
