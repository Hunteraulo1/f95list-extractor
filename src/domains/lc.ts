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

export const extractDataLC = (fullData: boolean) => {
	const data = getData();

	const title =
		document.querySelector<HTMLHeadingElement>(".p-title-value")?.innerText;

	const id = Number(data?.url?.split(".")[2]?.split("/")[0]);

	const image =
		document.querySelector("img.bbImage")?.getAttribute("src") ?? ""; // TODO: break feature

	const version = document.querySelector(
		"dl[data-field='version'] > dd",
	)?.textContent;

	console.log("🚀 ~ extractDataLC ~ titleMatch:", title);
	const name = data?.headline?.match(/([^\[]*) /)?.[1] ?? "";

	const { status, type, typeId } = scrapeGetTitle(title ?? "");

	const link = id ? `https://lewdcorner.com/threads/${id}` : "";

	if (!fullData) {
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
				link,
				image,
			},
			null,
			0,
		);
	}

	const developer =
		document.querySelector('[data-field="Developer"] > dd')?.textContent ?? "";
	const addedOn = Math.floor(new Date().getTime() / 1000);
	const lastUpdatedData = document.querySelector(
		'[data-field="dategamerelease"] > dd',
	)?.textContent;
	const lastUpdated = lastUpdatedData
		? Math.floor(new Date(lastUpdatedData).getTime() / 1000)
		: 0;

	// TODO: implement the values below
	const tags: string[] = [];
	const description = "description";
	const changelog = "changelog";

	return `INSERT INTO games VALUES ((SELECT id FROM games ORDER BY id ASC LIMIT 1) - 1, 1, '${name}', '${version}', '${developer}', ${typeId}, 1, '${link}', ${addedOn}, ${lastUpdated}, 0, '', 0, 0.0, 0, '', '', 0, 0, '[]', '${description}', '${changelog}', '${tags.toString()}', '[6]', '', '${image}', '[]', NULL, 0, '[]', 0, '[]', 0, '[]')`;
};

/*
-150	1	VIRTUAL DAUGHTER	Unchecked	LaFamilleClub	14	1	https://lewdcorner.com/threads/15283	1737764995	1731279600	0		1737765288	4	3		Unchecked	0	0	["D:/Games/VirtualDaughterch01-0.4A-pc/VirtualDaughterch01.exe"]	The game takes place in the near future. You play a 35 year old software developer who dabbles with chatbots and artificial intelligence in order to combat loneliness.
You find an app that sounds too good to be true, but there is a catch. It claims to "alter reality as you know it".
Meanwhile, things get turned upside-down after a car crash lands you in the emergency room.		[8, 68, 75]	[6]		custom	[]		0	[]	0	[]	0	[]

*/

const scrapeGetTitle = (
	data: string,
): { status: string; type: string; typeId: number } => {
	let status = "";
	let type = "";
	let typeId = 23;

	if (data.includes("Abandoned")) {
		status = "ABANDONNÉ";
	} else if (data.includes("Complete")) {
		status = "TERMINÉ";
	} else {
		status = "EN COURS";
	}
	if (data.includes("Ren'Py")) {
		type = "RenPy";
		typeId = 14;
	} else if (data.includes("RPGM")) {
		type = "RPGM";
		typeId = 13;
	} else if (data.includes("Unity")) {
		type = "Unity";
		typeId = 19;
	} else if (data.includes("Unreal Engine")) {
		type = "Unreal";
		typeId = 20;
	} else if (data.includes("Flash")) {
		type = "Flash";
		typeId = 4;
	} else if (data.includes("HTML")) {
		type = "HTML";
		typeId = 5;
	} else if (data.includes("QSP")) {
		type = "QSP";
		typeId = 10;
	} else if (data.includes("Others")) {
		type = "Autre";
		typeId = 9;
	}

	return { status, type, typeId };
};
