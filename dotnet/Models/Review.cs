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
        [JsonProperty("id")]
        public string Id { get; set; }

        /// <summary>
        /// Cache Id (currently same as Id)
        /// </summary>
        //public int CacheId { get; set; }

        /// <summary>
        /// Product Id
        /// </summary>
        [JsonProperty("productId")]
        public string ProductId { get; set; }

        /// <summary>
        /// Rating
        /// </summary>
        [JsonProperty("rating")]
        public int? Rating { get; set; }

        /// <summary>
        /// Review Title
        /// </summary>
        [JsonProperty("title")]
        public string Title { get; set; }

        /// <summary>
        /// Text of Review
        /// </summary>
        [JsonProperty("text")]
        public string Text { get; set; }

        /// <summary>
        /// Name of Reviewer
        /// </summary>
        [JsonProperty("reviewerName")]
        public string ReviewerName { get; set; }

        /// <summary>
        /// Id of shopper submitting review
        /// </summary>
        [JsonProperty("shopperId")]
        public string ShopperId { get; set; }

        /// <summary>
        /// Date & time review submitted
        /// </summary>
        [JsonProperty("reviewDateTime")]
        public string ReviewDateTime { get; set; }

        /// <summary>
        /// Date & time review submitted
        /// </summary>
        [JsonProperty("searchDate")]
        public string SearchDate { get; set; }

        /// <summary>
        /// Shopper has purchased the item
        /// </summary>
        [JsonProperty("verifiedPurchaser")]
        public bool? VerifiedPurchaser { get; set; }

        /// <summary>
        /// Product sku
        /// </summary>
        [JsonProperty("sku")]
        public string Sku { get; set; }

        /// <summary>
        /// Review has been approved by moderator
        /// </summary>
        [JsonProperty("approved")]
        public bool? Approved { get; set; }

        /// <summary>
        /// Reviewer location
        /// </summary>
        [JsonProperty("location")]
        public string Location { get; set; }
    }
}
