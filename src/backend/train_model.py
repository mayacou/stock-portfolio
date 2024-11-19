import yfinance as yf
import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
import pickle

def fetch_historical_data(ticker, period="1y"):
    """
    Fetch historical stock data from Yahoo Finance.
    """
    stock = yf.Ticker(ticker)
    data = stock.history(period=period)
    data.reset_index(inplace=True)
    data['Day'] = np.arange(len(data))  # Add a numeric day column
    return data

def train_model(ticker):
    """
    Train a Linear Regression model on historical stock data.
    """
    data = fetch_historical_data(ticker)

    X = data[['Day']]  # Independent variable (Day)
    y = data['Close']  # Dependent variable (Closing price)

    # Train the model
    model = LinearRegression()
    model.fit(X, y)

    # Save the model
    with open(f'{ticker}_model.pkl', 'wb') as f:
        pickle.dump(model, f)

    print(f"Model trained and saved as '{ticker}_model.pkl'.")

if __name__ == "__main__":
    # Train the model for a specific stock (e.g., AAPL)
    train_model("AAPL")
