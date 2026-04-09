import re

def mock_parse_v4(text):
    text = text.lower()
    INDIAN_NAMES = ['rahul', 'rohit', 'shyam', 'ram', 'aman', 'mummy', 'papa'] # Subset
    
    # 3. SEGMENTATION
    split_pattern = r'\s+(?:and|aur|plus|or|bhi|phir|main|maine|also)(?=\s+(?:\d+|[a-z]+))\s*|\s*,\s*'
    raw_segments = re.split(split_pattern, text)
    
    segments = []
    for s in raw_segments:
        s = s.strip()
        if not s: continue
        
        # Multi-Name Handling
        multi_name_match = re.search(fr'(\w+)\s+(?:and|aur|or)\s+(\w+)\s+(?:ko|ne|se)', s)
        if multi_name_match:
            name1, name2 = multi_name_match.group(1), multi_name_match.group(2)
            if name1 in INDIAN_NAMES and name2 in INDIAN_NAMES:
                segments.append(s.replace(f"{name1} aur {name2}", name1).strip())
                segments.append(s.replace(f"{name1} aur {name2}", name2).strip())
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
    "100 burger and 200 pizza",
    "rahul aur aman ko 500 diye",
    "rahul ko 100 main aman ko 200 khane ke liye",
    "100 petrol phir 200 khana also 50 chai",
    "100 pizza 200 burger 300 fries"
]

for tc in test_cases:
    print(f"Input: {tc}")
    res = mock_parse_v4(tc)
    print(f"Segments Detected: {res}")
    print("-" * 30)
