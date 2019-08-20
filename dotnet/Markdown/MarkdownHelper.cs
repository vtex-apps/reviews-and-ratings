using System.Collections.Generic;

namespace ReviewsRatings.Markdown
{
    public class MarkdownHelper
    {
        private static Dictionary<string, string> markdownDictionary = new Dictionary<string, string>()
        {
            { "automatic-cache-updates/after", "automaticCacheUpdates/after.md" },
            { "automatic-cache-updates/before", "automaticCacheUpdates/before.md" },
            { "dynamic-pagination/after", "dynamicPagination/after.md" },
            { "dynamic-pagination/before", "dynamicPagination/before.md" },
            { "home/main", "home/main.md" },
            { "preview-with-cached-data/after", "previewWithCachedData/after.md" },
            { "preview-with-cached-data/before", "previewWithCachedData/before.md" },
            { "static-pagination/after", "staticPagination/after.md" },
            { "static-pagination/before", "staticPagination/before.md" },
            { "styleguide/after", "styleguide/after.md" },
            { "styleguide/before", "styleguide/before.md" }
        };

        public static string GetMarkdown(string source)
        {
            if (!markdownDictionary.ContainsKey(source))
            {
                return null;
            }

            var fileName = markdownDictionary[source];
            return System.IO.File.ReadAllText($"Markdown/docs/{fileName}");
        }
    }


}