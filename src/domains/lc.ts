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
	const description =
		document
			.querySelector(".message-body .bbWrapper > div")
			?.textContent?.split("Overview:\n")[1]
			?.replaceAll('"', "''") ?? "";
	const tagsData: string[] =
		document
			.querySelector(".js-tagList")
			?.textContent?.replaceAll("\t", "")
			.split("\n\n\n\n")
			.slice(1) ?? [];

	const tags: number[] = [];
	const unknownTags: string[] = [];

	for (const tag of tagsData) {
		if (tag === "") continue;

		if (tag in idByTagsName) {
			const id = idByTagsName[tag as keyof typeof idByTagsName];

			if (id === 0 || tag in tags) continue;

			tags.push(id);

			continue;
		}

		unknownTags.push(tag);
	}

	if (unknownTags[0] === "") unknownTags.shift();
	console.info("🚀 ~ extractDataLC ~ unknownTags:", unknownTags);
	if (unknownTags.length > 0) alert(`Tags non trouvés: ${unknownTags}`);

	const ratingComponent = document.querySelector(".bratr-rating");

	const score: number =
		Number(ratingComponent?.querySelectorAll(".br-selected").length ?? "0") +
		Number(ratingComponent?.querySelectorAll(".br-fractional").length ?? "0") /
			2;

	return `BEGIN TRANSACTION; UPDATE games SET name = "${name?.replaceAll('"', "''")}", version = "${version?.replaceAll('"', "''")}", developer = "${developer?.replaceAll('"', "''")}", last_updated = ${lastUpdated}, score = ${score ?? 0.0}, description = "${description?.replaceAll('"', "")}", tags = json_patch(tags, '[${tags}]') WHERE id = (SELECT id FROM games WHERE url = '${link}' LIMIT 1); INSERT INTO games SELECT (SELECT COALESCE(MIN(id) - 1, -1) FROM games), 1, "${name?.replaceAll('"', "''")}", "${version?.replaceAll('"', "''")}", "${developer?.replaceAll('"', "''")}", ${typeId}, 1, '${link}', ${addedOn}, ${lastUpdated}, 0, '', 0, ${score ?? 0.0}, 0, '', '', 0, 0, '[]', "${description?.replaceAll('"', "")}", "n/a", '[${tags}]', '[]', '', '', '[]', NULL, 0, '[]', 0, '[]', 0, '[]' WHERE NOT EXISTS (SELECT 1 FROM games WHERE url = '${link}'); COMMIT;`;
};

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
	} else if (data.includes("Other")) {
		type = "Autre";
		typeId = 9;
	}

	return { status, type, typeId };
};

const idByTagsName = {
	"2d": 1,
	"2d game": 1,
	"2dcg": 2,
	"3d": 3,
	"3d game": 3,
	"3dcg": 4,
	action: 0,
	"adjustable age": 0,
	"adult content": 0,
	adventure: 5,
	ahegao: 6,
	ai: 140,
	"ai art": 140,
	"ai cg": 140,
	"anal sex": 7,
	anime: 71,
	animated: 8,
	arcade: 0,
	bbw: 37,
	bdsm: 34,
	bestiality: 35,
	"big ass": 36,
  "big dick": 0,
	"big dicks": 0,
	"big tits": 37,
	blackmail: 38,
  blowjob: 91,
	brothel: 99,
	bukkake: 39,
	"card game": 0,
	casual: 0,
	censored: 40,
	"character creation": 41,
	"character customization": 41,
	cheating: 42,
	combat: 43,
	comic: 0,
	corruption: 44,
	cosplay: 45,
	creampie: 46,
	cuckold: 90,
	"dating sim": 47,
	defloration: 135,
	dilf: 48,
	drama: 0,
	"dress up": 0,
	drugs: 49,
	drunk: 49,
	"dystopian setting": 50,
	ebony: 70,
	eroge: 71,
	erotic: 0,
	exhibitionism: 51,
	facial: 39,
	fantasy: 52,
	"female protagonist": 54,
	femaledomination: 53,
	femdom: 53,
	fighting: 43,
	fisting: 7,
	"foot fetish": 55,
	footjob: 55,
	furry: 56,
	"futa trans": 57,
	"futa trans (avoidable)": 57,
	"futa/trans protagonist": 58,
	gay: 59,
	"gay (avoidable)": 59,
	gilf: 80,
	"glory hole": 0,
	gore: 60,
	"graphic violence": 60,
	groping: 61,
	"group sex": 62,
	guro: 71,
	handholding: 0,
	handjob: 63,
	harem: 64,
	headpats: 0,
  hebe: 75,
	horror: 65,
	humiliation: 66,
	humor: 67,
	incest: 68,
	"incest (optional)": 68,
	"internal view": 69,
	interracial: 70,
	impregnation: 0,
	"japanese game": 71,
	"kinetic novel": 72,
	lactation: 73,
	lesbian: 74,
	"lesbian (avoidable)": 74,
	loli: 75,
	"male protagonist": 77,
	maledom: 76,
	maledomination: 76,
	management: 78,
	masturbation: 79,
	milf: 80,
	"mind control": 81,
  "mini games": 100,
	"mobile game": 82,
	monster: 83,
	"monster girl": 84,
	"multiple endings": 85,
	"multiple penetration": 86,
	"multiple protagonist": 87,
	necrophilia: 88,
	"no sexual content": 89,
	"netori (stealing)": 90,
	"netorase (sharing)": 90,
	"netorare (cheating)": 90,
	ntr: 90,
	nudity: 0,
	"oral sex": 91,
	paranormal: 92,
	parody: 93,
	"pixel art": 0,
	platformer: 94,
	"point click": 95,
	"point & click": 95,
	possession: 96,
	pov: 97,
	pregnancy: 98,
	prostitution: 99,
	puzzle: 100,
	rape: 101,
	"real porn": 102,
	religion: 103,
	romance: 104,
	rpg: 105,
	sandbox: 106,
	scat: 107,
	"school setting": 108,
	"sci-fi": 109,
	"sex toys": 110,
	"sexual content": 0,
	"sexual harassment": 111,
  sharing: 90,
	shooter: 112,
	shota: 113,
	"side-scroller": 114,
	simulator: 115,
	simulation: 115,
	sissification: 116,
	slave: 117,
	"sleep sex": 118,
  "slice of life": 0,
	"small tits": 0,
	spanking: 119,
	strategy: 120,
	stripping: 121,
	superpowers: 122,
	swinging: 123,
	teasing: 124,
	teen: 0,
	tentacles: 125,
	"text based": 126,
	titfuck: 127,
  toddler: 75,
	trainer: 128,
	transformation: 129,
	transgender: 57,
	trap: 130,
	"turn based combat": 131,
	twins: 132,
	urination: 133,
	"vaginal sex": 134,
	virgin: 135,
	"virtual reality": 136,
	voiced: 137,
	vore: 138,
	voyeurism: 139,
	watersports: 133,
};
