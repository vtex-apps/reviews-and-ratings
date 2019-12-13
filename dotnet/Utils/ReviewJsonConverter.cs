namespace ReviewsRatings.Utils
{
    using Newtonsoft.Json;
    using Newtonsoft.Json.Linq;
    using ReviewsRatings.Models;
    using System;
    using System.Collections.Generic;

    class ReviewJsonConverter : JsonConverter
    {
        public override bool CanConvert(Type objectType)
        {
            return (objectType == typeof(Review));
        }

        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
        {
            JObject jo = JObject.Load(reader);
            Review review = new Review();
            if (jo["Approved"] != null)
            {
                review.VerifiedPurchaser = (bool)jo["Approved"];
            }

            review.CacheId = (int)jo["CacheId"];
            review.Id = (int)jo["Id"];
            review.Location = jo["Location"] != null ? (string)jo["Location"] : null;
            review.ProductId = (string)jo["ProductId"];
            review.Rating = (int)jo["Rating"];
            review.ReviewDateTime = jo["ReviewDateTime"] != null ? (string)jo["ReviewDateTime"] : null;
            review.ReviewerName = jo["ReviewerName"] != null ? (string)jo["ReviewerName"] : null;
            review.ShopperId = jo["ShopperId"] != null ? (string)jo["ShopperId"] : null;
            review.Sku = jo["Sku"] != null ? (string)jo["Sku"] : null;

            if (jo["Text"] != null)
            {
                JToken reviewText = jo["Text"];
                review.Text = EscapeForJson(reviewText.ToString());
                Console.WriteLine($"review.Text ======== {review.Text}");
            }

            if (jo["Title"] != null)
            {
                JToken titleText = jo["Title"];
                review.Title = EscapeForJson(titleText.ToString());
            }

            if (jo["VerifiedPurchaser"] != null)
            {
                review.VerifiedPurchaser = (bool)jo["VerifiedPurchaser"];
            }

            return review;
        }

        public override bool CanWrite
        {
            get { return false; }
        }

        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
        {
            throw new NotImplementedException();
        }

        static string EscapeForJson(string s)
        {
            string quoted = JsonConvert.ToString(s);
            return quoted.Substring(1, quoted.Length - 2);
        }
    }
}
