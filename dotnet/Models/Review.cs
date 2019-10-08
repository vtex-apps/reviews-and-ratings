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
    ///  Sku: String
    /// </summary>
    public class Review
    {
        public int Id { get; set; }

        public int CacheId { get; set; }

        public string ProductId { get; set; }

        public int Rating { get; set; }

        public string Title { get; set; }

        public string Text { get; set; }

        public string ReviewerName { get; set; }

        public string ShopperId { get; set; }

        public string ReviewDateTime { get; set; }

        public bool VerifiedPurchaser { get; set; }

        public string Sku { get; set; }

        public bool Approved { get; set; }

        public string Location { get; set; }
    }
}
