import type { CompleteEntity } from "../types";

const getData = () => {
	const extracts = Array.from(
		document.querySelectorAll<HTMLScriptElement>(
			'script[type="application/ld+json"]',
		),
	);
	console.log("🚀 ~ getData ~ extracts:", extracts);

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
	console.log("🚀 ~ getData ~ result:", result);

	if (!mainEntity || typeof mainEntity !== "object") {
		console.error("mainEntity n'est pas défini ou mal formé.");
		return;
	}

	return mainEntity;
};

export const extractTagsLC = () => {
	const mainEntity = getData();

	return mainEntity?.keywords ?? "";
};

export const extractDataLC = () => {
	const data = getData();

	const title =
		document.querySelector<HTMLHeadingElement>(".p-title-value")?.innerText;

	const id = data?.url?.split(".")[2]?.split("/")[0] ?? "";

	const version = document.querySelector(
		"dl[data-field='version'] > dd",
	)?.textContent;

	title?.match(/(?!\[)([\w\\. \(\)\']+)(?=\]\s)/gi)?.[0] ?? "";
	const name = data?.headline?.match(/([^\[]*) /)?.[1] ?? "";

	const { status, type } = scrapeGetTitle(title ?? "");

	return JSON.stringify(
		{
			id,
			domain: "LewdCorner",
			name,
			version,
			status,
			tags: data?.keywords ?? "",
			type,
			ac: false,
			link: id === "" ? "" : `https://lewdcorner.com/threads/${id}`,
			image: data?.image ?? "",
		},
		null,
		0,
	);
};

const scrapeGetTitle = (data: string): { status: string; type: string } => {
	let status = "";
	let type = "";

	for (const e of data) {
		switch (e) {
			case "Abandoned":
				status = "ABANDONNÉ";
				break;
			case "Completed":
				status = "TERMINÉ";
				break;
			default:
				status = "EN COURS";
				break;
		}
		switch (e) {
			case "Ren'Py":
				type = "RenPy";
				break;
			case "RPGM":
				type = "RPGM";
				break;
			case "Unity":
				type = "Unity";
				break;
			case "Unreal Engine":
				type = "Unreal";
				break;
			case "Flash":
				type = "Flash";
				break;
			case "HTML":
				type = "HTML";
				break;
			case "QSP":
				type = "QSP";
				break;
			case "Others":
				type = "Autre";
				break;
		}
	}

	return { status, type };
};
