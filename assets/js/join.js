// The link is /join/<iCloud share code>?from=<name>: the invitation is iCloud's link with
// that code; the name is who invited.
(function () {
    var parts = location.pathname.split("/").filter(Boolean);
    var code = parts[0] === "join" && /^[A-Za-z0-9_-]+$/.test(parts[1] || "") ? parts[1] : null;
    if (code) document.querySelector("[data-accept]").href = "https://www.icloud.com/share/" + code;
    var from = (new URLSearchParams(location.search).get("from") || "").trim().slice(0, 40);
    var texts = {
        en: { eyebrow: "Knit & crochet together", invited: "You're invited", by: "%s invited you", lead: "Each of you works on your own project and sees the others' rows, photos and finish dates.", step1: "Get YarnSpace, it's free", step2: "Then join the group", accept: "Accept the invitation", hint: "Just installed YarnSpace? Come back to this page and tap “Accept the invitation”. If you already have the app, the link opens it right away.", badge: "en-us", badgeAlt: "Download on the App Store", home: "/" },
        de: { eyebrow: "Gemeinsam stricken & häkeln", invited: "Du bist eingeladen", by: "%s lädt dich ein", lead: "Jede arbeitet an ihrem eigenen Projekt, und ihr seht gegenseitig Reihen, Fotos und Fertig-Termine.", step1: "YarnSpace laden, kostenlos", step2: "Dann der Gruppe beitreten", accept: "Einladung annehmen", hint: "Gerade erst installiert? Komm zurück auf diese Seite und tippe auf „Einladung annehmen“. Wenn du die App schon hast, öffnet der Link sie direkt.", badge: "de-de", badgeAlt: "Laden im App Store", home: "/de/" },
        es: { eyebrow: "Tejer juntas", invited: "Estás invitada", by: "%s te ha invitado", lead: "Cada una trabaja en su propio proyecto y veis las vueltas, fotos y fechas de fin de las demás.", step1: "Descarga YarnSpace, es gratis", step2: "Después únete al grupo", accept: "Aceptar la invitación", hint: "¿Acabas de instalar YarnSpace? Vuelve a esta página y toca «Aceptar la invitación». Si ya tienes la app, el enlace la abre directamente." },
        fr: { eyebrow: "Tricoter ensemble", invited: "Tu es invitée", by: "%s t’invite", lead: "Chacune travaille sur son propre projet et voit les rangs, photos et dates de fin des autres.", step1: "Télécharge YarnSpace, c’est gratuit", step2: "Puis rejoins le groupe", accept: "Accepter l’invitation", hint: "Tu viens d’installer YarnSpace ? Reviens sur cette page et touche « Accepter l’invitation ». Si tu as déjà l’app, le lien l’ouvre directement." },
        nl: { eyebrow: "Samen breien en haken", invited: "Je bent uitgenodigd", by: "%s nodigt je uit", lead: "Ieder werkt aan een eigen project en ziet de rijen, foto’s en einddata van de anderen.", step1: "Download YarnSpace, gratis", step2: "Doe dan mee met de groep", accept: "Uitnodiging accepteren", hint: "Net YarnSpace geïnstalleerd? Kom terug naar deze pagina en tik op “Uitnodiging accepteren”. Heb je de app al, dan opent de link hem meteen." },
        sv: { eyebrow: "Sticka och virka tillsammans", invited: "Du är inbjuden", by: "%s bjuder in dig", lead: "Ni jobbar med var sitt projekt och ser varandras varv, bilder och klardatum.", step1: "Hämta YarnSpace, gratis", step2: "Gå sedan med i gruppen", accept: "Acceptera inbjudan", hint: "Har du precis installerat YarnSpace? Kom tillbaka till sidan och tryck på ”Acceptera inbjudan”. Har du redan appen öppnar länken den direkt." },
        da: { eyebrow: "Strik og hækl sammen", invited: "Du er inviteret", by: "%s inviterer dig", lead: "I arbejder hver på jeres eget projekt og ser hinandens rækker, billeder og færdigdatoer.", step1: "Hent YarnSpace, gratis", step2: "Deltag så i gruppen", accept: "Accepter invitationen", hint: "Har du lige installeret YarnSpace? Kom tilbage til siden og tryk på “Accepter invitationen”. Har du allerede appen, åbner linket den med det samme." },
        ru: { eyebrow: "Вяжем вместе", invited: "Тебя пригласили", by: "%s приглашает тебя", lead: "Каждая вяжет свой проект, и вы видите ряды, фото и сроки друг друга.", step1: "Скачай YarnSpace бесплатно", step2: "Затем присоединись к группе", accept: "Принять приглашение", hint: "Только что установила YarnSpace? Вернись на эту страницу и нажми «Принять приглашение». Если приложение уже есть, ссылка откроет его сразу." },
        ja: { eyebrow: "いっしょに編もう", invited: "招待が届いています", by: "%sさんからの招待", lead: "それぞれ自分のプロジェクトを編みながら、お互いの段数、写真、完成予定日が見られます。", step1: "YarnSpaceを無料でダウンロード", step2: "それからグループに参加", accept: "招待を受ける", hint: "YarnSpaceをインストールしたら、このページに戻って「招待を受ける」をタップしてください。アプリがあれば、リンクから直接開きます。" }
    };
    var lang = (navigator.language || "en").toLowerCase().slice(0, 2);
    var t = texts[lang] || texts.en;
    if (t !== texts.en) {
        document.documentElement.lang = lang;
        document.querySelectorAll("[data-text]").forEach(function (el) { el.textContent = t[el.dataset.text]; });
        if (t.badge) { document.querySelector("[data-badge]").src = "/assets/img/badge-" + t.badge + ".svg"; document.querySelector("[data-badge]").alt = t.badgeAlt; }
        if (t.home) document.querySelector("[data-home]").href = t.home;
    }
    var title = from ? t.by.replace("%s", from) : t.invited;
    document.querySelector("[data-title]").textContent = title;
    document.title = title + " – YarnSpace";
})();
