
document.addEventListener("DOMContentLoaded", () => {
    const header = document.querySelector("#header");
    const gnb = document.querySelector(".gnb");
    const subMenus = document.querySelectorAll(".sub_menu");

    if (header && gnb) {
        gnb.addEventListener("mouseenter", () => {
            header.classList.add("on");
            subMenus.forEach((sub) => (sub.style.display = "block"));
        });

        gnb.addEventListener("mouseleave", () => {
            header.classList.remove("on");
            subMenus.forEach((sub) => (sub.style.display = "none"));
        });
        if (header) {
            let lastY = window.scrollY || 0;
            let ticking = false;

            const getthreshold = () => window.innerHeight * 0.8;
            const menuBtn = document.querySelector(".menu_btn");
            const menuOverlay = document.getElementById("menuoverlay");
            const icon = menuBtn ? menuBtn.querySelector("i") : null;

            if (header && menuBtn && menuOverlay) {

                const setIconOpen = () => {
                    if (!icon) return;
                    icon.classList.remove("fa-bars");
                    icon.classList.add("fa-xmark");
                };

                const setIconClose = () => {
                    if (!icon) return;
                    icon.classList.remove("fa-xmark");
                    icon.classList.add("fa-bars");
                };
                const getScrollbarWidth = () => window.innerWidth - document.documentElement.clientWidth;

                const openMenu = () => {
                    const sw = getScrollbarWidth();
                    document.body.style.paddingRight = sw + "px";
                    header.classList.add("menu_open");
                    header.style.paddingRight = sw + "px";
                    menuOverlay.classList.add("is_on");
                    menuOverlay.setAttribute("aria-hidden", "false");
                    document.documentElement.classList.add("no_scroll");
                    document.body.classList.add("no_scroll");
                    setIconOpen();
                };

                const closeMenu = () => {
                    menuOverlay.style.opacity = "0";
                    menuOverlay.querySelector(".menu_panel").style.transform = "translateY(20px)";
                    menuOverlay.querySelector(".menu_panel").style.opacity = "0";

                    setTimeout(() => {
                        header.classList.remove("menu_open");
                        menuOverlay.classList.remove("is_on");
                        menuOverlay.setAttribute("aria-hidden", "true");
                        menuOverlay.style.opacity = "";
                        menuOverlay.querySelector(".menu_panel").style.transform = "";
                        menuOverlay.querySelector(".menu_panel").style.opacity = "";
                        document.documentElement.classList.remove("no_scroll");
                        document.body.classList.remove("no_scroll");
                        document.body.style.paddingRight = "";
                        header.style.paddingRight = "";
                        setIconClose();

                        header.style.opacity = "0";
                        requestAnimationFrame(() => {
                            requestAnimationFrame(() => {
                                header.style.opacity = "";
                            });
                        });

                    }, 400);
                };
                const toggleMenu = () => {
                    const isOpen = menuOverlay.classList.contains("is_on");
                    if (isOpen) closeMenu();
                    else openMenu();
                };

                menuBtn.addEventListener("click", function (e) {
                    e.preventDefault();
                    toggleMenu();
                });

                menuOverlay.addEventListener("click", function (e) {
                    if (!e.target.closest("a, button")) closeMenu();
                });

                document.addEventListener("keydown", function (e) {
                    if (e.key === "Escape" && menuOverlay.classList.contains("is_on")) {
                        closeMenu();
                    }
                });
            }
            const shouldKeepHeader = () => {
                const utilGroup = document.querySelector(".util_search_group");
                const utilOpen = utilGroup && utilGroup.classList.contains("is_open");

                const dropdown = document.getElementById("searchDropdown");
                const overlay = document.querySelector(".search_overlay");
                const dropdownOpen = dropdown && dropdown.classList.contains("is_open");

                const gnbOpen = header.classList.contains("on");
                const menuOpen = header.classList.contains("menu_open");

                return utilOpen || dropdownOpen || gnbOpen || menuOpen;
            };
            const onScroll = () => {
                if (header.classList.contains("menu_open")) return;

                const y = window.scrollY || 0;
                const threshold = getthreshold();
                if (y < threshold || shouldKeepHeader()) {
                    header.classList.remove("hide");
                    lastY = y;
                    return;
                }

                const delta = y - lastY;

                if (delta > 12) header.classList.add("hide");
                if (delta < -12) header.classList.remove("hide");

                lastY = y;
            };

            window.addEventListener(
                "scroll",
                () => {
                    if (ticking) return;
                    ticking = true;
                    requestAnimationFrame(() => {
                        onScroll();
                        ticking = false;
                    });
                },
                { passive: true }
            );

            onScroll();

            const handleHeaderBg = () => {
                const y = window.scrollY || 0;
                if (y > window.innerHeight - 80) {
                    header.classList.add("scrolled");
                } else {
                    header.classList.remove("scrolled");
                }
            };

            window.addEventListener("scroll", handleHeaderBg, { passive: true });
            handleHeaderBg();
        }
    }

    const searchWrap = document.getElementById("utilSearch");
    const searchToggle = document.getElementById("utilSearchToggle");
    const searchInput = document.getElementById("utilSearchInput");

    if (searchWrap && searchToggle && searchInput) {
        const group = searchWrap.closest(".util_search_group");

        const openSearch = () => {
            searchWrap.classList.add("is_open");
            group.classList.add("is_open");
            searchToggle.setAttribute("aria-expanded", "true");
            searchToggle.setAttribute("aria-label", "검색 닫기");

            setTimeout(() => {
                searchInput.focus();
            }, 150);
        };

        const closeSearch = () => {
            searchWrap.classList.remove("is_open");
            group.classList.remove("is_open");
            searchToggle.setAttribute("aria-expanded", "false");
            searchToggle.setAttribute("aria-label", "검색 열기");
        };

        searchToggle.addEventListener("click", (e) => {
            e.preventDefault();
            if (searchWrap.classList.contains("is_open")) closeSearch();
            else openSearch();
        });

        document.addEventListener("click", (e) => {
            const withinUtil = e.target.closest(".util");
            if (!withinUtil) closeSearch();
        });

        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") closeSearch();
        });
    }

    const dropdown = document.getElementById("searchDropdown");

    if (dropdown) {
        const fields = document.querySelectorAll(".search_field[data-filter]");
        const panels = dropdown.querySelectorAll(".dropdown_panel[data-panel]");
        const optionButtons = dropdown.querySelectorAll(".option_btn[data-set][data-label]");

        let openKey = null;

        const setAriaExpanded = (key, isOpen) => {
            fields.forEach((btn) => {
                const match = btn.dataset.filter === key;
                btn.setAttribute("aria-expanded", match && isOpen ? "true" : "false");
            });
        };

        const showPanel = (key) => {
            panels.forEach((p) => {
                p.hidden = p.dataset.panel !== key;
            });
        };

        let regionBound = false;
        let activeSido = "서울";
        let selectedRegions = new Set();
        let selectedSidos = new Set();

        const REGION_DATA = {
            서울: ["강남구", "마포구", "송파구", "영등포구", "서초구", "성동구", "동작구", "광진구", "은평구", "노원구"],
            경기: ["성남시", "수원시", "용인시", "고양시", "부천시", "안양시", "화성시", "남양주시", "평택시", "의정부시"],
            인천: ["미추홀구", "연수구", "남동구", "부평구", "서구", "계양구", "중구", "동구"],
            부산: ["해운대구", "수영구", "부산진구", "동래구", "남구", "사하구", "북구", "금정구"],
            대구: ["수성구", "중구", "동구", "서구", "남구", "북구", "달서구", "달성군"]
        };

        const initRegionPanel = (key) => {
            if (key !== "region") return;

            const regionPanel = dropdown.querySelector('.dropdown_panel[data-panel="region"]');
            if (!regionPanel) return;

            const sidoListEl = document.getElementById("regionSidoList");
            const guWrapEl = document.getElementById("regionGuWrap");
            const searchEl = document.getElementById("regionsearchinput");
            const clearBtn = document.getElementById("regionSearchClear");
            const resetBtn = document.getElementById("regionResetBtn");
            const applyBtn = document.getElementById("regionApplyBtn");
            const summaryEl = document.getElementById("regionSelectedSummary");
            const hintEl = document.getElementById("regionLimitHint");

            if (!sidoListEl || !guWrapEl || !searchEl || !clearBtn || !resetBtn || !applyBtn || !summaryEl) return;

            const setSummary = () => {
                const sidoArr = Array.from(selectedSidos);
                const guArr = Array.from(selectedRegions);
                const all = [...sidoArr, ...guArr];
                summaryEl.textContent = all.length ? all.join(", ") : "";
                applyBtn.disabled = all.length === 0;
            };
            let hintTimer = null;

            const showLimitHint = () => {
                if (!hintEl) return;
                hintEl.textContent = "지역은 최대 3개까지 선택할 수 있어요";
                hintEl.classList.add("is_show");
                clearTimeout(hintTimer);
                hintTimer = setTimeout(() => {
                    hintEl.textContent = "";
                    hintEl.classList.remove("is_show");
                }, 1600);
            };
            const renderSido = (filterText = "") => {
                const entries = Object.keys(REGION_DATA).filter((s) => s.includes(filterText));
                if (!entries.includes(activeSido) && entries.length) activeSido = entries[0];
                sidoListEl.innerHTML = entries
                    .map((s) => {
                        const isActive = s === activeSido;
                        return `<li><button type="button" class="region_sido_btn ${isActive ? "is_active" : ""}" data-sido="${s}">${s}</button></li>`;
                    })
                    .join("");
            };

            const renderGu = (filterText = "") => {
                const list = (REGION_DATA[activeSido] || []).filter((g) => g.includes(filterText));
                guWrapEl.innerHTML = list
                    .map((g) => {
                        const k = `${activeSido} ${g}`;
                        const checked = selectedRegions.has(k) ? "checked" : "";
                        const id = `gu_${activeSido}_${g}`.replace(/\s+/g, "_");
                        return `<div class="region_gu_item"><input type="checkbox" id="${id}" data-key="${k}" ${checked}><label for="${id}">${g}</label></div>`;
                    })
                    .join("");
            };

            const resetAll = () => {
                selectedRegions = new Set();
                selectedSidos = new Set();

                regionPanel
                    .querySelectorAll('input[type="checkbox"][data-key]')
                    .forEach(cb => cb.checked = false);

                activeSido = "서울";

                renderSido(searchEl.value.trim());
                renderGu(searchEl.value.trim());
                setSummary();

                const valueEl = document.querySelector('.field_value[data-value="region"]');
                if (valueEl) {
                    valueEl.textContent = "근처 보호소 찾기";
                }
            };

            if (!regionBound) {
                regionPanel.addEventListener("click", (e) => {
                    const sidoBtn = e.target.closest(".region_sido_btn");
                    if (sidoBtn) {
                        const nextSido = sidoBtn.dataset.sido;

                        const totalCount = selectedSidos.size + selectedRegions.size;

                        if (!selectedSidos.has(nextSido) && totalCount >= 3) {
                            showLimitHint();
                            return;
                        }

                        activeSido = nextSido;

                        selectedSidos.add(activeSido);

                        selectedRegions.forEach((v) => {
                            if (v.startsWith(activeSido + " ")) selectedRegions.delete(v);
                        });

                        renderSido(searchEl.value.trim());
                        renderGu(searchEl.value.trim());
                        setSummary();
                        return;
                    };

                    const checkbox = e.target.closest('input[type="checkbox"][data-key]');
                    if (checkbox) {
                        const k = checkbox.dataset.key;
                        const sido = k.split(" ")[0];

                        const totalCount = selectedSidos.size + selectedRegions.size;

                        if (checkbox.checked) {
                            if (totalCount >= 3) {
                                checkbox.checked = false;
                                showLimitHint();
                                return;
                            }
                            selectedRegions.add(k);
                            selectedSidos.delete(sido);
                        } else {
                            selectedRegions.delete(k);
                        }

                        setSummary();
                        return;
                    }
                });

                searchEl.addEventListener("input", () => {
                    const t = searchEl.value.trim();
                    renderSido(t);
                    renderGu(t);
                });

                clearBtn.addEventListener("click", () => {
                    searchEl.value = "";
                    renderSido("");
                    renderGu("");
                });

                resetBtn.addEventListener("click", resetAll);

                applyBtn.addEventListener("click", () => {
                    const sidoArr = Array.from(selectedSidos);
                    const guArr = Array.from(selectedRegions);
                    const all = [...sidoArr, ...guArr];

                    if (all.length === 0) return;

                    const valueEl = document.querySelector('.field_value[data-value="region"]');
                    if (valueEl) {
                        valueEl.textContent = `${all.length}개 선택`;
                    }

                    // 다음 단계(조건 선택)로 이동
                    openDropdown("condition");
                });

                regionBound = true;
            }

            renderSido(searchEl.value.trim());
            renderGu(searchEl.value.trim());
            setSummary();
        };

        const initConditionPanel = (key) => {
            if (key !== "condition") return;

            const panel = dropdown.querySelector('.dropdown_panel[data-panel="condition"]');
            if (!panel) return;

            const summaryEl = document.getElementById("conditionSelectedSummary");
            const resetBtn = document.getElementById("conditionResetBtn");
            const applyBtn = document.getElementById("conditionApplyBtn");

            if (!summaryEl || !resetBtn || !applyBtn) return;

            let selectedSex = new Set();
            let selectedAge = new Set();

            const getAll = () => [...selectedSex, ...selectedAge];

            const updateSummary = () => {
                const all = getAll();
                summaryEl.textContent = all.length ? all.join(", ") : "";
                applyBtn.disabled = all.length === 0;
            };

            const resetAll = () => {
                selectedSex.clear();
                selectedAge.clear();
                panel.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
                updateSummary();
            };

            panel.addEventListener("change", (e) => {
                const cb = e.target.closest('input[type="checkbox"]');
                if (!cb) return;

                const group = cb.dataset.group;
                const value = cb.value;

                if (group === "sex") {
                    cb.checked ? selectedSex.add(value) : selectedSex.delete(value);
                }

                if (group === "age") {
                    cb.checked ? selectedAge.add(value) : selectedAge.delete(value);
                }

                updateSummary();
            });

            resetBtn.addEventListener("click", resetAll);

            applyBtn.addEventListener("click", () => {
                const all = getAll();
                const valueEl = document.querySelector('.field_value[data-value="condition"]');
                if (valueEl) {
                    valueEl.textContent = all.length ? all.join(", ") : "성별 · 나이";
                }
                closeDropdown();
            });

            updateSummary();
        };
        const openDropdown = (key) => {
            openKey = key;

            showPanel(key);
            const searchArea = document.querySelector(".search_area");

            const targetY =
                searchArea.getBoundingClientRect().top +
                window.pageYOffset -
                window.innerHeight * 0.3;

            gsap.to(window, {
                scrollTo: targetY,
                duration: 0.8,
                ease: "none"
            });
            initRegionPanel(key);
            initConditionPanel(key);

            setAriaExpanded(key, true);
            dropdown.setAttribute("aria-hidden", "false");

            if (overlay) {
                overlay.classList.add("is_on");
                overlay.setAttribute("aria-hidden", "false");
            }

            if (!dropdown.classList.contains("is_open")) {
                dropdown.classList.add("is_open");
            }

            gsap.killTweensOf(dropdown);

            gsap.fromTo(
                dropdown,
                { y: 6, scale: 0.985, opacity: 0.9 },
                { y: 0, scale: 1, opacity: 1, duration: 0.55, ease: "power3.out", overwrite: true }
            );
        };

        const closeDropdown = () => {
            openKey = null;
            dropdown.classList.remove("is_open");
            dropdown.setAttribute("aria-hidden", "true");
            if (overlay) {
                overlay.classList.remove("is_on");
                overlay.setAttribute("aria-hidden", "true");
            }

            panels.forEach((p) => (p.hidden = true));
            fields.forEach((btn) => btn.setAttribute("aria-expanded", "false"));
        };

        fields.forEach((btn) => {
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                const key = btn.dataset.filter;

                const isOpen = dropdown.getAttribute("aria-hidden") === "false";
                if (isOpen && openKey === key) {
                    closeDropdown();
                    return;
                }

                openDropdown(key);
            });
        });

        optionButtons.forEach((opt) => {
            opt.addEventListener("click", () => {
                const key = opt.dataset.set;
                const label = opt.dataset.label;

                const valueEl = document.querySelector(`.field_value[data-value="${key}"]`);
                if (valueEl) valueEl.textContent = label;

                // 종 선택이면 → 지역으로 이동
                if (key === "species") {
                    openDropdown("region");
                    return;
                }

                closeDropdown();
            });
        });
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") closeDropdown();
        });

        const overlay = document.querySelector(".search_overlay");
        dropdown.addEventListener("mousedown", (e) => {
            if (e.target.closest("input, textarea, select, option, label")) return;
            e.preventDefault();
        });
        if (overlay) {
            overlay.addEventListener("click", closeDropdown);
        }
    }

    const company = document.querySelector(".company");
    const items = Array.from(document.querySelectorAll(".com_item"));

    if (company && items.length) {
        function set_state(active_index) {
            items.forEach((li, idx) => {
                li.classList.remove("is_active", "is_next");
                if (idx === active_index) li.classList.add("is_active");
                if (idx === active_index + 1) li.classList.add("is_next");
            });
        }

        function reset_state() {
            items.forEach((li) => li.classList.remove("is_active", "is_next"));
        }

        items.forEach((li, idx) => {
            const btn = li.querySelector(".com_btn");
            if (!btn) return;

            btn.addEventListener("click", (e) => {
                e.stopPropagation();

                if (li.classList.contains("is_active")) {
                    reset_state();
                    return;
                }

                set_state(idx);
            });
        });

        company.addEventListener("click", (e) => {
            const clicked_item = e.target.closest(".com_item");
            if (!clicked_item) {
                reset_state();
            }
        });

        set_state(0);

    }

    gsap.registerPlugin(ScrollTrigger);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!reduceMotion) {
        gsap.utils.toArray(".block_title").forEach((wrap) => {
            const heading = wrap.querySelector(".title_heading");
            const sub = wrap.querySelector(".title_sub");

            const targets = [heading, sub].filter(Boolean);
            if (!targets.length) return;

            gsap.fromTo(
                targets,
                { y: 18, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.6,
                    ease: "power3.out",
                    stagger: 0.1,
                    immediateRender: false,
                    scrollTrigger: {
                        trigger: wrap,
                        start: "top 86%",
                        end: "top 30%",
                        toggleActions: "play none none none",
                        once: true,
                        fastScrollEnd: true,
                        preventOverlaps: true
                    }
                }
            );
        });
        const missingcards = gsap.utils.toArray(".missing_container > a");

        if (missingcards.length) {
            gsap.set(missingcards, { y: 40, opacity: 0, scale: 0.985 });

            gsap.to(missingcards, {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 0.9,
                ease: "power3.out",
                stagger: 0.14,
                scrollTrigger: {
                    trigger: ".missing_container",
                    start: "top 82%",
                    toggleActions: "play none none none",
                    once: true
                }
            });
        }

    } else {
        document.querySelectorAll(".block_title .title_heading, .block_title .title_sub").forEach((el) => {
            el.style.opacity = "1";
            el.style.transform = "none";
        });
    }

    gsap.fromTo(
        ".reveal_line",
        { y: 60, opacity: 0 },
        {
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.2,
            ease: "power3.out",
            scrollTrigger: {
                trigger: ".search_heading",
                start: "top 85%",
                toggleActions: "play reverse play reverse",
                once: false
            }
        }
    );

    const initRecommendSlider = () => {
        const track = document.querySelector(".recommend_track");
        const section = document.querySelector(".recommend");
        if (!track || !section) return;

        const prevBtn = section.querySelector(".slide_btn .prev");
        const nextBtn = section.querySelector(".slide_btn .next");

        const originalCards = Array.from(track.children);
        const originalCount = originalCards.length;
        if (originalCount === 0) return;

        originalCards.forEach(card => {
            track.appendChild(card.cloneNode(true));
        });

        let cardWidth = originalCards[0].getBoundingClientRect().width;
        let gap = parseFloat(getComputedStyle(track).gap) || 12;
        let step = cardWidth + gap;

        let currentIndex = 0;

        const move = () => {
            track.style.transform = `translateX(-${currentIndex * step}px)`;
            track.style.transition = "transform 0.4s ease";
        };

        nextBtn?.addEventListener("click", () => {
            currentIndex++;
            move();

            if (currentIndex >= originalCount) {
                setTimeout(() => {
                    track.style.transition = "none";
                    currentIndex = 0;
                    move();
                    track.offsetHeight;
                    track.style.transition = "transform 0.4s ease";
                }, 400);
            }
        });

        prevBtn?.addEventListener("click", () => {
            if (currentIndex === 0) {
                track.style.transition = "none";
                currentIndex = originalCount;
                move();
                track.offsetHeight;
            }
            currentIndex--;
            move();
        });
    };

    window.addEventListener("load", () => {
        initRecommendSlider();
    });
    const initMissingLoop = () => {
        const container = document.querySelector(".missing_container");
        const section = document.querySelector(".missing");
        if (!container || !section) return;

        const prevBtn = section.querySelector(".slide_btn .prev");
        const nextBtn = section.querySelector(".slide_btn .next");

        let track = container.querySelector(".missing_track");

        if (!track) {
            track = document.createElement("div");
            track.className = "missing_track";

            while (container.firstChild) {
                track.appendChild(container.firstChild);
            }
            container.appendChild(track);
        }

        track.style.display = "flex";
        track.style.gap = getComputedStyle(container).gap || "16px";
        track.style.willChange = "transform";

        let isAnimating = false;

        const getStep = () => {
            const card = track.children[0];
            if (!card) return 0;
            const cardWidth = card.getBoundingClientRect().width;
            const gap = parseFloat(getComputedStyle(track).gap) || 16;
            return cardWidth + gap;
        };

        const animate = (dir) => {
            if (isAnimating) return;
            isAnimating = true;

            const step = getStep();
            if (!step) {
                isAnimating = false;
                return;
            }

            track.style.transition = "transform 0.35s ease";
            track.style.transform = `translateX(${dir * -step}px)`;

            const onEnd = () => {
                track.removeEventListener("transitionend", onEnd);

                if (dir === 1) {
                    const first = track.firstElementChild;
                    if (first) track.appendChild(first);
                } else {
                    const last = track.lastElementChild;
                    if (last) track.prepend(last);
                }

                track.style.transition = "none";
                track.style.transform = `translateX(0px)`;

                requestAnimationFrame(() => {
                    isAnimating = false;
                });
            };

            track.addEventListener("transitionend", onEnd);
        };

        nextBtn?.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            animate(1);
        });

        prevBtn?.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            animate(-1);
        });
    };

    initMissingLoop();
    const videoA = document.querySelector(".video_a");
    const videoB = document.querySelector(".video_b");

    if (videoA && videoB) {
        const src = "../asset/video/main_video.mp4";

        videoA.src = src;
        videoB.src = src;

        let active = videoA;
        let next = videoB;

        const playActive = () => {
            active.classList.add("is_active");
            active.currentTime = 0;
            const p = active.play();
            if (p && typeof p.catch === "function") p.catch(() => { });
        };

        const swap = () => {
            next.currentTime = 0;
            const p = next.play();
            if (p && typeof p.catch === "function") p.catch(() => { });

            next.classList.add("is_active");
            active.classList.remove("is_active");

            const temp = active;
            active = next;
            next = temp;
        };

        videoA.addEventListener("ended", () => {
            if (active === videoA) swap();
        });

        videoB.addEventListener("ended", () => {
            if (active === videoB) swap();
        });

        playActive();
    }
});