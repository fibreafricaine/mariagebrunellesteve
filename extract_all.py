import json
import re
import os

files = {
    "welcome": r"C:\Users\Admin\.gemini\antigravity\brain\fdddd797-6f02-47c4-9c97-6bbcdb16f5b9\.system_generated\steps\6\content.md",
    "schedule": r"C:\Users\Admin\.gemini\antigravity\brain\fdddd797-6f02-47c4-9c97-6bbcdb16f5b9\.system_generated\steps\52\content.md",
    "fiancailles": r"C:\Users\Admin\.gemini\antigravity\brain\fdddd797-6f02-47c4-9c97-6bbcdb16f5b9\.system_generated\steps\54\content.md",
    "info": r"C:\Users\Admin\.gemini\antigravity\brain\fdddd797-6f02-47c4-9c97-6bbcdb16f5b9\.system_generated\steps\56\content.md",
    "contact": r"C:\Users\Admin\.gemini\antigravity\brain\fdddd797-6f02-47c4-9c97-6bbcdb16f5b9\.system_generated\steps\58\content.md"
}

def scan_dict(d, path=""):
    results = []
    if isinstance(d, dict):
        for k, v in d.items():
            new_path = f"{path}.{k}" if path else k
            if isinstance(v, str):
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

output_lines = []

for name, path in files.items():
    if not os.path.exists(path):
        output_lines.append(f"=== File for {name} does not exist: {path} ===")
        continue
    
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
    
    match = re.search(r'window\.__INITIAL_APOLLO_STATE__\s*=\s*JSON\.parse\("(.*?)"\);', content)
    if not match:
        match = re.search(r'window\.__INITIAL_APOLLO_STATE__\s*=\s*(.*?);', content, re.DOTALL)
        
    if match:
        apollo_str = match.group(1)
        try:
            decoded_str = json.loads('["' + apollo_str + '"]')[0]
            apollo_data = json.loads(decoded_str)
            output_lines.append(f"\n======================================")
            output_lines.append(f"=== APOLLO STATE FOR PAGE: {name} ===")
            output_lines.append(f"======================================")
            
            # Typename counts
            from collections import Counter
            typenames = Counter(v.get("__typename") for v in apollo_data.values() if isinstance(v, dict) and "__typename" in v)
            output_lines.append(f"Typenames: {dict(typenames)}")
            
            # Recursively find interesting content
            strings = scan_dict(apollo_data)
            output_lines.append(f"Found {len(strings)} text strings:")
            for p, val in strings:
                # print some clean representations
                # clean up double spaces and newlines
                val_clean = val.replace('\n', ' ').strip()
                output_lines.append(f"  {p} ===> {val_clean}")
                
            # Specifically dump WeddingEvents, FAQItems, StoryItems
            for key, val in apollo_data.items():
                if not isinstance(val, dict):
                    continue
                tn = val.get("__typename")
                if tn in ["TimelineEvent", "WeddingEvent", "ScheduleSection", "WeddingTimelineEvent"]:
                    output_lines.append(f"  [Detail: {tn}] {key} -> {json.dumps(val, ensure_ascii=False)}")
                elif tn in ["StorySection", "StoryItem", "Story", "LoveStory"]:
                    output_lines.append(f"  [Detail: {tn}] {key} -> {json.dumps(val, ensure_ascii=False)}")
                elif tn in ["QnaItem", "QAItem", "FAQItem", "QuestionAnswer"]:
                    output_lines.append(f"  [Detail: {tn}] {key} -> {json.dumps(val, ensure_ascii=False)}")
                    
        except Exception as e:
            output_lines.append(f"Error decoding Apollo State for {name}: {e}")
    else:
        output_lines.append(f"No Apollo State match for {name}")

with open("all_pages_extracted.txt", "w", encoding="utf-8") as out:
    out.write("\n".join(output_lines))

print("Completed extracting all pages text into all_pages_extracted.txt")
