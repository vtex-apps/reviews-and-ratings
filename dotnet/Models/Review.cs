namespace ReviewsRatings.Models
{
    /// <summary>
    ///  id: ID!
    ///  cacheId: ID!
    ///  productId: String!
    ///  rating: Int!
    ///  title: String
    ///  text: String
    ///  reviewerName: String
    ///  shopperId: String
    ///  reviewDateTime: String
    ///  verifiedPurchaser: Boolean
    /// </summary>
    public class Review
    {
        public string Id { get; set; }

        public string CacheId { get; set; }

        public string ProductId { get; set; }

        public int Rating { get; set; }

        public string Title { get; set; }

        public string Text { get; set; }

        public string ReviewerName { get; set; }

        public string ShopperId { get; set; }

        public string ReviewDateTime { get; set; }

        public bool VerifiedPurchaser { get; set; }
    }
}
