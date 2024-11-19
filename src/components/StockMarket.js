import React, { useState, useEffect } from 'react';
import { fetchMultipleStocks, fetchStockPrice } from '../api/stockApi';

const StockMarket = ({ portfolio }) => {
    const [stocks, setStocks] = useState([]);
    const [searchTicker, setSearchTicker] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Default list of portfolio stocks
    const defaultTickers = portfolio.map((stock) => stock.ticker);

    // Fetch data for default stocks
    const fetchPortfolioStocks = async () => {
        try {
            setLoading(true);
            const stockData = await fetchMultipleStocks(defaultTickers);
            setStocks(stockData);
            setError(null);
        } catch (err) {
            setError('Failed to fetch portfolio stocks.');
        } finally {
            setLoading(false);
        }
    };

    // Fetch details for a single stock by ticker
    const searchStock = async () => {
        if (!searchTicker) return;

        try {
            setLoading(true);
            const stockData = await fetchStockPrice(searchTicker.toUpperCase());
            setStocks((prevStocks) => [
                ...prevStocks.filter((stock) => stock.ticker !== stockData.ticker),
                stockData,
            ]);
            setError(null);
        } catch (err) {
            setError(`Failed to fetch details for ${searchTicker}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPortfolioStocks();
    }, [portfolio]);

    return (
        <div>
            <h2>Stock Market</h2>
            <div style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    placeholder="Search by ticker (e.g., AAPL)"
                    value={searchTicker}
                    onChange={(e) => setSearchTicker(e.target.value)}
                    style={{ padding: '10px', marginRight: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
                />
                <button
                    onClick={searchStock}
                    style={{
                        padding: '10px 20px',
                        borderRadius: '4px',
                        background: '#4CAF50',
                        color: 'white',
                        border: 'none',
                    }}
                >
                    Search
                </button>
                <button
                    onClick={fetchPortfolioStocks}
                    style={{
                        padding: '10px 20px',
                        borderRadius: '4px',
                        background: '#36A2EB',
                        color: 'white',
                        border: 'none',
                        marginLeft: '10px',
                    }}
                >
                    Refresh
                </button>
            </div>
            {loading && <div>Loading stock data...</div>}
            {error && <div style={{ color: 'red' }}>{error}</div>}
            {!loading && !error && (
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f4f4f9', borderBottom: '2px solid #ddd' }}>
                            <th style={tableHeaderStyle}>Ticker</th>
                            <th style={tableHeaderStyle}>Current Price</th>
                            <th style={tableHeaderStyle}>Opening Price</th>
                            <th style={tableHeaderStyle}>High</th>
                            <th style={tableHeaderStyle}>Low</th>
                            <th style={tableHeaderStyle}>Previous Close</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stocks.map((stock, index) => (
                            <tr key={index} style={{ borderBottom: '1px solid #ddd', textAlign: 'center' }}>
                                <td style={tableCellStyle}>{stock.ticker}</td>
                                <td style={tableCellStyle}>${stock.price.toFixed(2)}</td>
                                <td style={tableCellStyle}>${stock.open?.toFixed(2) || 'N/A'}</td>
                                <td style={tableCellStyle}>${stock.high?.toFixed(2) || 'N/A'}</td>
                                <td style={tableCellStyle}>${stock.low?.toFixed(2) || 'N/A'}</td>
                                <td style={tableCellStyle}>${stock.prevClose?.toFixed(2) || 'N/A'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

const tableHeaderStyle = {
    padding: '10px',
    textAlign: 'center',
    fontWeight: 'bold',
    borderBottom: '2px solid #ddd',
};

const tableCellStyle = {
    padding: '10px',
    textAlign: 'center',
};

export default StockMarket;

