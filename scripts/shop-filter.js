(() => {
    const grid = document.getElementById("productsGrid");
    if (!grid) return;

    const filterButtons = Array.from(document.querySelectorAll(".filter-btn"));
    const sortSelect = document.getElementById("sortSelect");
    const clearButton = document.getElementById("clearFilters");
    const emptyMessage = document.getElementById("productsEmpty");
    const searchInput = document.getElementById("shopSearch");

    const normalizeText = (value) =>
        (value || "")
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim();

    const products = Array.from(grid.querySelectorAll(".product-card")).map((card, index) => {
        const title = card.querySelector(".product-card__title")?.textContent || "";
        const collection = card.querySelector(".product-card__category")?.textContent || "";
        const category = card.dataset.category || "";

        return {
            element: card,
            index,
            category,
            colors: (card.dataset.color || "").split(" ").filter(Boolean),
            sizes: (card.dataset.size || "").split(" ").filter(Boolean),
            price: Number(card.dataset.price) || 0,
            searchText: normalizeText(`${title} ${collection} ${category}`)
        };
    });

    const activeFilters = {
        categoria: new Set(),
        color: new Set(),
        talla: new Set()
    };

    let searchQuery = "";

    const matchesGroup = (activeValues, productValues) => {
        if (activeValues.size === 0) return true;
        return productValues.some((value) => activeValues.has(value));
    };

    const matchesSearch = (product) => {
        if (!searchQuery) return true;
        return product.searchText.includes(searchQuery);
    };

    const getVisibleProducts = () =>
        products.filter((product) =>
            matchesGroup(activeFilters.categoria, [product.category]) &&
            matchesGroup(activeFilters.color, product.colors) &&
            matchesGroup(activeFilters.talla, product.sizes) &&
            matchesSearch(product)
        );

    const sortProducts = (list) => {
        const sorted = list.slice();
        switch (sortSelect ? sortSelect.value : "recientes") {
            case "precio-asc":
                sorted.sort((a, b) => a.price - b.price);
                break;
            case "precio-desc":
                sorted.sort((a, b) => b.price - a.price);
                break;
            default:
                sorted.sort((a, b) => a.index - b.index);
        }
        return sorted;
    };

    const hasActiveFilters = () =>
        Object.values(activeFilters).some((set) => set.size > 0) || searchQuery !== "";

    const render = () => {
        const visible = sortProducts(getVisibleProducts());
        const visibleSet = new Set(visible);

        visible.forEach((product) => grid.appendChild(product.element));

        products.forEach((product) => {
            product.element.hidden = !visibleSet.has(product);
        });

        if (emptyMessage) {
            emptyMessage.hidden = visible.length > 0;
        }

        if (clearButton) {
            clearButton.hidden = !hasActiveFilters();
        }
    };

    filterButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const group = button.dataset.filterGroup;
            const value = button.dataset.value;
            const set = activeFilters[group];
            if (!set) return;

            if (set.has(value)) {
                set.delete(value);
                button.setAttribute("aria-pressed", "false");
                button.classList.remove("is-active");
            } else {
                set.add(value);
                button.setAttribute("aria-pressed", "true");
                button.classList.add("is-active");
            }

            render();
        });
    });

    if (sortSelect) {
        sortSelect.addEventListener("change", render);
    }

    if (searchInput) {
        searchInput.addEventListener("input", () => {
            searchQuery = normalizeText(searchInput.value);
            render();
        });
    }

    if (clearButton) {
        clearButton.addEventListener("click", () => {
            Object.values(activeFilters).forEach((set) => set.clear());
            filterButtons.forEach((button) => {
                button.setAttribute("aria-pressed", "false");
                button.classList.remove("is-active");
            });
            searchQuery = "";
            if (searchInput) searchInput.value = "";
            render();
        });
    }

    const initialQuery = new URLSearchParams(location.search).get("q");
    if (initialQuery && searchInput) {
        searchInput.value = initialQuery;
        searchQuery = normalizeText(initialQuery);
    }

    render();
})();
