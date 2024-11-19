import axios from 'axios';

// Use environment variables for the API key
const API_KEY = process.env.REACT_APP_FINNHUB_API_KEY; // Use .env variable

// Base URL for Finnhub
const BASE_URL = 'https://finnhub.io/api/v1';

// Fetch stock price and details by ticker
export const fetchStockPrice = async (ticker) => {
    try {
        const response = await axios.get(`${BASE_URL}/quote`, {
            params: {
                symbol: ticker,
                token: API_KEY,
            },
        });

        const data = response.data;
        if (!data || !data.c) {
            throw new Error('Invalid ticker or no data available.');
        }

        return {
            ticker,
            price: data.c, // Current price
            open: data.o,  // Opening price
            high: data.h,  // Day's high
            low: data.l,   // Day's low
            prevClose: data.pc, // Previous close price
        };
    } catch (error) {
        console.error('Error fetching stock price:', error.message);
        throw error;
    }
};

// Fetch multiple stock prices (real-time) for a list of tickers
export const fetchMultipleStocks = async (tickers) => {
    try {
        const promises = tickers.map((ticker) =>
            axios.get(`${BASE_URL}/quote`, {
                params: {
                    symbol: ticker,
                    token: API_KEY,
                },
            })
        );

        const responses = await Promise.all(promises);
        return responses.map((response, index) => {
            const data = response.data;
            if (!data || !data.c) {
                throw new Error(`Invalid data for ticker: ${tickers[index]}`);
            }

            return {
                ticker: tickers[index],
                price: data.c,
                open: data.o,
                high: data.h,
                low: data.l,
                prevClose: data.pc,
            };
        });
    } catch (error) {
        console.error('Error fetching multiple stocks:', error.message);
        throw error;
    }
};






