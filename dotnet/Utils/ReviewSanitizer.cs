using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;
using System.Text.RegularExpressions;

namespace ReviewsRatings.Utils
{
    public static class ReviewSanitizer
    {
        public static string SantizeReviewText(string rawReviewsText)
        {
            int startPos = rawReviewsText.IndexOf("\"Text\":", StringComparison.OrdinalIgnoreCase);
            int i = 0; // just to keep it from somehow getting stuck
            while (startPos > 0 && i < 999)
            {
                int endPos = rawReviewsText.IndexOf(",\"", startPos, StringComparison.OrdinalIgnoreCase);
                startPos = startPos + 7;
                string rawText = rawReviewsText.Substring(startPos, endPos - startPos);
                //Console.WriteLine($"rawtext is -[{rawText}]-");
                if(!rawText.Equals("null"))
                {
                    // Remove quotes around the text field
                    rawText = rawText.Substring(1, rawText.Length - 2);
                    string replacementText = JsonConvert.ToString(rawText);
                    //Console.WriteLine($"REPTEXT1 = {replacementText}");
                    // JsonConvert will add surrounding quotes - remove them
                    replacementText = replacementText.Substring(1, replacementText.Length - 2);
                    var regex = new Regex(Regex.Escape(rawText));
                    rawReviewsText = regex.Replace(rawReviewsText, replacementText, 1);
                }

                startPos = rawReviewsText.IndexOf("\"Text\":", endPos);
                i++;
            }

            return rawReviewsText;
        }
    }
}
