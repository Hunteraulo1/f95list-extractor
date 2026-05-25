import { DASHBOARD_ORIGIN } from "./dashboardOrigin";
import {
	extractData,
	extractFullData,
	extractTags,
	getExtractPayload,
} from "./domains";
import type { ExtractListPayload } from "./types";
import { isF95z } from "./utils";

export const panelElement = document.createElement("div");

/** Limite pour éviter une query string trop longue (navigateurs / proxies). */
const MAX_DESCRIPTION_QUERY_LEN = 1200;

const descriptionForQuery = (payload: ExtractListPayload): string => {
	const raw = payload.description?.trim() ?? "";
	if (!raw) return "";
	return raw.length <= MAX_DESCRIPTION_QUERY_LEN
		? raw
		: `${raw.slice(0, MAX_DESCRIPTION_QUERY_LEN)}…`;
};

const buildExtractGetUrl = (
	segment: "f95" | "lc",
	payload: ExtractListPayload,
) => {
	const origin = DASHBOARD_ORIGIN.replace(/\/$/, "");
	const q = new URLSearchParams({
		name: payload.name,
		tags: payload.tags,
		image: payload.image,
		link: payload.link,
		gameVersion: payload.version,
		gameAutoCheck: payload.ac ? "true" : "false",
	});

	const description = descriptionForQuery(payload);
	if (description) {
		q.set("description", description);
	}

	return `${origin}/api/extract/${segment}/${payload.id}?${q}`;
};

const addToList = () => {
	const payload = getExtractPayload();
	if (!payload?.id || Number.isNaN(payload.id)) {
		alert("Impossible de déterminer l'identifiant du jeu.");
		return;
	}

	const segment = isF95z() ? "f95" : "lc";
	const url = buildExtractGetUrl(segment, payload);

	window.open(url, "_blank", "noopener,noreferrer");
};

export const panel = () => {
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

const closeButton = (element: HTMLDivElement) => {
	const close = document.createElement("button");

	close.className = "extractor-close";
	close.textContent = "X";

	element.prepend(close);

	handleClickClose(close);
};

const handleClickClose = (element: HTMLButtonElement) => {
	element.addEventListener("click", () => {
		panelElement.style.display = "none";
	});
};

const button = (title: string, action: () => string) => {
	const button = document.createElement("button");

	button.className = "extractor-panelButton";
	button.textContent = title;

	panelElement.append(button);

	button.addEventListener("click", () => {
		handleClickButton(action);
	});
};

const actionButton = (title: string, handler: () => void | Promise<void>) => {
	const el = document.createElement("button");

	el.className = "extractor-panelButton";
	el.textContent = title;

	panelElement.append(el);

	el.addEventListener("click", () => {
		void Promise.resolve(handler()).catch((err) => console.error(err));
	});
};

const handleClickButton = (action: () => string) => {
	navigator.clipboard
		.writeText(action())
		.then(() => {
			console.info("Text copied to clipboard");
		})
		.catch((err) => console.error("Could not copy text", err));
};
