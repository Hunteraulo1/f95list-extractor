import { extractData, extractTags } from "./actions";

export const panelElement = document.createElement("div");

export const panel = () => {
	panelElement.style.width = "16rem";
	panelElement.style.borderRadius = "1rem";
	panelElement.style.backgroundColor = "#1e2022";
	panelElement.style.position = "fixed";
	panelElement.style.top = "2rem";
	panelElement.style.right = "2rem";
	panelElement.style.zIndex = "1001";
	panelElement.style.display = "none";
	panelElement.style.flex = "flex";
	panelElement.style.flexDirection = "column";
	panelElement.style.gap = "1rem";
	panelElement.style.padding = "1rem";

	const body = document.querySelector("body");
	body?.prepend(panelElement);

	closeButton(panelElement);
	button("Extract tags", extractTags);
	button("Extract all data", extractData);
};

const closeButton = (element: HTMLDivElement) => {
	const close = document.createElement("button");

	close.style.height = "2rem";
	close.style.width = "2rem";
	close.style.borderRadius = "99999px";
	close.style.backgroundColor = "#37383a";
	close.style.alignSelf = "end";
	close.style.border = "none";
	close.style.color = "#ba4545";
	close.style.fontWeight = "bold";
	close.style.fontSize = "1rem";
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

	button.style.height = "2rem";
	button.style.width = "100%";
	button.style.backgroundColor = "#37383a";
	button.style.border = "#ba4545";
	button.style.borderRadius = "1rem";
	button.style.color = "#ba4545";
	button.style.fontWeight = "bold";
	button.style.fontSize = "1rem";
	button.textContent = title;

	panelElement.append(button);

	handleClickButton(action);
};

const handleClickButton = (action: () => string) => {
	navigator.clipboard
		.writeText(action())
		.then(() => console.log("Text copied to clipboard"))
		.catch((err) => console.error("Could not copy text", err));
};
