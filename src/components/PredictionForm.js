import React, { useState } from 'react';

const PredictionForm = () => {
    const [ticker, setTicker] = useState('');
    const [days, setDays] = useState('');
    const [predictedPrices, setPredictedPrices] = useState(null);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setPredictedPrices(null);

        try {
            const response = await fetch('http://127.0.0.1:5000/predict', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ticker, day: parseInt(days) }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch prediction');
            }

            const data = await response.json();
            if (data.error) {
                throw new Error(data.error);
            }

            setPredictedPrices(data.predicted_prices);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div>
            <h2>Predict Stock Prices</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Stock Ticker:
                    <input
                        type="text"
                        value={ticker}
                        onChange={(e) => setTicker(e.target.value)}
                        required
                    />
                </label>
                <br />
                <label>
                    Days to Predict:
                    <input
                        type="number"
                        value={days}
                        onChange={(e) => setDays(e.target.value)}
                        required
                    />
                </label>
                <br />
                <button type="submit">Predict</button>
            </form>

            {predictedPrices && (
                <div>
                    <h3>Predicted Prices for {ticker}:</h3>
                    <ul>
                        {predictedPrices.map((price, index) => (
                            <li key={index}>Day {index + 1}: ${price.toFixed(2)}</li>
                        ))}
                    </ul>
                </div>
            )}
            {error && <div style={{ color: 'red' }}>Error: {error}</div>}
        </div>
    );
};

export default PredictionForm;
