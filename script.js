const usd = document.getElementById('usd');
const otherCur = document.getElementById('other-cur');
const currenciesSelector = document.getElementById('currencies');
const rateView = document.getElementById('rateView');
const lastUpdated = document.getElementById('last-updated');

usd.addEventListener('input', calculateRates);

otherCur.addEventListener('input', calculateUSD);
currencies.addEventListener('change', calculateRates);

async function saveRates() {
	const rateArr = await getRates();
	const rates = rateArr[0];
	const timestamp = rateArr[2];

	// Save to localstorage
	localStorage.setItem('rates', JSON.stringify(rates));
	localStorage.setItem('timestamp', JSON.stringify(timestamp));

	return [rates, timestamp];
}

function loadRates() {
	const rates = JSON.parse(localStorage.getItem('rates'));

	return rates;
}

// Calculate rates
async function calculateRates() {
	const selector = currenciesSelector.value;
	const rates = loadRates();

	const rate = rates[selector];

	const usdCurrency = usd.value;

	otherCur.value = (usdCurrency * rate).toFixed(2);

	const rateSum = `1 USD = ${rate} ${selector}`;
	rateView.innerText = rateSum;
}

async function calculateUSD() {
	const selector = currenciesSelector.value;
	const rates = loadRates();

	const usdRate = rates['USD'];
	const otherRate = rates[selector];

	const finalRate = usdRate * otherRate;

	const otherCurrency = otherCur.value;

	usd.value = (otherCurrency / finalRate).toFixed(2);
}

// Fetch conversion rates
async function getRates() {
	const selector = currenciesSelector.value;

	const res = await fetch(
		`https://openexchangerates.org/api/latest.json?app_id=1b1a35a1207d46d3a2d1f8a3644361bc&base=USD`
	);

	const data = await res.json();
	const rates = data.rates;
	const timestamp = data.timestamp;
	const rate = rates[selector];

	return [rates, rate, timestamp];
}

setInterval(async () => {
	const ratesArr = await saveRates();
	const rates = ratesArr[0];
	const timestamp = ratesArr[1];

	localStorage.setItem('rates', JSON.stringify(rates));
	localStorage.setItem('timestamp', JSON.stringify(timestamp));
}, 3000 * 60 * 60);

async function checkLocalStorage() {
	if ('rates' in localStorage) {
		if ('timestamp' in localStorage) {
			const timestamp = JSON.parse(localStorage.getItem('timestamp'));

			const dateNow = new Date();
			const timestampNow = dateNow.getTime();

			const oldDate = new Date(timestamp * 1000);
			const timestampOld = oldDate.getTime();

			const difference = Math.floor(
				Math.abs(timestampNow - timestampOld) / 36e5
			);

			const formatDate = new Date(timestampOld);
			const dateString = `Last Update: ${formatDate.toLocaleString()}`;

			lastUpdated.innerText = dateString;

			console.log('Getting data from localstorage');

			if (difference >= 3) {
				console.log('Fetching new data');
				saveRates();
			}
		} else {
			console.log('No timestamp found');
			const timeStamp = await saveRates();
			const timestamp = timeStamp[1];

			localStorage.setItem('timestamp', JSON.stringify(timestamp));
		}
	} else {
		console.log('No localstorage, creating entry');
		saveRates();
	}
}

window.onload = function () {
	checkLocalStorage();
};
