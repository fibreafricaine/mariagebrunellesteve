with open(r"C:\Users\Admin\.gemini\antigravity\brain\fdddd797-6f02-47c4-9c97-6bbcdb16f5b9\.system_generated\steps\6\content.md", "r", encoding="utf-8") as f:
    text = f.read()

import re

# Find words of interest
words = ["cocktail", "reception", "ceremonie", "diner", "mairie", "église", "eglise", "programme", "fiançailles", "fiançailles", "mariage", "adresse"]
for w in words:
    matches = [m.start() for m in re.finditer(w, text, re.IGNORECASE)]
    print(f"Word '{w}': found {len(matches)} occurrences")
    for pos in matches[:3]:
        print(f"  context: {text[max(0, pos-50):min(len(text), pos+50)].strip()}")
