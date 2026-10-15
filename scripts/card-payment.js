// Visual-only card form for the demo checkout: formats, previews and validates
// the fields, but the card data is never stored or sent anywhere.
(() => {
    const container = document.getElementById("cardPayment");
    if (!container) return;

    const numberInput = document.getElementById("cardNumber");
    const nameInput = document.getElementById("cardName");
    const expiryInput = document.getElementById("cardExpiry");
    const cvvInput = document.getElementById("cardCvv");
    const inputs = [numberInput, nameInput, expiryInput, cvvInput];
    const paymentRadios = document.querySelectorAll('input[name="payment"]');

    const preview = document.getElementById("cardPreview");
    const previewNumber = document.getElementById("cardPreviewNumber");
    const previewName = document.getElementById("cardPreviewName");
    const previewExpiry = document.getElementById("cardPreviewExpiry");
    const previewBrand = document.getElementById("cardPreviewBrand");

    const BRANDS = [
        { id: "amex", label: "AMEX", pattern: /^3[47]/, length: 15, cvv: 4, groups: [4, 6, 5] },
        { id: "visa", label: "VISA", pattern: /^4/, length: 16, cvv: 3, groups: [4, 4, 4, 4] },
        { id: "mastercard", label: "Mastercard", pattern: /^(5[1-5]|2[2-7])/, length: 16, cvv: 3, groups: [4, 4, 4, 4] }
    ];
    const DEFAULT_BRAND = { id: "", label: "", length: 16, cvv: 3, groups: [4, 4, 4, 4] };

    const digitsOf = (value) => value.replace(/\D/g, "");
    const detectBrand = (digits) => BRANDS.find((brand) => brand.pattern.test(digits)) || DEFAULT_BRAND;

    const groupDigits = (digits, groups) => {
        const parts = [];
        let start = 0;
        groups.forEach((size) => {
            if (start < digits.length) parts.push(digits.slice(start, start + size));
            start += size;
        });
        return parts.join(" ");
    };

    // Luhn checksum used by every real card number
    const passesLuhn = (digits) => {
        let sum = 0;
        digits.split("").reverse().forEach((char, index) => {
            let digit = Number(char);
            if (index % 2 === 1) {
                digit *= 2;
                if (digit > 9) digit -= 9;
            }
            sum += digit;
        });
        return sum % 10 === 0;
    };

    const isFutureExpiry = (value) => {
        const match = value.match(/^(\d{2})\/(\d{2})$/);
        if (!match) return false;
        const month = Number(match[1]);
        const year = 2000 + Number(match[2]);
        if (month < 1 || month > 12) return false;
        const now = new Date();
        return year > now.getFullYear() || (year === now.getFullYear() && month >= now.getMonth() + 1);
    };

    const validate = () => {
        const digits = digitsOf(numberInput.value);
        const brand = detectBrand(digits);
        numberInput.setCustomValidity(digits.length === brand.length && passesLuhn(digits) ? "" : "invalid");
        expiryInput.setCustomValidity(isFutureExpiry(expiryInput.value) ? "" : "invalid");
        cvvInput.setCustomValidity(digitsOf(cvvInput.value).length === brand.cvv ? "" : "invalid");
    };

    const updatePreview = () => {
        const digits = digitsOf(numberInput.value);
        const brand = detectBrand(digits);
        const masked = digits.padEnd(brand.length, "•");

        previewNumber.textContent = groupDigits(masked, brand.groups);
        previewName.textContent = nameInput.value.trim().toUpperCase() || "NOMBRE APELLIDO";
        previewExpiry.textContent = expiryInput.value || "MM/AA";
        previewBrand.textContent = brand.label;
        preview.dataset.brand = brand.id;
    };

    numberInput.addEventListener("input", () => {
        const digits = digitsOf(numberInput.value);
        const brand = detectBrand(digits);
        numberInput.value = groupDigits(digits.slice(0, brand.length), brand.groups);
        cvvInput.maxLength = brand.cvv;
        validate();
        updatePreview();
    });

    expiryInput.addEventListener("input", (event) => {
        let digits = digitsOf(expiryInput.value).slice(0, 4);
        // "5" -> "05/" so single-digit months need one keystroke
        if (digits.length === 1 && Number(digits) > 1) digits = `0${digits}`;
        const deleting = event.inputType?.startsWith("delete");
        expiryInput.value = digits.length >= 2 && !(deleting && digits.length === 2)
            ? `${digits.slice(0, 2)}/${digits.slice(2)}`
            : digits;
        validate();
        updatePreview();
    });

    cvvInput.addEventListener("input", () => {
        cvvInput.value = digitsOf(cvvInput.value);
        validate();
    });

    cvvInput.addEventListener("focus", () => preview.classList.add("is-cvv"));
    cvvInput.addEventListener("blur", () => preview.classList.remove("is-cvv"));

    nameInput.addEventListener("input", updatePreview);

    // Card fields only count when the card option is selected
    const syncPaymentMethod = () => {
        const usingCard = document.querySelector('input[name="payment"]:checked')?.value === "Tarjeta";
        container.hidden = !usingCard;
        inputs.forEach((input) => {
            input.disabled = !usingCard;
        });
    };

    paymentRadios.forEach((radio) => radio.addEventListener("change", syncPaymentMethod));

    // checkout.js calls this after a confirmed order so no card data stays on the page
    window.AlcobaCardPayment = {
        reset: () => {
            inputs.forEach((input) => {
                input.value = "";
            });
            validate();
            updatePreview();
        }
    };

    validate();
    updatePreview();
    syncPaymentMethod();
})();
