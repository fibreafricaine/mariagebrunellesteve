import json

with open("apollo_state.json", "r", encoding="utf-8") as f:
    data = json.load(f)

output_lines = []

output_lines.append("--- SEARCHING FOR TEXT CONTENTS ---")

# Let's search for objects with text, description, or content fields, or anything with long string values
for k, v in data.items():
    if isinstance(v, dict):
        long_fields = {}
        for vk, vv in v.items():
            if isinstance(vv, str) and (len(vv) > 20 or vk in ['text', 'description', 'content', 'title', 'subTitle', 'body', 'label']):
                if not vv.startswith('http'):
                    long_fields[vk] = vv
        if long_fields:
            typename = v.get("__typename", "Unknown")
            output_lines.append(f"Key: {k} (Type: {typename})")
            for fk, fv in long_fields.items():
                output_lines.append(f"  {fk}: {fv}")

with open("found_texts.txt", "w", encoding="utf-8") as out:
    out.write("\n".join(output_lines))

print("Saved output to found_texts.txt")
