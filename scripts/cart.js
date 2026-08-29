(() => {
    const STORAGE_KEY = "alcoba-cart";
    const inPages = location.pathname.includes("/pages/");
    const assetPrefix = inPages ? "../" : "";
    const shopHref = inPages ? "shop.html" : "pages/shop.html";

    const readCart = () => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            const parsed = raw ? JSON.parse(raw) : [];
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    };

    const writeCart = (cart) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    };

    let cart = readCart();

    const cartItemsEl = document.getElementById("cartItems");
    const cartEmptyEl = document.getElementById("cartEmpty");
    const cartSummaryEl = document.getElementById("cartSummary");
    const cartSubtotalEl = document.getElementById("cartSubtotal");
    const cartCountEl = document.getElementById("cartCount");
    const cartCheckoutEl = document.getElementById("cartCheckout");

    if (cartCheckoutEl) cartCheckoutEl.href = shopHref;

    const formatPrice = (value) => `$${value.toLocaleString("en-US")} USD`;

    const normalizeImage = (src) => assetPrefix + src.replace(/^(\.\.\/)+/, "");

    const render = () => {
        const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);

        if (cartCountEl) {
            cartCountEl.textContent = String(totalCount);
            cartCountEl.hidden = totalCount === 0;
        }

        if (!cartItemsEl) return;

        cartItemsEl.innerHTML = "";

        if (cart.length === 0) {
            if (cartEmptyEl) cartEmptyEl.hidden = false;
            if (cartSummaryEl) cartSummaryEl.hidden = true;
            return;
        }

        if (cartEmptyEl) cartEmptyEl.hidden = true;
        if (cartSummaryEl) cartSummaryEl.hidden = false;

        const subtotal = cart.reduce((sum, item) => sum + item.qty * item.price, 0);
        if (cartSubtotalEl) cartSubtotalEl.textContent = formatPrice(subtotal);

        cart.forEach((item) => {
            const li = document.createElement("li");
            li.className = "cart-item";
            li.dataset.id = item.id;
            li.innerHTML = `
                <img class="cart-item__image" src="${normalizeImage(item.image)}" alt="${item.name}">
                <div class="cart-item__info">
                    <p class="cart-item__title">${item.name}</p>
                    <span class="cart-item__price">${formatPrice(item.price)}</span>
                    <div class="cart-item__qty">
                        <button type="button" data-qty="-1" aria-label="Reducir cantidad">&minus;</button>
                        <span>${item.qty}</span>
                        <button type="button" data-qty="1" aria-label="Aumentar cantidad">+</button>
                    </div>
                </div>
                <button type="button" class="cart-item__remove" data-remove aria-label="Eliminar producto">&times;</button>
            `;
            cartItemsEl.appendChild(li);
        });
    };

    const saveAndRender = () => {
        writeCart(cart);
        render();
    };

    const addItem = (item) => {
        const existing = cart.find((entry) => entry.id === item.id);
        if (existing) {
            existing.qty += 1;
        } else {
            cart.push({ ...item, qty: 1 });
        }
        saveAndRender();
    };

    document.querySelectorAll("[data-add-to-cart]").forEach((button) => {
        button.addEventListener("click", () => {
            const card = button.closest(".product-card");
            if (!card) return;

            const id = card.dataset.id;
            const name = card.querySelector(".product-card__title")?.textContent.trim();
            const priceText = card.querySelector(".product-card__price")?.textContent || "0";
            const price = Number(priceText.replace(/[^0-9.]/g, "")) || 0;
            const image = card.querySelector("img")?.getAttribute("src") || "";

            if (!id || !name) return;

            addItem({ id, name, price, image });

            button.classList.add("is-added");
            window.setTimeout(() => button.classList.remove("is-added"), 900);
        });
    });

    if (cartItemsEl) {
        cartItemsEl.addEventListener("click", (event) => {
            const itemEl = event.target.closest(".cart-item");
            if (!itemEl) return;

            const id = itemEl.dataset.id;
            const cartItem = cart.find((entry) => entry.id === id);
            if (!cartItem) return;

            if (event.target.closest("[data-remove]")) {
                cart = cart.filter((entry) => entry.id !== id);
                saveAndRender();
                return;
            }

            const qtyButton = event.target.closest("[data-qty]");
            if (qtyButton) {
                cartItem.qty += Number(qtyButton.dataset.qty);
                if (cartItem.qty <= 0) {
                    cart = cart.filter((entry) => entry.id !== id);
                }
                saveAndRender();
            }
        });
    }

    render();
})();
