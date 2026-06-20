import urllib.request
import re

url = "https://withjoy.com/bliss-apps/joy-web/web/content/shared/graphql.ed761a9e.js"
print("Downloading JS...")
with urllib.request.urlopen(url) as response:
    js_content = response.read().decode('utf-8')

print("JS Downloaded, size:", len(js_content))

# Look for occurrences of "query" or "mutation" or "gql"
# Let's search for some query patterns like `query {` or `query(\w+)`
# Often queries are represented as string templates or minified strings
# Let's search for "schedule" or "timeline" in a case-insensitive way, and print their surrounding context (100 chars)

terms = ["Schedule", "Timeline", "Registry", "Story", "FAQ", "Qna", "Contact"]
for t in terms:
    matches = [m.start() for m in re.finditer(t, js_content, re.IGNORECASE)]
    print(f"\n--- Matches for {t}: {len(matches)} ---")
    for pos in matches[:3]:
        context = js_content[max(0, pos-100):min(len(js_content), pos+100)]
        print(f"  Pos {pos}: {repr(context)}")
