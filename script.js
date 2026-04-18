
const countryList = {
    AED: "AE", AFN: "AF", XCD: "AG", ALL: "AL", AMD: "AM", ANG: "AN", AOA: "AO",
    ARS: "AR", AUD: "AU", AZN: "AZ", BAM: "BA", BBD: "BB", BDT: "BD", XOF: "BE",
    BGN: "BG", BHD: "BH", BIF: "BI", BMD: "BM", BND: "BN", BOB: "BO", BRL: "BR",
    BSD: "BS", NOK: "BV", BWP: "BW", BYR: "BY", BZD: "BZ", CAD: "CA", CDF: "CD",
    XAF: "CF", CHF: "CH", CLP: "CL", CNY: "CN", COP: "CO", CRC: "CR", CUP: "CU",
    CVE: "CV", CYP: "CY", CZK: "CZ", DJF: "DJ", DKK: "DK", DOP: "DO", DZD: "DZ",
    ECS: "EC", EEK: "EE", EGP: "EG", ETB: "ET", EUR: "FR", FJD: "FJ", FKP: "FK",
    GBP: "GB", GEL: "GE", GGP: "GG", GHS: "GH", GIP: "GI", GMD: "GM", GNF: "GN",
    GTQ: "GT", GYD: "GY", HKD: "HK", HNL: "HN", HRK: "HR", HTG: "HT", HUF: "HU",
    IDR: "ID", ILS: "IL", INR: "IN", IQD: "IQ", IRR: "IR", ISK: "IS", JMD: "JM",
    JOD: "JO", JPY: "JP", KES: "KE", KGS: "KG", KHR: "KH", KMF: "KM", KPW: "KP",
    KRW: "KR", KWD: "KW", KYD: "KY", KZT: "KZ", LAK: "LA", LBP: "LB", LKR: "LK",
    LRD: "LR", LSL: "LS", LTL: "LT", LVL: "LV", LYD: "LY", MAD: "MA", MDL: "MD",
    MGA: "MG", MKD: "MK", MMK: "MM", MNT: "MN", MOP: "MO", MRO: "MR", MTL: "MT",
    MUR: "MU", MVR: "MV", MWK: "MW", MXN: "MX", MYR: "MY", MZN: "MZ", NAD: "NA",
    XPF: "NC", NGN: "NG", NIO: "NI", NPR: "NP", NZD: "NZ", OMR: "OM", PAB: "PA",
    PEN: "PE", PGK: "PG", PHP: "PH", PKR: "PK", PLN: "PL", PYG: "PY", QAR: "QA",
    RON: "RO", RSD: "RS", RUB: "RU", RWF: "RW", SAR: "SA", SBD: "SB", SCR: "SC",
    SDG: "SD", SEK: "SE", SGD: "SG", SKK: "SK", SLL: "SL", SOS: "SO", SRD: "SR",
    STD: "ST", SVC: "SV", SYP: "SY", SZL: "SZ", THB: "TH", TJS: "TJ", TMT: "TM",
    TND: "TN", TOP: "TO", TRY: "TR", TTD: "TT", TWD: "TW", TZS: "TZ", UAH: "UA",
    UGX: "UG", USD: "US", UYU: "UY", UZS: "UZ", VEF: "VE", VND: "VN", VUV: "VU",
    YER: "YE", ZAR: "ZA", ZMK: "ZM", ZWD: "ZW"
};

// Populate selects
const selects = document.querySelectorAll(".exchanger select");

for (let select of selects) {
    for (let key in countryList) {
        let opt = document.createElement("option");
        opt.innerText = key;
        opt.value = key;
        
        if (select.id === "options1" && key === "USD") opt.selected = true;
        if (select.id === "options2" && key === "PKR") opt.selected = true;
        select.append(opt);
    }

    select.addEventListener("change", (e) => updateFlag(e.target));
}

function updateFlag(element) {
    let countryCode = countryList[element.value];
    let img = element.parentElement.querySelector("img");
    img.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
}

// Fetch rate
const btn = document.querySelector(".btn button");

btn.addEventListener("click", async () => {
    const amountInput = document.querySelector(".amount input");
    const amtval = parseFloat(amountInput.value);
    const valueEl = document.querySelector(".value");

    if (!amtval || amtval < 1) {
        alert("Please enter a valid amount.");
        return;
    }

    const from = document.getElementById("options1").value;
    const to = document.getElementById("options2").value;

    btn.classList.add("loading");
    btn.textContent = "Fetching...";

    try {
        const res = await fetch("https://cdn.moneyconvert.net/api/latest.json");
        const data = await res.json();

        let rate;
        if (from === "USD") {
            rate = data.rates[to];
        } else {
            rate = (1 / data.rates[from]) * data.rates[to];
        }

        const finalAmount = (amtval * rate).toFixed(2);

        valueEl.classList.remove("updated");
        void valueEl.offsetWidth;
        valueEl.textContent = `${amtval} ${from} = ${finalAmount} ${to}`;
        valueEl.classList.add("updated");

    } catch (err) {
        valueEl.textContent = "Failed to fetch rate. Try again.";
        valueEl.classList.remove("updated");
    }

    btn.classList.remove("loading");
    btn.textContent = "Get Exchange Rate";
});
