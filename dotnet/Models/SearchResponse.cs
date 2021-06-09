using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace ReviewsRatings.Models
{
    public class SearchRange
    {
        [DataMember(Name = "total")]
        public long Total { get; set; }

        [DataMember(Name = "from")]
        public long From { get; set; }

        [DataMember(Name = "to")]
        public long To { get; set; }
    }

    public class Totals 
    {
        [DataMember(Name = "total5")]
        public long Total5 { get; set; }

        [DataMember(Name = "total4")]
        public long Total4 { get; set; }

        [DataMember(Name = "total3")]
        public long Total3 { get; set; }

        [DataMember(Name = "total2")]
        public long Total2 { get; set; }

        [DataMember(Name = "total1")]
        public long Total1 { get; set; }
    }

    public class SearchResponse
    {
        //SearchResponse searchResponse;

        [DataMember(Name = "data")]
        public DataElement Data { get; set; }

        [DataMember(Name = "range")]
        public SearchRange Range { get; set; }

        [DataMember(Name = "totals")]
        public Totals Totals { get; set; }

        //public IEnumerator<SearchResponse> GetEnumerator()
        //{
            //foreach (var searchResponse in searchResponses)
                //yield return searchResponse;
        //}
    }

    public class DataElement : IEnumerable<Review>
    {
        public IList<Review> data;

        public IEnumerator<Review> GetEnumerator()
        {
            return data.GetEnumerator();
        }

        IEnumerator IEnumerable.GetEnumerator()
        {
            return GetEnumerator();
        }
    }
}
