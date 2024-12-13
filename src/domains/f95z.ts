export const extractTagsF95z = () => {
	const tags = document.querySelectorAll(".tagItem") ?? [];

	return Array.from(tags)
		.map((tag) => tag.textContent)
		.join(", ");
};

export const extractDataF95z = () => {
	const title = document.querySelector("title")?.textContent ?? "";
	const img = document.querySelector("img.bbImage")?.getAttribute("src") ?? "";

	const id = window.location.pathname.split(".")[1]?.split("/")[0] ?? "";
	const image = img?.replace("attachments.", "preview.") ?? "";

	const regName = /.*-\s(.*?)\s\[/i;
	const regTitle = /([\w\\']+)(?=\s-)/gi;
	const regVersion = /\[([^\]]+)\]/gi;

	const titleMatch = title.match(regTitle) ?? [];
	const nameMatch = title.match(regName) ?? [];
	const versionMatch = title.match(regVersion) ?? [];

	const name = nameMatch?.[1] ?? "";
	const { status, type } = scrapeGetTitle(titleMatch);
	const version = versionMatch?.[1] ?? "";

	const tags = extractTagsF95z();

	return JSON.stringify(
		{
			id,
			domain: "F95z",
			name,
			version,
			status,
			tags,
			type,
			ac: false,
			link: id === "" ? "" : `https://f95zone.to/threads/${id}`,
			image,
		},
		null,
		0,
	);
};

const scrapeGetTitle = (data: string[]): { status: string; type: string } => {
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
