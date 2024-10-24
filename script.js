document.addEventListener("DOMContentLoaded", function() {
    const assetsTable = document.getElementById("assetsTable");
    const totalValueElement = document.getElementById("totalValue");
    const assetForm = document.getElementById("assetForm");

    // Load portfolio from local storage
    let portfolio = JSON.parse(localStorage.getItem('portfolio')) || [];

    // Initialize chart
    let portfolioChart = null;
    
    // Function to update the total portfolio value
    function updateTotalPortfolioValue() {
        let totalPortfolioValue = portfolio.reduce((acc, asset) => acc + asset.quantity * asset.price, 0);
        totalValueElement.innerText = totalPortfolioValue.toFixed(2);
    }

    // Function to render the assets in the table
    function renderAssets() {
        assetsTable.innerHTML = "";  // Clear the table
        portfolio.forEach((asset, index) => {
            const totalValue = asset.quantity * asset.price;

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${asset.name}</td>
                <td>${asset.quantity}</td>
                <td>${asset.price}</td>
                <td>${totalValue.toFixed(2)}</td>
                <td><button class="delete-btn" data-index="${index}">Delete</button></td>
            `;
            assetsTable.appendChild(row);
        });
    }

    // Function to handle adding a new asset
    function addAsset(event) {
        event.preventDefault();
        const name = document.getElementById("assetName").value;
        const quantity = parseFloat(document.getElementById("quantity").value);
        const price = parseFloat(document.getElementById("price").value);

        const newAsset = { name, quantity, price };
        portfolio.push(newAsset);

        // Update portfolio in local storage
        localStorage.setItem('portfolio', JSON.stringify(portfolio));

        renderAssets();
        updateTotalPortfolioValue();
        updateChart(); // Update chart after adding new asset
        assetForm.reset();  // Clear the form
    }

    // Function to handle deleting an asset
    function deleteAsset(index) {
        portfolio.splice(index, 1);
        localStorage.setItem('portfolio', JSON.stringify(portfolio));
        renderAssets();
        updateTotalPortfolioValue();
        updateChart(); // Update chart after deleting an asset
    }

    // Event listener for form submission
    assetForm.addEventListener("submit", addAsset);

    // Event listener for delete button
    assetsTable.addEventListener("click", function(event) {
        if (event.target.classList.contains("delete-btn")) {
            const index = event.target.getAttribute("data-index");
            deleteAsset(index);
        }
    });

    // Function to create or update the chart
    function updateChart() {
        const assetNames = portfolio.map(asset => asset.name);
        const assetValues = portfolio.map(asset => asset.quantity * asset.price);

        const ctx = document.getElementById("portfolioChart").getContext("2d");

        if (portfolioChart !== null) {
            portfolioChart.destroy();  // Destroy the old chart before creating a new one
        }

        portfolioChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: assetNames,
                datasets: [{
                    data: assetValues,
                    backgroundColor: [
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56',
                        '#4BC0C0',
                        '#9966FF',
                        '#FF9F40'
                    ],
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                    },
                    title: {
                        display: true,
                        text: 'Portfolio Breakdown by Asset Value'
                    }
                }
            }
        });
    }

    // Initial rendering of assets and portfolio value
    renderAssets();
    updateTotalPortfolioValue();
    updateChart();  // Initial chart rendering
});
