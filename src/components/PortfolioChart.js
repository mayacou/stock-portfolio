import React from 'react';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

Chart.register(ArcElement, Tooltip, Legend);

const PortfolioChart = ({ portfolio }) => {
    const data = {
        labels: portfolio.map(stock => stock.ticker),
        datasets: [
            {
                data: portfolio.map(stock => stock.quantity * stock.purchase_price),
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
                hoverBackgroundColor: ['#FF6384AA', '#36A2EBAA', '#FFCE56AA', '#4BC0C0AA', '#9966FFAA'],
            },
        ],
    };

    const options = {
        plugins: {
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const index = context.dataIndex;
                        const stock = portfolio[index];
                        const totalValue = (stock.quantity * stock.purchase_price).toFixed(2);
                        return `${stock.ticker}: $${totalValue} (${stock.quantity} shares)`;
                    },
                },
            },
        },
    };

    return (
        <div>
            <h2>Portfolio Breakdown</h2>
            <Pie data={data} options={options} />
        </div>
    );
};

export default PortfolioChart;
