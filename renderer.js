const priceElement = document.getElementById('price');

// Customizable settings
const textSize = '5em'; // You can change this to any size you prefer

let lastPrice = null;

async function fetchPrice() {
  try {
    const response = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=SOLFDUSD');
    const data = await response.json();
    let price = parseFloat(data.price);

    if (!showDecimals) {
      price = Math.floor(price);
    }

    // Format the price with commas
    const formattedPrice = price.toLocaleString();

    // Update the color based on price movement
    if (lastPrice !== null) {
      if (price > lastPrice) {
        priceElement.style.color = 'rgb(69, 151, 130)'; // Custom green color
      } else if (price < lastPrice) {
        priceElement.style.color = 'rgb(223, 72, 76)'; // Custom red color
      } else {
        priceElement.style.color = 'rgb(69, 151, 130)'; // Custom green color
      }
    }

    priceElement.textContent = formattedPrice;
    lastPrice = price;

  } catch (error) {
    priceElement.textContent = 'Error fetching price';
    console.error('Error fetching price:', error);
  }
}

// Initial fetch and interval setup
fetchPrice();
setInterval(fetchPrice, 200); // Fetch price every 200 milliseconds

// Apply the customizable text size
priceElement.style.fontSize = textSize;
