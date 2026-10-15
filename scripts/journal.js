(() => {
    const modalEl = document.getElementById("articleModal");
    if (!modalEl || !window.bootstrap) return;

    const modal = new bootstrap.Modal(modalEl);
    const titleEl = document.getElementById("articleModalTitle");
    const categoryEl = document.getElementById("articleModalCategory");
    const imageEl = document.getElementById("articleModalImage");
    const textEl = document.getElementById("articleModalText");

    const openArticle = (link) => {
        const template = document.getElementById(`article-${link.dataset.article}`);
        const article = link.closest("article");
        if (!template || !article) return;

        const image = article.querySelector("img");
        titleEl.textContent = article.querySelector("h2, h3")?.textContent.trim() || "";
        categoryEl.textContent = article.querySelector(".eyebrow, .journal-card__category")?.textContent.trim() || "";
        imageEl.src = image?.getAttribute("src") || "";
        imageEl.alt = image?.alt || "";
        textEl.replaceChildren(template.content.cloneNode(true));

        history.replaceState(null, "", link.getAttribute("href"));
        modal.show();
    };

    const links = Array.from(document.querySelectorAll("[data-article]"));

    links.forEach((link) => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            openArticle(link);
        });
    });

    modalEl.addEventListener("hidden.bs.modal", () => {
        history.replaceState(null, "", location.pathname + location.search);
    });

    // Direct links such as journal.html#articulo-invierno
    const linked = links.find((link) => link.getAttribute("href") === location.hash);
    if (linked) openArticle(linked);
})();
