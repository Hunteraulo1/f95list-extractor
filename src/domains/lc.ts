import type { CompleteEntity } from "../types";

const getData = () => {
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

	const id = Number(data?.url?.split(".")[2]?.split("/")[0]);

	const version = document.querySelector(
		"dl[data-field='version'] > dd",
	)?.textContent;

	console.log("🚀 ~ extractDataLC ~ titleMatch:", title);
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
			link: id ? "" : `https://lewdcorner.com/threads/${id}`,
			image: data?.image ?? "",
		},
		null,
		0,
	);
};

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
	} else if (data.includes("Unreal Engine")) {
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
