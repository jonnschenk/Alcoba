(() => {
    const toggleButton = document.getElementById("searchToggle");
    const overlay = document.getElementById("searchOverlay");
    const closeButton = document.getElementById("searchClose");
    const input = document.getElementById("searchInput");

    if (!toggleButton || !overlay) return;

    const openOverlay = () => {
        overlay.hidden = false;
        toggleButton.setAttribute("aria-expanded", "true");
        window.requestAnimationFrame(() => input?.focus());
    };

    const closeOverlay = () => {
        overlay.hidden = true;
        toggleButton.setAttribute("aria-expanded", "false");
    };

    toggleButton.addEventListener("click", () => {
        if (overlay.hidden) {
            openOverlay();
        } else {
            closeOverlay();
        }
    });

    closeButton?.addEventListener("click", closeOverlay);

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !overlay.hidden) {
            closeOverlay();
            toggleButton.focus();
        }
    });

    document.addEventListener("click", (event) => {
        if (overlay.hidden) return;
        if (overlay.contains(event.target) || toggleButton.contains(event.target)) return;
        closeOverlay();
    });
})();
