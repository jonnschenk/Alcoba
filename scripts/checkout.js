(() => {
    const cart = window.AlcobaCart;
    const form = document.getElementById("checkoutForm");
    if (!cart || !form) return;

    const SHIPPING_COST = 15;
    const FREE_SHIPPING_FROM = 300;

    const layoutEl = document.getElementById("checkoutLayout");
    const emptyEl = document.getElementById("checkoutEmpty");
    const successEl = document.getElementById("checkoutSuccess");
    const itemsEl = document.getElementById("checkoutItems");
    const subtotalEl = document.getElementById("checkoutSubtotal");
    const shippingEl = document.getElementById("checkoutShipping");
    const totalEl = document.getElementById("checkoutTotal");
    const shippingNoteEl = document.getElementById("checkoutShippingNote");

    const createItem = (item) => {
        const li = document.createElement("li");
        li.className = "checkout__item";

        const image = document.createElement("img");
        image.className = "checkout__item-image";
        image.src = item.image;
        image.alt = item.name;

        const info = document.createElement("div");
        const name = document.createElement("p");
        name.className = "checkout__item-name";
        name.textContent = item.name;
        const qty = document.createElement("span");
        qty.className = "checkout__item-qty";
        qty.textContent = `Cantidad: ${item.qty}`;
        info.append(name, qty);

        const price = document.createElement("span");
        price.className = "checkout__item-price";
        price.textContent = cart.formatPrice(item.qty * item.price);

        li.append(image, info, price);
        return li;
    };

    const render = () => {
        const items = cart.getItems();
        emptyEl.hidden = items.length > 0;
        layoutEl.hidden = items.length === 0;
        if (items.length === 0) return;

        const subtotal = items.reduce((sum, item) => sum + item.qty * item.price, 0);
        const shipping = subtotal >= FREE_SHIPPING_FROM ? 0 : SHIPPING_COST;

        itemsEl.replaceChildren(...items.map(createItem));
        subtotalEl.textContent = cart.formatPrice(subtotal);
        shippingEl.textContent = shipping === 0 ? "Gratis" : cart.formatPrice(shipping);
        totalEl.textContent = cart.formatPrice(subtotal + shipping);
        shippingNoteEl.textContent = shipping === 0
            ? "Tu pedido tiene envío gratis."
            : `Te faltan ${cart.formatPrice(FREE_SHIPPING_FROM - subtotal)} para el envío gratis.`;
    };

    // Keep the summary in sync when quantities change from the cart panel
    document.getElementById("cartItems")?.addEventListener("click", () => {
        if (successEl.hidden) window.setTimeout(render);
    });

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        form.classList.add("was-validated");

        if (!form.checkValidity()) {
            form.querySelector(":invalid")?.focus();
            return;
        }

        const orderNumber = `ALC-${Date.now().toString().slice(-6)}`;
        document.getElementById("checkoutOrderNumber").textContent = orderNumber;
        document.getElementById("checkoutOrderEmail").textContent = form.elements.email.value.trim();

        cart.clear();
        window.AlcobaCardPayment?.reset();
        form.reset();
        form.classList.remove("was-validated");
        layoutEl.hidden = true;
        emptyEl.hidden = true;
        successEl.hidden = false;
        successEl.focus();
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    render();
})();
