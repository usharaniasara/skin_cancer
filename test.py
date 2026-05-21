import urllib.request
import json

url = 'https://usharani2006-skin-cancer-api.hf.space/api/register'
data = json.dumps({"name": "test", "email": "test2@test.com", "password": "test"}).encode('utf-8')
req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json', 'Origin': 'https://frontend-ecru-one-15.vercel.app'})

try:
    with urllib.request.urlopen(req) as response:
        print("STATUS:", response.status)
        print("HEADERS:", response.headers)
        print("BODY:", response.read().decode('utf-8'))
except urllib.error.HTTPError as e:
    print("HTTP ERROR:", e.code)
    print("HEADERS:", e.headers)
    print("BODY:", e.read().decode('utf-8'))
except Exception as e:
    print("ERROR:", e)
