import re

def test_parse_v3(text):
    text = text.lower()
    
    number_replacements = {
        r'\bone hundred\b': '100', r'\bhundred\b': '100', r'\bek so\b': '100', r'\bek sau\b': '100', r'\bsau\b': '100', r'\bso\b': '100',
    }
    for pattern, digit in number_replacements.items():
        text = re.sub(pattern, digit, text)
    
    CATEGORIES = {
        'Food': ['pizza', 'burger', 'momos', 'biryani', 'chai', 'tea', 'coffee', 'sandwich', 'thali', 'samosa', 'kachori', 'bread', 'milk', 'doodh', 'paneer', 'chicken', 'meat', 'egg', 'soda', 'pepsi', 'coke', 'maggi', 'pasta', 'zomato', 'swiggy', 'kfc', 'mcdonald', 'dominos', 'pizza hut', 'subway', 'starbucks', 'blinkit', 'zepto', 'khana', 'dinner', 'lunch', 'snack', 'restaurant', 'ice cream', 'pani', 'water', 'biscuit', 'cake', 'munch', 'chocolate'],
    }
    INDIAN_NAMES = ['rahul', 'rohit', 'shyam', 'ram', 'aman', 'anjali', 'priya', 'pooja', 'neha', 'karan', 'arjun', 'aditya', 'deepa', 'shanti', 'sonu', 'monu', 'chintu', 'bittu', 'pinky', 'ravi', 'vijay', 'sanjay', 'ajay', 'suresh', 'mukesh', 'rajesh', 'dinesh', 'vinod', 'sunil', 'anil', 'pramod', 'manoj', 'ashok', 'laxmi', 'savita', 'kavita', 'rekha', 'suman', 'meena', 'sarita', 'kavya', 'ishan', 'aryan', 'kabir', 'vivaan', 'advait', 'anaya', 'shanaya', 'myra', 'kyra', 'saanvi', 'aavya', 'mummy', 'papa', 'bhai', 'behen', 'didi', 'bhaiya', 'uncle', 'aunty', 'dadi', 'dada', 'nani', 'nana', 'kapil', 'mohit', 'deepak', 'gaurav', 'vikas', 'pankaj', 'abhishek', 'sameer', 'isha', 'tanvi', 'ria', 'diya', 'manish', 'yogesh', 'akash', 'vishal', 'sandeep', 'nitin', 'tushar', 'nikhil', 'varun', 'kunal']
    STOP_WORDS = ['ko', 'ne', 'se', 'ka', 'ki', 'ke', 'liye', 'aur', 'and', 'me', 'par', 'per', 'to', 'from', 'for', 'with', 'by', 'the', 'is', 'at', 'gave', 'given', 'gave', 'diya', 'diye', 'mila', 'mila', 'mile', 'received', 'got', 'sent', 'bheja', 'bheje', 'pay', 'paid', 'transferred', 'dalya', 'dala', 'dal', 'add', 'added', 'put', 'rs', 'rupee', 'rupees', 'rupya', 'rupaye', 'bucks', 'rps', 'in', 'of']
    ALL_CAT_KEYWORDS = [kw for lst in CATEGORIES.values() for kw in lst]

    segments = [text]
    results = []
    for seg in segments:
        amt_match = re.search(r'(\d+(?:\.\d+)?)', seg)
        if not amt_match: continue
        amount = float(amt_match.group(1))
        is_debt = False; is_income = False; person_name = None; debt_type = None; found_category = None
        
        for cat, keywords in CATEGORIES.items():
            if any(re.search(fr'\b{kw}\b', seg) for kw in keywords):
                found_category = cat; break

        # CURRENT LOGIC
        if re.search(r'\bne\b.*(?:diya|diye|mila)\b', seg) or re.search(r'\bse\b.*\bliya\b', seg) or re.search(r'\bborrowed\b', seg) or re.search(r'\bse\b.*\bmile\b', seg):
            is_debt = True; debt_type = 'borrowed'
        elif re.search(r'\bko\b.*(?:diya|diye)\b', seg) or re.search(r'\blent\b', seg) or re.search(r'\bdiye\b.*\bko\b', seg):
            if found_category and not re.search(r'\b(lent|borrowed)\b', seg): is_debt = False
            else: is_debt = True; debt_type = 'lent'
        
        clean_seg = re.sub(r'\b(rs|rupee|rupees|rupya|rupaye)\b', '', seg).strip()
        words = re.findall(r'\b\w+\b', clean_seg)
        marker_match = re.search(r'(\w+)\s+(ko|ne|se)\b', clean_seg)
        if marker_match:
            potential = marker_match.group(1)
            if potential not in STOP_WORDS and potential not in ALL_CAT_KEYWORDS and not potential.isdigit():
                person_name = potential.capitalize()
        if not person_name:
            for w in words:
                if w in INDIAN_NAMES: person_name = w.capitalize(); break
        
        desc_parts = []
        for w in words:
            if w == str(int(amount)): continue
            if person_name and w.lower() == person_name.lower(): continue
            if w in STOP_WORDS: continue
            desc_parts.append(w)
        final_description = " ".join(desc_parts).strip()
        
        results.append({'is_debt': is_debt, 'amount': amount, 'name': person_name, 'type': debt_type, 'description': final_description})
    return results

tc = "10 main pizza ke liye rahul ko diye"
print(f"Input: {tc}")
print(f"Output: {test_parse_v3(tc)}")
