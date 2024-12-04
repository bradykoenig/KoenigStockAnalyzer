const API_URL = "https://finnhub.io/api/v1/quote";
const API_KEY = "ct8c1v1r01qtkv5s2bhgct8c1v1r01qtkv5s2bi0";

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
    // Fetch stock data from Finnhub
    const response = await fetch(`${API_URL}?symbol=${ticker}&token=${API_KEY}`);
    const data = await response.json();

    // Handle API errors or missing data
    if (!data || !data.c) {
      resultDiv.innerText = 'Error fetching stock data. Please try again.';
      return;
    }

    // Extract and format data for chart (Finnhub provides current, high, low, open, and close data)
    const prices = [
      data.o, // Open
      data.h, // High
      data.l, // Low
      data.c  // Current (Close)
    ];
    const labels = ["Open", "High", "Low", "Close"];

    resultDiv.innerHTML = `<p>Showing data for: <strong>${ticker.toUpperCase()}</strong></p>`;

    // Destroy the existing chart instance if it exists
    if (chartInstance) {
      chartInstance.destroy();
    }

    // Create a new chart
    chartInstance = new Chart(chartCanvas, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Price',
          data: prices,
          backgroundColor: ['#007bff', '#28a745', '#ffc107', '#dc3545'],
          borderWidth: 1,
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
        },
        scales: {
          y: { title: { display: true, text: 'Price (USD)' }, beginAtZero: true }
        }
      }
    });
  } catch (error) {
    resultDiv.innerText = `Error fetching data: ${error.message}`;
  }
});
