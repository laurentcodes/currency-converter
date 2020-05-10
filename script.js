const usd = document.getElementById('usd');
const otherCur = document.getElementById('other-cur');
const currenciesSelector = document.getElementById('currencies');

usd.addEventListener('input', calculateRates);

otherCur.addEventListener('input', calculateUSD);
currencies.addEventListener('change', calculateRates);

// Calculate rates
async function calculateRates() {
	const usdCurrency = usd.value;
	const rate = await getRates();

	otherCur.value = (usdCurrency * rate).toFixed(2);
}

async function calculateUSD() {
	const otherCurrency = otherCur.value;

	const rate = await getRates();

	usd.value = (otherCurrency / rate).toFixed(2);
}

// Fetch conversion rates
async function getRates() {
	const selector = currenciesSelector.value;

	const res = await fetch(
		`https://openexchangerates.org/api/latest.json?app_id=1b1a35a1207d46d3a2d1f8a3644361bc&base=USD`
	);

	const data = await res.json();
	const rate = data.rates[selector];

	return rate;
}
