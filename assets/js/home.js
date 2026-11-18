// The screens showcase.
// Wide screens: the page stops at the iPhone while you scroll, and the scrolling changes the
// screen instead (the showcase sits in a tall track and stays put, sticky, until its last
// screen), settling on the nearest one when the scrolling stops. A feature on the left
// scrolls to its screen.
// Narrow screens: the screenshots are swiped inside the iPhone, with the feature's name and
// dots below. With reduced motion, the features are buttons that change the screen.
(() => {
    const track = document.querySelector("[data-showcase-track]");
    const showcase = track && track.querySelector("[data-showcase]");
    if (!showcase) return;
    const tabs = [...showcase.querySelectorAll(".showcase-item")];
    const screenArea = showcase.querySelector(".showcase-screens");
    const screens = [...screenArea.querySelectorAll("img")];
    const scrolly = matchMedia("(min-width: 901px) and (prefers-reduced-motion: no-preference)");
    const narrow = matchMedia("(max-width: 900px)");
    let current = -1;

    // Dots under the phone, for the narrow layout.
    const dots = document.createElement("div");
    dots.className = "showcase-dots";
    const dotButtons = tabs.map((tab, i) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.setAttribute("aria-label", (document.documentElement.lang.startsWith("de") ? "Bildschirm %d von %d" : "Screen %d of %d").replace("%d", i + 1).replace("%d", tabs.length));
        dot.addEventListener("click", () => swipeTo(i));
        dots.append(dot);
        return dot;
    });
    showcase.append(dots);

    const show = (index) => {
        index = Math.max(0, Math.min(tabs.length - 1, index));
        if (index === current) return;
        current = index;
        tabs.forEach((tab, i) => tab.setAttribute("aria-selected", String(i === index)));
        screens.forEach((img, i) => img.classList.toggle("is-active", i === index));
        dotButtons.forEach((dot, i) => dot.setAttribute("aria-current", String(i === index)));
        // The next one ready before it's needed.
        [index, index + 1].forEach((i) => { if (screens[i]) screens[i].loading = "eager"; });
    };

    // Narrow: the screenshots side by side inside the phone, moved by the script with
    // transforms, so a swipe feels the same on the phone and next to it (driving a scrolled
    // box from a swipe next to it stuttered). It follows the finger, rubber-bands at the ends
    // and goes on to the next one when swiped far or fast enough; up and down still scroll
    // the page (touch-action in the styles).
    const place = (offset = 0, animate = true) => {
        screens.forEach((img) => {
            img.style.transition = animate ? "" : "none";
            img.style.transform = narrow.matches ? `translateX(calc(${-current * 100}% + ${offset}px))` : "";
        });
    };
    const swipeTo = (index) => { show(index); place(); };
    narrow.addEventListener("change", () => place(0, false));
    let drag = null;
    showcase.addEventListener("touchstart", (event) => {
        if (!narrow.matches || event.touches.length > 1) return;
        const touch = event.touches[0];
        drag = { x: touch.clientX, y: touch.clientY, dx: 0, sideways: null, lastX: touch.clientX, lastTime: event.timeStamp, speed: 0 };
    }, { passive: true });
    showcase.addEventListener("touchmove", (event) => {
        if (!drag) return;
        const touch = event.touches[0];
        const dx = touch.clientX - drag.x, dy = touch.clientY - drag.y;
        if (drag.sideways === null && Math.hypot(dx, dy) > 8) drag.sideways = Math.abs(dx) > Math.abs(dy);
        if (!drag.sideways) return;
        // Speed in px per ms, smoothed over the last moves, for flicks.
        const time = event.timeStamp - drag.lastTime;
        if (time > 0) drag.speed = 0.6 * ((touch.clientX - drag.lastX) / time) + 0.4 * drag.speed;
        drag.lastX = touch.clientX; drag.lastTime = event.timeStamp; drag.dx = dx;
        const atEnd = (current === 0 && dx > 0) || (current === screens.length - 1 && dx < 0);
        place(atEnd ? dx * 0.3 : dx, false);
    }, { passive: true });
    const endDrag = () => {
        if (!drag) return;
        if (drag.sideways) {
            const far = Math.abs(drag.dx) > screenArea.clientWidth * 0.2;
            const fast = Math.abs(drag.speed) > 0.35 && Math.sign(drag.speed) === Math.sign(drag.dx);
            const step = far || fast ? (drag.dx < 0 ? 1 : -1) : 0;
            show(current + step);
            place();
        }
        drag = null;
    };
    showcase.addEventListener("touchend", endDrag);
    showcase.addEventListener("touchcancel", endDrag);
    // All of them loaded once the showcase comes near: lazy images side by side only load
    // as they slide into view, which made the swiping stutter.
    new IntersectionObserver((entries, observer) => {
        if (!entries[0].isIntersecting) return;
        screens.forEach((img) => { img.loading = "eager"; });
        observer.disconnect();
    }, { rootMargin: "600px 0px" }).observe(showcase);

    // Wide: how far the track has been scrolled through, 0 at its start, 1 where it lets go.
    const stickyTop = () => parseFloat(getComputedStyle(showcase).top) || 0;
    const trackStart = () => track.getBoundingClientRect().top + scrollY - stickyTop();
    // The showcase sticks from when the track's top reaches its sticky offset until the
    // track's end reaches the showcase's bottom: that stretch is the track minus the showcase.
    const range = () => track.offsetHeight - showcase.offsetHeight;
    const progress = () => {
        const distance = range();
        const travelled = stickyTop() - track.getBoundingClientRect().top;
        return distance > 0 ? Math.max(0, Math.min(1, travelled / distance)) : 0;
    };

    // Wide: the page scrolls freely through the screens (a light swipe moves on about one, a
    // strong one through all of them), and once the scrolling stops, it settles on the nearest
    // screen, so it never rests halfway between two. Near the track's start and end it doesn't
    // settle, so it never holds you back on the way in or out.
    const screenTop = (i) => trackStart() + range() * (i + 0.5) / tabs.length;
    // Coming in from above with the wheel or trackpad, a swipe stops at the first screen and
    // the rest of its momentum is swallowed; the next swipe scrolls on freely. A swipe ends with
    // a pause, a change of direction, or a step that grows again (a new swipe in the momentum).
    let catching = false, lastWheel = 0, lastStep = 0, caughtAt = 0;
    addEventListener("wheel", (event) => {
        if (!scrolly.matches || event.ctrlKey) return;
        const now = performance.now(), step = Math.abs(event.deltaY);
        if (catching) {
            const over = now - lastWheel > 200 || event.deltaY < 0 ||
                (now - caughtAt > 160 && step > lastStep * 1.5 + 4);
            if (over) catching = false;
            else event.preventDefault();
        } else if (event.deltaY > 0) {
            // Crossing into the track (where the showcase starts to stay put), it goes to the
            // first screen.
            const edge = trackStart();
            if (scrollY < edge - 2 && scrollY + event.deltaY >= edge - 2) {
                event.preventDefault();
                catching = true;
                caughtAt = now;
                scrollTo({ top: screenTop(0), behavior: "smooth" });
            }
        }
        lastWheel = now;
        lastStep = step;
    }, { passive: false });
    let settleTimer = 0;
    const settle = () => {
        if (!scrolly.matches) return;
        const p = progress();
        if (p <= 0.03 || p >= 0.97) return;
        const target = screenTop(Math.floor(p * tabs.length * 0.999));
        if (Math.abs(target - scrollY) > 4) scrollTo({ top: target, behavior: "smooth" });
    };
    addEventListener("scroll", () => {
        clearTimeout(settleTimer);
        settleTimer = setTimeout(settle, 180);
    }, { passive: true });

    let frame = 0;
    const onScroll = () => {
        if (frame) return;
        frame = requestAnimationFrame(() => {
            frame = 0;
            if (scrolly.matches) show(Math.floor(progress() * tabs.length * 0.999));
        });
    };
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    scrolly.addEventListener("change", onScroll);

    tabs.forEach((tab, i) => tab.addEventListener("click", () => {
        if (narrow.matches) return swipeTo(i);
        if (!scrolly.matches) return show(i);
        // To the middle of this screen's stretch of the track.
        scrollTo({ top: trackStart() + range() * (i + 0.5) / tabs.length, behavior: "smooth" });
    }));
    showcase.querySelector(".showcase-list").addEventListener("keydown", (event) => {
        const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[event.key];
        if (!step) return;
        event.preventDefault();
        const next = Math.max(0, Math.min(tabs.length - 1, current + step));
        tabs[next].focus();
        tabs[next].click();
    });
    show(0);
    onScroll();
})();

// The strand in the hero: its length, for drawing it in (see the styles).
document.querySelectorAll(".hero-thread path").forEach(path => path.style.setProperty("--len", path.getTotalLength()));
// Photo to Chart: the range input moves the line between the picture and the chart.
document.querySelectorAll("[data-compare]").forEach(compare => {
    const range = compare.querySelector("input");
    const update = () => compare.style.setProperty("--pos", range.value + "%");
    range.addEventListener("input", update);
    update();
});
// Sections fade in as they scroll into view (not with reduced motion; without JavaScript
// everything simply stays visible, the class on <html> is what hides them first).
if (matchMedia("(prefers-reduced-motion: no-preference)").matches) {
    let pending = [...document.querySelectorAll(".section-head, .feature-grid .card, .highlight, .plan, .faq details, .final-cta .container")];
    pending.forEach((item, i) => {
        // Cards in one row come in one after the other.
        if (item.matches(".card")) item.style.transitionDelay = (i % 3) * 70 + "ms";
    });
    // Everything that's in view or already above it shows (also after jumping to an anchor).
    let queued = false;
    const check = () => {
        queued = false;
        const limit = innerHeight * 0.92;
        pending = pending.filter(item => {
            if (item.getBoundingClientRect().top > limit) return true;
            item.classList.add("is-visible");
            if (item.style.transitionDelay) setTimeout(() => { item.style.transitionDelay = ""; }, 1000);
            return false;
        });
        if (!pending.length) { removeEventListener("scroll", queue); removeEventListener("resize", queue); }
    };
    const queue = () => { if (!queued) { queued = true; requestAnimationFrame(check); } };
    document.documentElement.classList.add("reveal");
    check();
    addEventListener("scroll", queue, { passive: true });
    addEventListener("resize", queue);
}
