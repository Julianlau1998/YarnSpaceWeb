# yarnspace.app

Static website for the YarnSpace app. Plain HTML and CSS, no build step and no external requests.

| Page | English | German |
|---|---|---|
| Home | `/` | `/de/` |
| Privacy policy | `/privacy/` | `/de/datenschutz/` |
| Imprint | `/imprint/` | `/de/impressum/` |
| Guides (overview) | `/guides/` | `/de/ratgeber/` |
| Guide: substitute yarn | `/guides/substitute-yarn/` | `/de/ratgeber/garn-ersetzen/` |
| Guide: photo to chart | `/guides/photo-to-chart/` | `/de/ratgeber/foto-zu-zaehlmuster/` |
| Guide: gauge swatch | `/guides/gauge-swatch/` | `/de/ratgeber/maschenprobe/` |
| Guide: increase/decrease evenly | `/guides/increase-decrease-evenly/` | `/de/ratgeber/gleichmaessig-zu-und-abnehmen/` |
| Guide: needle sizes | `/guides/needle-sizes/` | `/de/ratgeber/nadelstaerken/` |
| Guide: how much yarn | `/guides/how-much-yarn/` | `/de/ratgeber/garnmenge-berechnen/` |

## Before going live

- Wrap the App Store badge (`.store-badge` in both `index.html` files) in a link to the App Store page and drop the "Coming soon" line. Then add `"sameAs"` and `"downloadUrl"` with the App Store URL to the JSON-LD.
- Fill the US transfer placeholder in both privacy pages, the same as in the app (`PrivacyPolicyView.swift`).
- If you host somewhere other than GitHub Pages, update the "This website" / "Diese Website" section.
- Keep the privacy texts in sync with the app.
- New guide: add it to both overview pages, the guides section on both home pages, every guide's "More guides" list and `sitemap.xml` (with the hreflang pair).

## Hosting (GitHub Pages)

Push to a repository and enable Pages for the main branch. `CNAME` is set to `yarnspace.app`. Add the DNS records GitHub lists (A records for the apex domain), then turn on "Enforce HTTPS".

After launch, add the site in Google Search Console and submit `https://yarnspace.app/sitemap.xml`.

## Local preview

You can open `index.html` directly, since all paths are relative. Links between pages point to folders (`de/`, `privacy/`), so to click through the whole site, run a small server and open http://localhost:8000:

    python3 -m http.server 8000

## Screenshots

`assets/img/shots/` holds real screenshots (`en-…` and `de-…`) from a Debug build launched with `-ScreenshotMode -pro.simulated YES -welcome.hasBeenSeen YES` (sample data, see `ScreenshotData.swift` in the app). The device frames around them are plain CSS (`.iphone`, `.ipad`, `.mac`).
