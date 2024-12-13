import { panelElement } from "./panel";
import { isF95z } from "./utils";

const openElement = document.createElement("button");

export const button = () => {
	openElement.style.height = "48px";
	openElement.style.width = "48px";
	openElement.style.borderRadius = "99999px";
	openElement.style.backgroundColor = "#1e2022";
	openElement.style.top = "0";
	openElement.style.right = "0";
	openElement.style.position = "absolute";
	openElement.style.marginTop = isF95z() ? "8px" : "14px";
	openElement.style.marginRight = "14px";
	openElement.style.zIndex = "1000";
	openElement.style.border = "none";
	openElement.style.color = "#ba4545";
	openElement.style.fontWeight = "bold";
	openElement.style.fontSize = "24px";
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
