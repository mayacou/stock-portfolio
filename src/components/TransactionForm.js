import React, { useState } from 'react';
import { fetchStockPrice } from '../api/stockApi';

const TransactionForm = ({ onAddTransaction }) => {
    const [formData, setFormData] = useState({
        ticker: '',
        quantity: '',
        purchase_price: '',
        transaction_type: 'buy',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            let price = parseFloat(formData.purchase_price);

            // Fetch the current price for "Buy" transactions if the user didn't enter one
            if (formData.transaction_type === 'buy' && !price) {
                const stockData = await fetchStockPrice(formData.ticker);
                price = stockData.price;
                alert(`Fetched price for ${formData.ticker}: $${price}`);
            }

            // Build transaction data
            const transactionData = {
                ...formData,
                purchase_price: price,
            };

            if (formData.transaction_type === 'sell') {
                delete transactionData.purchase_price;
            }

            console.log('Transaction submitted:', transactionData);
            alert('Transaction added successfully!');

            onAddTransaction(transactionData);

            setFormData({
                ticker: '',
                quantity: '',
                purchase_price: '',
                transaction_type: 'buy',
            });
        } catch (error) {
            alert('Failed to fetch stock price. Please check the ticker and try again.');
            console.error('Error submitting transaction:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Add Transaction</h2>
            <label>
                Ticker:
                <input
                    type="text"
                    name="ticker"
                    value={formData.ticker}
                    onChange={handleChange}
                    required
                />
            </label>
            <br />
            <label>
                Quantity:
                <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    required
                />
            </label>
            <br />
            <label>
                Purchase Price (optional for "Buy"):
                <input
                    type="number"
                    name="purchase_price"
                    value={formData.purchase_price}
                    onChange={handleChange}
                />
            </label>
            <br />
            <label>
                Transaction Type:
                <select
                    name="transaction_type"
                    value={formData.transaction_type}
                    onChange={handleChange}
                >
                    <option value="buy">Buy</option>
                    <option value="sell">Sell</option>
                </select>
            </label>
            <br />
            <button type="submit">Add Transaction</button>
        </form>
    );
};

export default TransactionForm;
