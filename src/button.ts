import { panelElement } from "./panel";

const openElement = document.createElement("button");
export const extractorWrapper = document.createElement("div");

/** Zones natives du header XenForo (F95z & LC), par ordre de préférence. */
const HEADER_TARGETS = [
	".p-nav-opposite .p-discovery",
	".p-nav-opposite .p-account",
	".p-nav-opposite",
];

export const button = () => {
	openElement.type = "button";
	openElement.className = "extractor-button";
	openElement.title = "Extractor";
	openElement.textContent = "E";

	extractorWrapper.className = "extractor-wrapper";
	extractorWrapper.append(openElement);

	const target = HEADER_TARGETS.flatMap((s) =>
		Array.from(document.querySelectorAll<HTMLElement>(s)),
	).find(isVisible);

	if (target) {
		target.append(extractorWrapper);
	} else {
		// Fallback : ancien comportement (bouton flottant dans la nav)
		extractorWrapper.classList.add("extractor-wrapper--floating");
		document.querySelector("nav")?.prepend(extractorWrapper);
	}

	handleClickOpen(openElement);
};

/** Ignore les éléments présents dans le DOM mais masqués (menus off-canvas…). */
const isVisible = (el: HTMLElement) => el.getClientRects().length > 0;

const handleClickOpen = (element: HTMLButtonElement) => {
	element.addEventListener("click", (e) => {
		e.stopPropagation();
		panelElement.style.display =
			panelElement.style.display === "flex" ? "none" : "flex";
	});
};
