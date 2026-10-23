export const isF95z = () => window.location.hostname === "f95zone.to";

/** Retire les balises img (y compris si le HTML est présent comme texte). */
const stripImgMarkup = (s: string): string =>
	s.replace(/<img\b[^>]*>/gi, "").replace(/<\/img>/gi, "");

/** Champs de la fiche F95 qui suivent l'overview quand il n'est pas dans son propre bloc. */
const F95_NEXT_FIELD =
	/\n\s*(Thread Updated|Updated|Release Date|Developer)\s*:/i;

/**
 * Sur F95, l'overview est un `<b>Overview</b>:` placé soit dans un div centré
 * (avec ou sans l'image), soit directement dans le .bbWrapper du premier post.
 */
const textFromF95Description = (): string | undefined => {
	const wrapper = document.querySelector(".message-body .bbWrapper");
	if (!wrapper) return;

	const label = Array.from(wrapper.querySelectorAll("b")).find((b) =>
		b.textContent?.trim().startsWith("Overview"),
	);
	const block = label?.parentElement;
	if (!block) return;

	const text = (block.textContent ?? "").replace(/​/g, "");
	const start = text.search(/Overview\s*:/);
	if (start === -1) return;

	let overview = text.slice(start).replace(/^Overview\s*:/, "");
	if (block === wrapper) {
		const end = overview.search(F95_NEXT_FIELD);
		if (end !== -1) overview = overview.slice(0, end);
	}

	return overview
		.split("\n")
		.map((line) => line.trim())
		.join("\n")
		.replace(/\n{3,}/g, "\n\n");
};

export const scrapeThreadDescription = (): string | null => {
	let raw: string | undefined;
	if (isF95z()) {
		raw = textFromF95Description();
	} else {
		raw = document
			.querySelector(".message-body > div > div > .bbWrapper > div")
			?.textContent?.replace("Overview:", "");
	}

	if (raw === undefined) return null;
	const trimmed = stripImgMarkup(raw).trim();
	return trimmed === "" ? null : trimmed;
};
