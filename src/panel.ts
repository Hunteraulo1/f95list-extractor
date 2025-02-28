import { extractData, extractFullData, extractTags } from "./domains";
import { isF95z } from "./utils";

export const panelElement = document.createElement("div");

export const panel = () => {
	panelElement.className = "extractor-panel";
	panelElement.style.marginTop = isF95z() ? "8px" : "14px";

	const nav = document.querySelector("nav");
	nav?.prepend(panelElement);

	closeButton(panelElement);
	button("Extract tags", extractTags);
	button("Extract all data", extractData);

	if (isF95z()) return;

	button("Extract for f95checker", extractFullData);
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

const handleClickButton = (action: () => string) => {
	navigator.clipboard
		.writeText(action())
		.then(() => {
			console.info("Text copied to clipboard");
			console.log(action());
		})
		.catch((err) => console.error("Could not copy text", err));
};
