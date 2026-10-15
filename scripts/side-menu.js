(() => {
    // AOS shifts sections down while they wait to animate in, which makes the browser
    // stop short of the real position. offsetTop ignores that transform.
    const scrollToSection = (target, behavior) => {
        let top = 0;
        for (let node = target; node; node = node.offsetParent) top += node.offsetTop;
        top -= parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
        window.scrollTo({ top, behavior });
    };

    const findTarget = (hash) => {
        try {
            return hash ? document.querySelector(hash) : null;
        } catch {
            return null;
        }
    };

    // Arriving from another page, e.g. collections.html#chapter-04
    window.addEventListener("load", () => {
        const target = findTarget(location.hash);
        if (target) scrollToSection(target, "instant");
    });

    const menuEl = document.getElementById("menuOffcanvas");
    if (!menuEl || !window.bootstrap) return;

    const menu = bootstrap.Offcanvas.getOrCreateInstance(menuEl);

    // Links to a section of the current page (e.g. collections.html#chapter-03 while
    // already on Colecciones) don't reload, so close the menu first and then scroll,
    // because Bootstrap locks the page scroll while the menu is open.
    menuEl.querySelectorAll("a[href*='#']").forEach((link) => {
        link.addEventListener("click", (event) => {
            const url = new URL(link.href);
            const target = findTarget(url.hash);
            if (url.pathname !== location.pathname || !target) return;

            event.preventDefault();
            menuEl.addEventListener("hidden.bs.offcanvas", () => {
                history.pushState(null, "", url.hash);
                scrollToSection(target, "smooth");
            }, { once: true });
            menu.hide();
        });
    });
})();
