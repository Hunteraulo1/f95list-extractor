import { panelElement } from "./panel";
import { isF95z } from "./utils";

const openElement = document.createElement("button");

export const button = () => {
	openElement.className = "extractor-button";
	openElement.style.marginTop = isF95z() ? "8px" : "14px";
	openElement.textContent = "E";

	const nav = document.querySelector("nav");
	nav?.prepend(openElement);

	handleClickOpen(openElement);
};

const handleClickOpen = (element: HTMLButtonElement) => {
	element.addEventListener("click", () => {
		panelElement.style.display = "flex";
	});
};
