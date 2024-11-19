import requests

url = "http://127.0.0.1:5000/predict"
payload = {"ticker": "TSLA", "day": 1}
response = requests.post(url, json=payload)
print(response.json())
