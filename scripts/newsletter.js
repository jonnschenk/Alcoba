(() => {
    document.querySelectorAll(".newsletter__form").forEach((form) => {
        const input = form.querySelector(".newsletter__input");
        form.noValidate = true;
        const message = document.createElement("p");
        message.className = "newsletter__message";
        message.setAttribute("role", "status");
        message.hidden = true;
        form.after(message);

        const showMessage = (text, isError) => {
            message.textContent = text;
            message.classList.toggle("is-error", isError);
            message.hidden = false;
        };

        form.addEventListener("submit", (event) => {
            event.preventDefault();

            if (!input.value.trim() || !input.checkValidity()) {
                showMessage("Escribe un correo electrónico válido.", true);
                input.focus();
                return;
            }

            showMessage(`¡Gracias por suscribirte! Enviaremos las novedades a ${input.value.trim()}.`, false);
            form.reset();
        });

        input.addEventListener("input", () => {
            if (message.classList.contains("is-error")) message.hidden = true;
        });
    });
})();
