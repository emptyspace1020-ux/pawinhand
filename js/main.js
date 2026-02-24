document.addEventListener("DOMContentLoaded", () => {
    const scrolldown = document.getElementById("scrolldown");
    const nextsection = document.querySelector(".main_banner")?.nextElementSibling;

    const scrolltonext = () => {
        if (!nextsection) return;
        nextsection.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const setarrow = () => {
        if (!scrolldown) return;
        const y = window.scrollY || document.documentElement.scrollTop;
        if (y > 60) {
            scrolldown.classList.add("is_fade");
            scrolldown.classList.remove("is_show");
        } else {
            scrolldown.classList.remove("is_fade");
            scrolldown.classList.add("is_show");
        }
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

    setarrow();
    window.addEventListener("scroll", setarrow, { passive: true });
});