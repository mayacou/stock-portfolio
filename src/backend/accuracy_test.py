import requests
from sklearn.metrics import mean_absolute_error, mean_squared_error
import math

# Choose a stock ticker for testing
ticker = "TSLA"  # Replace with your desired stock ticker

# Define actual prices for testing (manually input recent prices)
actual_prices = [222.48, 227.23, 226.96, 224.23, 224.23]

# Initialize a list to store predicted prices
predicted_prices = []

# Define the prediction API URL
url = "http://127.0.0.1:5000/predict"

# Fetch predictions for each day
for day in range(1, len(actual_prices) + 1):
    try:
        response = requests.post(url, json={"ticker": ticker, "days": day})
        response.raise_for_status()  # Raise an exception for HTTP errors
        data = response.json()  # Parse the JSON response

        # Extract the first predicted price from the list
        prediction_list = data.get("predicted_prices", [])
        prediction = prediction_list[0] if prediction_list else None

        if prediction is not None:
            predicted_prices.append(prediction)
        else:
            print(f"No prediction for Day {day}: {data}")
            predicted_prices.append(None)
    except Exception as e:
        print(f"Error fetching prediction for Day {day}: {e}")
        predicted_prices.append(None)

# Display actual and predicted prices
print("Actual Prices:\n", actual_prices)
print("Predicted Prices:\n", predicted_prices)

# Filter out None values to calculate metrics
filtered_actual = [a for a, p in zip(actual_prices, predicted_prices) if p is not None]
filtered_predicted = [p for p in predicted_prices if p is not None]

# Ensure there's valid data for comparison
if filtered_actual and filtered_predicted:
    mae = mean_absolute_error(filtered_actual, filtered_predicted)
    mse = mean_squared_error(filtered_actual, filtered_predicted)
    rmse = math.sqrt(mse)

    # Display accuracy metrics
    print("\nAccuracy Metrics:")
    print(f"MAE: {mae}")
    print(f"MSE: {mse}")
    print(f"RMSE: {rmse}")
else:
    print("Insufficient data for accuracy metrics.")
