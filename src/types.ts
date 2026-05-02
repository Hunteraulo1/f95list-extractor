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

/** Données « extract all » envoyées à l’API d’ajout à la liste. */
export type ExtractListPayload = {
	id: number;
	domain: string;
	name: string;
	version: string;
	status: string;
	tags: string;
	type: string;
	ac: boolean;
	link: string;
	image: string;
};

export interface CompleteEntity {
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
