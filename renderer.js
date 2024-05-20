const priceElement = document.getElementById('price');

// Customizable settings
const showDecimals = false; // Change to true if you want to show decimals

let lastPrice = null;

window['__onGCastApiAvailable'] = function(isAvailable) {
    if (isAvailable) {
        initializeCastApi();
    }
};

function initializeCastApi() {
    cast.framework.CastContext.getInstance().setOptions({
        receiverApplicationId: chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID,
        autoJoinPolicy: chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED
    });
}

document.getElementById('castButton').addEventListener('click', () => {
    const context = cast.framework.CastContext.getInstance();
    const session = context.getCurrentSession();
    if (!session) {
        context.requestSession().then(() => {
            startCasting();
        }).catch((error) => {
            console.error('Error starting cast session:', error);
        });
    } else {
        startCasting();
    }
});

function startCasting() {
    const mediaInfo = new chrome.cast.media.MediaInfo(window.location.href, 'text/html');
    const request = new chrome.cast.media.LoadRequest(mediaInfo);
    const session = cast.framework.CastContext.getInstance().getCurrentSession();
    session.loadMedia(request).then(() => {
        console.log('Media loaded successfully');
    }).catch((error) => {
        console.error('Error loading media:', error);
    });
}

async function fetchPrice() {
    try {
        const response = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCFDUSD');
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