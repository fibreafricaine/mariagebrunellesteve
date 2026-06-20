import re

file_path = r"C:\Users\Admin\.gemini\antigravity\brain\fdddd797-6f02-47c4-9c97-6bbcdb16f5b9\.system_generated\steps\6\content.md"

with open(file_path, "r", encoding="utf-8") as f:
    html = f.read()

# Find script tags with src
srcs = re.findall(r'<script[^>]*src="([^"]+)"', html)
print("Script sources:")
for s in srcs:
    print("  ", s)
