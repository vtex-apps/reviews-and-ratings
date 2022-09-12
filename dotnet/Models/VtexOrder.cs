using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace ReviewsRatings.Models
{
    public class VtexOrder
    {
        [JsonProperty("items")]
        public List<VtexOrderItem> Items { get; set; }

        [JsonProperty("sellers")]
        public List<Seller> Sellers { get; set; }

        [JsonProperty("giftRegistryData")]
        public object GiftRegistryData { get; set; }

        [JsonProperty("receiptData")]
        public ReceiptData ReceiptData { get; set; }

        [JsonProperty("contextData")]
        public ContextData ContextData { get; set; }

        [JsonProperty("marketPlaceOrderId")]
        public string MarketPlaceOrderId { get; set; }

        [JsonProperty("marketPlaceOrderGroup")]
        public object MarketPlaceOrderGroup { get; set; }

        [JsonProperty("marketplaceServicesEndpoint")]
        public object MarketplaceServicesEndpoint { get; set; }

        [JsonProperty("orderFormId")]
        public string OrderFormId { get; set; }

        [JsonProperty("sequence")]
        public string Sequence { get; set; }

        [JsonProperty("affiliateId")]
        public string AffiliateId { get; set; }

        [JsonProperty("status")]
        public string Status { get; set; }

        [JsonProperty("callCenterOperator")]
        public string CallCenterOperator { get; set; }

        [JsonProperty("userProfileId")]
        public string UserProfileId { get; set; }

        [JsonProperty("hostName")]
        public string HostName { get; set; }

        [JsonProperty("creationVersion")]
        public string CreationVersion { get; set; }

        [JsonProperty("creationEnvironment")]
        public string CreationEnvironment { get; set; }

        [JsonProperty("lastChangeVersion")]
        public string LastChangeVersion { get; set; }

        [JsonProperty("workflowInstanceId")]
        public string WorkflowInstanceId { get; set; }

        [JsonProperty("marketplacePaymentValue")]
        public object MarketplacePaymentValue { get; set; }

        [JsonProperty("orderId")]
        public string OrderId { get; set; }

        [JsonProperty("orderGroup")]
        public string OrderGroup { get; set; }

        [JsonProperty("state")]
        public string State { get; set; }

        [JsonProperty("isCheckedIn")]
        public bool? IsCheckedIn { get; set; }

        [JsonProperty("sellerOrderId")]
        public string SellerOrderId { get; set; }

        [JsonProperty("origin")]
        public string Origin { get; set; }

        [JsonProperty("storeId")]
        public object StoreId { get; set; }

        [JsonProperty("checkedInPickupPointId")]
        public object CheckedInPickupPointId { get; set; }

        [JsonProperty("value")]
        public long Value { get; set; }

        [JsonProperty("totals")]
        public List<Total> Totals { get; set; }

        [JsonProperty("clientProfileData")]
        public ClientProfileData ClientProfileData { get; set; }

        [JsonProperty("ratesAndBenefitsData")]
        public RatesAndBenefitsData RatesAndBenefitsData { get; set; }

        [JsonProperty("shippingData")]
        public ShippingData ShippingData { get; set; }

        [JsonProperty("paymentData")]
        public PaymentData PaymentData { get; set; }

        [JsonProperty("packageAttachment")]
        public PackageAttachment PackageAttachment { get; set; }

        [JsonProperty("clientPreferencesData")]
        public ClientPreferencesData ClientPreferencesData { get; set; }

        [JsonProperty("commercialConditionData")]
        public object CommercialConditionData { get; set; }

        [JsonProperty("marketingData")]
        public object MarketingData { get; set; }

        [JsonProperty("storePreferencesData")]
        public StorePreferencesData StorePreferencesData { get; set; }

        [JsonProperty("changesAttachment")]
        public ChangesAttachment ChangesAttachment { get; set; }

        [JsonProperty("openTextField")]
        public OpenTextField OpenTextField { get; set; }

        [JsonProperty("invoiceData")]
        public object InvoiceData { get; set; }

        [JsonProperty("itemMetadata")]
        public ItemMetadata ItemMetadata { get; set; }

        [JsonProperty("taxData")]
        public object TaxData { get; set; }

        [JsonProperty("customData")]
        public object CustomData { get; set; }

        [JsonProperty("hooksData")]
        public object HooksData { get; set; }

        [JsonProperty("changeData")]
        public object ChangeData { get; set; }

        [JsonProperty("subscriptionData")]
        public object SubscriptionData { get; set; }

        [JsonProperty("salesChannel")]
        public string SalesChannel { get; set; }

        [JsonProperty("followUpEmail")]
        public string FollowUpEmail { get; set; }

        [JsonProperty("creationDate")]
        public string CreationDate { get; set; }

        [JsonProperty("lastChange")]
        public string LastChange { get; set; }

        [JsonProperty("timeZoneCreationDate")]
        public string TimeZoneCreationDate { get; set; }

        [JsonProperty("timeZoneLastChange")]
        public string TimeZoneLastChange { get; set; }

        [JsonProperty("isCompleted")]
        public bool? IsCompleted { get; set; }

        [JsonProperty("merchantName")]
        public object MerchantName { get; set; }

        [JsonProperty("userType")]
        public string UserType { get; set; }

        [JsonProperty("roundingError")]
        public long RoundingError { get; set; }

        [JsonProperty("allowEdition")]
        public bool? AllowEdition { get; set; }

        [JsonProperty("allowCancellation")]
        public bool? AllowCancellation { get; set; }

        [JsonProperty("isUserDataVisible")]
        public bool? IsUserDataVisible { get; set; }

        [JsonProperty("allowChangeSeller")]
        public bool? AllowChangeSeller { get; set; }

        [JsonProperty("authorizedDate")]
        public string AuthorizedDate { get; set; }
    }

    public class ClientPreferencesData
    {
        [JsonProperty("locale")]
        public string Locale { get; set; }

        [JsonProperty("optinNewsLetter")]
        public bool? OptinNewsLetter { get; set; }
    }

    public class ClientProfileData
    {
        [JsonProperty("email")]
        public string Email { get; set; }

        [JsonProperty("firstName")]
        public string FirstName { get; set; }

        [JsonProperty("lastName")]
        public string LastName { get; set; }

        [JsonProperty("document")]
        public object Document { get; set; }

        [JsonProperty("documentType")]
        public object DocumentType { get; set; }

        [JsonProperty("phone")]
        public string Phone { get; set; }

        [JsonProperty("corporateName")]
        public object CorporateName { get; set; }

        [JsonProperty("tradeName")]
        public object TradeName { get; set; }

        [JsonProperty("corporateDocument")]
        public object CorporateDocument { get; set; }

        [JsonProperty("stateInscription")]
        public object StateInscription { get; set; }

        [JsonProperty("corporatePhone")]
        public object CorporatePhone { get; set; }

        [JsonProperty("isCorporate")]
        public bool? IsCorporate { get; set; }

        [JsonProperty("profileCompleteOnLoading")]
        public bool? ProfileCompleteOnLoading { get; set; }

        [JsonProperty("profileErrorOnLoading")]
        public bool? ProfileErrorOnLoading { get; set; }

        [JsonProperty("customerClass")]
        public object CustomerClass { get; set; }
    }

    public class ContextData
    {
        [JsonProperty("loggedIn")]
        public bool? LoggedIn { get; set; }

        [JsonProperty("hasAccessToOrderFormEnabledByLicenseManager")]
        public bool? HasAccessToOrderFormEnabledByLicenseManager { get; set; }

        [JsonProperty("userAgent")]
        public string UserAgent { get; set; }

        [JsonProperty("userId")]
        public string UserId { get; set; }
    }

    public class ItemMetadata
    {
        [JsonProperty("items")]
        public List<ItemMetadataItem> Items { get; set; }
    }

    public class ItemMetadataItem
    {
        [JsonProperty("id")]
        public string Id { get; set; }

        [JsonProperty("seller")]
        public string Seller { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("skuName")]
        public string SkuName { get; set; }

        [JsonProperty("productId")]
        public string ProductId { get; set; }

        [JsonProperty("refId")]
        public string RefId { get; set; }

        [JsonProperty("ean")]
        public object Ean { get; set; }

        [JsonProperty("imageUrl")]
        public Uri ImageUrl { get; set; }

        [JsonProperty("detailUrl")]
        public string DetailUrl { get; set; }

        [JsonProperty("assemblyOptions")]
        public List<AssemblyOption> AssemblyOptions { get; set; }
    }

    public class AssemblyOption
    {
        [JsonProperty("id")]
        public string Id { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("required")]
        public bool? AssemblyOptionRequired { get; set; }

        [JsonProperty("inputValues")]
        public Schema InputValues { get; set; }

        [JsonProperty("composition")]
        public object Composition { get; set; }
    }

    public class Schema
    {
        [JsonProperty("Line 1", NullValueHandling = NullValueHandling.Ignore)]
        public Line1 Line1 { get; set; }

        [JsonProperty("Line 2", NullValueHandling = NullValueHandling.Ignore)]
        public Line1 Line2 { get; set; }

        [JsonProperty("Line 3", NullValueHandling = NullValueHandling.Ignore)]
        public Line1 Line3 { get; set; }

        [JsonProperty("Line 4", NullValueHandling = NullValueHandling.Ignore)]
        public Line1 Line4 { get; set; }

        [JsonProperty("Text Style", NullValueHandling = NullValueHandling.Ignore)]
        public Line1 TextStyle { get; set; }
    }

    public class Line1
    {
        [JsonProperty("maximumNumberOfCharacters")]
        public long MaximumNumberOfCharacters { get; set; }

        [JsonProperty("domain")]
        public List<string> Domain { get; set; }
    }

    public class VtexOrderItem
    {
        [JsonProperty("additionalInfo")]
        public AdditionalInfo AdditionalInfo { get; set; }

        [JsonProperty("sellerSku")]
        public string SellerSku { get; set; }

        [JsonProperty("priceTable")]
        public object PriceTable { get; set; }

        [JsonProperty("priceValidUntil")]
        public string PriceValidUntil { get; set; }

        [JsonProperty("callCenterOperator")]
        public object CallCenterOperator { get; set; }

        [JsonProperty("commission")]
        public long Commission { get; set; }

        [JsonProperty("freightCommission")]
        public long FreightCommission { get; set; }

        [JsonProperty("taxCode")]
        public string TaxCode { get; set; }

        [JsonProperty("uniqueId")]
        public string UniqueId { get; set; }

        [JsonProperty("id")]
        public string Id { get; set; }

        [JsonProperty("productId")]
        public string ProductId { get; set; }

        [JsonProperty("productRefId")]
        public string ProductRefId { get; set; }

        [JsonProperty("refId")]
        public string RefId { get; set; }

        [JsonProperty("ean")]
        public string Ean { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("skuName")]
        public string SkuName { get; set; }

        [JsonProperty("modalType")]
        public object ModalType { get; set; }

        [JsonProperty("parentItemIndex")]
        public int? ParentItemIndex { get; set; }

        [JsonProperty("parentAssemblyBinding")]
        public object ParentAssemblyBinding { get; set; }

        [JsonProperty("assemblies")]
        public List<ItemAssembly> Assemblies { get; set; }

        [JsonProperty("tax")]
        public long Tax { get; set; }

        [JsonProperty("price")]
        public long Price { get; set; }

        [JsonProperty("listPrice")]
        public long ListPrice { get; set; }

        [JsonProperty("manualPrice")]
        public object ManualPrice { get; set; }

        [JsonProperty("manualPriceAppliedBy")]
        public object ManualPriceAppliedBy { get; set; }

        [JsonProperty("sellingPrice")]
        public long SellingPrice { get; set; }

        [JsonProperty("rewardValue")]
        public long RewardValue { get; set; }

        [JsonProperty("isGift")]
        public bool? IsGift { get; set; }

        [JsonProperty("preSaleDate")]
        public object PreSaleDate { get; set; }

        [JsonProperty("productCategoryIds")]
        public string ProductCategoryIds { get; set; }

        [JsonProperty("productCategories")]
        public Dictionary<string, string> ProductCategories { get; set; }

        [JsonProperty("quantity")]
        public long Quantity { get; set; }

        [JsonProperty("seller")]
        public string Seller { get; set; }

        [JsonProperty("sellerChain")]
        public List<string> SellerChain { get; set; }

        [JsonProperty("imageUrl")]
        public Uri ImageUrl { get; set; }

        [JsonProperty("detailUrl")]
        public string DetailUrl { get; set; }

        [JsonProperty("components")]
        public List<object> Components { get; set; }

        [JsonProperty("bundleItems")]
        public List<object> BundleItems { get; set; }

        [JsonProperty("attachments")]
        public List<object> Attachments { get; set; }

        [JsonProperty("attachmentOfferings")]
        public List<AttachmentOffering> AttachmentOfferings { get; set; }

        [JsonProperty("offerings")]
        public List<object> Offerings { get; set; }

        [JsonProperty("priceTags")]
        public List<PriceTag> PriceTags { get; set; }

        [JsonProperty("availability")]
        public string Availability { get; set; }

        [JsonProperty("measurementUnit")]
        public string MeasurementUnit { get; set; }

        [JsonProperty("unitMultiplier")]
        public long? UnitMultiplier { get; set; }

        [JsonProperty("manufacturerCode")]
        public string ManufacturerCode { get; set; }
    }

    public class AdditionalInfo
    {
        [JsonProperty("dimension")]
        public Dimension Dimension { get; set; }

        [JsonProperty("categoriesIds")]
        public string CategoriesIds { get; set; }

        [JsonProperty("categories")]
        public List<Category> Categories { get; set; }

        [JsonProperty("productClusterId")]
        public string ProductClusterId { get; set; }

        [JsonProperty("commercialConditionId")]
        public string CommercialConditionId { get; set; }

        [JsonProperty("brandName")]
        public string BrandName { get; set; }

        [JsonProperty("brandId")]
        public string BrandId { get; set; }

        [JsonProperty("offeringInfo")]
        public object OfferingInfo { get; set; }

        [JsonProperty("offeringType")]
        public object OfferingType { get; set; }

        [JsonProperty("offeringTypeId")]
        public object OfferingTypeId { get; set; }
    }

    public class Category
    {
        [JsonProperty("id")]
        public long Id { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }
    }

    public class Dimension
    {
        [JsonProperty("cubicweight")]
        public long Cubicweight { get; set; }

        [JsonProperty("height")]
        public long Height { get; set; }

        [JsonProperty("length")]
        public long Length { get; set; }

        [JsonProperty("weight")]
        public long Weight { get; set; }

        [JsonProperty("width")]
        public long Width { get; set; }
    }

    public class AttachmentOffering
    {
        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("required")]
        public bool? AttachmentOfferingRequired { get; set; }

        [JsonProperty("schema")]
        public Schema Schema { get; set; }
    }

    public class PriceTag
    {
        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("rate")]
        public double? Rate { get; set; }

        [JsonProperty("value")]
        public long Value { get; set; }

        [JsonProperty("rawValue")]
        public double RawValue { get; set; }

        [JsonProperty("jurisCode")]
        public string JurisCode { get; set; }

        [JsonProperty("jurisType")]
        public string JurisType { get; set; }

        [JsonProperty("jurisName")]
        public string JurisName { get; set; }

        [JsonProperty("isPercentual")]
        public bool? IsPercentual { get; set; }

        [JsonProperty("identifier")]
        public object Identifier { get; set; }
    }

    public class OpenTextField
    {
        [JsonProperty("value")]
        public string Value { get; set; }
    }

    public class PaymentData
    {
        [JsonProperty("giftCards")]
        public List<object> GiftCards { get; set; }

        [JsonProperty("transactions")]
        public List<Transaction> Transactions { get; set; }
    }

    public class PackageAttachment
    {
        [JsonProperty("packages")]
        public List<Package> Packages { get; set; }
    }

    public class Package
    {
        [JsonProperty("items")]
        public List<PackageItem> Items { get; set; }

        [JsonProperty("courier")]
        public string Courier { get; set; }

        [JsonProperty("invoiceNumber")]
        public string InvoiceNumber { get; set; }

        [JsonProperty("invoiceValue")]
        public long InvoiceValue { get; set; }

        [JsonProperty("invoiceUrl")]
        public object InvoiceUrl { get; set; }

        [JsonProperty("issuanceDate")]
        public DateTimeOffset IssuanceDate { get; set; }

        [JsonProperty("trackingNumber")]
        public string TrackingNumber { get; set; }

        [JsonProperty("invoiceKey")]
        public object InvoiceKey { get; set; }

        [JsonProperty("trackingUrl")]
        public object TrackingUrl { get; set; }

        [JsonProperty("embeddedInvoice")]
        public string EmbeddedInvoice { get; set; }

        [JsonProperty("type")]
        public string Type { get; set; }

        [JsonProperty("courierStatus")]
        public object CourierStatus { get; set; }

        [JsonProperty("cfop")]
        public object Cfop { get; set; }

        [JsonProperty("restitutions")]
        public Content Restitutions { get; set; }

        [JsonProperty("volumes")]
        public object Volumes { get; set; }
    }

    public class PackageItem
    {
        [JsonProperty("itemIndex")]
        public long ItemIndex { get; set; }

        [JsonProperty("quantity")]
        public long Quantity { get; set; }

        [JsonProperty("price")]
        public long Price { get; set; }

        [JsonProperty("description")]
        public object Description { get; set; }

        [JsonProperty("unitMultiplier")]
        public long? UnitMultiplier { get; set; }
    }

    public class Content
    {
    }

    public class Transaction
    {
        [JsonProperty("isActive")]
        public bool? IsActive { get; set; }

        [JsonProperty("transactionId")]
        public string TransactionId { get; set; }

        [JsonProperty("merchantName")]
        public string MerchantName { get; set; }

        [JsonProperty("payments")]
        public List<Payment> Payments { get; set; }

        [JsonProperty("sharedTransaction")]
        public bool? SharedTransaction { get; set; }
    }

    public class Payment
    {
        [JsonProperty("id")]
        public string Id { get; set; }

        [JsonProperty("paymentSystem")]
        public string PaymentSystem { get; set; }

        [JsonProperty("paymentSystemName")]
        public string PaymentSystemName { get; set; }

        [JsonProperty("value")]
        public long Value { get; set; }

        [JsonProperty("installments")]
        public long Installments { get; set; }

        [JsonProperty("connectorResponses")]
        public ConnectorResponses ConnectorResponses { get; set; }

        [JsonProperty("referenceValue")]
        public long ReferenceValue { get; set; }

        [JsonProperty("cardHolder")]
        public object CardHolder { get; set; }

        [JsonProperty("cardNumber")]
        public object CardNumber { get; set; }

        [JsonProperty("firstDigits")]
        public object FirstDigits { get; set; }

        [JsonProperty("lastDigits")]
        public object LastDigits { get; set; }

        [JsonProperty("cvv2")]
        public object Cvv2 { get; set; }

        [JsonProperty("expireMonth")]
        public object ExpireMonth { get; set; }

        [JsonProperty("expireYear")]
        public object ExpireYear { get; set; }

        [JsonProperty("url")]
        public object Url { get; set; }

        [JsonProperty("koinUrl")]
        public object KoinUrl { get; set; }

        [JsonProperty("tid")]
        public object Tid { get; set; }

        [JsonProperty("redemptionCode")]
        public object RedemptionCode { get; set; }

        [JsonProperty("giftCardId")]
        public object GiftCardId { get; set; }

        [JsonProperty("giftCardProvider")]
        public object GiftCardProvider { get; set; }

        [JsonProperty("giftCardAsDiscount")]
        public object GiftCardAsDiscount { get; set; }

        [JsonProperty("group")]
        public string Group { get; set; }

        [JsonProperty("dueDate")]
        public object DueDate { get; set; }

        [JsonProperty("accountId")]
        public object AccountId { get; set; }

        [JsonProperty("parentAccountId")]
        public object ParentAccountId { get; set; }

        [JsonProperty("bankIssuedInvoiceIdentificationNumber")]
        public object BankIssuedInvoiceIdentificationNumber { get; set; }

        [JsonProperty("bankIssuedInvoiceIdentificationNumberFormatted")]
        public object BankIssuedInvoiceIdentificationNumberFormatted { get; set; }

        [JsonProperty("bankIssuedInvoiceBarCodeNumber")]
        public object BankIssuedInvoiceBarCodeNumber { get; set; }

        [JsonProperty("bankIssuedInvoiceBarCodeType")]
        public object BankIssuedInvoiceBarCodeType { get; set; }
    }

    public class ConnectorResponses
    {
    }

    public class RatesAndBenefitsData
    {
        [JsonProperty("rateAndBenefitsIdentifiers")]
        public List<object> RateAndBenefitsIdentifiers { get; set; }

        [JsonProperty("teaser")]
        public List<object> Teaser { get; set; }
    }

    public class ReceiptData
    {
        [JsonProperty("ReceiptCollection")]
        public List<ReceiptCollection> ReceiptCollection { get; set; }
    }

    public class ReceiptCollection
    {
        [JsonProperty("ReceiptType")]
        public string ReceiptType { get; set; }

        [JsonProperty("Date")]
        public string Date { get; set; }

        [JsonProperty("ReceiptToken")]
        public string ReceiptToken { get; set; }

        [JsonProperty("Source")]
        public string Source { get; set; }

        [JsonProperty("InvoiceNumber")]
        public object InvoiceNumber { get; set; }

        [JsonProperty("TransactionId")]
        public string TransactionId { get; set; }

        [JsonProperty("MerchantName")]
        public string MerchantName { get; set; }

        [JsonProperty("SellerOrderId")]
        public object SellerOrderId { get; set; }

        [JsonProperty("ValueAsInt")]
        public object ValueAsInt { get; set; }
    }

    public class Seller
    {
        [JsonProperty("subSellerId")]
        public string SubSellerId { get; set; }

        [JsonProperty("fulfillmentEndpoint")]
        public Uri FulfillmentEndpoint { get; set; }

        [JsonProperty("id")]
        public string Id { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("logo")]
        public string Logo { get; set; }
    }

    public class ShippingData
    {
        [JsonProperty("address")]
        public Address Address { get; set; }

        [JsonProperty("logisticsInfo")]
        public List<LogisticsInfo> LogisticsInfo { get; set; }

        [JsonProperty("selectedAddresses")]
        public List<Address> SelectedAddresses { get; set; }

        [JsonProperty("availableAddresses")]
        public List<Address> AvailableAddresses { get; set; }

        [JsonProperty("pickupPoints")]
        public List<PickupPoint> PickupPoints { get; set; }
    }

    public class Address
    {
        [JsonProperty("addressType")]
        public string AddressType { get; set; }

        [JsonProperty("receiverName")]
        public string ReceiverName { get; set; }

        [JsonProperty("addressId")]
        public string AddressId { get; set; }

        [JsonProperty("isDisposable")]
        public bool? IsDisposable { get; set; }

        [JsonProperty("postalCode")]
        public string PostalCode { get; set; }

        [JsonProperty("city")]
        public string City { get; set; }

        [JsonProperty("state")]
        public string State { get; set; }

        [JsonProperty("country")]
        public string Country { get; set; }

        [JsonProperty("street")]
        public string Street { get; set; }

        [JsonProperty("number")]
        public object Number { get; set; }

        [JsonProperty("neighborhood")]
        public string Neighborhood { get; set; }

        [JsonProperty("complement")]
        public string Complement { get; set; }

        [JsonProperty("reference")]
        public object Reference { get; set; }

        [JsonProperty("geoCoordinates")]
        public List<double> GeoCoordinates { get; set; }
    }

    public class LogisticsInfo
    {
        [JsonProperty("itemIndex")]
        public long ItemIndex { get; set; }

        [JsonProperty("selectedSla")]
        public string SelectedSla { get; set; }

        [JsonProperty("selectedDeliveryChannel")]
        public string SelectedDeliveryChannel { get; set; }

        [JsonProperty("addressId")]
        public string AddressId { get; set; }

        [JsonProperty("slas")]
        public List<Sla> Slas { get; set; }

        [JsonProperty("shipsTo")]
        public List<string> ShipsTo { get; set; }

        [JsonProperty("itemId")]
        public string ItemId { get; set; }

        [JsonProperty("deliveryChannels")]
        public List<DeliveryChannel> DeliveryChannels { get; set; }

        [JsonProperty("lockTTL")]
        public string LockTtl { get; set; }

        [JsonProperty("price")]
        public long Price { get; set; }

        [JsonProperty("listPrice")]
        public long ListPrice { get; set; }

        [JsonProperty("sellingPrice")]
        public long SellingPrice { get; set; }

        [JsonProperty("deliveryWindow")]
        public object DeliveryWindow { get; set; }

        [JsonProperty("deliveryCompany")]
        public string DeliveryCompany { get; set; }

        [JsonProperty("shippingEstimate")]
        public string ShippingEstimate { get; set; }

        [JsonProperty("shippingEstimateDate")]
        public string ShippingEstimateDate { get; set; }

        [JsonProperty("deliveryIds")]
        public List<DeliveryId> DeliveryIds { get; set; }

        [JsonProperty("deliveryChannel")]
        public string DeliveryChannel { get; set; }

        [JsonProperty("pickupStoreInfo")]
        public PickupStoreInfo PickupStoreInfo { get; set; }

        [JsonProperty("polygonName")]
        public object PolygonName { get; set; }

        [JsonProperty("pickupPointId")]
        public object PickupPointId { get; set; }

        [JsonProperty("transitTime")]
        public string TransitTime { get; set; }
    }

    public class DeliveryChannel
    {
        [JsonProperty("id")]
        public string Id { get; set; }
    }

    public class Sla
    {
        [JsonProperty("id")]
        public string Id { get; set; }

        [JsonProperty("deliveryChannel")]
        public string DeliveryChannel { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("deliveryIds")]
        public List<DeliveryId> DeliveryIds { get; set; }

        [JsonProperty("shippingEstimate")]
        public string ShippingEstimate { get; set; }

        [JsonProperty("shippingEstimateDate")]
        public string ShippingEstimateDate { get; set; }

        [JsonProperty("lockTTL")]
        public string LockTtl { get; set; }

        [JsonProperty("availableDeliveryWindows")]
        public List<object> AvailableDeliveryWindows { get; set; }

        [JsonProperty("deliveryWindow")]
        public object DeliveryWindow { get; set; }

        [JsonProperty("price")]
        public long Price { get; set; }

        [JsonProperty("listPrice")]
        public long ListPrice { get; set; }

        [JsonProperty("tax")]
        public long Tax { get; set; }

        [JsonProperty("pickupStoreInfo")]
        public PickupStoreInfo PickupStoreInfo { get; set; }

        [JsonProperty("pickupPointId")]
        public string PickupPointId { get; set; }

        [JsonProperty("pickupDistance")]
        public double PickupDistance { get; set; }

        [JsonProperty("polygonName")]
        public object PolygonName { get; set; }

        [JsonProperty("transitTime")]
        public string TransitTime { get; set; }
    }

    public class DeliveryId
    {
        [JsonProperty("courierId")]
        public string CourierId { get; set; }

        [JsonProperty("warehouseId")]
        public string WarehouseId { get; set; }

        [JsonProperty("dockId")]
        public string DockId { get; set; }

        [JsonProperty("courierName")]
        public string CourierName { get; set; }

        [JsonProperty("quantity")]
        public long Quantity { get; set; }

        [JsonProperty("kitItemDetails")]
        public List<object> KitItemDetails { get; set; }
    }

    public class PickupStoreInfo
    {
        [JsonProperty("isPickupStore")]
        public bool? IsPickupStore { get; set; }

        [JsonProperty("friendlyName")]
        public string FriendlyName { get; set; }

        [JsonProperty("address")]
        public Address Address { get; set; }

        [JsonProperty("additionalInfo")]
        public string AdditionalInfo { get; set; }

        [JsonProperty("dockId")]
        public string DockId { get; set; }
    }

    public class PickupPoint
    {
        [JsonProperty("friendlyName")]
        public string FriendlyName { get; set; }

        [JsonProperty("address")]
        public Address Address { get; set; }

        [JsonProperty("additionalInfo")]
        public string AdditionalInfo { get; set; }

        [JsonProperty("id")]
        public string Id { get; set; }

        [JsonProperty("businessHours")]
        public List<BusinessHour> BusinessHours { get; set; }
    }

    public class BusinessHour
    {
        [JsonProperty("DayOfWeek")]
        public long DayOfWeek { get; set; }

        [JsonProperty("OpeningTime")]
        public string OpeningTime { get; set; }

        [JsonProperty("ClosingTime")]
        public string ClosingTime { get; set; }
    }

    public class StorePreferencesData
    {
        [JsonProperty("countryCode")]
        public string CountryCode { get; set; }

        [JsonProperty("saveUserData")]
        public bool? SaveUserData { get; set; }

        [JsonProperty("timeZone")]
        public string TimeZone { get; set; }

        [JsonProperty("currencyCode")]
        public string CurrencyCode { get; set; }

        [JsonProperty("currencyLocale")]
        public long CurrencyLocale { get; set; }

        [JsonProperty("currencySymbol")]
        public string CurrencySymbol { get; set; }

        [JsonProperty("currencyFormatInfo")]
        public CurrencyFormatInfo CurrencyFormatInfo { get; set; }
    }

    public class CurrencyFormatInfo
    {
        [JsonProperty("currencyDecimalDigits")]
        public long CurrencyDecimalDigits { get; set; }

        [JsonProperty("currencyDecimalSeparator")]
        public string CurrencyDecimalSeparator { get; set; }

        [JsonProperty("currencyGroupSeparator")]
        public string CurrencyGroupSeparator { get; set; }

        [JsonProperty("currencyGroupSize")]
        public long CurrencyGroupSize { get; set; }

        [JsonProperty("startsWithCurrencySymbol")]
        public bool? StartsWithCurrencySymbol { get; set; }
    }

    public class Total
    {
        [JsonProperty("id")]
        public string Id { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("value")]
        public long Value { get; set; }
    }

    public class ItemAssembly
    {
        [JsonProperty("id")]
        public string Id { get; set; }

        [JsonProperty("inputValues")]
        public object InputValues { get; set; }
    }

    public class InputValues
    {
        [JsonProperty("Line 1", NullValueHandling = NullValueHandling.Ignore)]
        public string Line1 { get; set; }

        [JsonProperty("Line 2", NullValueHandling = NullValueHandling.Ignore)]
        public string Line2 { get; set; }

        [JsonProperty("Line 3", NullValueHandling = NullValueHandling.Ignore)]
        public string Line3 { get; set; }

        [JsonProperty("Line 4", NullValueHandling = NullValueHandling.Ignore)]
        public string Line4 { get; set; }

        [JsonProperty("Text Style", NullValueHandling = NullValueHandling.Ignore)]
        public string TextStyle { get; set; }
    }

    public class ChangesAttachment
    {
        [JsonProperty("id")]
        public string Id { get; set; }

        [JsonProperty("changesData")]
        public ChangesDatum[] ChangesData { get; set; }
    }

    public class ChangesDatum
    {
        [JsonProperty("reason")]
        public string Reason { get; set; }

        [JsonProperty("discountValue")]
        public long DiscountValue { get; set; }

        [JsonProperty("incrementValue")]
        public long IncrementValue { get; set; }

        [JsonProperty("itemsAdded")]
        public ChangedItem[] ItemsAdded { get; set; }

        [JsonProperty("itemsRemoved")]
        public ChangedItem[] ItemsRemoved { get; set; }

        [JsonProperty("receipt")]
        public Receipt Receipt { get; set; }
    }

    public class ChangedItem
    {
        [JsonProperty("id")]
        public string Id { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("quantity")]
        public long Quantity { get; set; }

        [JsonProperty("price")]
        public long Price { get; set; }

        [JsonProperty("unitMultiplier")]
        public long? UnitMultiplier { get; set; }
    }

    public partial class Receipt
    {
        [JsonProperty("date")]
        public DateTimeOffset Date { get; set; }

        [JsonProperty("orderId")]
        public string OrderId { get; set; }

        [JsonProperty("receipt")]
        public Guid ReceiptReceipt { get; set; }
    }
}
