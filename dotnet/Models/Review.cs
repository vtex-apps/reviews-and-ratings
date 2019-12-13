using Newtonsoft.Json;
using ReviewsRatings.Utils;

namespace ReviewsRatings.Models
{
    /// <summary>
    ///  Id: ID!
    ///  CacheId: ID!
    ///  ProductId: String!
    ///  Rating: Int!
    ///  Title: String
    ///  Text: String
    ///  ReviewerName: String
    ///  ShopperId: String
    ///  ReviewDateTime: String
    ///  VerifiedPurchaser: Boolean
    ///  Sku: String
    ///  Approved : Boolean
    ///  Location : String
    /// </summary>
    //[JsonConverter(typeof(ReviewJsonConverter))]
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
