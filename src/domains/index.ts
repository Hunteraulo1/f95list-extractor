import { extractDataF95z, extractTagsF95z } from "./f95z";
import { extractDataLC, extractTagsLC } from "./lc";

export const extractTags = () => {
	if (window.location.hostname === "f95zone.to") {
		return extractTagsF95z();
	}

	return extractTagsLC();
};

export const extractData = () => {
	if (window.location.hostname === "f95zone.to") {
		return extractDataF95z();
	}

	return extractDataLC();
};
