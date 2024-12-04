document.getElementById('analyzeButton').addEventListener('click', async () => {
    const ticker = document.getElementById('ticker').value;
    const resultDiv = document.getElementById('result');
    const chartCanvas = document.getElementById('chart').getContext('2d');
  
    if (!ticker) {
      resultDiv.innerText = 'Please enter a stock ticker!';
      return;
    }
  
    // Fetch stock data from the API on analyze.koenignetwork.com
    try {
      const response = await fetch(`/analyze?ticker=${ticker}`);
      const data = await response.json();
  
      if (data.error) {
        resultDiv.innerText = `Error: ${data.error}`;
      } else {
        resultDiv.innerHTML = `
          <p>Model Accuracy: <strong>${data.accuracy}</strong></p>
          <p>Prediction for Next Day: <strong>${data.prediction}</strong></p>
        `;
  
        // Prepare data for chart
        const labels = data.data.map(entry => entry.Date);
        const closePrices = data.data.map(entry => entry.Close);
  
        // Render Chart.js chart
        new Chart(chartCanvas, {
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
      }
    } catch (error) {
      resultDiv.innerText = `Error fetching data: ${error.message}`;
    }
  });
  
