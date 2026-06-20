import urllib.request
import re

url = "https://withjoy.com/bliss-apps/joy-web/web/content/shared/graphql.ed761a9e.js"
print("Downloading JS...")
try:
    with urllib.request.urlopen(url) as response:
        js_content = response.read().decode('utf-8')
    print("JS Downloaded, size:", len(js_content))
    
    # Search for GraphQL queries (they often use gql`...` or query: "...")
    # Let's search for query names
    queries = re.findall(r'(query\s+[A-Za-z0-9_]+)', js_content)
    print("Found queries:", len(queries))
    for q in set(queries)[:30]:
        print("  ", q)
        
    # Search for strings containing "Timeline" or "Schedule" or "Registry"
    for term in ["Timeline", "Schedule", "Registry", "Story", "Event", "FAQ"]:
        matches = [m.start() for m in re.finditer(term, js_content)]
        print(f"Term '{term}': found {len(matches)} occurrences")
        
except Exception as e:
    print("Error:", e)
