import { extractData, extractTags } from "./domains";

export const panelElement = document.createElement("div");

export const panel = () => {
	panelElement.style.width = "128px";
	panelElement.style.borderRadius = "8px";
	panelElement.style.backgroundColor = "#1e2022";
	panelElement.style.position = "fixed";
	panelElement.style.top = "16px";
	panelElement.style.right = "16px";
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

	close.style.height = "16px";
	close.style.width = "16px";
	close.style.borderRadius = "99999px";
	close.style.backgroundColor = "#37383a";
	close.style.alignSelf = "end";
	close.style.border = "none";
	close.style.color = "#ba4545";
	close.style.fontWeight = "bold";
	close.style.fontSize = "8px";
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

	button.style.height = "16px";
	button.style.width = "100%";
	button.style.backgroundColor = "#37383a";
	button.style.border = "#ba4545";
	button.style.borderRadius = "8px";
	button.style.color = "#ba4545";
	button.style.fontWeight = "bold";
	button.style.fontSize = "8px";
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
