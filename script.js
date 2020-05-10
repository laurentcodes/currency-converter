const usd = document.getElementById('usd');
const otherCur = document.getElementById('other-cur');
const currenciesSelector = document.getElementById('currencies');

usd.addEventListener('input', calculateRates);

otherCur.addEventListener('input', calculateUSD);
currencies.addEventListener('change', calculateRates);

async function saveRates() {
	const rateArr = await getRates();
	const rates = rateArr[0];
	const timestamp = rateArr[2];

	// Save to localstorage
	localStorage.setItem('rates', JSON.stringify(rates));

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
}, 21600);

loadRates();
saveRates();
