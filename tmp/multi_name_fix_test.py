import re

def mock_parse_v5_fixed(text):
    text = text.lower()
    INDIAN_NAMES = ['rahul', 'rohit', 'shyam', 'ram', 'aman', 'mummy', 'papa'] # Subset
    ALL_CAT_KEYWORDS = ['burger', 'pizza', 'petrol', 'khana'] # Subset
    
    # 3. SEGMENTATION
    # Use Lookahead to split by separators ONLY if followed by a number or a category keyword
    split_pattern = r'\s+(?:and|aur|plus|or|bhi|phir|main|maine|also)(?=\s+(?:\d+|' + '|'.join(ALL_CAT_KEYWORDS) + r'))\s*|\s*,\s*(?=\d+)'
    raw_segments = re.split(split_pattern, text)
    
    segments = []
    for s in raw_segments:
        s = s.strip()
        if not s: continue
        
        # Multi-Name Handling
        marker_match = re.search(r'(ko|ne|se)', s)
        if marker_match:
            marker = marker_match.group(1)
            prefix = s[:marker_match.start()].strip()
            potential_names = re.findall(r'\b\w+\b', prefix)
            found_names = [n for n in potential_names if n.lower() in INDIAN_NAMES]
            
            if len(found_names) > 1:
                base_text = s[marker_match.start():].strip()
                for name in found_names:
                    segments.append(f"{name} {base_text}")
                continue
        
        # Split by multiple numbers
        nums = list(re.finditer(r'(?<![a-zA-Z])\d+(?![a-zA-Z])', s))
        if len(nums) > 1:
            last_pos = 0
            for i in range(1, len(nums)):
                split_pos = nums[i].start()
                segments.append(s[last_pos:split_pos].strip())
                last_pos = split_pos
            segments.append(s[last_pos:].strip())
        else:
            segments.append(s.strip())
            
    return segments

test_cases = [
    "rahul aur aman ko 10 diye",
    "rahul, aman aur shyam ko 100",
    "100 burger and 200 pizza",
    "rahul ko 100 main aman ko 200 khane ke liye",
    "mummy aur papa ko 500 diye petrol bhara"
]

for tc in test_cases:
    print(f"Input: {tc}")
    res = mock_parse_v5_fixed(tc)
    print(f"Segments Detected: {res}")
    print("-" * 30)
