(() => {
    const STORAGE_KEY = "alcoba-cart";
    const inPages = location.pathname.includes("/pages/");
    const assetPrefix = inPages ? "../" : "";
    const shopHref = inPages ? "shop.html" : "pages/shop.html";

    const isValidItem = (item) =>
        item &&
        typeof item.id === "string" &&
        typeof item.name === "string" &&
        typeof item.image === "string" &&
        Number.isFinite(item.price) &&
        Number.isInteger(item.qty) &&
        item.qty > 0;

    const readCart = () => {
        try {
            const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
            return Array.isArray(parsed) ? parsed.filter(isValidItem) : [];
        } catch {
            return [];
        }
    };

    const writeCart = (cart) => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
        } catch {
            // Storage unavailable (private mode, quota): the cart still works for this page view.
        }
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

    const createElement = (tag,  Name, text) => {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (text !== undefined) element.textContent = text;
        return element;
    };

    const createButton = (className, label, text, data) => {
        const button = createElement("button", className, text);
        button.type = "button";
        button.setAttribute("aria-label", label);
        Object.assign(button.dataset, data);
        return button;
    };

    const createCartItem = (item) => {
        const li = createElement("li", "cart-item");
        li.dataset.id = item.id;

        const image = createElement("img", "cart-item__image");
        image.src = normalizeImage(item.image);
        image.alt = item.name;

        const info = createElement("div", "cart-item__info");
        const qty = createElement("div", "cart-item__qty");
        qty.append(
            createButton("cart-item__qty-button", "Reducir cantidad", "\u2212", { qty: "-1" }),
            createElement("span", "cart-item__qty-value", String(item.qty)),
            createButton("cart-item__qty-button", "Aumentar cantidad", "+", { qty: "1" })
        );
        info.append(
            createElement("p", "cart-item__title", item.name),
            createElement("span", "cart-item__price", formatPrice(item.price)),
            qty
        );

        li.append(image, info, createButton("cart-item__remove", "Eliminar producto", "\u00d7", { remove: "" }));
        return li;
    };

    const render = () => {
        const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);

        if (cartCountEl) {
            cartCountEl.textContent = String(totalCount);
            cartCountEl.hidden = totalCount === 0;
        }

        if (!cartItemsEl) return;

        cartItemsEl.replaceChildren();

        if (cart.length === 0) {
            if (cartEmptyEl) cartEmptyEl.hidden = false;
            if (cartSummaryEl) cartSummaryEl.hidden = true;
            return;
        }

        if (cartEmptyEl) cartEmptyEl.hidden = true;
        if (cartSummaryEl) cartSummaryEl.hidden = false;

        const subtotal = cart.reduce((sum, item) => sum + item.qty * item.price, 0);
        if (cartSubtotalEl) cartSubtotalEl.textContent = formatPrice(subtotal);

        cartItemsEl.append(...cart.map(createCartItem));
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
            const price = Number(card.dataset.price) || 0;
            const image = card.querySelector(".product-card__image")?.getAttribute("src") || "";

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
