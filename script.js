const API_URL = "https://cors-anywhere.herokuapp.com/https://query1.finance.yahoo.com/v8/finance/chart/";

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
    // Fetch stock data from Yahoo Finance via proxy
    const response = await fetch(`${API_URL}${ticker}?interval=1d&range=6mo`);
    const data = await response.json();

    if (!data.chart || !data.chart.result) {
      resultDiv.innerText = 'Error fetching stock data. Please try again.';
      return;
    }

    const results = data.chart.result[0];
    const timestamps = results.timestamp.map(ts => new Date(ts * 1000).toLocaleDateString());
    const closePrices = results.indicators.quote[0].close;

    resultDiv.innerHTML = `<p>Showing data for: <strong>${ticker.toUpperCase()}</strong></p>`;

    // Render chart
    new Chart(chartCanvas, {
      type: 'line',
      data: {
        labels: timestamps,
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
