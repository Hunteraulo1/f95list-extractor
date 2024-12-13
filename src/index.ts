import { button } from "./button";
import { panel } from "./panel";

(() => {
	button();
	panel();

	// navigator.clipboard
	// 	.writeText(textToCopy)
	// 	.then(() => console.log("Text copied to clipboard"))
	// 	.catch((err) => console.error("Could not copy text", err));
})();
