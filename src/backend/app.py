from flask import Flask, request, jsonify
import yfinance as yf
from statsmodels.tsa.arima.model import ARIMA
from flask_cors import CORS

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS

# Root endpoint
@app.route('/', methods=['GET'])
def home():
    return "ARIMA Stock Price Prediction API is running!"

# Prediction endpoint
@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Parse JSON data from request
        data = request.json
        ticker = data.get('ticker', 'AAPL').upper()  # Default to AAPL if not provided
        days = int(data.get('day', 1))  # Number of days to forecast

        # Fetch historical stock data
        stock_data = yf.Ticker(ticker).history(period="2y")['Close']  # Last 2 years of data
        if stock_data.empty:
            return jsonify({'error': f'No historical data found for {ticker}'}), 404

        # Train ARIMA model
        model = ARIMA(stock_data, order=(5, 1, 0))  # ARIMA parameters: p=5, d=1, q=0
        model_fit = model.fit()

        # Forecast the next 'days' prices
        forecast = model_fit.forecast(steps=days)
        forecast_list = forecast.tolist()

        return jsonify({'predicted_prices': forecast_list})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Run the app
if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=5000)

