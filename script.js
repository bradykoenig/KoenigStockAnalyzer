const API_URL = "https://www.alphavantage.co/query";
const API_KEY = "3D6J8YQ1M2PRSLBF"; // Replace with your Alpha Vantage API key

let chartInstance = null; // Store the current chart instance

document.getElementById('analyzeButton').addEventListener('click', async () => {
  const ticker = document.getElementById('ticker').value.trim();
  const resultDiv = document.getElementById('result');
  const chartCanvas = document.getElementById('chart').getContext('2d');

  if (!ticker) {
    resultDiv.innerText = 'Please enter a stock ticker!';
    return;
  }

  resultDiv.innerText = 'Fetching data...';

  try {
    // Fetch stock data from Alpha Vantage
    const response = await fetch(`${API_URL}?function=TIME_SERIES_DAILY&symbol=${ticker}&apikey=${API_KEY}`);
    const data = await response.json();

    if (!data["Time Series (Daily)"]) {
      resultDiv.innerText = 'Error fetching stock data. Please try again.';
      return;
    }

    // Extract and format data
    const timeSeries = data["Time Series (Daily)"];
    const labels = Object.keys(timeSeries).slice(0, 30).reverse(); // Get the last 30 days
    const closePrices = labels.map(date => parseFloat(timeSeries[date]["4. close"]));

    resultDiv.innerHTML = `<p>Showing data for: <strong>${ticker.toUpperCase()}</strong></p>`;

    // Destroy the existing chart instance if it exists
    if (chartInstance) {
      chartInstance.destroy();
    }

    // Create a new chart
    chartInstance = new Chart(chartCanvas, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Close Price',
          data: closePrices,
          borderColor: '#007bff',
          backgroundColor: 'rgba(0, 123, 255, 0.1)',
          borderWidth: 2,
          fill: true,
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true },
        },
        scales: {
          x: { title: { display: true, text: 'Date' } },
          y: { title: { display: true, text: 'Price' } }
        }
      }
    });
  } catch (error) {
    resultDiv.innerText = `Error fetching data: ${error.message}`;
  }
});
