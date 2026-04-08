import requests, json

s = requests.Session()
s.post('http://localhost:5001/api/register', json={'username':'finaltest','password':'finaltest'})
s.post('http://localhost:5001/api/login', json={'username':'finaltest','password':'finaltest'})

def test(text):
    r = s.post('http://localhost:5001/api/ai_parse', json={'text': text})
    d = r.json()[0] if r.json() else {}
    debt = d.get('is_debt', False)
    tp = d.get('type', '?')
    cat = d.get('category', '')
    name = d.get('name', '')
    return f"debt={debt} type={tp} cat={cat} name={name}"

print("1: " + test('rahul ne mujhe 100 rs diye'))
print("2: " + test('rahul ko 200 rs diye'))
print("3: " + test('pizza 500'))
print("4: " + test('salary 50000'))
print("5: " + test('auto 150'))
print("6: " + test('rent 15000'))
print("7: " + test('swiggy 300'))
