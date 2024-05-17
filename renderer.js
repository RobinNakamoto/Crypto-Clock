const priceElement = document.getElementById('price');
const preferencesForm = document.getElementById('preferences-form');
const textSizeInput = document.getElementById('text-size');
const showDecimalsInput = document.getElementById('show-decimals');

let lastPrice = null;

// Load preferences from local storage
const preferences = {
  textSize: localStorage.getItem('textSize') || '5em',
  showDecimals: localStorage.getItem('showDecimals') === 'true'
};

// Apply preferences to UI
textSizeInput.value = preferences.textSize;
showDecimalsInput.checked = preferences.showDecimals;
priceElement.style.fontSize = preferences.textSize;

// Fetch and update price
async function fetchPrice() {
  try {
    const response = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCFDUSD');
    const data = await response.json();
    let price = parseFloat(data.price);

    if (!preferences.showDecimals) {
      price = Math.floor(price);
    }

    // Format the price with commas
    const formattedPrice = price.toLocaleString();

    // Update the color based on price movement
    if (lastPrice !== null) {
      if (price > lastPrice) {
        priceElement.style.color = 'green';
      } else if (price < lastPrice) {
        priceElement.style.color = 'red';
      } else {
        priceElement.style.color = 'white';
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
setInterval(fetchPrice, 500); // Fetch price every 500 milliseconds

// Handle preferences form submission
preferencesForm.addEventListener('submit', (event) => {
  event.preventDefault();
  preferences.textSize = textSizeInput.value;
  preferences.showDecimals = showDecimalsInput.checked;

  // Save preferences to local storage
  localStorage.setItem('textSize', preferences.textSize);
  localStorage.setItem('showDecimals', preferences.showDecimals);

  // Apply preferences
  priceElement.style.fontSize = preferences.textSize;
  fetchPrice();
});
