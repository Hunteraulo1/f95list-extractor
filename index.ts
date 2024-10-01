// ==UserScript==
// @name         LC Script Extractor
// @version      v1.0.0
// @description  Extract all LC thread data
// @author       Hunteraulo
// @match        https://lewdcorner.com/threads/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lewdcorner.com
// @grant        none
// ==/UserScript==

interface MainEntity {
	"@type": "DiscussionForumPosting";
	"@id": string;
	headline: string;
	datePublished: string;
	keywords: string;
	url: string;
	articleSection: string;
	author: {
		"@type": "Person";
		"@id": string;
		name: string;
		url: string;
	};
	interactionStatistic: Array<{
		"@type": "InteractionCounter";
		interactionType: string;
		userInteractionCount: number;
	}>;
	dateModified: string;
	image: string;
	articleBody: string;
}

interface CompleteEntity {
	"@context": string;
	"@type": string;
	url: string;
	mainEntity: MainEntity;
	publisher: {
		"@type": "Organization";
		name: string;
		alternateName: string;
		description: string;
		url: string;
		logo: string;
	};
	name: string;
	description: string;
	aggregateRating: {
		"@type": "AggregateRating";
		ratingValue: string;
		bestRating: string;
		ratingCount: string;
	};
}

(() => {
	const btn = document.querySelector<HTMLButtonElement>(".fa--xf.fa-tags");
	btn?.addEventListener("click", () => {
		const extracts = Array.from(
			document.querySelectorAll<HTMLScriptElement>(
				'script[type="application/ld+json"]',
			),
		);

		const result: CompleteEntity = {} as CompleteEntity;

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

		const title = document.querySelector<HTMLHeadingElement>(
			".p-title-value.flag-inserted",
		)?.innerText;

		const id = mainEntity?.url?.split(".")[2]?.split("/")[0] ?? "";
		const version =
			title?.match(/(?!\[)([\w\\. \(\)\']+)(?=\]\s)/gi)?.[0] ?? "";
		const name = mainEntity?.headline?.match(/([^\[]*) /)?.[1] ?? "";
		const titleMatch = title?.match(/([^\[]*) /)?.[1] ?? "";

		const { status, type } = scrapeGetTitle(titleMatch);

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
			2,
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
	} else if (data.includes("Completed")) {
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
