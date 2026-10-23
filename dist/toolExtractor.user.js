
// ==UserScript==
// @name         Tool Extractor
// @namespace    http://tampermonkey.net/
// @version      1.4.1-dev
// @description  Extract all LC/F95z thread data
// @author       Hunteraulo
// @source       https://github.com/Hunteraulo1/f95list-extractor
// @downloadURL  https://raw.githubusercontent.com/Hunteraulo1/f95list-extractor/refs/heads/main/dist/toolExtractor.user.js
// @updateURL    https://raw.githubusercontent.com/Hunteraulo1/f95list-extractor/refs/heads/main/dist/toolExtractor.user.js
// @match        http*://lewdcorner.com/threads/*
// @match        http*://*.lewdcorner.com/threads/*
// @match        http*://f95zone.to/threads/*
// @match        http*://*.f95zone.to/threads/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lewdcorner.com
// @grant        none
// ==/UserScript==

"use strict";
(() => {
  // src/dashboardOrigin.ts
  var DASHBOARD_ORIGIN = "http://localhost:5173";

  // src/utils.ts
  var isF95z = () => window.location.hostname === "f95zone.to";
  var stripImgMarkup = (s) => s.replace(/<img\b[^>]*>/gi, "").replace(/<\/img>/gi, "");
  var textFromF95DescriptionEl = (el) => {
    const html = el.innerHTML;
    const doc = new DOMParser().parseFromString(html, "text/html");
    for (const img of doc.body.querySelectorAll("img")) {
      img.remove();
    }
    let t = doc.body.textContent ?? "";
    t = stripImgMarkup(t);
    return t.replace("Overview:", "");
  };
  var scrapeThreadDescription = () => {
    const f95 = isF95z();
    const selector = f95 ? ".message-body > .bbWrapper > div" : ".message-body > div > div > .bbWrapper > div";
    const el = document.querySelector(selector);
    if (!el) return null;
    let raw;
    if (f95) {
      raw = textFromF95DescriptionEl(el);
    } else {
      raw = el.textContent?.replace("Overview:", "");
    }
    if (raw === void 0) return null;
    const trimmed = stripImgMarkup(raw).trim();
    return trimmed === "" ? null : trimmed;
  };

  // src/domains/f95z.ts
  var extractTagsF95z = () => {
    const tags = document.querySelectorAll(".tagItem") ?? [];
    return Array.from(tags).map((tag) => tag.textContent?.replace(/\s+/g, " ").trim() ?? "").filter(Boolean).join(", ");
  };
  var getExtractPayloadF95z = () => {
    const title = document.querySelector("title")?.textContent ?? "";
    const img = document.querySelector("img.bbImage")?.getAttribute("src") ?? "";
    const id = Number(window.location.pathname.split(".")[1]?.split("/")[0]);
    const image = img?.replace("attachments.", "preview.") ?? "";
    const regName = /.*-\s(.*?)\s\[/i;
    const regTitle = /([\w\\']+)(?=\s-)/gi;
    const regVersion = /\[([^\]]+)\]/gi;
    const titleMatch = title.match(regTitle) ?? [];
    const nameMatch = title.match(regName) ?? [];
    const versionMatch = title.match(regVersion) ?? [];
    console.log("versionMatch:", versionMatch);
    const name = nameMatch?.[1] ?? "";
    const { status, type } = scrapeGetTitle(titleMatch);
    const version = versionMatch?.[0]?.replace("[", "").replace("]", "") ?? "";
    const tags = extractTagsF95z();
    return {
      id,
      domain: "F95z",
      name,
      version,
      status,
      tags,
      type,
      ac: false,
      link: id ? `https://f95zone.to/threads/${id}` : "",
      image,
      description: scrapeThreadDescription() ?? ""
    };
  };
  var extractDataF95z = () => JSON.stringify(getExtractPayloadF95z(), null, 0);
  var scrapeGetTitle = (data) => {
    let status = "";
    let type = "";
    for (const e of data) {
      switch (e) {
        case "Abandoned":
          status = "ABANDONNÉ";
          break;
        case "Completed":
          status = "TERMINÉ";
          break;
        default:
          status = "EN COURS";
          break;
      }
      switch (e) {
        case "Ren'Py":
          type = "RenPy";
          break;
        case "RPGM":
          type = "RPGM";
          break;
        case "Unity":
          type = "Unity";
          break;
        case "Unreal Engine":
          type = "Unreal";
          break;
        case "Flash":
          type = "Flash";
          break;
        case "HTML":
          type = "HTML";
          break;
        case "QSP":
          type = "QSP";
          break;
        case "Others":
          type = "Autre";
          break;
      }
    }
    return { status, type };
  };

  // src/domains/lc.ts
  var getData = () => {
    const extracts = Array.from(
      document.querySelectorAll(
        'script[type="application/ld+json"]'
      )
    );
    const result = {};
    for (const { textContent } of extracts) {
      try {
        const parsedContent = textContent ? JSON.parse(textContent) : {};
        Object.assign(result, parsedContent);
      } catch (error) {
        console.error("Erreur lors du parsing JSON:", error);
      }
    }
    const { mainEntity } = result;
    if (!mainEntity || typeof mainEntity !== "object") {
      console.error("mainEntity n'est pas défini ou mal formé.");
      return;
    }
    return mainEntity;
  };
  var extractTagsLC = () => {
    const mainEntity = getData();
    return mainEntity?.keywords ?? "";
  };
  var getExtractPayloadLC = () => {
    const data = getData();
    if (!data) return null;
    const title = document.querySelector(".p-title-value")?.innerText;
    const id = Number(data?.url?.split(".")[2]?.split("/")[0]);
    const image = document.querySelector("img.bbImage")?.getAttribute("src") ?? "";
    const version = document.querySelector(
      "dl[data-field='version'] > dd"
    )?.textContent;
    const name = data?.headline?.match(/([^[]*) /)?.[1] ?? "";
    const { status, type } = scrapeGetTitle2(title ?? "");
    const link = id ? `https://lewdcorner.com/threads/${id}` : "";
    return {
      id,
      domain: "LewdCorner",
      name,
      version: version ?? "",
      status,
      tags: data?.keywords ?? "",
      type,
      ac: false,
      link,
      image,
      description: scrapeThreadDescription() ?? ""
    };
  };
  var extractDataLC = (fullData) => {
    const payload = getExtractPayloadLC();
    if (!payload) {
      return JSON.stringify({});
    }
    const { id, name, version, status, type, link, image, description } = payload;
    const data = getData();
    const title = document.querySelector(".p-title-value")?.innerText;
    const { typeId } = scrapeGetTitle2(title ?? "");
    if (!fullData) {
      return JSON.stringify(
        {
          id,
          domain: "LewdCorner",
          name,
          version,
          status,
          tags: data?.keywords ?? "",
          type,
          ac: false,
          link,
          image,
          description
        },
        null,
        0
      );
    }
    const developer = document.querySelector('[data-field="Developer"] > dd')?.textContent ?? "";
    const addedOn = Math.floor(Date.now() / 1e3);
    const lastUpdatedData = document.querySelector(
      '[data-field="dategamerelease"] > dd'
    )?.textContent;
    const lastUpdated = lastUpdatedData ? Math.floor(new Date(lastUpdatedData).getTime() / 1e3) : 0;
    const descriptionSql = document.querySelector(".message-body .bbWrapper > div")?.textContent?.split("Overview:\n")[1]?.replaceAll('"', "''") ?? "";
    const tagsData = document.querySelector(".js-tagList")?.textContent?.replaceAll("	", "").split("\n\n\n\n").slice(1) ?? [];
    const tags = [];
    const unknownTags = [];
    for (const tag of tagsData) {
      if (tag === "") continue;
      if (tag in idByTagsName) {
        const id2 = idByTagsName[tag];
        if (id2 === 0 || tag in tags) continue;
        tags.push(id2);
        continue;
      }
      unknownTags.push(tag);
    }
    if (unknownTags[0] === "") unknownTags.shift();
    console.info("🚀 ~ extractDataLC ~ unknownTags:", unknownTags);
    if (unknownTags.length > 0) alert(`Tags non trouvés: ${unknownTags}`);
    const ratingComponent = document.querySelector(".bratr-rating");
    const score = Number(ratingComponent?.querySelectorAll(".br-selected").length ?? "0") + Number(ratingComponent?.querySelectorAll(".br-fractional").length ?? "0") / 2;
    return `BEGIN TRANSACTION; UPDATE games SET name = "${name?.replaceAll('"', "''")}", version = "${version?.replaceAll('"', "''")}", developer = "${developer?.replaceAll('"', "''")}", last_updated = ${lastUpdated}, score = ${score ?? 0}, description = "${descriptionSql?.replaceAll('"', "")}", tags = json_patch(tags, '[${tags}]') WHERE id = (SELECT id FROM games WHERE url = '${link}' LIMIT 1); INSERT INTO games SELECT (SELECT COALESCE(MIN(id) - 1, -1) FROM games), 1, "${name?.replaceAll('"', "''")}", "${version?.replaceAll('"', "''")}", "${developer?.replaceAll('"', "''")}", ${typeId}, 1, '${link}', ${addedOn}, ${lastUpdated}, 0, '', 0, ${score ?? 0}, 0, '', '', 0, 0, '[]', "${descriptionSql?.replaceAll('"', "")}", "n/a", '[${tags}]', '[]', '', '', '[]', NULL, 0, '[]', 0, '[]', 0, '[]' WHERE NOT EXISTS (SELECT 1 FROM games WHERE url = '${link}'); COMMIT;`;
  };
  var scrapeGetTitle2 = (data) => {
    let status = "";
    let type = "";
    let typeId = 23;
    if (data.includes("Abandoned")) {
      status = "ABANDONNÉ";
    } else if (data.includes("Complete")) {
      status = "TERMINÉ";
    } else {
      status = "EN COURS";
    }
    if (data.includes("Ren'Py")) {
      type = "RenPy";
      typeId = 14;
    } else if (data.includes("RPGM")) {
      type = "RPGM";
      typeId = 13;
    } else if (data.includes("Unity")) {
      type = "Unity";
      typeId = 19;
    } else if (data.includes("Unreal Engine")) {
      type = "Unreal";
      typeId = 20;
    } else if (data.includes("Flash")) {
      type = "Flash";
      typeId = 4;
    } else if (data.includes("HTML")) {
      type = "HTML";
      typeId = 5;
    } else if (data.includes("QSP")) {
      type = "QSP";
      typeId = 10;
    } else if (data.includes("Other")) {
      type = "Autre";
      typeId = 9;
    }
    return { status, type, typeId };
  };
  var idByTagsName = {
    "2d": 1,
    "2d game": 1,
    "2dcg": 2,
    "3d": 3,
    "3d game": 3,
    "3dcg": 4,
    action: 0,
    "adjustable age": 0,
    "adult content": 0,
    adventure: 5,
    ahegao: 6,
    ai: 140,
    "ai art": 140,
    "ai cg": 140,
    "anal sex": 7,
    anime: 71,
    animated: 8,
    arcade: 0,
    bbw: 37,
    bdsm: 34,
    bestiality: 35,
    "big ass": 36,
    "big dick": 0,
    "big dicks": 0,
    "big tits": 37,
    blackmail: 38,
    blowjob: 91,
    brothel: 99,
    bukkake: 39,
    "card game": 0,
    casual: 0,
    censored: 40,
    "character creation": 41,
    "character customization": 41,
    cheating: 42,
    combat: 43,
    comic: 0,
    corruption: 44,
    cosplay: 45,
    creampie: 46,
    cuckold: 90,
    "dating sim": 47,
    defloration: 135,
    dilf: 48,
    drama: 0,
    "dress up": 0,
    drugs: 49,
    drunk: 49,
    "dystopian setting": 50,
    ebony: 70,
    eroge: 71,
    erotic: 0,
    exhibitionism: 51,
    facial: 39,
    fantasy: 52,
    "female protagonist": 54,
    femaledomination: 53,
    femdom: 53,
    fighting: 43,
    fisting: 7,
    "foot fetish": 55,
    footjob: 55,
    furry: 56,
    "futa trans": 57,
    "futa trans (avoidable)": 57,
    "futa/trans protagonist": 58,
    gay: 59,
    "gay (avoidable)": 59,
    gilf: 80,
    "glory hole": 0,
    gore: 60,
    "graphic violence": 60,
    groping: 61,
    "group sex": 62,
    guro: 71,
    handholding: 0,
    handjob: 63,
    harem: 64,
    headpats: 0,
    hebe: 75,
    horror: 65,
    humiliation: 66,
    humor: 67,
    incest: 68,
    "incest (optional)": 68,
    "internal view": 69,
    interracial: 70,
    impregnation: 0,
    "japanese game": 71,
    "kinetic novel": 72,
    lactation: 73,
    lesbian: 74,
    "lesbian (avoidable)": 74,
    loli: 75,
    "male protagonist": 77,
    maledom: 76,
    maledomination: 76,
    management: 78,
    masturbation: 79,
    milf: 80,
    "mind control": 81,
    "mini games": 100,
    "mobile game": 82,
    monster: 83,
    "monster girl": 84,
    "multiple endings": 85,
    "multiple penetration": 86,
    "multiple protagonist": 87,
    necrophilia: 88,
    "no sexual content": 89,
    "netori (stealing)": 90,
    "netorase (sharing)": 90,
    "netorare (cheating)": 90,
    ntr: 90,
    nudity: 0,
    "oral sex": 91,
    paranormal: 92,
    parody: 93,
    "pixel art": 0,
    platformer: 94,
    "point click": 95,
    "point & click": 95,
    possession: 96,
    pov: 97,
    pregnancy: 98,
    prostitution: 99,
    puzzle: 100,
    rape: 101,
    "real porn": 102,
    religion: 103,
    romance: 104,
    rpg: 105,
    sandbox: 106,
    scat: 107,
    "school setting": 108,
    "sci-fi": 109,
    "sex toys": 110,
    "sexual content": 0,
    "sexual harassment": 111,
    sharing: 90,
    shooter: 112,
    shota: 113,
    "side-scroller": 114,
    simulator: 115,
    simulation: 115,
    sissification: 116,
    slave: 117,
    "sleep sex": 118,
    "slice of life": 0,
    "small tits": 0,
    spanking: 119,
    strategy: 120,
    stripping: 121,
    superpowers: 122,
    swinging: 123,
    teasing: 124,
    teen: 0,
    tentacles: 125,
    "text based": 126,
    titfuck: 127,
    toddler: 75,
    trainer: 128,
    transformation: 129,
    transgender: 57,
    trap: 130,
    "turn based combat": 131,
    twins: 132,
    urination: 133,
    "vaginal sex": 134,
    virgin: 135,
    "virtual reality": 136,
    voiced: 137,
    vore: 138,
    voyeurism: 139,
    watersports: 133
  };

  // src/domains/index.ts
  var extractTags = () => isF95z() ? extractTagsF95z() : extractTagsLC();
  var extractData = () => isF95z() ? extractDataF95z() : extractDataLC(false);
  var extractFullData = () => isF95z() ? extractDataF95z() : extractDataLC(true);
  var getExtractPayload = () => isF95z() ? getExtractPayloadF95z() : getExtractPayloadLC();

  // src/panel.ts
  var panelElement = document.createElement("div");
  var MAX_DESCRIPTION_QUERY_LEN = 1200;
  var descriptionForQuery = (payload) => {
    const raw = payload.description?.trim() ?? "";
    if (!raw) return "";
    return raw.length <= MAX_DESCRIPTION_QUERY_LEN ? raw : `${raw.slice(0, MAX_DESCRIPTION_QUERY_LEN)}…`;
  };
  var buildExtractGetUrl = (segment, payload) => {
    const origin = DASHBOARD_ORIGIN.replace(/\/$/, "");
    const q = new URLSearchParams({
      name: payload.name,
      tags: payload.tags,
      image: payload.image,
      link: payload.link,
      gameVersion: payload.version,
      gameAutoCheck: payload.ac ? "true" : "false"
    });
    const description = descriptionForQuery(payload);
    if (description) {
      q.set("description", description);
    }
    return `${origin}/api/extract/${segment}/${payload.id}?${q}`;
  };
  var addToList = () => {
    const payload = getExtractPayload();
    if (!payload?.id || Number.isNaN(payload.id)) {
      alert("Impossible de déterminer l'identifiant du jeu.");
      return;
    }
    const segment = isF95z() ? "f95" : "lc";
    const url = buildExtractGetUrl(segment, payload);
    window.open(url, "_blank", "noopener,noreferrer");
  };
  var panel = () => {
    panelElement.className = "extractor-panel";
    panelElement.style.marginTop = isF95z() ? "8px" : "14px";
    const nav = document.querySelector("nav");
    nav?.prepend(panelElement);
    closeButton(panelElement);
    button("Copier les tags", extractTags);
    button("Copier toutes les données", extractData);
    actionButton("Ajouter à la liste", addToList);
    if (isF95z()) return;
    button("Copier pour f95checker", extractFullData);
  };
  var closeButton = (element) => {
    const close = document.createElement("button");
    close.className = "extractor-close";
    close.textContent = "X";
    element.prepend(close);
    handleClickClose(close);
  };
  var handleClickClose = (element) => {
    element.addEventListener("click", () => {
      panelElement.style.display = "none";
    });
  };
  var button = (title, action) => {
    const button3 = document.createElement("button");
    button3.className = "extractor-panelButton";
    button3.textContent = title;
    panelElement.append(button3);
    button3.addEventListener("click", () => {
      handleClickButton(action);
    });
  };
  var actionButton = (title, handler) => {
    const el = document.createElement("button");
    el.className = "extractor-panelButton";
    el.textContent = title;
    panelElement.append(el);
    el.addEventListener("click", () => {
      void Promise.resolve(handler()).catch((err) => console.error(err));
    });
  };
  var handleClickButton = (action) => {
    navigator.clipboard.writeText(action()).then(() => {
      console.info("Text copied to clipboard");
    }).catch((err) => console.error("Could not copy text", err));
  };

  // src/button.ts
  var openElement = document.createElement("button");
  var button2 = () => {
    openElement.className = "extractor-button";
    openElement.style.marginTop = isF95z() ? "8px" : "14px";
    openElement.textContent = "E";
    const nav = document.querySelector("nav");
    nav?.prepend(openElement);
    handleClickOpen(openElement);
  };
  var handleClickOpen = (element) => {
    element.addEventListener("click", () => {
      panelElement.style.display = "flex";
    });
  };

  // src/style.scss
  var style = document.createElement("style");
  style.textContent = `.extractor-button,.extractor-panel{background-color:#1e2022;top:0;right:0;position:absolute;margin-right:14px}.extractor-button{height:48px;width:48px;border-radius:99999px;z-index:1000;border:0;color:#ba4545;font-weight:700;font-size:24px;cursor:pointer}.extractor-button:hover{background-color:#1a1b1b}.extractor-panel{width:200px;border-radius:8px;z-index:1001;display:none;flex:flex;flex-direction:column;gap:1rem;padding:1rem}.extractor-panel .extractor-close,.extractor-panel .extractor-panelButton{height:16px;background-color:#37383a;color:#ba4545;font-weight:700;font-size:8px;cursor:pointer}.extractor-panel .extractor-close{width:16px;border-radius:99999px;align-self:end;border:0}.extractor-panel .extractor-close:hover,.extractor-panel .extractor-panelButton:hover{background-color:#2b2b2c}.extractor-panel .extractor-panelButton{width:100%;border:#ba4545;border-radius:8px}`;
  document.head.appendChild(style);

  // src/index.ts
  (() => {
    button2();
    panel();
  })();
})();
