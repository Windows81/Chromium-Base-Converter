const DEFAULT_RADIX = 12;
const FRAC_MODES = {
	TRUNCATED_WHOLE: 0,
	UNTRUNCATED_WHOLE: 1,
	PERCENTAGE: 2,
};

const DIGITS = {
	[12]: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "\u218a", "\u218b"],
};

const FACTORS = {
	["%"]: -2,
	["k"]: 3,
	["mil"]: 3,

	["M"]: 6,
	["million"]: 6,
	["millones"]: 6,
	["millón"]: 6,

	["B"]: 9,
	["billion"]: 9,

	["billón"]: 12,
	["billion"]: 9,
	["billiones"]: 9,
};

const SUFFIXES = {};
function getSuffix(radix) {
	const prefab = SUFFIXES[radix];
	if (prefab) return prefab;
	const output = [];
	let base = radix;
	do {
		let add = base % 10;
		output.unshift(0x2080 + add);
		base = ~~(base / 10);
	} while (base > 0);
	return (SUFFIXES[radix] = String.fromCharCode.apply(null, output));
}

function getSetting(index, def) {
	return new Promise((res) => {
		chrome.storage.sync.get(index, (v) => res(v != null && v[index] != null ? v[index] : def));
	});
}

function getDigitTable(radix) {
	const prefab = DIGITS[radix];
	if (prefab) return prefab;
	const table = [];
	for (let c = 0; c < radix; c++) table.push(String.fromCharCode(c + (c > 9 ? 55 : 48)));
	return (DIGITS[radix] = table);
}

function changeRadix(number, radix, precis = 0) {
	//console.log(`Logged decimal ${number}.`);
	const digits = getDigitTable(radix);
	const sign = Math.sign(number);
	switch (sign) {
		case -1:
			return `-${changeRadix(-number, radix, precis)}`;
		case 0:
			return "0";
	}

	let base = ~~number;
	let frac = number % 1;

	const baseBuffer = [];
	do {
		let add = base % radix;
		baseBuffer.unshift(digits[add]);
		base = ~~(base / radix);
	} while (base > 0);
	let baseStr = baseBuffer.join("");

	if (precis > 0) {
		let fracMagn = ~~(precis / Math.log10(radix) + 0.5);
		let fracStr = changeRadix(~~(frac * radix ** fracMagn + 0.5), radix, 0).padStart(fracMagn, "0");
		return `${baseStr};${fracStr}`;
	}
	return baseStr;
}

async function modifyText(text, fracMode = FRAC_MODES.UNTRUNCATED_WHOLE, radix = NaN) {
	if (!text) return text;
	if (isNaN(radix)) radix = await getSetting("radix", DEFAULT_RADIX);

	var c = 0,
		offset = 0;
	var result = text;
	for (let match of text.matchAll(/([0-9][0-9\.,]*) ?([^:\.,\+\/ ]+)?/g)) {
		let capture = match[0],
			base = match[1],
			suffix = (match[2] || "").trim();
		let factor = FACTORS[suffix] || FACTORS[suffix.toLowerCase()] || 0;
		let beg = match.index + offset;
		let len = factor ? capture.length : base.length;

		let num, precis;
		switch (fracMode) {
			case FRAC_MODES.TRUNCATED_WHOLE: {
				base = base.replace(/,/, ".");
				if (factor == 0) base = base.replace(/\./, "");
				let decIndex = base.lastIndexOf(".");
				let decShift = decIndex > -1 ? base.length - decIndex - 1 : 0;
				num = Number.parseFloat(base) * 10 ** factor;
				precis = decShift - factor;
				break;
			}
			case FRAC_MODES.UNTRUNCATED_WHOLE: {
				num = Number.parseFloat(base.replace(/[,\.]/g, "")) * 10 ** factor;
				precis = 0;
				break;
			}
			case FRAC_MODES.PERCENTAGE: {
				base = base.replace(/,/, ".");
				let decIndex = base.lastIndexOf(".");
				let decShift = decIndex > -1 ? base.length - decIndex - 1 : 0;
				num = Number.parseFloat(base) / 10 ** 2;
				precis = decShift + 2;
				break;
			}
		}

		let ret = changeRadix(num, radix, precis) + getSuffix(radix);
		offset += ret.length - len;
		let end = beg + len;
		result = result.substr(0, beg) + ret + result.substr(end);
	}
	return result;
}

const RESERVED = {};
async function modifyElement(elem, fracMode = FRAC_MODES.UNTRUNCATED_WHOLE, radix = NaN) {
	if (!elem || elem.hasAttribute("radix_changed")) return;
	elem.innerText = await modifyText(elem.innerText, fracMode, radix);
	elem.setAttribute("radix_changed", true);
}

async function modifySelector(sel, fracMode = FRAC_MODES.UNTRUNCATED_WHOLE, radix = NaN) {
	document.querySelectorAll(sel).forEach((e) => modifyElement(e, fracMode, radix));
}
