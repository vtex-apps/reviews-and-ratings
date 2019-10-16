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

    public class SearchResponse
    {
        //SearchResponse searchResponse;

        [DataMember(Name = "data")]
        public DataElement Data { get; set; }

        [DataMember(Name = "range")]
        public SearchRange Range { get; set; }

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
