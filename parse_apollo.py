import json
from collections import Counter

with open("apollo_state.json", "r", encoding="utf-8") as f:
    data = json.load(f)

# Count typenames
typenames = Counter()
for k, v in data.items():
    if isinstance(v, dict) and "__typename" in v:
        typenames[v["__typename"]] += 1

print("--- Typenames Count ---")
for tn, count in typenames.most_common():
    print(f"  {tn}: {count}")

# Print items for the most interesting typenames
print("\n--- Listing items for some typenames ---")

interesting = ["Wedding", "Event", "EventDetail", "TimelineEvent", "WeddingTimelineEvent", "StorySection", "StoryItem", "Story", "Registry", "RegistryItem", "QnaItem", "QAItem", "FAQItem", "Page", "WeddingPage", "Person", "Couple", "Greeting"]
for tn in interesting:
    items = [v for v in data.values() if isinstance(v, dict) and v.get("__typename") == tn]
    if items:
        print(f"\n[{tn}] ({len(items)} items):")
        for item in items[:10]: # show up to 10
            print("  ", {k: v for k, v in item.items() if k not in ["__typename"]})

# Let's also do a general search for any field containing "Brady" or "Tryphene" or French words like "mariage" or "fiançailles"
print("\n--- Search for text fields containing key terms ---")
terms = ["Brady", "Tryphène", "fiançailles", "programme", "ceremonie", "2026", "aout", "samedi"]
found_terms = {t: [] for t in terms}

for k, v in data.items():
    if isinstance(v, dict):
        for vk, vv in v.items():
            if isinstance(vv, str):
                for t in terms:
                    if t.lower() in vv.lower():
                        found_terms[t].append((k, vk, vv))

for t, occurrences in found_terms.items():
    print(f"\nTerm '{t}' (found {len(occurrences)}):")
    for key, field, val in occurrences[:5]:
        print(f"  [{key}][{field}]: {val[:200]}")
