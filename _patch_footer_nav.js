const fs = require("fs");
const path = require("path");

const root = "E:\\zoomies nur\\zoomies for cursor";
const pages = [
  "Homepage.dc.html",
  "Services.dc.html",
  "Daycare.dc.html",
  "Grooming.dc.html",
  "Training.dc.html",
  "Pricing.dc.html",
  "Contact.dc.html",
];

const FOOTER_SOCIAL = `<div class="footer-social" aria-label="Social media">
  <a class="footer-social-btn" href="https://www.instagram.com/zoomies_ireland/" target="_blank" rel="noopener" aria-label="Instagram">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
  </a>
  <a class="footer-social-btn" href="https://www.facebook.com/zoomiesireland" target="_blank" rel="noopener" aria-label="Facebook">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M14 9h3V6h-3c-1.7 0-3 1.3-3 3v2H9v3h2v7h3v-7h3l1-3h-4V9c0-.6.4-1 1-1z"/></svg>
  </a>
</div>`;

const NAV_SOCIAL = `      <div class="nav-social" aria-label="Social">
        <a class="nav-social-btn" href="https://www.instagram.com/zoomies_ireland/" target="_blank" rel="noopener" aria-label="Instagram">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
        </a>
        <a class="nav-social-btn" href="https://www.facebook.com/zoomiesireland" target="_blank" rel="noopener" aria-label="Facebook">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M14 9h3V6h-3c-1.7 0-3 1.3-3 3v2H9v3h2v7h3v-7h3l1-3h-4V9c0-.6.4-1 1-1z"/></svg>
        </a>
      </div>
`;

const SOCIAL_CSS = `
  .footer-social {
    display: flex; gap: 10px; margin-top: 18px; align-items: center;
  }
  .footer-social-btn {
    width: 40px; height: 40px; border-radius: 50%;
    display: inline-flex; align-items: center; justify-content: center;
    background: rgba(246,241,228,0.08);
    color: #F5C21A;
    border: 1.5px solid rgba(245,194,26,0.35);
    transition: transform 0.35s cubic-bezier(.34,1.56,.64,1), background 0.25s ease, color 0.25s ease, border-color 0.25s ease;
  }
  .footer-social-btn:hover {
    background: #F5C21A; color: #23281C; border-color: #F5C21A;
    transform: translateY(-4px) rotate(-6deg) scale(1.06);
  }
  .nav-social { display: flex; gap: 8px; align-items: center; flex-shrink: 0; }
  .nav-social-btn {
    width: 34px; height: 34px; border-radius: 50%;
    display: inline-flex; align-items: center; justify-content: center;
    color: #F6F1E4; background: rgba(246,241,228,0.08);
    border: 1px solid rgba(246,241,228,0.14);
    transition: transform 0.35s cubic-bezier(.34,1.56,.64,1), background 0.25s ease, color 0.25s ease;
  }
  .nav-social-btn:hover { background: #F5C21A; color: #23281C; transform: translateY(-2px) rotate(8deg); }
  @media (max-width: 900px) { .nav-social { display: none; } }
`;

const OLD_DROPDOWN_BLOCK = `  .nav-dropdown-wrap .nav-dropdown-caret { transition: transform 0.28s ease; display: inline-block; }
  .nav-dropdown-wrap:hover .nav-dropdown-caret,
  .nav-dropdown-wrap:focus-within .nav-dropdown-caret { transform: rotate(180deg); }
  .nav-dropdown {
    position: absolute;
    top: calc(100% + 10px);
    left: 50%;
    transform: translateX(-50%) translateY(10px);
    background: #FFFFFF;
    border: 1px solid rgba(35,40,28,0.1);
    border-radius: 16px;
    padding: 10px;
    min-width: 224px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
    transition: opacity 0.22s ease, transform 0.28s cubic-bezier(.22,1,.36,1), visibility 0.22s;
    z-index: 300;
    box-shadow: 0 12px 28px -12px rgba(35,40,28,0.35);
  }`;

const NEW_DROPDOWN_BLOCK = `  .nav-dropdown-wrap .nav-dropdown-caret { transition: transform 0.45s cubic-bezier(.34,1.3,.64,1); display: inline-block; }
  .nav-dropdown-wrap:hover .nav-dropdown-caret,
  .nav-dropdown-wrap:focus-within .nav-dropdown-caret { transform: rotate(180deg); }
  .nav-dropdown {
    position: absolute;
    top: calc(100% + 10px);
    left: 50%;
    transform: translateX(-50%) translateY(14px) scale(0.96);
    background: #FFFEFA;
    border: 2px solid #F5C21A;
    border-radius: 18px;
    padding: 10px;
    min-width: 224px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
    transition:
      opacity 0.42s ease,
      transform 0.5s cubic-bezier(.22,1,.36,1),
      visibility 0.42s,
      box-shadow 0.4s ease;
    transform-origin: top center;
    z-index: 300;
    box-shadow: 4px 4px 0 rgba(35,40,28,0.12), 0 16px 32px -16px rgba(35,40,28,0.35);
  }`;

const OLD_OPEN = `  .nav-dropdown-wrap:hover .nav-dropdown,
  .nav-dropdown-wrap:focus-within .nav-dropdown {
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
    transform: translateX(-50%) translateY(0);
  }`;

const NEW_OPEN = `  .nav-dropdown-wrap:hover .nav-dropdown,
  .nav-dropdown-wrap:focus-within .nav-dropdown {
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
    transform: translateX(-50%) translateY(0) scale(1);
  }`;

const OLD_ITEM = `  .nav-dropdown-item {
    display: flex; align-items: center; gap: 12px;
    padding: 11px 12px; border-radius: 11px;
    font-family: 'Lora', serif; font-size: 15.5px; font-weight: 500;
    color: #23281C; white-space: nowrap;
    transition: background 0.2s ease, padding-left 0.2s ease;
    pointer-events: auto;
    position: relative; z-index: 1;
  }
  .nav-dropdown-item:hover { background: #FBF3D9; padding-left: 16px; }
  .nav-dropdown-icon {
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    width: 32px; height: 32px; border-radius: 9px; background: #F6F1E4;
  }
  .nav-dropdown-item:hover .nav-dropdown-icon { background: #F5C21A; }`;

const NEW_ITEM = `  .nav-dropdown-item {
    display: flex; align-items: center; gap: 12px;
    padding: 11px 12px; border-radius: 11px;
    font-family: 'Lora', serif; font-size: 15.5px; font-weight: 500;
    color: #23281C; white-space: nowrap;
    transition:
      background 0.4s ease,
      transform 0.4s cubic-bezier(.22,1,.36,1),
      padding-left 0.4s cubic-bezier(.22,1,.36,1),
      box-shadow 0.35s ease;
    pointer-events: auto;
    position: relative; z-index: 1;
  }
  .nav-dropdown-item:hover {
    background: #FBF3D9;
    padding-left: 16px;
    transform: translateX(2px);
  }
  .nav-dropdown-icon {
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    width: 32px; height: 32px; border-radius: 9px; background: #F6F1E4;
    transition: background 0.4s ease, transform 0.45s cubic-bezier(.34,1.56,.64,1);
  }
  .nav-dropdown-item:hover .nav-dropdown-icon {
    background: #F5C21A;
    transform: rotate(-8deg) scale(1.08);
  }`;

const OLD_NAV_LINKS = `  .site-header .nav-links {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .site-header .nav-links > a,
  .site-header .nav-dropdown-wrap > a {
    font-family: 'Lora', serif;
    font-size: 15.5px;
    font-weight: 600;
    letter-spacing: -0.01em;
    color: rgba(246,241,228,0.82);
    padding: 8px 14px;
    border-radius: 999px;
    transition: color 0.2s ease, background 0.2s ease;
  }
  .site-header .nav-links > a:hover,
  .site-header .nav-dropdown-wrap > a:hover {
    color: #23281C;
    background: #F5C21A;
  }
  .site-header .nav-links > a.is-active {
    color: #23281C;
    background: #F5C21A;
  }`;

const NEW_NAV_LINKS = `  .site-header .nav-links {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px;
    border-radius: 999px;
    background: rgba(246,241,228,0.06);
    border: 1px solid rgba(246,241,228,0.1);
  }
  .site-header .nav-links > a,
  .site-header .nav-dropdown-wrap > a {
    font-family: 'Lora', serif;
    font-size: 15.5px;
    font-weight: 600;
    letter-spacing: -0.01em;
    color: rgba(246,241,228,0.82);
    padding: 8px 14px;
    border-radius: 999px;
    transition: color 0.3s ease, background 0.3s ease, transform 0.35s cubic-bezier(.34,1.56,.64,1);
  }
  .site-header .nav-links > a:hover,
  .site-header .nav-dropdown-wrap > a:hover {
    color: #23281C;
    background: #F5C21A;
    transform: translateY(-1px) rotate(-1.5deg);
  }
  .site-header .nav-links > a.is-active {
    color: #23281C;
    background: #F5C21A;
    box-shadow: 2px 2px 0 rgba(245,194,26,0.35);
  }`;

const OLD_FOOTER_KICKER_PAIR = `  .footer-kicker, .footer-heading {
    font-family: 'Lora', serif;
  }`;

const NEW_FOOTER_KICKER_PAIR = `  .footer-kicker {
    font-family: 'Caveat', cursive;
    font-size: 22px; font-weight: 700;
    letter-spacing: 0.02em;
    text-transform: none;
    color: #F5C21A;
    margin-bottom: 14px;
  }
  .footer-heading {
    font-family: inherit;
    padding-bottom: 0;
  }`;

const OLD_NEWS_BTN = `  .footer-news-btn {
    align-self: flex-start;
    background: #F5C21A; color: #23281C; border: 0;
    border-radius: 999px;
    padding: 11px 20px;
    font-family: 'Lora', serif; font-weight: 600; font-size: 14.5px;
    cursor: pointer;
    transition: transform 0.2s ease, background 0.2s ease;
  }
  .footer-news-btn:hover { background: #F6F1E4; transform: translateY(-1px); }`;

const NEW_NEWS_BTN = `  .footer-news-btn {
    align-self: flex-start;
    background: #F5C21A; color: #23281C; border: 0;
    border-radius: 999px;
    padding: 11px 20px;
    font-family: 'Lora', serif; font-weight: 600; font-size: 14.5px;
    cursor: pointer;
    transition: transform 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
    box-shadow: 3px 3px 0 #F6F1E4;
  }
  .footer-news-btn:hover {
    background: #F6F1E4;
    transform: translate(-2px,-2px);
    box-shadow: 5px 5px 0 #F6F1E4;
  }`;

const HOME_OLD_KICKER = `  .footer-kicker {
    font-size: 12px; font-weight: 600; letter-spacing: 0.1em;
    text-transform: uppercase; color: #F5C21A; margin-bottom: 18px;
  }
  .footer-heading { position: relative; display: inline-block; padding-bottom: 8px; }
  .footer-heading::after {
    content: ""; position: absolute; left: 0; bottom: 0; width: 24px; height: 2.5px;
    background: #F5C21A; border-radius: 2px;
  }`;

const HOME_NEW_KICKER = `  .footer-kicker {
    font-family: 'Caveat', cursive;
    font-size: 22px; font-weight: 700;
    letter-spacing: 0.02em;
    text-transform: none;
    color: #F5C21A;
    margin-bottom: 14px;
  }
  .footer-heading {
    font-family: inherit;
    position: relative;
    display: inline-block;
    padding-bottom: 0;
  }
  .footer-heading::after { content: none; display: none; }`;

function replaceOnce(text, oldStr, newStr, label, notes) {
  const idx = text.indexOf(oldStr);
  if (idx === -1) {
    notes.push("MISSING " + label);
    return text;
  }
  notes.push(label);
  return text.slice(0, idx) + newStr + text.slice(idx + oldStr.length);
}

function removeLimited(text, regex, max) {
  let count = 0;
  return text.replace(regex, (match) => {
    count += 1;
    return count <= max ? "" : match;
  });
}

for (const name of pages) {
  const file = path.join(root, name);
  let text = fs.readFileSync(file, "utf8").replace(/\r\n/g, "\n");
  const orig = fs.readFileSync(file, "utf8");
  const notes = [];

  text = replaceOnce(text, OLD_DROPDOWN_BLOCK, NEW_DROPDOWN_BLOCK, "dropdown-open", notes);
  text = replaceOnce(text, OLD_OPEN, NEW_OPEN, "dropdown-visible", notes);
  text = replaceOnce(text, OLD_ITEM, NEW_ITEM, "dropdown-item", notes);
  text = replaceOnce(text, OLD_NAV_LINKS, NEW_NAV_LINKS, "nav-links", notes);

  if (name === "Homepage.dc.html") {
    text = replaceOnce(text, HOME_OLD_KICKER, HOME_NEW_KICKER, "home-underline-removed", notes);
  }

  text = replaceOnce(text, OLD_FOOTER_KICKER_PAIR, NEW_FOOTER_KICKER_PAIR, "footer-kicker-play", notes);
  text = replaceOnce(text, OLD_NEWS_BTN, NEW_NEWS_BTN, "news-btn", notes);

  if (!text.includes(".footer-social {")) {
    const marker = "  @keyframes to-top-float-live {";
    if (text.includes(marker)) {
      text = text.replace(marker, SOCIAL_CSS + "\n" + marker);
      notes.push("social-css");
    } else {
      notes.push("MISSING social-css-marker");
    }
  } else {
    notes.push("social-css-exists");
  }

  if (!text.includes('class="footer-social"')) {
    const tagRe = /(<p[^>]*>At Zoomies every Paw has a Place and every dog carries a tale\.<\/p>)/;
    const m = tagRe.exec(text);
    if (m) {
      const lineStart = text.lastIndexOf("\n", m.index) + 1;
      const indent = text.slice(lineStart, m.index);
      const socialIndented = FOOTER_SOCIAL.split("\n")
        .map((ln) => (ln ? indent + ln : ln))
        .join("\n");
      text =
        text.slice(0, m.index + m[0].length) +
        "\n" +
        socialIndented +
        text.slice(m.index + m[0].length);
      notes.append ? notes.append("footer-social-html") : notes.push("footer-social-html");
    } else {
      notes.push("MISSING tagline");
    }
  } else {
    notes.push("footer-social-exists");
  }

  if (!text.includes('class="nav-social"')) {
    const waRe = /(<\/div>\s*)(<a href="https:\/\/wa\.me\/353868099535"[^>]*class="btn btn-whatsapp)/;
    const m = waRe.exec(text);
    if (m) {
      const insertAt = m.index + m[1].length;
      text = text.slice(0, insertAt) + NAV_SOCIAL + text.slice(insertAt);
      notes.push("nav-social-html");
    } else {
      notes.push("MISSING nav-social-slot");
    }
  } else {
    notes.push("nav-social-exists");
  }

  const before = text;
  text = removeLimited(
    text,
    /\n\s*<a class="link"[^>]*href="https:\/\/www\.instagram\.com\/zoomies_ireland\/"[^>]*>Instagram<\/a>/g,
    2
  );
  text = removeLimited(
    text,
    /\n\s*<a class="link"[^>]*href="https:\/\/www\.facebook\.com\/[^"]*"[^>]*>Facebook<\/a>/g,
    2
  );
  if (text !== before) notes.push("removed-text-social");

  if (text !== orig.replace(/\r\n/g, "\n") || orig.includes("\r\n")) {
    fs.writeFileSync(file, text, "utf8");
    notes.push("WRITTEN");
  } else {
    notes.push("NOCHANGE");
  }

  console.log("=== " + name + " ===");
  for (const n of notes) console.log(" ", n);
}
