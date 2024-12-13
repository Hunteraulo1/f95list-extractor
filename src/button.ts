import { panelElement } from "./panel";

const openElement = document.createElement("button");

export const button = () => {
	openElement.style.height = "48px";
	openElement.style.width = "48px";
	openElement.style.borderRadius = "99999px";
	openElement.style.backgroundColor = "#1e2022";
	openElement.style.position = "fixed";
	openElement.style.top = "16px";
	openElement.style.right = "16px";
	openElement.style.zIndex = "1000";
	openElement.style.border = "none";
	openElement.style.color = "#ba4545";
	openElement.style.fontWeight = "bold";
	openElement.style.fontSize = "24px";
	openElement.textContent = "E";

	const body = document.querySelector("body");
	body?.prepend(openElement);

	handleClickOpen(openElement);
};

const handleClickOpen = (element: HTMLButtonElement) => {
	element.addEventListener("click", () => {
		panelElement.style.display = "flex";
	});
};
