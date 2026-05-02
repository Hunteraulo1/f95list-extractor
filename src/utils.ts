export const isF95z = () => window.location.hostname === "f95zone.to";

/** Retire les balises img (y compris si le HTML est présent comme texte). */
const stripImgMarkup = (s: string): string =>
	s.replace(/<img\b[^>]*>/gi, "").replace(/<\/img>/gi, "");

const textFromF95DescriptionEl = (el: Element): string => {
	const html = el.innerHTML;
	const doc = new DOMParser().parseFromString(html, "text/html");
	doc.body.querySelectorAll("img").forEach((img) => img.remove());
	let t = doc.body.textContent ?? "";
	t = stripImgMarkup(t);
	return t.replace("Overview:", "");
};

export const scrapeThreadDescription = (): string | null => {
	const f95 = isF95z();
	const selector = f95
		? ".message-body > .bbWrapper > div"
		: ".message-body > div > div > .bbWrapper > div";
	const el = document.querySelector(selector);
	if (!el) return null;

	let raw: string | undefined;
	if (f95) {
		raw = textFromF95DescriptionEl(el);
	} else {
		raw = el.textContent?.replace("Overview:", "");
	}

	if (raw === undefined) return null;
	const trimmed = stripImgMarkup(raw).trim();
	return trimmed === "" ? null : trimmed;
};
