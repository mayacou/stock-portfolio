import React, { useEffect, useState } from 'react';
import { fetchStockPrice } from '../api/stockApi';

const Portfolio = ({ portfolio }) => {
    const [prices, setPrices] = useState({}); // Store current prices for each stock

    useEffect(() => {
        const fetchPrices = async () => {
            const updatedPrices = {};
            for (const stock of portfolio) {
                try {
                    const stockData = await fetchStockPrice(stock.ticker);
                    updatedPrices[stock.ticker] = stockData.price;
                } catch (error) {
                    console.error(`Error fetching price for ${stock.ticker}:`, error.message);
                    updatedPrices[stock.ticker] = null; // Handle missing price
                }
            }
            setPrices(updatedPrices);
        };

        fetchPrices();
    }, [portfolio]);

    const totalProfitLoss = portfolio.reduce((acc, stock) => {
        const currentPrice = prices[stock.ticker];
        const purchasePrice = stock.purchase_price;
        if (currentPrice !== null && currentPrice !== undefined && purchasePrice !== null && purchasePrice !== undefined) {
            return acc + (currentPrice - purchasePrice) * stock.quantity;
        }
        return acc;
    }, 0);

    return (
        <div>
            <h2>My Portfolio</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f4f4f9', borderBottom: '2px solid #ddd' }}>
                        <th style={tableHeaderStyle}>Ticker</th>
                        <th style={tableHeaderStyle}>Quantity</th>
                        <th style={tableHeaderStyle}>Purchase Price</th>
                        <th style={tableHeaderStyle}>Current Price</th>
                        <th style={tableHeaderStyle}>Profit/Loss</th>
                    </tr>
                </thead>
                <tbody>
                    {portfolio.map((stock, index) => {
                        const currentPrice = prices[stock.ticker];
                        const purchasePrice = stock.purchase_price;

                        const profitLoss =
                            currentPrice !== null && currentPrice !== undefined &&
                            purchasePrice !== null && purchasePrice !== undefined
                                ? ((currentPrice - purchasePrice) * stock.quantity).toFixed(2)
                                : 'N/A';

                        return (
                            <tr key={index} style={{ borderBottom: '1px solid #ddd', textAlign: 'center' }}>
                                <td style={tableCellStyle}>{stock.ticker}</td>
                                <td style={tableCellStyle}>{stock.quantity}</td>
                                <td style={tableCellStyle}>
                                    {purchasePrice !== null && purchasePrice !== undefined
                                        ? `$${purchasePrice.toFixed(2)}`
                                        : 'N/A'}
                                </td>
                                <td style={tableCellStyle}>
                                    {currentPrice !== null && currentPrice !== undefined
                                        ? `$${currentPrice.toFixed(2)}`
                                        : 'N/A'}
                                </td>
                                <td style={{ ...tableCellStyle, color: profitLoss >= 0 ? 'green' : 'red' }}>
                                    {profitLoss !== 'N/A' ? `$${profitLoss}` : 'N/A'}
                                </td>
                            </tr>
                        );
                    })}
                    <tr>
                        <td colSpan="4" style={{ textAlign: 'right', fontWeight: 'bold' }}>Total Profit/Loss:</td>
                        <td style={{ fontWeight: 'bold', color: totalProfitLoss >= 0 ? 'green' : 'red' }}>
                            ${totalProfitLoss.toFixed(2)}
                        </td>
                    </tr>
                </tbody>
            </table>
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

export default Portfolio;
