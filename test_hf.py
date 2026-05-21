import requests

url = "https://usharani2006-skin-cancer-api.hf.space/api/register"
payload = {
    "name": "Test Doctor",
    "email": "testdoc123@example.com",
    "password": "securepassword123"
}

try:
    print(f"Sending POST to {url}...")
    response = requests.post(url, json=payload, timeout=15)
    print(f"Status Code: {response.status_code}")
    print(f"Headers: {response.headers}")
    print(f"Response Body: {response.text}")
except Exception as e:
    print(f"Error: {e}")
