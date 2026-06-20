import json

with open("apollo_state.json", "r", encoding="utf-8") as f:
    data = json.load(f)

print("--- EVENT PAGES ---")
for k, v in data.items():
    if "EventPage" in k:
        print(f"Key: {k}")
        print("Val:", json.dumps(v, indent=2, ensure_ascii=False))

print("\n--- PAGE CONTAINERS ---")
for k, v in data.items():
    if "PageContainer" in k:
        print(f"Key: {k}")
        print("Val:", json.dumps(v, indent=2, ensure_ascii=False))
