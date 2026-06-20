import re
from bs4 import BeautifulSoup

file_path = r"C:\Users\Admin\.gemini\antigravity\brain\fdddd797-6f02-47c4-9c97-6bbcdb16f5b9\.system_generated\steps\6\content.md"

with open(file_path, "r", encoding="utf-8") as f:
    html = f.read()

# Let's parse with BeautifulSoup to extract readable elements
soup = BeautifulSoup(html, "html.parser")

# Remove script and style elements
for script in soup(["script", "style"]):
    script.decompose()

# Get text and clean it up
lines = (line.strip() for line in soup.get_text().splitlines())
chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
text = "\n".join(chunk for chunk in chunks if chunk)

with open("soup_text.txt", "w", encoding="utf-8") as out:
    out.write(text)

print("BeautifulSoup text length:", len(text))
print("First 2000 chars of soup text:")
print(text[:2000])
