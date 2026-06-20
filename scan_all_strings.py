import json
import re

with open("apollo_state.json", "r", encoding="utf-8") as f:
    data = json.load(f)

print("Total keys in apollo state:", len(data))

# Let's write a recursive finder to scan the whole dictionary
def scan_dict(d, path=""):
    results = []
    if isinstance(d, dict):
        for k, v in d.items():
            new_path = f"{path}.{k}" if path else k
            if isinstance(v, str):
                # If the string contains spaces and is not a URL, let's keep it
                if ' ' in v and not v.startswith('http'):
                    results.append((new_path, v))
            elif isinstance(v, (dict, list)):
                results.extend(scan_dict(v, new_path))
    elif isinstance(d, list):
        for idx, item in enumerate(d):
            new_path = f"{path}[{idx}]"
            if isinstance(item, str):
                if ' ' in item and not item.startswith('http'):
                    results.append((new_path, item))
            elif isinstance(item, (dict, list)):
                results.extend(scan_dict(item, new_path))
    return results

all_strings = scan_dict(data)
print("Found long strings:", len(all_strings))

with open("all_long_strings.txt", "w", encoding="utf-8") as out:
    for path, val in all_strings:
        out.write(f"{path} ===> {val}\n")

print("Saved all strings to all_long_strings.txt")
