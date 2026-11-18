// The link is /pattern/<id>/<permalink>: the permalink names the pattern on Ravelry.
(function () {
    var parts = location.pathname.split("/").filter(Boolean);
    var slug = parts[0] === "pattern" && /^[A-Za-z0-9-]+$/.test(parts[2] || "") ? parts[2] : null;
    if (slug) {
        document.querySelector("[data-ravelry]").href = "https://www.ravelry.com/patterns/library/" + slug;
        var name = slug.split("-").map(function (w) { return w.charAt(0).toUpperCase() + w.slice(1); }).join(" ");
        document.querySelector("[data-name]").textContent = name;
        document.title = name + " – YarnSpace";
    }
    if ((navigator.language || "").toLowerCase().indexOf("de") === 0) {
        document.documentElement.lang = "de";
        var de = {
            eyebrow: "Mit dir geteilt aus YarnSpace",
            lead: "Strick oder häkel sie mit YarnSpace, der App für deine Projekte, Anleitungen und dein Garn.",
            perk1: "Reihenzähler mit Erinnerungen, auch am Handgelenk",
            perk2: "Anleitungen von Ravelry und eigene PDFs",
            perk3: "Dein Garnvorrat, per Banderole eingescannt",
            ravelry: "Nur die Anleitung auf Ravelry ansehen →"
        };
        document.querySelectorAll("[data-text]").forEach(function (el) { el.textContent = de[el.dataset.text]; });
        if (!slug) document.querySelector("[data-name]").textContent = "Eine Anleitung";
        document.querySelector("[data-badge]").src = "/assets/img/badge-de-de.svg";
        document.querySelector("[data-badge]").alt = "Laden im App Store";
        document.querySelector("[data-home]").href = "/de/";
    }
})();
