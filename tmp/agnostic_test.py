import re

def test_parse_v4_agnostic(text):
    text = text.lower()
    
    CATEGORIES = {
        'Food': ['pizza', 'burger', 'momos', 'biryani', 'chai', 'tea', 'coffee', 'sandwich', 'thali', 'samosa', 'kachori', 'bread', 'milk', 'doodh', 'paneer', 'chicken', 'meat', 'egg', 'soda', 'pepsi', 'coke', 'maggi', 'pasta', 'zomato', 'swiggy', 'kfc', 'mcdonald', 'dominos', 'pizza hut', 'subway', 'starbucks', 'blinkit', 'zepto', 'khana', 'dinner', 'lunch', 'snack', 'restaurant', 'ice cream', 'pani', 'water', 'biscuit', 'cake', 'munch', 'chocolate'],
    }
    ALL_CAT_KEYWORDS = [kw for lst in CATEGORIES.values() for kw in lst]
    
    STOP_WORDS = [
        'ko', 'ne', 'se', 'ka', 'ki', 'ke', 'liye', 'aur', 'and', 'me', 'par', 'per', 'to', 'from', 'for', 'with', 'by', 'the', 'is', 'at', 
        'gave', 'given', 'diya', 'diye', 'mila', 'mile', 'received', 'got', 'sent', 'bheja', 'bheje', 'pay', 'paid', 'transferred', 
        'dalya', 'dala', 'dal', 'add', 'added', 'put', 'rs', 'rupee', 'rupees', 'rupya', 'rupaye', 'bucks', 'rps', 'in', 'of',
        'main', 'maine', 'mere', 'hum', 'mujh', 'apne', 'yaaron', 'bro', 'yaar', 'guys', 'guyz', 'please', 'pls', 'tha', 'thi', 'the',
        'kal', 'aaj', 'parso', 'today', 'yesterday', 'now', 'now', 'abhi', 'sent', 'received', 'liya', 'diya', 'done', 'ok', 'yes', 'no',
        'paisa', 'paise', 'money', 'cash', 'upi', 'gpay', 'phonepay', 'paytm', 'bank', 'account'
    ]

    split_pattern = r'\s+(?:and|aur|plus|or|bhi|phir|main|maine|also)(?=\s+(?:\d+|' + '|'.join(ALL_CAT_KEYWORDS) + r'))\s*|\s*,\s*(?=\d+)'
    raw_segments = re.split(split_pattern, text)
    
    segments = []
    for s in raw_segments:
        s = s.strip()
        if not s: continue
        
        marker_match = re.search(r'(ko|ne|se)', s)
        if marker_match:
            marker = marker_match.group(1)
            prefix = s[:marker_match.start()].strip()
            parts = re.split(r'\s+(?:and|aur|or|plus|comma)\s*|\s*,\s*', prefix)
            found_names = []
            for p in parts:
                p_clean = p.strip().lower()
                if p_clean and p_clean not in STOP_WORDS and p_clean not in ALL_CAT_KEYWORDS and not p_clean.isdigit():
                    found_names.append(p_clean.capitalize())
            
            if len(found_names) > 1:
                base_text = s[marker_match.start():].strip()
                for name in found_names:
                    segments.append(f"{name} {base_text}")
                continue
        segments.append(s)

    # Simplified extraction logic for testing
    results = []
    for seg in segments:
        amt_match = re.search(r'(\d+)', seg)
        if not amt_match: continue
        amount = int(amt_match.group(1))
        
        name = None
        m_match = re.search(r'(\w+)\s+(ko|ne|se)', seg)
        if m_match:
            name = m_match.group(1).capitalize()
        
        results.append({'name': name, 'amount': amount})
        
    return results

test_cases = [
    "moon or vikas ko 100 diye",
    "abc, xyz and foo ne 500 diye",
    "zim-zam ko 50"
]

for tc in test_cases:
    print(f"Input: {tc}")
    res = test_parse_v4_agnostic(tc)
    print(f"Detected: {res}")
    print("-" * 30)
