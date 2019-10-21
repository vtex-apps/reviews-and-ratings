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
        /// <summary>
        /// Review Unique Id
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// Cache Id (currently same as Id)
        /// </summary>
        public int CacheId { get; set; }

        /// <summary>
        /// Product Id
        /// </summary>
        public string ProductId { get; set; }

        /// <summary>
        /// Rating
        /// </summary>
        public int Rating { get; set; }

        /// <summary>
        /// Review Title
        /// </summary>
        public string Title { get; set; }

        /// <summary>
        /// Text of Review
        /// </summary>
        public string Text { get; set; }

        /// <summary>
        /// Name of Reviewer
        /// </summary>
        public string ReviewerName { get; set; }

        /// <summary>
        /// Id of shopper submitting review
        /// </summary>
        public string ShopperId { get; set; }

        /// <summary>
        /// Date & time review submitted
        /// </summary>
        public string ReviewDateTime { get; set; }

        /// <summary>
        /// Shopper has purchased the item
        /// </summary>
        public bool VerifiedPurchaser { get; set; }

        /// <summary>
        /// Product sku
        /// </summary>
        public string Sku { get; set; }

        /// <summary>
        /// Review has been approved by moderator
        /// </summary>
        public bool Approved { get; set; }

        /// <summary>
        /// Reviewer location
        /// </summary>
        public string Location { get; set; }
    }
}
