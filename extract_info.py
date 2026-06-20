import re
import json

file_path = r"C:\Users\Admin\.gemini\antigravity\brain\fdddd797-6f02-47c4-9c97-6bbcdb16f5b9\.system_generated\steps\6\content.md"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Let's search for script tags containing json data
# Common patterns: window.__INITIAL_STATE__, <script id="__NEXT_DATA__">, etc.
# We can search for block of JSON inside <script> tags or search for specific text.

print("File size:", len(content))

# Look for __NEXT_DATA__ or similar
matches = re.findall(r'<script[^>]*>(.*?)</script>', content, re.DOTALL)
print("Found", len(matches), "script tags.")

for idx, m in enumerate(matches):
    if "__NEXT_DATA__" in m or "INITIAL_STATE" in m or "window.joy" in m or "webpack" not in m and len(m) > 1000:
        print(f"\n--- Script {idx} (len {len(m)}) ---")
        print(m[:300])
        print("...")
        print(m[-300:])

# Let's also extract visible text (very rough parser)
text_content = re.sub(r'<style.*?</style>', '', content, flags=re.DOTALL)
text_content = re.sub(r'<script.*?</script>', '', text_content, flags=re.DOTALL)
text_content = re.sub(r'<[^>]+>', ' ', text_content)
text_content = re.sub(r'\s+', ' ', text_content).strip()

print("\n--- Sample Text Content ---")
print(text_content[:2000])

# Let's save some parsed info
with open("extracted_text.txt", "w", encoding="utf-8") as out:
    out.write(text_content)
