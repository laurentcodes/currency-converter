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
		`http://api.currencylayer.com/live?access_key=0fcd4fd8ce111a55b30e7fdbe3bf16df`
	);

	const data = await res.json();
	const rate = data.quotes[`USD${selector}`];

	return rate;
}
