document.addEventListener("DOMContentLoaded", () => {
    const scrolldown = document.getElementById("scrolldown");
    const nextsection = document.querySelector(".main_banner").nextElementSibling;

    const scrolltonext = () => {
        if (!nextsection) return;
        nextsection.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    if (scrolldown) {
        scrolldown.addEventListener("click", scrolltonext);
        scrolldown.addEventListener("keydown", (e) => {
            if (e.key === "enter" || e.key === " ") {
                e.preventDefault();
                scrolltonext();
            }
        });
    }
});