import re

def test_parse(text):
    text = text.lower()
    segments = re.split(r'\s+(?:and|aur|ke|liye|aur|plus|,)\s+|\s*,\s*', text)
    if len(segments) == 1 and segments[0] == text:
        segments = re.findall(r'\d+\s+[^\d]+', text)
        if not segments:
            segments = [text]

    results = []
    CATEGORIES = {
        'food': ['pizza', 'khana', 'dinner', 'lunch', 'chai', 'coffee', 'maggi', 'snack', 'restaurant', 'mcd', 'kfc'],
        'transport': ['auto', 'cab', 'uber', 'ola', 'petrol', 'diesel', 'bus', 'train', 'metro'],
        'shopping': ['amazon', 'flipkart', 'myntra', 'kapde', 'clothes', 'shoes'],
        'bills': ['recharge', 'wifi', 'rent', 'bijli', 'electricity', 'water'],
    }
    INCOME_KEYWORDS = ['salary', 'income', 'profit', 'mile', 'mila', 'aaye', 'aai', 'credited', 'deposit', 'bonus']
    DEBT_KEYWORDS = ['ko', 'diya', 'lent', 'se liya', 'borrowed', 'se']
    
    for seg in segments:
        seg = seg.strip()
        if not seg: continue
        amt_match = re.search(r'(\d+)', seg)
        if not amt_match: continue
        amount = float(amt_match.group(1))
        is_debt = False
        is_income = False
        person_name = None
        debt_type = None
        
        if any(kw in seg for kw in INCOME_KEYWORDS):
            is_income = True
        if 'ne diya' in seg or 'ne diye' in seg or 'mujhe' in seg:
            is_income = True
        elif any(kw in seg for kw in DEBT_KEYWORDS):
            is_debt = True
            words = seg.replace(str(int(amount)), '').split()
            potential_names = [w for w in words if w not in ['ko', 'diya', 'se', 'liya', 'aur', 'ke', 'liye', 'expense', 'add', 'lent', 'borrowed']]
            if potential_names:
                person_name = potential_names[0].capitalize()
            if 'ko' in seg or 'diya' in seg or 'lent' in seg:
                debt_type = 'lent'
            else:
                debt_type = 'borrowed'

        if is_debt and person_name:
            results.append({'is_debt': True, 'amount': amount, 'name': person_name, 'type': debt_type})
        elif is_income:
            results.append({'is_debt': False, 'amount': amount, 'type': 'income'})
        else:
            results.append({'is_debt': False, 'amount': amount, 'type': 'expense'})

    return results

test_cases = [
    "200 rs aaye mere pass",
    "1000 salary aai",
    "300 mujhe dost ne diye",
    "100 auto",
    "50 rahul ko diya"
]

for tc in test_cases:
    print(f"Testing: {tc}")
    print(f"Result: {test_parse(tc)}")
    print("-" * 20)
