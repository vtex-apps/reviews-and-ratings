using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace ReviewsRatings.Models
{
    public class VtexOrderList
    {
        [JsonProperty("list")]
        public List[] List { get; set; }

        [JsonProperty("facets")]
        public object[] Facets { get; set; }

        [JsonProperty("paging")]
        public Paging Paging { get; set; }

        [JsonProperty("stats")]
        public VtexOrderListStats Stats { get; set; }
    }

    public class List
    {
        [JsonProperty("orderId")]
        public string OrderId { get; set; }

        [JsonProperty("creationDate")]
        public DateTimeOffset CreationDate { get; set; }

        [JsonProperty("clientName")]
        public string ClientName { get; set; }

        [JsonProperty("items")]
        public object Items { get; set; }

        [JsonProperty("totalValue")]
        public long TotalValue { get; set; }

        [JsonProperty("paymentNames")]
        public string PaymentNames { get; set; }

        [JsonProperty("status")]
        public string Status { get; set; }

        [JsonProperty("statusDescription")]
        public string StatusDescription { get; set; }

        [JsonProperty("marketPlaceOrderId")]
        public string MarketPlaceOrderId { get; set; }

        [JsonProperty("sequence")]
        public string Sequence { get; set; }

        [JsonProperty("salesChannel")]
        public string SalesChannel { get; set; }

        [JsonProperty("affiliateId")]
        public string AffiliateId { get; set; }

        [JsonProperty("origin")]
        public string Origin { get; set; }

        [JsonProperty("workflowInErrorState")]
        public bool WorkflowInErrorState { get; set; }

        [JsonProperty("workflowInRetry")]
        public bool WorkflowInRetry { get; set; }

        [JsonProperty("lastMessageUnread")]
        public string LastMessageUnread { get; set; }

        [JsonProperty("ShippingEstimatedDate")]
        public DateTimeOffset? ShippingEstimatedDate { get; set; }

        [JsonProperty("ShippingEstimatedDateMax")]
        public object ShippingEstimatedDateMax { get; set; }

        [JsonProperty("ShippingEstimatedDateMin")]
        public object ShippingEstimatedDateMin { get; set; }

        [JsonProperty("orderIsComplete")]
        public bool OrderIsComplete { get; set; }

        [JsonProperty("listId")]
        public object ListId { get; set; }

        [JsonProperty("listType")]
        public object ListType { get; set; }

        [JsonProperty("authorizedDate")]
        public DateTimeOffset? AuthorizedDate { get; set; }

        [JsonProperty("callCenterOperatorName")]
        public object CallCenterOperatorName { get; set; }

        [JsonProperty("totalItems")]
        public long TotalItems { get; set; }

        [JsonProperty("currencyCode")]
        public string CurrencyCode { get; set; }
    }

    public class Paging
    {
        [JsonProperty("total")]
        public long Total { get; set; }

        [JsonProperty("pages")]
        public long Pages { get; set; }

        [JsonProperty("currentPage")]
        public long CurrentPage { get; set; }

        [JsonProperty("perPage")]
        public long PerPage { get; set; }
    }

    public class VtexOrderListStats
    {
        [JsonProperty("stats")]
        public StatsStats Stats { get; set; }
    }

    public class StatsStats
    {
        [JsonProperty("totalValue")]
        public TotalItems TotalValue { get; set; }

        [JsonProperty("totalItems")]
        public TotalItems TotalItems { get; set; }
    }

    public class OriginClass
    {
        [JsonProperty("Fulfillment")]
        public TotalItems Fulfillment { get; set; }

        [JsonProperty("Marketplace")]
        public TotalItems Marketplace { get; set; }
    }

    public class CurrencyCodeClass
    {
        [JsonProperty("BRL")]
        public TotalItems Brl { get; set; }
    }

    public class Facets
    {
        [JsonProperty("origin")]
        public OriginClass Origin { get; set; }

        [JsonProperty("currencyCode")]
        public CurrencyCodeClass CurrencyCode { get; set; }
    }

    public class TotalItems
    {
        [JsonProperty("Count")]
        public long Count { get; set; }

        [JsonProperty("Max")]
        public long Max { get; set; }

        [JsonProperty("Mean")]
        public double Mean { get; set; }

        [JsonProperty("Min")]
        public long Min { get; set; }

        [JsonProperty("Missing")]
        public long Missing { get; set; }

        [JsonProperty("StdDev")]
        public double StdDev { get; set; }

        [JsonProperty("Sum")]
        public long Sum { get; set; }

        [JsonProperty("SumOfSquares")]
        public long SumOfSquares { get; set; }

        [JsonProperty("Facets")]
        public Facets Facets { get; set; }
    }
}
