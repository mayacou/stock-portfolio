import React, { useState, useEffect } from 'react';
import Portfolio from '../components/Portfolio';
import PortfolioChart from '../components/PortfolioChart';
import TransactionForm from '../components/TransactionForm';
import StockMarket from '../components/StockMarket';
import PredictionForm from '../components/PredictionForm'; // Import PredictionForm

const Dashboard = () => {
    const [portfolio, setPortfolio] = useState([]);

    useEffect(() => {
        // Mock portfolio data for initial setup
        const mockPortfolio = [
            { ticker: 'AAPL', quantity: 10, purchase_price: 150 },
            { ticker: 'GOOG', quantity: 5, purchase_price: 2800 },
            { ticker: 'MSFT', quantity: 8, purchase_price: 300 },
        ];
        setPortfolio(mockPortfolio);
    }, []);

    const handleAddTransaction = (transaction) => {
        const updatedPortfolio = [...portfolio];
        const existingStock = updatedPortfolio.find((stock) => stock.ticker === transaction.ticker);

        if (existingStock) {
            if (transaction.transaction_type === 'buy') {
                existingStock.quantity += parseInt(transaction.quantity);
                existingStock.purchase_price = parseFloat(transaction.purchase_price);
            } else if (transaction.transaction_type === 'sell') {
                existingStock.quantity -= parseInt(transaction.quantity);
                if (existingStock.quantity <= 0) {
                    const index = updatedPortfolio.indexOf(existingStock);
                    updatedPortfolio.splice(index, 1);
                }
            }
        } else if (transaction.transaction_type === 'buy') {
            updatedPortfolio.push({
                ticker: transaction.ticker,
                quantity: parseInt(transaction.quantity),
                purchase_price: parseFloat(transaction.purchase_price),
            });
        }

        setPortfolio(updatedPortfolio);
    };

    return (
        <div>
            <h1>Stock Portfolio Manager</h1>

            {/* Portfolio Section */}
            <Portfolio portfolio={portfolio} />

            {/* Portfolio Breakdown Chart */}
            <PortfolioChart portfolio={portfolio} />

            {/* Transaction Form */}
            <TransactionForm onAddTransaction={handleAddTransaction} />

            {/* Stock Market Section */}
            <StockMarket portfolio={portfolio} />

            {/* Prediction Form */}
            <PredictionForm />
        </div>
    );
};

export default Dashboard;


