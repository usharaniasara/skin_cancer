import requests
import io
from PIL import Image

# Create a dummy image in memory to simulate a real file upload
dummy_img = Image.new('RGB', (224, 224), color = (73, 109, 137))
img_byte_arr = io.BytesIO()
dummy_img.save(img_byte_arr, format='JPEG')
img_byte_arr.seek(0)

# Construct payload
files = {'image': ('test_lesion.jpg', img_byte_arr, 'image/jpeg')}
url = 'http://localhost:5000/api/analyze'

print(f"Sending POST request to {url}...")
try:
    response = requests.post(url, files=files)
    print(f"Status Code: {response.status_code}")
    print(f"JSON Response:\n{response.json()}")
    if response.status_code == 200:
       print("✅ API IS FUNCTIONAL AND RETURNED A PREDICTION.")
    else:
       print("❌ API RETURNED AN ERROR.")
except Exception as e:
    print(f"❌ Failed to connect to API: {e}")
