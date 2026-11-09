/* =========================================================
   COSMIC CORE JS — Particles, Cursor Glow, Transitions, Lightbox
   Ragu Ram P Portfolio
========================================================= */

(function () {
    "use strict";

    /* -----------------------------------------------------
       1. FLOATING COSMIC PARTICLES / STARS
    ----------------------------------------------------- */
    const particlesEl = document.getElementById("particles");
    if (particlesEl) {
        const count = window.innerWidth < 700 ? 26 : 60;
        for (let i = 0; i < count; i++) {
            const p = document.createElement("div");
            p.className = "particle";
            const size = 1 + Math.random() * 2.8;
            p.style.width = size + "px";
            p.style.height = size + "px";
            p.style.left = Math.random() * 100 + "%";
            p.style.animationDuration = (8 + Math.random() * 17) + "s";
            p.style.animationDelay = (Math.random() * -20) + "s";
            p.style.opacity = String(0.2 + Math.random() * 0.6);
            particlesEl.appendChild(p);
        }
    }

    const starsEl = document.getElementById("stars");
    if (starsEl) {
        const starCount = window.innerWidth < 700 ? 35 : 75;
        for (let i = 0; i < starCount; i++) {
            const s = document.createElement("i");
            s.className = "star";
            s.style.left = Math.random() * 100 + "%";
            s.style.top = Math.random() * 100 + "%";
            s.style.opacity = String(0.15 + Math.random() * 0.72);
            s.style.animationDelay = (-Math.random() * 4) + "s";
            starsEl.appendChild(s);
        }
    }

    /* -----------------------------------------------------
       2. CURSOR GLOW FOLLOW
    ----------------------------------------------------- */
    const cursorGlow = document.getElementById("cursorGlow") || document.getElementById("glow");
    if (cursorGlow && window.matchMedia("(pointer: fine)").matches) {
        document.addEventListener("mousemove", function (e) {
            cursorGlow.style.left = e.clientX + "px";
            cursorGlow.style.top = e.clientY + "px";
        });
    }

    /* -----------------------------------------------------
       3. SCROLL PROGRESS BAR
    ----------------------------------------------------- */
    const progressBar = document.getElementById("progressBar");
    if (progressBar) {
        const updateBar = function () {
            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const pct = height > 0 ? Math.min(100, Math.max(0, (scrollTop / height) * 100)) : 0;
            progressBar.style.width = pct + "%";
        };
        window.addEventListener("scroll", updateBar, { passive: true });
        updateBar();
    }

    /* -----------------------------------------------------
       4. CURTAIN PAGE TRANSITION HELPER
    ----------------------------------------------------- */
    function getOverlay() {
        return document.getElementById("pageTransition") || document.getElementById("transitionOverlay");
    }

    window.navigateWithTransition = function (url) {
        if (!url) return;
        const overlay = getOverlay();
        if (!overlay || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            window.location.href = url;
            return;
        }
        overlay.classList.add("active");
        overlay.style.pointerEvents = "auto";
        setTimeout(function () {
            window.location.href = url;
        }, 560);
    };

    /* Bind transition links marked with [data-nav] */
    document.querySelectorAll("[data-nav]").forEach(function (el) {
        const target = el.getAttribute("data-nav");
        el.addEventListener("click", function (e) {
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
            e.preventDefault();
            window.navigateWithTransition(target);
        });
    });

    /* -----------------------------------------------------
       5. BFCACHE / BACK-FORWARD RESTORATION FIX
    ----------------------------------------------------- */
    function resetPageState() {
        const overlay = getOverlay();
        if (overlay) {
            overlay.classList.remove("active");
            overlay.style.animation = "none";
            overlay.style.transform = "scaleY(0)";
            overlay.style.pointerEvents = "none";
            void overlay.offsetHeight;
            overlay.style.animation = "";
            overlay.style.transform = "";
        }
        document.documentElement.style.visibility = "visible";
        document.body.style.visibility = "visible";
        document.body.style.opacity = "1";
        document.body.style.pointerEvents = "";

        const heroContent = document.getElementById("heroContent");
        if (heroContent) heroContent.style.transform = "translate(0,0)";
        const profile = document.getElementById("profileWrapper") || document.getElementById("profileShell");
        if (profile) profile.style.transform = "";
        const exploreButton = document.getElementById("exploreButton");
        if (exploreButton) exploreButton.style.transform = "";
    }

    window.addEventListener("pageshow", resetPageState);

    /* -----------------------------------------------------
       6. CARD SPOTLIGHT + KEYBOARD HANDLERS ([data-page])
    ----------------------------------------------------- */
    document.querySelectorAll(".project-card[data-page], .domain-node[data-page]").forEach(function (card) {
        card.addEventListener("mousemove", function (event) {
            const rect = card.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            card.style.setProperty("--mouse-x", x + "px");
            card.style.setProperty("--mouse-y", y + "px");
        });

        card.addEventListener("click", function (e) {
            if (e.target && e.target.closest("a")) return;
            window.navigateWithTransition(card.dataset.page);
        });

        card.addEventListener("keydown", function (event) {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                window.navigateWithTransition(card.dataset.page);
            }
        });
    });

    /* -----------------------------------------------------
       7. PROJECT SCREENSHOT GALLERY TABS & LIGHTBOX
    ----------------------------------------------------- */
    const galleryStage = document.getElementById("galleryMainImg");
    const galleryCaption = document.getElementById("galleryCaption");
    const galleryThumbs = document.querySelectorAll(".gallery-thumb");

    if (galleryStage && galleryThumbs.length > 0) {
        galleryThumbs.forEach(function (thumb) {
            thumb.addEventListener("click", function () {
                galleryThumbs.forEach(function (t) { t.classList.remove("active"); });
                thumb.classList.add("active");
                const fullSrc = thumb.getAttribute("data-src");
                const caption = thumb.getAttribute("data-caption") || "";
                if (fullSrc) {
                    galleryStage.style.opacity = "0.25";
                    setTimeout(function () {
                        galleryStage.src = fullSrc;
                        galleryStage.alt = caption;
                        if (galleryCaption) galleryCaption.textContent = caption;
                        galleryStage.style.opacity = "1";
                    }, 120);
                }
            });
        });
    }

    /* Click-to-zoom Lightbox */
    const zoomTargets = document.querySelectorAll("[data-zoomable]");
    if (zoomTargets.length > 0) {
        const modal = document.createElement("div");
        modal.className = "lightbox-modal";
        modal.id = "lightboxModal";
        modal.innerHTML =
            '<div class="lightbox-backdrop"></div>' +
            '<div class="lightbox-dialog" role="dialog" aria-modal="true" aria-label="Screenshot Preview">' +
            '  <button class="lightbox-close" type="button" aria-label="Close preview">&times;</button>' +
            '  <img id="lightboxImg" alt="">' +
            '  <p class="lightbox-caption" id="lightboxCap"></p>' +
            '</div>';
        document.body.appendChild(modal);

        const lbImg = document.getElementById("lightboxImg");
        const lbCap = document.getElementById("lightboxCap");
        const closeBtn = modal.querySelector(".lightbox-close");
        const backdrop = modal.querySelector(".lightbox-backdrop");

        function closeLightbox() {
            modal.classList.remove("open");
            document.body.style.overflow = "";
        }

        zoomTargets.forEach(function (img) {
            img.style.cursor = "zoom-in";
            img.addEventListener("click", function () {
                lbImg.src = img.src;
                lbImg.alt = img.alt || "";
                lbCap.textContent = (galleryCaption && img === galleryStage)
                    ? galleryCaption.textContent
                    : (img.getAttribute("data-caption") || img.alt || "");
                modal.classList.add("open");
                document.body.style.overflow = "hidden";
            });
        });

        closeBtn.addEventListener("click", closeLightbox);
        backdrop.addEventListener("click", closeLightbox);
        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape" && modal.classList.contains("open")) {
                closeLightbox();
            }
        });
    }
})();
