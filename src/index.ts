import type { CompleteEntity } from "./types";

(() => {
	const btn = document.querySelector<HTMLButtonElement>(".fa--xf.fa-tags");
	btn?.addEventListener("click", () => {
		const extracts = Array.from(
			document.querySelectorAll<HTMLScriptElement>(
				'script[type="application/ld+json"]',
			),
		);

		const result = {} as CompleteEntity;

		for (const { textContent } of extracts) {
			try {
				const parsedContent = textContent ? JSON.parse(textContent) : {};
				Object.assign(result, parsedContent);
			} catch (error) {
				console.error("Erreur lors du parsing JSON:", error);
			}
		}

		const { mainEntity } = result;

		if (!mainEntity || typeof mainEntity !== "object") {
			console.error("mainEntity n'est pas défini ou mal formé.");
			return;
		}

		const title =
			document.querySelector<HTMLHeadingElement>(".p-title-value")?.innerText;

		const id = mainEntity?.url?.split(".")[2]?.split("/")[0] ?? "";

		const version = document.querySelector(
			"dl[data-field='version'] > dd",
		)?.textContent;

		title?.match(/(?!\[)([\w\\. \(\)\']+)(?=\]\s)/gi)?.[0] ?? "";
		const name = mainEntity?.headline?.match(/([^\[]*) /)?.[1] ?? "";

		const { status, type } = scrapeGetTitle(title ?? "");

		const textToCopy = JSON.stringify(
			{
				id,
				domain: "LewdCorner",
				name,
				version,
				status,
				tags: mainEntity?.keywords ?? "",
				type,
				ac: false,
				link: id === "" ? "" : `https://lewdcorner.com/threads/${id}`,
				image: mainEntity?.image ?? "",
			},
			null,
			0,
		);

		navigator.clipboard
			.writeText(textToCopy)
			.then(() => console.log("Text copied to clipboard"))
			.catch((err) => console.error("Could not copy text", err));

		btn.style.color = "green";
	});
})();

const scrapeGetTitle = (data: string): { status: string; type: string } => {
	let status = "";
	let type = "";

	if (data.includes("Abandoned")) {
		status = "ABANDONNÉ";
	} else if (data.includes("Complete")) {
		status = "TERMINÉ";
	} else {
		status = "EN COURS";
	}

	if (data.includes("Ren'Py")) {
		type = "RenPy";
	} else if (data.includes("RPGM")) {
		type = "RPGM";
	} else if (data.includes("Unity")) {
		type = "Unity";
	} else if (data.includes("Unreal")) {
		type = "Unreal";
	} else if (data.includes("Flash")) {
		type = "Flash";
	} else if (data.includes("HTML")) {
		type = "HTML";
	} else if (data.includes("QSP")) {
		type = "QSP";
	} else if (data.includes("Others")) {
		type = "Autre";
	}

	return { status, type };
};
